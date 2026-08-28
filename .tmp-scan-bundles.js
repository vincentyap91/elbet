const fs = require("fs");
const https = require("https");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Referer: "https://www.eclbet04.com/my",
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
      )
      .on("error", reject);
  });
}

async function scanPage(slug) {
  const html = fs.readFileSync(`.tmp-${slug}.html`, "utf8");
  const mods = [...html.matchAll(/(?:src|href)=([^\s>]+)/g)]
    .map((m) => m[1].replace(/^["']|["']$/g, ""))
    .filter((u) => u.includes("/assets/") && u.endsWith(".js"));
  const uniq = [...new Set(mods)];
  const hits = new Set();
  for (const mod of uniq) {
    const url = mod.startsWith("http") ? mod : `https://www.eclbet04.com${mod}`;
    const js = await fetch(url);
    const paths = [
      ...js.matchAll(/\/static\/images\/[^"'\\]+?\.(?:jpg|jpeg|png|webp|gif|svg)/gi),
      ...js.matchAll(/ecl\/images\/[^"'\\]+?\.(?:jpg|jpeg|png|webp|gif|svg)/gi),
      ...js.matchAll(/game-provider\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi),
    ].map((m) => m[0]);
    paths.forEach((p) => hits.add(p));
    const entry = html.match(/__rollupEntries":\["([^"]+)"/);
    if (entry && js.includes(entry[1])) {
      console.log(slug, "bundle", mod, "matches entry", entry[1], "paths", paths.length);
    }
  }
  console.log("\n=== " + slug + " paths (" + hits.size + ") ===");
  [...hits].sort().forEach((p) => console.log(p));
}

(async () => {
  for (const slug of ["esports", "sports", "livecasino", "4d", "fast-game"]) {
    await scanPage(slug);
  }
})();
