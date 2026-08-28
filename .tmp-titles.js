const fs = require("fs");
const pages = ["esports", "sports", "livecasino", "slots", "4d", "fast-game"];
for (const p of pages) {
  const h = fs.readFileSync(`.tmp-${p}.html`, "utf8");
  const title = h.match(/<title>([^<]+)/)?.[1];
  const i = h.indexOf("site-layout-body");
  const j = h.indexOf("footer-divider", i);
  const b = h.slice(i, j);
  const bettingFilled = !b.includes("betting-transaction__table-wrapper></div>") && b.includes("betting-transaction");
  const tableRows = [...b.matchAll(/<td[^>]*>([^<]{2,40})<\/td>/g)].map((m) => m[1].trim());
  console.log(p, "| title:", title);
  console.log("  betting SSR rows:", tableRows.length, tableRows.slice(0, 6).join(" | "));
}
