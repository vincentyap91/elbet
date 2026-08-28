const fs = require("fs");
const https = require("https");

function head(url) {
  return new Promise((resolve) => {
    https
      .request(
        url,
        { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eclbet04.com/my/4d" } },
        (res) => {
          res.resume();
          resolve({ url, status: res.statusCode, len: res.headers["content-length"] || 0 });
        }
      )
      .on("error", () => resolve({ url, status: 0 }))
      .end();
  });
}

(async () => {
  const names = [
    "magnum", "toto", "damacai", "sg", "sabah88", "stc", "cashsweep",
    "magnum-4d", "sportstoto", "sports-toto", "damacai-1-3d", "singapore", "sabah-88", "4stc", "cash-sweep",
    "logo-magnum", "logo-toto", "logo-damacai",
  ];
  for (const n of names) {
    for (const ext of ["webp", "png", "jpg", "svg"]) {
      for (const dir of ["lottery/4d", "4d", "lottery", "lottery/4d/logo", "4d/logo"]) {
        const path = `/static/images/${dir}/${n}.${ext}`;
        const r = await head(`https://www.eclbet04.com${path}`);
        if (r.status === 200) console.log("OK", r.len, path);
      }
    }
  }

  // staging paths
  for (const n of names) {
    for (const ext of ["webp", "png"]) {
      const path = `https://staging-ecl.xyz/ecl/images/lottery/4d/${n}.${ext}`;
      const r = await head(path);
      if (r.status === 200 && Number(r.len) > 4000) console.log("OK staging", r.len, path);
    }
  }
})();
