const fs = require("fs");

function parseMc(slug) {
  const html = fs.readFileSync(`.tmp-${slug}.html`, "utf8");
  const start = html.indexOf('$MC=(window.$MC||[]).concat(');
  let i = start + '$MC=(window.$MC||[]).concat('.length;
  let depth = 0, inStr = false, esc = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(start + '$MC=(window.$MC||[]).concat('.length, i + 1));
    }
  }
}

function findByName(obj, names, out) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) return obj.forEach((v) => findByName(v, names, out));
  if (typeof obj.name === "string") {
    for (const n of names) {
      if (obj.name.toLowerCase().includes(n.toLowerCase())) {
        out.push({ name: obj.name, img: obj.image || obj.img, provider: obj.provider || obj.providerName || obj.club });
      }
    }
  }
  Object.values(obj).forEach((v) => findByName(v, names, out));
}

const slotNames = [
  "Olympus", "Sweet Bonanza", "Gates of Olympus", "Starlight Princess", "Wild West Gold", "Big Bass",
  "Age of the Gods", "Bubble Pop", "Three Little Pigs", "Panda Dragon",
];
const fastNames = ["Chicken Road", "Aviator", "Plinko", "Mines", "Limbo", "Dice", "Crash", "Tower", "Wheel", "Keno", "Coin Flip", "Rocket"];

for (const [slug, names] of [
  ["slots", slotNames],
  ["fast-game", fastNames],
]) {
  const mc = parseMc(slug);
  const out = [];
  findByName(mc, names, out);
  console.log("\n=== " + slug + " ===");
  out.slice(0, 40).forEach((g) => console.log(g.name, "|", g.provider, "|", g.img));
}
