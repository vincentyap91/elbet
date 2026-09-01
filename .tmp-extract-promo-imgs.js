const https = require("https");
const fs = require("fs");

function request(method, u, { body, cookie } = {}) {
  return new Promise((res, rej) => {
    const url = new URL(u);
    const payload = body == null ? null : typeof body === "string" ? body : JSON.stringify(body);
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Referer: "https://www.eclbet04.com/my/promotion",
      Origin: "https://www.eclbet04.com",
      Accept: "application/json, text/plain, */*",
    };
    if (cookie) headers.Cookie = cookie;
    if (payload != null) {
      headers["Content-Type"] = "application/json";
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
            ct: resp.headers["content-type"] || "",
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
          r.on("end", () => {
            const buf = Buffer.concat(chunks);
            res({ s: r.statusCode, buf, ct: r.headers["content-type"] || "" });
          });
        }
      )
      .on("error", rej);
  });
}

function slug(title) {
  const t = (title || "").toLowerCase();
  if (/welcome/.test(t)) return "welcome";
  if (/birthday/.test(t)) return "birthday";
  if (/usdt/.test(t) && /deposit|deposit/.test(t)) return "usdt-deposit";
  if (/deposit/.test(t) && /crypto|usdt/.test(t)) return "usdt-deposit";
  if (/usdt/.test(t) && /withdraw/.test(t)) return "usdt-withdrawal";
  if (/withdraw/.test(t) && /crypto|usdt/.test(t)) return "usdt-withdrawal";
  if (/rebate/.test(t)) return "rebates";
  if (/voucher|promo code/.test(t)) return "voucher";
  return null;
}

(async () => {
  const page = await request("GET", "https://www.eclbet04.com/my/promotion");
  const cookies = page.setCookie.map((c) => c.split(";")[0]).join("; ");
  console.log("cookies", cookies);

  const promo = await request("POST", "https://www.eclbet04.com/my/a/getDisplayPromo", {
    body: {},
    cookie: cookies,
  });
  fs.writeFileSync(".tmp-api-getDisplayPromo.json", promo.d);
  console.log("promo status", promo.s, promo.buf.length);

  const j = JSON.parse(promo.d);
  const listMap = j.d.promoList || {};
  const all = [];
  for (const [cat, arr] of Object.entries(listMap)) {
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      all.push({ cat, id: item.id, title: item.t, img: item.img, slug: slug(item.t) });
    }
  }
  // unique by id
  const byId = new Map();
  for (const p of all) if (!byId.has(p.id)) byId.set(p.id, p);
  const unique = [...byId.values()];
  console.log("\nAll unique promos:", unique.length);
  for (const p of unique) {
    console.log(`[${p.id}] slug=${p.slug || "-"} | ${p.title}`);
    console.log("  ", p.img);
  }

  console.log("\n== HEAD check images");
  for (const p of unique) {
    if (!p.img) continue;
    const r = await get(p.img);
    console.log(r.s, r.ct, r.buf.length, p.slug || p.id, p.img.split("/").pop());
  }

  // Target six
  const wanted = ["welcome", "birthday", "usdt-deposit", "rebates", "usdt-withdrawal", "voucher"];
  console.log("\n== mapped targets");
  for (const w of wanted) {
    const hit = unique.find((p) => p.slug === w);
    if (hit) console.log(w, "=>", hit.img, "|", hit.title);
    else console.log(w, "=> MISSING");
  }

  // notice with cookies again
  console.log("\n== notice");
  const noticeBodies = [
    { limit: 15, page_no: 1, language: "english", country: "my" },
    { limit: 15, page_no: 1, language: "en", country: "my" },
  ];
  for (const body of noticeBodies) {
    const n = await request("POST", "https://www.eclbet04.com/my/a/notice", { body, cookie: cookies });
    console.log(n.s, n.buf.length, JSON.stringify(body), n.d.slice(0, 500) || "(empty)");
    if (n.s === 200 && n.d.length > 50) fs.writeFileSync(".tmp-api-notice.json", n.d);
  }

  // also try from update page cookies
  const pageU = await request("GET", "https://www.eclbet04.com/my/update");
  const cookiesU = pageU.setCookie.map((c) => c.split(";")[0]).join("; ");
  const n2 = await request("POST", "https://www.eclbet04.com/my/a/notice", {
    body: { limit: 15, page_no: 1, language: "english", country: "my" },
    cookie: cookiesU,
  });
  console.log("notice from update cookies", n2.s, n2.buf.length, n2.d.slice(0, 800) || "(empty)");
  if (n2.s === 200 && n2.d.length > 50) fs.writeFileSync(".tmp-api-notice.json", n2.d);
})().catch((e) => console.error(e));
