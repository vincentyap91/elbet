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

function findExact(obj, names, out) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) return obj.forEach((v) => findExact(v, names, out));
  if (typeof obj.name === "string") {
    for (const n of names) {
      if (obj.name.toLowerCase() === n.toLowerCase()) {
        out.push({ name: obj.name, img: obj.image || obj.img });
      }
    }
  }
  Object.values(obj).forEach((v) => findExact(v, names, out));
}

const fastNames = ["Chicken Road", "Aviator", "Plinko", "Mines", "Limbo+", "Dice", "Crash X", "Tower", "Wheel", "Keno Blast", "Coin Flip", "Rocket"];
const mc = parseMc("fast-game");
const out = [];
findExact(mc, fastNames, out);
console.log(out);
