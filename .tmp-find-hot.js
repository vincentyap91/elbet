const fs = require("fs");
const https = require("https");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eclbet04.com/my/slots" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

(async () => {
  const html = fs.readFileSync(".tmp-slots.html", "utf8");
  const mods = [...html.matchAll(/modulepreload href=([^ >]+)/g)].map((m) => m[1]);
  for (const mod of mods) {
    const url = mod.startsWith("http") ? mod : `https://www.eclbet04.com${mod}`;
    try {
      const js = await fetch(url);
      const markers = ["HOT GAMES", "hotGames", "hot_games", "gamelist-wrapper", "SPADE", "CQ9", "JOKER", "Pragmatic", "Fast Game", "Spribe", "Aviator"];
      const hits = markers.filter((m) => js.includes(m));
      if (hits.length) {
        console.log("HIT", mod, hits.join(", "));
        for (const h of ["HOT GAMES", "SPADE", "CQ9", "JOKER", "Pragmatic", "Spribe"]) {
          const i = js.indexOf(h);
          if (i >= 0) console.log(" context:", js.slice(Math.max(0, i - 80), i + 120).replace(/\n/g, " "));
        }
      }
    } catch (e) {
      console.log("fail", mod, e.message);
    }
  }
})();
