const https = require("https");
const fs = require("fs");

function get(u, opts = {}) {
  return new Promise((res, rej) => {
    https
      .get(
        u,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Referer: "https://www.eclbet04.com/my/promotion",
            Accept: opts.accept || "*/*",
            ...(opts.headers || {}),
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

(async () => {
  // Find the promotion bundle from HTML and extract image construction context
  const html = fs.readFileSync(".tmp-page-my-promotion.html", "utf8");
  const scripts = [...new Set([...html.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];

  for (const s of scripts) {
    const r = await get("https://www.eclbet04.com" + s);
    if (r.s !== 200) continue;
    if (!r.d.includes("getDisplayPromo") && !r.d.includes("/static/images/promotion/")) continue;
    console.log("\nBUNDLE", s);
    const idx = r.d.indexOf("/static/images/promotion/");
    console.log("context promotion/", r.d.slice(Math.max(0, idx - 400), idx + 600));
    const idx2 = r.d.indexOf("getDisplayPromo");
    console.log("\ncontext getDisplayPromo", r.d.slice(Math.max(0, idx2 - 300), idx2 + 800));
    // all promotion/ static refs
    const refs = [...r.d.matchAll(/\/static\/images\/promotion\/[^"'\\)\s]+/g)].map((m) => m[0]);
    console.log("promotion static refs", [...new Set(refs)]);
    // staging image patterns near promo
    const staging = [...r.d.matchAll(/staging-ecl[^"'\\)\s]{0,120}|ecl\/images\/[^"'\\)\s]{0,120}/g)].map((m) => m[0]);
    console.log("staging-ish", [...new Set(staging)].slice(0, 40));
    // look for image field names
    const fields = [...r.d.matchAll(/["'](image|img|banner|thumb|thumbnail|desktopImg|mobileImg|promoImg|cover)["']/gi)].map(
      (m) => m[1]
    );
    console.log("image fields", [...new Set(fields)]);
  }

  // Also scan update page bundles
  const htmlU = fs.readFileSync(".tmp-page-my-update.html", "utf8");
  const scriptsU = [...new Set([...htmlU.matchAll(/src=(?:["']?)(\/assets\/[^"'>\s]+\.js)/gi)].map((m) => m[1]))];
  for (const s of scriptsU) {
    const r = await get("https://www.eclbet04.com" + s);
    if (r.s !== 200) continue;
    if (!/getDisplayUpdate|getUpdate|announcement|update-list|update-card/i.test(r.d)) continue;
    if (!/update/i.test(r.d)) continue;
    const hasApi = /\/a\/[^"'\\)\s]*update|getUpdate|getAnnouncement|getNews/i.test(r.d);
    if (!hasApi && !r.d.includes("update-list") && !r.d.includes("update-card")) continue;
    console.log("\nUPDATE BUNDLE", s.split("/").pop());
    const apis = [...r.d.matchAll(/["'`](\/?a\/[^"'`]{0,80})["'`]/g)].map((m) => m[1]);
    console.log(
      "a/ apis",
      [...new Set(apis)].filter((x) => /update|promo|news|announc|display/i.test(x)).slice(0, 40)
    );
    const idx = r.d.search(/getDisplayUpdate|getUpdateList|\/a\/[^"']*update/i);
    if (idx >= 0) console.log("ctx", r.d.slice(Math.max(0, idx - 200), idx + 500));
  }

  // Probe API endpoints on eclbet04
  const apis = [
    "https://www.eclbet04.com/a/getDisplayPromo",
    "https://www.eclbet04.com/a/getDisplayPromo?country=my&locale=en",
    "https://www.eclbet04.com/my/a/getDisplayPromo",
    "https://www.eclbet04.com/a/getDisplayUpdate",
    "https://www.eclbet04.com/a/getUpdate",
    "https://www.eclbet04.com/a/getAnnouncement",
    "https://www.eclbet04.com/a/getNews",
    "https://www.eclbet04.com/a/getDisplayNews",
  ];
  console.log("\n== /a/ probes");
  for (const u of apis) {
    try {
      const r = await get(u, { accept: "application/json" });
      console.log(r.s, r.ct.slice(0, 50), r.buf.length, u);
      console.log(r.d.slice(0, 400).replace(/\s+/g, " "));
    } catch (e) {
      console.log("ERR", u, e.message);
    }
  }

  // Probe voucher- and promo card path variants
  const names = [
    "welcome",
    "Welcome",
    "welcome-bonus",
    "birthday",
    "Birthday",
    "usdt-deposit",
    "usdt_deposit",
    "USDT-Deposit",
    "deposit-crypto",
    "usdt-withdrawal",
    "usdt_withdrawal",
    "USDT-Withdrawal",
    "rebates",
    "rebate",
    "voucher",
    "Voucher",
    "promo-code",
  ];
  const prefixes = [
    "https://www.eclbet04.com/static/images/promotion/",
    "https://www.eclbet04.com/static/images/promotion/voucher-",
    "https://www.eclbet04.com/static/images/promotions/",
    "https://staging-ecl.xyz/ecl/images/bg/",
    "https://staging-ecl.xyz/ecl/images/promotion/",
    "https://staging-ecl.xyz/ecl/images/promotions/",
    "https://staging-ecl.xyz/ecl/images/s3/",
  ];
  const exts = [".webp", ".png", ".jpg", ".jpeg", ".gif"];
  console.log("\n== promo card path probe");
  for (const prefix of prefixes) {
    for (const name of names) {
      for (const ext of exts) {
        // skip silly voucher- + voucher- prefix double for non-voucher prefix? keep simple
        const u = prefix + name + ext;
        const r = await get(u);
        if (r.s === 200 && /image\//.test(r.ct)) {
          console.log("OK", r.s, r.ct, r.buf.length, u);
        }
      }
    }
  }

  // Known homepage banners that likely map to promo themes
  const known = [
    "https://staging-ecl.xyz/ecl/images/bg/1756788797522--Desktop_Deposit-Crypto_General.jpg",
    "https://staging-ecl.xyz/ecl/images/bg/1756789037686--Desktop-Crypto-Withdrawal-General.jpg",
    "https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/promotions.webp",
    "https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/promotions.webp",
    "https://www.eclbet04.com/static/images/icons/icon-detail-arrow-left.svg",
    "https://www.eclbet04.com/static/images/icons/icon-detail-arrow-right.svg",
    "https://www.eclbet04.com/static/images/icons/icon-arrow-left-circle.png",
    "https://www.eclbet04.com/static/images/icon-page/rebates.png",
    "https://www.eclbet04.com/static/images/menu/icon-contact.svg",
    "https://www.eclbet04.com/static/images/icons/icon-contact-html-white.svg",
  ];
  console.log("\n== known related");
  for (const u of known) {
    const r = await get(u);
    console.log(r.s, r.ct, r.buf.length, u);
  }
})().catch((e) => console.error(e));
