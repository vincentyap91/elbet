const https = require("https");
const fs = require("fs");

function post(u, body = "{}") {
  return new Promise((res, rej) => {
    const url = new URL(u);
    const r = https.request(
      {
        method: "POST",
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: "https://www.eclbet04.com/my/update",
          Origin: "https://www.eclbet04.com",
          Accept: "application/json",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (resp) => {
        const chunks = [];
        resp.on("data", (c) => chunks.push(c));
        resp.on("end", () => {
          const buf = Buffer.concat(chunks);
          res({ s: resp.statusCode, d: buf.toString("utf8"), buf, ct: resp.headers["content-type"] || "" });
        });
      }
    );
    r.on("error", rej);
    r.write(body);
    r.end();
  });
}

function get(u) {
  return new Promise((res, rej) => {
    https
      .get(u, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eclbet04.com/my" } }, (r) => {
        const chunks = [];
        r.on("data", (c) => chunks.push(c));
        r.on("end", () => {
          const buf = Buffer.concat(chunks);
          res({ s: r.statusCode, buf, ct: r.headers["content-type"] || "", d: buf.toString("utf8") });
        });
      })
      .on("error", rej);
  });
}

(async () => {
  // Find update-specific fetch endpoints by scanning all update page scripts deeply
  const html = fs.readFileSync(".tmp-page-my-update.html", "utf8");
  const scripts = [...new Set([...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of scripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (r.s !== 200) continue;
    const js = r.d;
    if (!/update/i.test(js)) continue;
    // look for Update component patterns
    const markers = [
      "getDisplayUpdate",
      "getUpdateList",
      "updateList",
      "update-card",
      "update-list",
      "no-info-box",
      "title-update",
      "/update/",
      "announcement",
      "getAnnouncement",
    ];
    const hit = markers.filter((m) => js.includes(m));
    if (!hit.length) continue;
    console.log("\nBUNDLE", s.split("/").pop(), "hits", hit);
    for (const m of hit) {
      const i = js.indexOf(m);
      console.log("--", m, js.slice(Math.max(0, i - 120), i + 280).replace(/\s+/g, " "));
    }
    const fetches = [...js.matchAll(/fetch\(([^)]{0,200})\)/g)].map((m) => m[1]);
    console.log(
      "fetches",
      fetches.filter((f) => /update|promo|news|announc|a\//i.test(f)).slice(0, 20)
    );
  }

  // Try common update endpoint names
  const names = [
    "getUpdateList",
    "getDisplayUpdateList",
    "getUpdates",
    "getNewsList",
    "getAnnouncementList",
    "getAnnouncementData",
    "getInfoList",
    "getInfo",
    "getArticle",
    "getArticleList",
    "getContent",
    "getContents",
    "getCmsUpdate",
    "getCmsList",
  ];
  console.log("\n== update API name probes");
  for (const n of names) {
    const u = `https://www.eclbet04.com/my/a/${n}`;
    const r = await post(u);
    if (r.s !== 404) {
      console.log(r.s, r.ct.slice(0, 40), r.buf.length, u, r.d.slice(0, 300).replace(/\s+/g, " "));
    }
  }

  // Also getHomeOther may include banners
  console.log("\n== getHomeOther");
  const home = await post("https://www.eclbet04.com/my/a/getHomeOther");
  console.log(home.s, home.buf.length);
  fs.writeFileSync(".tmp-api-getHomeOther.json", home.d);
  // extract image urls
  const imgs = [...home.d.matchAll(/https?:\\\/\\\/[^"\\]+|https?:\/\/[^"\\]+|\\\/ecl\\\/images\\\/[^"\\]+|\/static\/[^"\\]+/g)].map(
    (m) => m[0].replace(/\\\//g, "/")
  );
  console.log(
    "home imgs sample",
    [...new Set(imgs)].filter((u) => /promo|welcome|birthday|usdt|rebate|voucher|banner|update|bg\//i.test(u)).slice(0, 60)
  );
  // also plain image path strings
  const soft = [...home.d.matchAll(/["']([^"']+\.(?:webp|png|jpg|jpeg|gif))["']/gi)].map((m) => m[1]);
  console.log("home soft imgs", [...new Set(soft)].slice(0, 80));

  // staging filename probes for promo themes
  console.log("\n== staging theme probes");
  const stagingCandidates = [
    // reuse known homepage banners already in download script as thematic fallbacks
    "https://staging-ecl.xyz/ecl/images/bg/1787728927771--p1-desktop.jpg",
    "https://staging-ecl.xyz/ecl/images/bg/1742544233354--Desktop%20banner%20EN.jpg",
    "https://staging-ecl.xyz/ecl/images/bg/1756788797522--Desktop_Deposit-Crypto_General.jpg",
    "https://staging-ecl.xyz/ecl/images/bg/1756789037686--Desktop-Crypto-Withdrawal-General.jpg",
    // guessed promo names under staging
    "https://staging-ecl.xyz/ecl/images/promotion/welcome.png",
    "https://staging-ecl.xyz/ecl/images/promotion/birthday.png",
    "https://staging-ecl.xyz/ecl/images/promotion/rebates.png",
    "https://staging-ecl.xyz/ecl/images/promotion/voucher.png",
    "https://staging-ecl.xyz/ecl/images/promotions/welcome.png",
    "https://staging-ecl.xyz/ecl/images/s3/welcome.png",
    "https://staging-ecl.xyz/ecl/images/s3/birthday.png",
    "https://staging-ecl.xyz/ecl/images/s3/rebate.png",
    "https://staging-ecl.xyz/ecl/images/s3/rebates.png",
    "https://staging-ecl.xyz/ecl/images/s3/voucher.png",
    "https://staging-ecl.xyz/ecl/images/s3/USDT.png",
    "https://staging-ecl.xyz/ecl/images/s3/usdt.png",
  ];
  for (const u of stagingCandidates) {
    const r = await get(u);
    if (r.s === 200 && /image\//.test(r.ct)) console.log("OK", r.ct, r.buf.length, u);
    else if (r.s !== 404) console.log(r.s, r.ct, r.buf.length, u);
  }

  // List directory-ish by probing common update thumb patterns under static
  console.log("\n== update thumb path guesses");
  const updateGuesses = [];
  for (let i = 1; i <= 50; i++) {
    updateGuesses.push(`https://www.eclbet04.com/static/images/update/${i}.png`);
    updateGuesses.push(`https://www.eclbet04.com/static/images/update/${i}.webp`);
    updateGuesses.push(`https://www.eclbet04.com/static/images/updates/${i}.png`);
  }
  for (const u of [
    "https://www.eclbet04.com/static/images/update/thumb.png",
    "https://www.eclbet04.com/static/images/ECLBET/update/thumb.webp",
    "https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/update.webp",
    "https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/update.webp",
    "https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/promotions.webp",
    "https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/promotions.webp",
    "https://www.eclbet04.com/static/images/promotion/voucher-en.png",
  ]) {
    const r = await get(u);
    console.log(r.s, r.ct, r.buf.length, u);
  }
})().catch((e) => console.error(e));
