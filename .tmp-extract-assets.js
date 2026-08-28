const fs = require("fs");
const https = require("https");

const pages = [
  ["esports", "https://www.eclbet04.com/my/esports"],
  ["sports", "https://www.eclbet04.com/my/sports"],
  ["livecasino", "https://www.eclbet04.com/my/livecasino"],
  ["slots", "https://www.eclbet04.com/my/slots"],
  ["fast-game", "https://www.eclbet04.com/my/fast-game"],
  ["4d", "https://www.eclbet04.com/my/4d"],
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html,*/*",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return fetch(new URL(res.headers.location, url).href).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      }
    ).on("error", reject);
  });
}

function extractImgs(html) {
  const urls = new Set();
  for (const m of html.matchAll(/(?:src|data-src|data-original|poster)=["']([^"']+)["']/gi)) {
    urls.add(m[1]);
  }
  for (const m of html.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
    urls.add(m[1]);
  }
  return [...urls].filter((u) => /static|staging|\.webp|\.jpg|\.png|\.gif|\.svg/i.test(u));
}

(async () => {
  const all = {};
  for (const [slug, url] of pages) {
    let html;
    const cache = `.tmp-${slug}.html`;
    if (fs.existsSync(cache)) html = fs.readFileSync(cache, "utf8");
    else {
      console.log("Fetching", url);
      html = await fetch(url);
      fs.writeFileSync(cache, html);
    }
    const imgs = extractImgs(html);
    all[slug] = imgs;
    console.log("\n=== " + slug + " (" + imgs.length + ") ===");
    imgs
      .filter((u) => /game-provider|lottery|4d|banner|page-icon|ECLBET\/banners|staging-ecl|slots|fast/i.test(u))
      .forEach((u) => console.log(u));
  }

  // Also parse $MC JSON for image paths in slots/fast-game
  for (const slug of ["slots", "fast-game"]) {
    const html = fs.readFileSync(`.tmp-${slug}.html`, "utf8");
    const mc = html.match(/\$MC=\(window\.\$MC\|\|\[\]\)\.concat\(([\s\S]+?)\)<\/script>/);
    if (!mc) continue;
    const paths = [...mc[1].matchAll(/(?:https?:\/\/[^"\\]+|\/static\/[^"\\]+|ecl\/images\/[^"\\]+)/g)].map((m) => m[0]);
    const uniq = [...new Set(paths)].filter((p) => /\.(webp|jpg|png|gif|svg)/i.test(p));
    if (uniq.length) {
      console.log("\n=== " + slug + " MC images ===");
      uniq.slice(0, 40).forEach((u) => console.log(u));
    }
  }
})();
