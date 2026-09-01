const https = require("https");
const fs = require("fs");

function get(u) {
  return new Promise((res, rej) => {
    https
      .get(
        u,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Referer: "https://www.eclbet04.com/my",
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
              ct: r.headers["content-type"],
              loc: r.headers.location,
            });
          });
        }
      )
      .on("error", rej);
  });
}

function abs(u) {
  if (!u) return u;
  if (u.startsWith("http")) return u;
  if (u.startsWith("//")) return "https:" + u;
  return "https://www.eclbet04.com" + u;
}

function extractUrls(text) {
  const out = new Set();
  const re =
    /(?:https?:)?\/\/[^"'\\\s)]+\.(?:webp|png|jpe?g|gif|svg)(?:\?[^"'\\\s)]*)?|\/static\/[^"'\\\s)]+\.(?:webp|png|jpe?g|gif|svg)(?:\?[^"'\\\s)]*)?/gi;
  let m;
  while ((m = re.exec(text))) out.add(m[0]);
  const staging = text.match(/https?:\/\/staging-ecl\.xyz[^"'\\\s)]+/gi) || [];
  staging.forEach((u) => out.add(u));
  return [...out];
}

function interesting(u) {
  return /promo|promotion|update|welcome|birthday|usdt|rebate|voucher|contact|banner|hero|icon-page|ECLBET\/banners|staging-ecl|cloudcdnetw|news|announcement/i.test(
    u
  );
}

(async () => {
  const paths = [
    "/my/promotion",
    "/my/promotion/2",
    "/my/mypromotion",
    "/my/update",
    "/my/update/42",
    "/my/contact",
  ];
  const allScripts = new Set();
  const pageHits = {};

  for (const p of paths) {
    const page = await get("https://www.eclbet04.com" + p);
    const file = ".tmp-page" + p.replace(/\//g, "-") + ".html";
    fs.writeFileSync(file, page.d);
    const imgs = extractUrls(page.d).filter(interesting);
    const scripts = [...page.d.matchAll(/src=["']([^"']+\.js[^"']*)["']/gi)].map((m) => m[1]);
    scripts.forEach((s) => allScripts.add(s));
    const rollup = (page.d.match(/"__rollupEntries__":\[([^\]]+)\]/) || [])[1];
    pageHits[p] = { status: page.s, len: page.d.length, rollup, imgs: [...new Set(imgs)] };
    console.log("\n==", p, page.s, "len", page.d.length, "rollup", rollup);
    console.log("interesting imgs", pageHits[p].imgs.slice(0, 50));
  }

  console.log("\n== scanning JS bundles for image paths");
  const bundleHits = new Set();
  for (const s of [...allScripts].slice(0, 40)) {
    const url = abs(s);
    try {
      const r = await get(url);
      if (r.s !== 200) continue;
      const found = extractUrls(r.d).filter(interesting);
      found.forEach((u) => bundleHits.add(u));
      if (found.length) console.log("bundle", s.split("/").pop(), found.length, found.slice(0, 20));
      // also look for promo-ish string literals without extension filters
      const soft = [
        ...r.d.matchAll(
          /["'`]([^"'`]*(?:promo|promotion|update|welcome|birthday|usdt|rebate|voucher|contact)[^"'`]*(?:webp|png|jpe?g|gif|svg))["'`]/gi
        ),
      ].map((m) => m[1]);
      if (soft.length) console.log("soft", s.split("/").pop(), [...new Set(soft)].slice(0, 30));
    } catch (e) {
      console.log("bundle fail", s, e.message);
    }
  }
  console.log("\nALL bundle interesting", [...bundleHits].sort());

  // Candidate HEAD probes based on known ECLBET path patterns
  const candidates = [
    "/static/images/ECLBET/banners/en/desktop/promotion.webp",
    "/static/images/ECLBET/banners/en/desktop/promotions.webp",
    "/static/images/ECLBET/banners/en/desktop/update.webp",
    "/static/images/ECLBET/banners/en/desktop/updates.webp",
    "/static/images/ECLBET/banners/en/desktop/news.webp",
    "/static/images/ECLBET/banners/en/desktop/contact.webp",
    "/static/images/ECLBET/banners/en/mobile/promotion.webp",
    "/static/images/ECLBET/banners/en/mobile/update.webp",
    "/static/images/ECLBET/banners/en/mobile/contact.webp",
    "/static/images/icon-page/promotion.png",
    "/static/images/icon-page/promotions.png",
    "/static/images/icon-page/update.png",
    "/static/images/icon-page/updates.png",
    "/static/images/icon-page/contact.png",
    "/static/images/icons/icon-promotion.svg",
    "/static/images/icons/icon-update.svg",
    "/static/images/icons/icon-contact.svg",
    "/static/images/promotion/welcome.webp",
    "/static/images/promotion/welcome.png",
    "/static/images/promotion/birthday.webp",
    "/static/images/promotion/birthday.png",
    "/static/images/promotion/usdt-deposit.webp",
    "/static/images/promotion/usdt-withdrawal.webp",
    "/static/images/promotion/rebates.webp",
    "/static/images/promotion/voucher.webp",
    "/static/images/promotions/welcome.webp",
    "/static/images/promotions/birthday.webp",
    "/static/images/promotions/usdt-deposit.webp",
    "/static/images/promotions/usdt-withdrawal.webp",
    "/static/images/promotions/rebates.webp",
    "/static/images/promotions/voucher.webp",
    "/static/images/ECLBET/promotion/welcome.webp",
    "/static/images/ECLBET/promotions/welcome.webp",
    "/static/images/update/hero.webp",
    "/static/images/updates/hero.webp",
    "/static/images/others/promotion.webp",
    "/static/images/others/update.webp",
  ];

  console.log("\n== HEAD/GET candidates");
  for (const path of candidates) {
    const u = abs(path);
    const r = await get(u);
    console.log(r.s, r.ct, r.buf.length, u);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
