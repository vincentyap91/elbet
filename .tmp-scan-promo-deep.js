const https = require("https");
const http = require("http");
const fs = require("fs");

function get(u) {
  return new Promise((res, rej) => {
    const lib = u.startsWith("https") ? https : http;
    lib
      .get(
        u,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Referer: "https://www.eclbet04.com/my/promotion",
            Accept: "*/*",
          },
        },
        (r) => {
          const chunks = [];
          r.on("data", (c) => chunks.push(c));
          r.on("end", () => {
            const buf = Buffer.concat(chunks);
            res({
              s: r.statusCode,
              d: buf.toString("utf8"),
              buf,
              ct: r.headers["content-type"] || "",
              loc: r.headers.location,
            });
          });
        }
      )
      .on("error", rej);
  });
}

function extractMc(html) {
  const i = html.indexOf("$MC=");
  if (i < 0) return null;
  // find concat payload roughly
  const m = html.match(/\$MC=\(window\.\$MC\|\|\[\]\)\.concat\((\{[\s\S]*?\})\)<\/script>/);
  return m ? m[1].slice(0, 5000) : null;
}

(async () => {
  // Parse promotion / update pages for rollup + API clues
  for (const file of [
    ".tmp-page-my-promotion.html",
    ".tmp-page-my-promotion-2.html",
    ".tmp-page-my-update.html",
    ".tmp-page-my-update-42.html",
    ".tmp-page-my-contact.html",
    ".tmp-page-my-mypromotion.html",
  ]) {
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    const rollup = html.match(/"__rollupEntries__":\[([^\]]+)\]/);
    const baseImg = html.match(/"baseImgUrl":"([^"]+)"/);
    const baseUrl = html.match(/"baseUrl":"([^"]+)"/);
    const path = html.match(/"path":"([^"]+)"/);
    const scripts = [...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]);
    console.log("\nFILE", file);
    console.log("path", path && path[1], "rollup", rollup && rollup[1], "baseImg", baseImg && baseImg[1], "baseUrl", baseUrl && baseUrl[1]);
    console.log("scripts", scripts.length);

    // search HTML for promo-related strings
    const soft = [
      ...html.matchAll(/["']([^"']*(?:promo|Promotion|update|Update|welcome|birthday|USDT|rebate|voucher|announcement)[^"']{0,120})["']/g),
    ]
      .map((m) => m[1])
      .filter((s) => s.length < 200);
    console.log(
      "soft strings",
      [...new Set(soft)].filter((s) => /promo|update|welcome|birthday|usdt|rebate|voucher|banner|image|img|thumb|icon/i.test(s)).slice(0, 40)
    );

    // body banner/page-icon near promotion title
    const body = html.match(/site-layout-body[\s\S]{0,2500}/);
    if (body) {
      const imgs = [...body[0].matchAll(/src=["']?([^"'>\s]+)/g)].map((m) => m[1]);
      console.log("body imgs", imgs);
    }
  }

  // Deep scan all JS from promotion page
  const html = fs.readFileSync(".tmp-page-my-promotion.html", "utf8");
  const scripts = [...new Set([...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  console.log("\n== deep bundle scan", scripts.length);
  const hits = new Set();
  for (const s of scripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (r.s !== 200) continue;
    const js = r.d;
    const paths = [
      ...js.matchAll(/\/static\/images\/[^"'\\]+?\.(?:jpg|jpeg|png|webp|gif|svg)/gi),
      ...js.matchAll(/ecl\/images\/[^"'\\]+?\.(?:jpg|jpeg|png|webp|gif|svg)/gi),
      ...js.matchAll(/staging-ecl\.xyz\/[^"'\\)\s]+/gi),
      ...js.matchAll(/cloudcdnetw\.com\/[^"'\\)\s]+/gi),
    ].map((m) => m[0]);
    paths.forEach((p) => {
      if (/promo|update|welcome|birthday|usdt|rebate|voucher|contact|banner|news|announc/i.test(p)) hits.add(p);
    });
    // API endpoints
    const apis = [...js.matchAll(/["'`](\/?(?:api\/)?[^"'`]*(?:promo|promotion|update|announcement|news)[^"'`]*)["'`]/gi)]
      .map((m) => m[1])
      .filter((x) => x.length < 180);
    if (apis.length) console.log("api-ish", s.split("/").pop(), [...new Set(apis)].slice(0, 25));
    if (paths.filter((p) => /promo|update|welcome|birthday|usdt|rebate|voucher/i.test(p)).length)
      console.log(
        "img",
        s.split("/").pop(),
        paths.filter((p) => /promo|update|welcome|birthday|usdt|rebate|voucher|banner/i.test(p)).slice(0, 30)
      );
  }
  console.log("HIT PATHS", [...hits].sort());

  // Try common API endpoints
  const apis = [
    "http://api.eclwebapi.com/my/promotion",
    "http://api.eclwebapi.com/my/promotions",
    "https://api.eclwebapi.com/my/promotion",
    "https://api.eclwebapi.com/my/promotions",
    "http://api.eclwebapi.com/my/update",
    "https://api.eclwebapi.com/my/update",
    "http://api.eclwebapi.com/my/announcement",
    "https://www.eclbet04.com/api/promotion",
    "https://www.eclbet04.com/api/promotions",
    "https://www.eclbet04.com/api/update",
  ];
  console.log("\n== API probes");
  for (const u of apis) {
    try {
      const r = await get(u);
      console.log(r.s, r.ct.slice(0, 40), r.buf.length, u, r.d.slice(0, 120).replace(/\s+/g, " "));
    } catch (e) {
      console.log("ERR", u, e.message);
    }
  }
})().catch((e) => console.error(e));
