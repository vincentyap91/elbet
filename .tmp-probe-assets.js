const fs = require("fs");
const https = require("https");
const path = require("path");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Referer: "https://www.eclbet04.com/my",
            Accept: "*/*",
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            return fetch(new URL(res.headers.location, url).href).then(resolve, reject);
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
        }
      )
      .on("error", reject);
  });
}

function probe(url) {
  return fetch(url).then((r) => ({ url, status: r.status, len: r.body.length }));
}

(async () => {
  const candidates = [
    // providers - alternate names
    "https://www.eclbet04.com/static/images/game-provider/my/Esports/SABA%20ESPORTS.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Esports/SABA_ESPORTS.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Esports/saba-esports.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Esports/Saba-Esports.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Esports/IA%20GAMING.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Esports/IAGAMING.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Sports/ECL%20SPORTS.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Sports/ecl.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/EZUGI%20CLUB.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/ON%20LIVE.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/ONLIVE%20CLUB.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/CHOICE%20CLUB.jpg",
    "https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/CREEDROOMZ%20CLUB.jpg",
    // 4d logos - alternate paths
    "https://www.eclbet04.com/static/images/lottery/magnum.png",
    "https://www.eclbet04.com/static/images/lottery/4d/Magnum.png",
    "https://www.eclbet04.com/static/images/lottery/4d/logo-magnum.png",
    "https://www.eclbet04.com/static/images/lottery/4d/magnum.webp",
    "https://www.eclbet04.com/static/images/lottery/4d/Magnum-4D.png",
    "https://staging-ecl.xyz/ecl/images/lottery/magnum.png",
    "https://staging-ecl.xyz/ecl/images/lottery/4d/magnum.png",
    "https://staging-ecl.xyz/ecl/images/s3/lottery/magnum.png",
    // game thumbs alternate
    "https://staging-ecl.xyz/ecl/images/s3/slots/Olympus.webp",
    "https://staging-ecl.xyz/ecl/images/s3/slots/olympus.jpg",
    "https://staging-ecl.xyz/ecl/images/s3/game/slots/olympus.webp",
  ];

  for (const url of candidates) {
    const r = await probe(url);
    if (r.status === 200 && r.len > 500) console.log("OK", r.len, url);
    else console.log("NO", r.status, url);
  }

  // Parse MC JSON from pages
  for (const slug of ["esports", "sports", "livecasino", "slots", "fast-game", "4d"]) {
    const file = `.tmp-${slug}.html`;
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    const mc = html.match(/\$MC=\(window\.\$MC\|\|\[\]\)\.concat\(([\s\S]+?)\)<\/script>/);
    if (!mc) continue;
    const imgs = [...new Set([...mc[1].matchAll(/(?:https?:\/\/[^"\\]+?\.(?:webp|jpg|jpeg|png|gif|svg)|\/static\/[^"\\]+?\.(?:webp|jpg|jpeg|png|gif|svg)|ecl\/images\/[^"\\]+?\.(?:webp|jpg|jpeg|png|gif|svg))/gi)].map((m) => m[0]))];
    if (imgs.length) {
      console.log("\n=== MC images:", slug, "===", imgs.length);
      imgs.forEach((u) => console.log(u));
    }
  }
})();
