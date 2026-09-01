const https = require("https");

function request(method, u, { body, headers = {}, cookie } = {}) {
  return new Promise((res, rej) => {
    const url = new URL(u);
    const payload = body == null ? null : typeof body === "string" ? body : JSON.stringify(body);
    const h = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Referer: "https://www.eclbet04.com/my/update",
      Origin: "https://www.eclbet04.com",
      Accept: "application/json, text/plain, */*",
      ...headers,
    };
    if (cookie) h.Cookie = cookie;
    if (payload != null) {
      if (!h["Content-Type"]) h["Content-Type"] = "application/json";
      h["Content-Length"] = Buffer.byteLength(payload);
    }
    const r = https.request(
      {
        method,
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: h,
      },
      (resp) => {
        const chunks = [];
        resp.on("data", (c) => chunks.push(c));
        resp.on("end", () => {
          const buf = Buffer.concat(chunks);
          const setCookie = resp.headers["set-cookie"] || [];
          res({
            s: resp.statusCode,
            d: buf.toString("utf8"),
            buf,
            ct: resp.headers["content-type"] || "",
            setCookie,
            headers: resp.headers,
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
  // Warm session from page
  const page = await request("GET", "https://www.eclbet04.com/my/update");
  const cookies = page.setCookie.map((c) => c.split(";")[0]).join("; ");
  console.log("page", page.s, "cookies", cookies || "(none)", "set-cookie count", page.setCookie.length);

  const body = { limit: 15, page_no: 1, language: "english", country: "my" };

  for (const label of ["with-cookie", "no-cookie"]) {
    const r = await request("POST", "https://www.eclbet04.com/my/a/notice", {
      body,
      cookie: label === "with-cookie" ? cookies : undefined,
    });
    console.log("\nnotice", label, r.s, r.ct, r.buf.length);
    console.log("resp headers", {
      server: r.headers.server,
      "x-request-id": r.headers["x-request-id"],
      "content-length": r.headers["content-length"],
    });
    console.log(r.d.slice(0, 1000) || "(empty body)");
  }

  // getHomeBannerBg with cookie
  const bg = await request("POST", "https://www.eclbet04.com/my/a/getHomeBannerBg", {
    body: { country: "my" },
    cookie: cookies,
  });
  console.log("\ngetHomeBannerBg", bg.s, bg.buf.length, bg.d.slice(0, 2000) || "(empty)");

  // getDisplayPromo with cookie
  const promo = await request("POST", "https://www.eclbet04.com/my/a/getDisplayPromo", {
    body: {},
    cookie: cookies,
  });
  console.log("\ngetDisplayPromo", promo.s, promo.buf.length, promo.d.slice(0, 1000));

  // Try curl-like without content-type? Browser fetch with JSON.stringify still sets content-type in some cases
  // Marko fetch may omit content-type - try that
  const notice2 = await request("POST", "https://www.eclbet04.com/my/a/notice", {
    body: JSON.stringify(body),
    cookie: cookies,
    headers: { "Content-Type": undefined },
  });
  // force omit content-type
  const notice3 = await new Promise((res, rej) => {
    const payload = JSON.stringify(body);
    const url = new URL("https://www.eclbet04.com/my/a/notice");
    const r = https.request(
      {
        method: "POST",
        hostname: url.hostname,
        path: url.pathname,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: "https://www.eclbet04.com/my/update",
          Origin: "https://www.eclbet04.com",
          Accept: "*/*",
          "Content-Length": Buffer.byteLength(payload),
          Cookie: cookies,
        },
      },
      (resp) => {
        const chunks = [];
        resp.on("data", (c) => chunks.push(c));
        resp.on("end", () => res({ s: resp.statusCode, d: Buffer.concat(chunks).toString("utf8"), len: Buffer.concat(chunks).length }));
      }
    );
    r.on("error", rej);
    r.write(payload);
    r.end();
  });
  console.log("\nnotice omit content-type", notice3.s, notice3.len, notice3.d.slice(0, 1000));
})().catch((e) => console.error(e));
