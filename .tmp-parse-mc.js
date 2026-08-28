const fs = require("fs");

function parseMc(slug) {
  const html = fs.readFileSync(`.tmp-${slug}.html`, "utf8");
  const start = html.indexOf('$MC=(window.$MC||[]).concat(');
  if (start < 0) return null;
  let i = start + '$MC=(window.$MC||[]).concat('.length;
  let depth = 0;
  let inStr = false;
  let esc = false;
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
      if (depth === 0) {
        const json = html.slice(start + '$MC=(window.$MC||[]).concat('.length, i + 1);
        return JSON.parse(json);
      }
    }
  }
  return null;
}

function walk(obj, out) {
  if (!obj) return;
  if (typeof obj === "string") {
    if (/\.(webp|jpg|jpeg|png|gif|svg)/i.test(obj) || /game-provider|lottery|\/ecl\/images/i.test(obj)) out.add(obj);
    return;
  }
  if (Array.isArray(obj)) obj.forEach((v) => walk(v, out));
  else if (typeof obj === "object") Object.values(obj).forEach((v) => walk(v, out));
}

for (const slug of ["esports", "sports", "livecasino", "slots", "fast-game", "4d"]) {
  try {
    const mc = parseMc(slug);
    const imgs = new Set();
    walk(mc, imgs);
    console.log("\n=== " + slug + " (" + imgs.size + ") ===");
    [...imgs].sort().forEach((u) => console.log(u));
  } catch (e) {
    console.log(slug, "ERR", e.message);
  }
}
