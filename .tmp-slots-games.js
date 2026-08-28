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

const mc = parseMc("slots");
const games = mc.o?.g?.games || mc.g?.games || [];
console.log("games array length", games.length);
if (games.length) {
  console.log("sample game keys", Object.keys(games[0]));
  games.slice(0, 5).forEach((g) => console.log(JSON.stringify(g)));
}

// search whole MC for imageUrl/thumbnail/img fields
function findGameObjs(obj, out) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((v) => findGameObjs(v, out));
    return;
  }
  if (obj.name && (obj.image || obj.img || obj.thumbnail || obj.icon || obj.gameImage)) {
    out.push(obj);
  }
  Object.values(obj).forEach((v) => findGameObjs(v, out));
}

const objs = [];
findGameObjs(mc, objs);
console.log("\nobjects with name+image:", objs.length);
objs.slice(0, 15).forEach((o) =>
  console.log(o.name, o.provider || o.providerName, o.image || o.img || o.thumbnail || o.icon || o.gameImage)
);
