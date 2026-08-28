const fs = require("fs");
const https = require("https");

function extractJsonNames(file) {
  const h = fs.readFileSync(file, "utf8");
  const names = [...h.matchAll(/"name":"([^"]{2,80})"/g)].map((m) => m[1]);
  const providers = [...h.matchAll(/"provider(?:Name)?":"([^"]{2,80})"/g)].map((m) => m[1]);
  const hot = h.includes("HOT GAMES") || h.includes("hotGames") || h.includes("hot games");
  return {
    hotMarker: hot,
    names: [...new Set([...names, ...providers])].slice(0, 40),
  };
}

console.log("slots:", extractJsonNames(".tmp-slots.html"));
console.log("fast-game:", extractJsonNames(".tmp-fast-game.html"));

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eclbet04.com/my/slots" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, len: d.length, sample: d.slice(0, 500) }));
      })
      .on("error", reject);
  });
}

(async () => {
  const urls = [
    "https://www.eclbet04.com/my/api/game/slots",
    "https://www.eclbet04.com/api/my/slots",
    "https://api.eclwebapi.com/my/game/slots",
  ];
  for (const u of urls) {
    try {
      const r = await get(u);
      console.log(u, r.status, r.len, r.sample.slice(0, 120));
    } catch (e) {
      console.log(u, "err", e.message);
    }
  }
})();
