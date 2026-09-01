const https = require("https");
const fs = require("fs");

function req(method, u, body) {
  return new Promise((res, rej) => {
    const url = new URL(u);
    const opts = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: "https://www.eclbet04.com/my/promotion",
        Origin: "https://www.eclbet04.com",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    };
    const r = https.request(opts, (resp) => {
      const chunks = [];
      resp.on("data", (c) => chunks.push(c));
      resp.on("end", () => {
        const buf = Buffer.concat(chunks);
        res({ s: resp.statusCode, d: buf.toString("utf8"), buf, ct: resp.headers["content-type"] || "" });
      });
    });
    r.on("error", rej);
    if (body) r.write(body);
    r.end();
  });
}

function get(u) {
  return new Promise((res, rej) => {
    https
      .get(
        u,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Referer: "https://www.eclbet04.com/my/promotion",
            Accept: "image/*,*/*",
          },
        },
        (r) => {
          const chunks = [];
          r.on("data", (c) => chunks.push(c));
          r.on("end", () =>
            res({ s: r.statusCode, buf: Buffer.concat(chunks), ct: r.headers["content-type"] || "", d: Buffer.concat(chunks).toString("utf8") })
          );
        }
      )
      .on("error", rej);
  });
}

(async () => {
  const endpoints = [
    "https://www.eclbet04.com/my/a/getDisplayPromo",
    "https://www.eclbet04.com/my/a/getDisplayUpdate",
    "https://www.eclbet04.com/my/a/getUpdate",
    "https://www.eclbet04.com/my/a/getAnnouncement",
    "https://www.eclbet04.com/my/a/getNews",
    "https://www.eclbet04.com/my/a/getDisplayNews",
    "https://www.eclbet04.com/my/a/getPromo",
    "https://www.eclbet04.com/my/a/getPromotion",
    "https://www.eclbet04.com/my/a/getPromotions",
  ];
  for (const u of endpoints) {
    for (const body of ["{}", ""]) {
      const r = await req("POST", u, body);
      console.log("POST", r.s, r.ct.slice(0, 40), r.buf.length, u, "body=" + JSON.stringify(body));
      console.log(r.d.slice(0, 800).replace(/\s+/g, " "));
      console.log("---");
      if (r.s === 200 && r.d.length > 20 && !/Not Found/i.test(r.d)) {
        fs.writeFileSync(".tmp-api-" + u.split("/").pop() + ".json", r.d);
      }
    }
  }

  // Extract more from promotion + update bundles
  const html = fs.readFileSync(".tmp-page-my-promotion.html", "utf8");
  const scripts = [...new Set([...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of scripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (!r.d.includes("getDisplayPromo") && !r.d.includes("formatDisplayPromo")) continue;
    const js = r.d;
    const i = js.indexOf("formatDisplayPromoListData");
    console.log("\nformatDisplayPromoListData\n", js.slice(i, i + 2000));
    // voucher concat variable
    const v = js.indexOf('voucher-".concat');
    console.log("\nvoucher concat\n", js.slice(v - 200, v + 200));
    // all /a/ endpoints in this file
    const apis = [...js.matchAll(/["'`](\/?[^"'`]{0,40}\/a\/[^"'`]{0,60})["'`]/g)].map((m) => m[1]);
    console.log("a endpoints", [...new Set(apis)]);
  }

  const htmlU = fs.readFileSync(".tmp-page-my-update.html", "utf8");
  const scriptsU = [...new Set([...htmlU.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of scriptsU) {
    const r = await get("https://www.eclbet04.com" + s);
    if (r.s !== 200) continue;
    if (!r.d.includes("/a/") && !r.d.includes("update-list") && !r.d.includes("getDisplay")) continue;
    const apis = [...r.d.matchAll(/fetch\(["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
    const apis2 = [...r.d.matchAll(/\/[a-z]{2}\/a\/[A-Za-z0-9_]+/g)].map((m) => m[0]);
    const apis3 = [...r.d.matchAll(/["'`](\/?a\/[A-Za-z0-9_]+)["'`]/g)].map((m) => m[1]);
    const interesting = [...new Set([...apis, ...apis2, ...apis3])].filter((x) =>
      /update|promo|news|announc|display|get/i.test(x)
    );
    if (interesting.length) console.log("\nupdate-ish", s.split("/").pop(), interesting.slice(0, 50));
  }

  // Probe voucher- locale variants
  console.log("\n== voucher- locale probes");
  for (const y of ["en", "zh", "zh-Hans", "zh-Hant", "vi", "my", "cn", "english", "EN", "MY"]) {
    const u = `https://www.eclbet04.com/static/images/promotion/voucher-${y}.png`;
    const r = await get(u);
    console.log(r.s, r.ct, r.buf.length, u);
  }
})().catch((e) => console.error(e));
