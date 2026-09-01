const https = require("https");
const fs = require("fs");

function request(method, u, { body, cookie, contentType } = {}) {
  return new Promise((res, rej) => {
    const url = new URL(u);
    const payload = body == null ? null : typeof body === "string" ? body : JSON.stringify(body);
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Referer: "https://www.eclbet04.com/my/update",
      Origin: "https://www.eclbet04.com",
      Accept: "*/*",
    };
    if (cookie) headers.Cookie = cookie;
    if (payload != null) {
      if (contentType !== null) headers["Content-Type"] = contentType || "text/plain;charset=UTF-8";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }
    const r = https.request(
      {
        method,
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers,
      },
      (resp) => {
        const chunks = [];
        resp.on("data", (c) => chunks.push(c));
        resp.on("end", () => {
          const buf = Buffer.concat(chunks);
          res({
            s: resp.statusCode,
            d: buf.toString("utf8"),
            buf,
            setCookie: resp.headers["set-cookie"] || [],
          });
        });
      }
    );
    r.on("error", rej);
    if (payload != null) r.write(payload);
    r.end();
  });
}

(async () => {
  const page = await request("GET", "https://www.eclbet04.com/my/update");
  const cookies = page.setCookie.map((c) => c.split(";")[0]).join("; ");
  const body = { limit: 15, page_no: 1, language: "english", country: "my" };

  const trials = [
    ["text/plain;charset=UTF-8", JSON.stringify(body)],
    ["text/plain;charset=UTF-8", body],
    ["application/json", body],
    ["application/json;charset=UTF-8", body],
  ];
  for (const [ct, b] of trials) {
    const r = await request("POST", "https://www.eclbet04.com/my/a/notice", {
      body: b,
      cookie: cookies,
      contentType: ct,
    });
    console.log(ct, r.s, r.buf.length, r.d.slice(0, 400) || "(empty)");
    if (r.s === 200 && r.d.length > 80) fs.writeFileSync(".tmp-api-notice.json", r.d);
  }

  // Confirm icons on disk
  for (const p of [
    "assets/images/icons/promotion.svg",
    "assets/images/icons/update.svg",
    "assets/images/icons/voucher.svg",
    "assets/images/logo.png",
  ]) {
    const exists = fs.existsSync(p);
    const size = exists ? fs.statSync(p).size : 0;
    console.log(exists ? "EXISTS" : "MISSING", size, p);
  }
})().catch(console.error);
