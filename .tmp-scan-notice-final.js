const https = require("https");
const fs = require("fs");

function post(u, bodyObj) {
  const body = JSON.stringify(bodyObj);
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

function absImg(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return "https://staging-ecl.xyz" + path;
  return "https://staging-ecl.xyz/" + path.replace(/^\//, "");
}

(async () => {
  console.log("== notice");
  const notice = await post("https://www.eclbet04.com/my/a/notice", {
    limit: 30,
    page_no: 1,
    language: "english",
    country: "my",
  });
  console.log(notice.s, notice.buf.length);
  fs.writeFileSync(".tmp-api-notice.json", notice.d);
  console.log(notice.d.slice(0, 3000));

  let noticeData = null;
  try {
    noticeData = JSON.parse(notice.d);
  } catch {}
  const items = (noticeData && (noticeData.data || noticeData.d || [])) || [];
  console.log("\nnotice items", Array.isArray(items) ? items.length : typeof items);
  if (Array.isArray(items)) {
    for (const it of items.slice(0, 20)) {
      console.log({
        id: it.id,
        title: it.title || it.name || it.t,
        cover: it.cover_image,
        display_date: it.display_date,
      });
      const u = absImg(it.cover_image);
      if (u) {
        const r = await get(u);
        console.log(" ", r.s, r.ct, r.buf.length, u);
      }
    }
  }

  console.log("\n== getHomeBannerBg");
  const bg = await post("https://www.eclbet04.com/my/a/getHomeBannerBg", { country: "my" });
  fs.writeFileSync(".tmp-api-getHomeBannerBg.json", bg.d);
  console.log(bg.s, bg.buf.length, bg.d.slice(0, 4000));
  try {
    const j = JSON.parse(bg.d);
    const data = j.data || j.d || j;
    const str = JSON.stringify(data);
    const urls = [...str.matchAll(/https?:\\\/\\\/[^"\\]+|https?:\/\/[^"\\]+|ecl\/images\/[^"\\]+|images\/cms\/[^"\\]+/g)].map((m) =>
      m[0].replace(/\\\//g, "/")
    );
    console.log("bg urls", [...new Set(urls)].slice(0, 50));
    for (const path of [...new Set(urls)].slice(0, 30)) {
      const u = absImg(path);
      const r = await get(u);
      if (r.s === 200 && /image\//.test(r.ct)) console.log("OK", r.ct, r.buf.length, u);
      else console.log(r.s, r.ct, r.buf.length, u);
    }
  } catch (e) {
    console.log("parse fail", e.message);
  }

  // Also try notice with language en
  for (const language of ["en", "english", "zh-Hans", "vi"]) {
    const r = await post("https://www.eclbet04.com/my/a/notice", {
      limit: 15,
      page_no: 1,
      language,
      country: "my",
    });
    let n = 0;
    try {
      const j = JSON.parse(r.d);
      n = (j.data || []).length;
    } catch {}
    console.log("notice lang", language, r.s, "items", n, r.d.slice(0, 120));
  }
})().catch((e) => console.error(e));
