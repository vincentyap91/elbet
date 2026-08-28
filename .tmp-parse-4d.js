const fs = require("fs");

function bodyOf(p) {
  const h = fs.readFileSync(`.tmp-${p}.html`, "utf8");
  const i = h.indexOf("site-layout-body");
  const j = h.indexOf("footer-divider", i);
  return h.slice(i, j).replace(/></g, ">\n<");
}

const b4 = bodyOf("4d");
const lines = b4.split("\n").filter((l) => l.trim());
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (/h1|h2|h3|Payout|Result|Bet Now|rule|accordion|Forecast|Magnum|lottery/i.test(l)) {
    console.log(lines.slice(Math.max(0, i - 1), i + 4).join("\n"));
    console.log("---");
  }
}

// Try parse $MC JSON tail for 4d rules
const h4 = fs.readFileSync(".tmp-4d.html", "utf8");
const mc = h4.match(/\$MC=\(window\.\$MC\|\|\[\]\)\.concat\(([\s\S]+)\)<\/script>/);
if (mc) {
  try {
    const data = JSON.parse(mc[1].slice(0, mc[1].lastIndexOf("}") + 1));
    console.log("MC keys:", Object.keys(data.g || data.o?.g || {}));
  } catch (e) {
    const ruleMatch = mc[1].match(/"rule[^"]*"/g)?.slice(0, 10);
    console.log("rule strings in MC:", ruleMatch);
  }
}

// Extract betting transaction sample from esports SSR table if present
const be = bodyOf("esports");
console.log("\nEsports betting rows:");
const rows = [...be.matchAll(/<td[^>]*>([^<]{2,30})<\/td>/g)].map((m) => m[1].trim()).slice(0, 20);
console.log(rows.join(" | "));
