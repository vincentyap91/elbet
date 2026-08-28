const fs = require("fs");
const https = require("https");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eclbet04.com/my/4d" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

(async () => {
  const html = fs.readFileSync(".tmp-4d.html", "utf8");
  const mods = [...html.matchAll(/src=([^\s>]+\.js)/g)].map((m) => m[1]).filter((u) => u.includes("/assets/"));
  for (const mod of [...new Set(mods)]) {
    const url = `https://www.eclbet04.com${mod}`;
    const js = await fetch(url);
    if (!/magnum|toto|damacai|sabah|cashsweep|4d|lottery/i.test(js)) continue;
    console.log("HIT bundle", mod);
    for (const term of ["magnum", "toto", "damacai", "sabah", "cashsweep", "singapore", "stc", "4d"]) {
      const re = new RegExp(".{0,60}" + term + ".{0,60}", "gi");
      const ms = [...js.matchAll(re)].slice(0, 5);
      ms.forEach((m) => console.log(m[0].replace(/\n/g, " ")));
    }
  }

  const html2 = fs.readFileSync(".tmp-slots.html", "utf8");
  const mods2 = [...html2.matchAll(/src=([^\s>]+\.js)/g)].map((m) => m[1]).filter((u) => u.includes("/assets/"));
  const gameHits = new Set();
  for (const mod of [...new Set(mods2)]) {
    const url = `https://www.eclbet04.com${mod}`;
    const js = await fetch(url);
    const paths = [
      ...js.matchAll(/ecl\/images\/s3\/[^"'\\]+?\.(?:webp|jpg|png)/gi),
      ...js.matchAll(/\/static\/images\/slots\/[^"'\\]+?\.(?:webp|jpg|png)/gi),
    ].map((m) => m[0]);
    paths.forEach((p) => gameHits.add(p));
  }
  console.log("\nSlots game paths sample:");
  [...gameHits].slice(0, 30).forEach((p) => console.log(p));
})();
