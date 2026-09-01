const https = require("https");
const fs = require("fs");

function post(u, body = "{}", headers = {}) {
  return new Promise((res, rej) => {
    const url = new URL(u);
    const h = {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://www.eclbet04.com/my/update",
      Origin: "https://www.eclbet04.com",
      Accept: "application/json, text/plain, */*",
      ...headers,
    };
    if (body != null) {
      h["Content-Type"] = h["Content-Type"] || "application/json";
      h["Content-Length"] = Buffer.byteLength(body);
    }
    const r = https.request(
      {
        method: "POST",
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: h,
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
    if (body != null) r.write(body);
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
  // Full home banner payload
  const hb = await post("https://www.eclbet04.com/my/a/getHomeBanner");
  fs.writeFileSync(".tmp-api-getHomeBanner.json", hb.d);
  console.log("getHomeBanner", hb.s, hb.d.slice(0, 4000));

  // notice with various content-types / empty bodies like browser fetch
  console.log("\n== notice variants");
  const variants = [
    [{ "Content-Type": "application/json" }, "{}"],
    [{ "Content-Type": "application/json;charset=UTF-8" }, "{}"],
    [{ "Content-Type": "text/plain;charset=UTF-8" }, "{}"],
    [{ "Content-Type": "application/x-www-form-urlencoded" }, ""],
    [{}, null],
    [{ "Content-Type": "application/json" }, "null"],
    [{ "Content-Type": "application/json" }, "[]"],
  ];
  for (const [headers, body] of variants) {
    const r = await post("https://www.eclbet04.com/my/a/notice", body, headers);
    console.log(r.s, r.buf.length, JSON.stringify(headers), JSON.stringify(body), r.d.slice(0, 200).replace(/\s+/g, " "));
  }

  // Extract notice fetch call exactly from update bundle
  const html = fs.readFileSync(".tmp-page-my-update.html", "utf8");
  const scripts = [...new Set([...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of scripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (!r.d.includes('/a/notice"') && !r.d.includes("/a/notice'")) continue;
    const i = r.d.indexOf("/a/notice");
    console.log("\nnotice fetch context\n", r.d.slice(Math.max(0, i - 500), i + 800));
  }

  // How home banners map images - search homepage / index bundle or getHomeBanner consumers
  const homeHtml = await get("https://www.eclbet04.com/my");
  fs.writeFileSync(".tmp-page-my-home.html", homeHtml.d);
  const homeScripts = [...new Set([...homeHtml.d.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of homeScripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (!r.d.includes("getHomeBanner") && !r.d.includes("homebanner")) continue;
    console.log("\nHOME BANNER BUNDLE", s.split("/").pop());
    const i = r.d.indexOf("homebanner");
    console.log(r.d.slice(Math.max(0, i - 200), i + 900).replace(/\s+/g, " "));
    const i2 = r.d.indexOf("getHomeBanner");
    console.log("getHomeBanner ctx", r.d.slice(Math.max(0, i2 - 100), i2 + 500).replace(/\s+/g, " "));
    // image url construction
    const imgs = [...r.d.matchAll(/staging-ecl[^"'\\)\s]+|ecl\/images\/[^"'\\)\s]+|content\)|mobile_content/g)].slice(0, 30);
    console.log("refs", imgs.map((m) => m[0]));
  }

  // Probe whether homepage already embeds banner URLs in SSR
  const bannerImgs = [...homeHtml.d.matchAll(/src=["']?([^"'>\s]+(?:banner|bg\/|staging-ecl)[^"'>\s]*)/gi)].map((m) => m[1]);
  console.log("\nhome SSR banner-ish", [...new Set(bannerImgs)].slice(0, 40));
  const allHomeImgs = [...homeHtml.d.matchAll(/https?:\/\/staging-ecl\.xyz[^"'\\\s)]+/gi)].map((m) => m[0]);
  console.log("staging in home SSR", [...new Set(allHomeImgs)].slice(0, 40));
})().catch((e) => console.error(e));
