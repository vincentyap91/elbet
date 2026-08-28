const fs = require("fs");

function bodyOf(p) {
  const h = fs.readFileSync(`.tmp-${p}.html`, "utf8");
  const i = h.indexOf("site-layout-body");
  const j = h.indexOf("footer-divider", i);
  return h.slice(i, j);
}

function cards(p) {
  return [...bodyOf(p).matchAll(/game-card__title>([^<]+)/g)].map((m) => m[1].trim());
}

function labels(p) {
  return [...bodyOf(p).matchAll(/game-card__label[^>]*>([^<]+)/g)].map((m) => m[1].trim());
}

console.log("livecasino cards:", cards("livecasino"));
console.log("livecasino labels:", labels("livecasino"));
console.log("4d has betting:", bodyOf("4d").includes("Betting Transaction"));

const b4 = bodyOf("4d");
console.log("\n4d payout intro:");
console.log(
  b4
    .match(/Prize money for Big Forecast[\s\S]{0,200}/)?.[0]
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
);

const ruleBlock = b4.match(/Bet Now[\s\S]{0,4000}/)?.[0] || "";
const ruleItems = [...ruleBlock.matchAll(/class="[^"]*accordion[^"]*"[\s\S]{0,200}/g)];
console.log("\n4d after Bet Now has accordion markers:", ruleBlock.includes("accordion") || ruleBlock.includes("rule"));
console.log("rule titles:", [...ruleBlock.matchAll(/<h[34][^>]*>([^<]+)/g)].map((m) => m[1]));

const resultNames = [...b4.matchAll(/lottery-4d__result-name[^>]*>([^<]+)/g)].map((m) => m[1].trim());
console.log("4d result operators:", resultNames.length ? resultNames : "fallback search");
if (!resultNames.length) {
  const ops = ["Magnum - 4D", "Sports Toto", "Damacai 1+3D", "Singapore 4D", "Sabah 88", "4STC 4D", "Cash Sweep"].filter((n) => b4.includes(n));
  console.log(ops);
}

// Check CN banner paths referenced anywhere
for (const p of ["esports", "sports", "livecasino", "slots", "4d", "fast-game"]) {
  const h = fs.readFileSync(`.tmp-${p}.html`, "utf8");
  const cn = h.includes("/banners/cn/") || h.includes("/banners/zh/");
  const enBanner = h.match(/banners\/en\/desktop\/([^"']+)/)?.[1];
  console.log(`${p}: EN banner=${enBanner}, CN refs=${cn}`);
}
