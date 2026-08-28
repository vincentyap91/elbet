const fs = require("fs");
const https = require("https");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eclbet04.com/my" } }, (res) => {
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
    const js = await fetch(`https://www.eclbet04.com${mod}`);
    const imgs = [...js.matchAll(/\/static\/images\/[^"'\\]+?\.(?:webp|png|jpg|svg)/gi)].map((m) => m[0]);
    const lottery = imgs.filter((p) => /4d|lottery|magnum|toto|damacai|sabah|cash|stc|singapore/i.test(p));
    if (lottery.length) {
      console.log("bundle", mod);
      lottery.forEach((p) => console.log(p));
    }
  }

  // probe known lottery logo naming on static
  const names = [
    "magnum", "toto", "damacai", "sg", "sabah88", "stc", "cashsweep",
    "magnum-4d", "sportstoto", "damacai-1+3d", "singapore-4d", "sabah-88", "4stc", "cash-sweep",
  ];
  for (const n of names) {
    for (const ext of ["webp", "png", "jpg"]) {
      for (const base of [
        `/static/images/lottery/4d/${n}.${ext}`,
        `/static/images/4d/${n}.${ext}`,
        `/static/images/lottery/${n}.${ext}`,
      ]) {
        const url = `https://www.eclbet04.com${base}`;
        const res = await fetch(url).catch(() => null);
        // can't get status easily - use head via https
      }
    }
  }
})();
