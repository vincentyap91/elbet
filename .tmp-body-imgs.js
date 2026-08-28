const fs = require("fs");

for (const slug of ["esports", "sports", "livecasino", "4d", "slots", "fast-game"]) {
  const h = fs.readFileSync(`.tmp-${slug}.html`, "utf8");
  const i = h.indexOf("site-layout-body");
  const j = h.indexOf("footer-divider", i);
  const body = h.slice(i, j);
  const imgs = [...body.matchAll(/(?:src|data-src)=["']([^"']+)["']/gi)].map((m) => m[1]);
  console.log("\n=== " + slug + " body imgs ===");
  [...new Set(imgs)].forEach((u) => console.log(u));
  const providers = [...body.matchAll(/game-provider[^"']*/gi)].slice(0, 20);
  if (providers.length) console.log("provider refs:", providers.map((m) => m[0]));
}
