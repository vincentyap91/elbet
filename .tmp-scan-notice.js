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
  console.log("== notice API");
  for (const body of ["{}", '{"id":42}', '{"page":1}', '{"limit":20}']) {
    const r = await post("https://www.eclbet04.com/my/a/notice", body);
    console.log(r.s, r.ct.slice(0, 40), r.buf.length, "body", body);
    console.log(r.d.slice(0, 1500));
    console.log("---");
    if (r.s === 200) fs.writeFileSync(".tmp-api-notice.json", r.d);
  }

  // More home/banner APIs
  console.log("\n== related APIs");
  for (const n of [
    "getHomeOther",
    "getHomeBanner",
    "getBanner",
    "getBanners",
    "getCarousel",
    "getSlider",
    "getPopup",
    "getDisplayBanner",
    "notice",
    "getNotice",
    "getNoticeList",
    "getNoticeDetail",
  ]) {
    const r = await post(`https://www.eclbet04.com/my/a/${n}`);
    if (r.s === 200) {
      console.log("OK", n, r.buf.length, r.d.slice(0, 250).replace(/\s+/g, " "));
      fs.writeFileSync(`.tmp-api-${n}.json`, r.d);
    } else if (r.s !== 404) {
      console.log(r.s, n, r.d.slice(0, 120).replace(/\s+/g, " "));
    }
  }

  // Extract promo detail image construction from promotion/2 page bundle
  const html = fs.readFileSync(".tmp-page-my-promotion-2.html", "utf8");
  const scripts = [...new Set([...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of scripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (!/promotion-detail|getDisplayPromo|promoDetail|cover_image|\.img/i.test(r.d)) continue;
    if (!r.d.includes("promotion-detail") && !r.d.includes("getDisplayPromo")) continue;
    console.log("\nDETAIL BUNDLE", s.split("/").pop());
    for (const m of ["promotion-detail__banner-img", "getPromo", "promoDetail", "cover_image", "P.img", ".img"]) {
      const i = r.d.indexOf(m);
      if (i >= 0) console.log(m, r.d.slice(Math.max(0, i - 150), i + 350).replace(/\s+/g, " "));
    }
    const fetches = [...r.d.matchAll(/fetch\(([^)]{0,250})\)/g)].map((x) => x[1]);
    console.log(
      "fetches",
      fetches.filter((f) => /promo|notice|a\//i.test(f)).slice(0, 30)
    );
  }

  // If notice returned cover images, HEAD them
  if (fs.existsSync(".tmp-api-notice.json")) {
    const j = JSON.parse(fs.readFileSync(".tmp-api-notice.json", "utf8"));
    const str = JSON.stringify(j);
    const covers = [...str.matchAll(/cover_image["\s:]+["']?([^"']+)/g)].map((m) => m[1]);
    const imgs = [...str.matchAll(/["']([^"']+\.(?:webp|png|jpg|jpeg|gif))["']/gi)].map((m) => m[1]);
    console.log("\ncover_image fields", covers);
    console.log("image fields", [...new Set(imgs)].slice(0, 40));
    for (const path of [...new Set([...covers, ...imgs])].slice(0, 20)) {
      const u = path.startsWith("http") ? path : `https://staging-ecl.xyz/${path.replace(/^\//, "")}`;
      const r = await get(u);
      console.log(r.s, r.ct, r.buf.length, u);
    }
  }
})().catch((e) => console.error(e));
