/**
 * Downloads round Malaysian bank marks (Payment-Icon, MIT) into assets/images/banks.
 */
const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const destDir = path.join(root, "assets", "images", "banks");
const banks = {
  maybank: "Maybank",
  cimb: "Cimb",
  rhb: "RHB",
  hlb: "HongLeongBank",
  ambank: "AmBank",
  bsn: "BSN",
  rakyat: "BankRakyat",
  uob: "UOB",
  ocbc: "OCBC",
  alliance: "AllianceBank",
};

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "elbet-bank-icons" } }, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (res.statusCode >= 300) reject(new Error(url + " " + res.statusCode));
          else resolve(JSON.parse(body));
        });
      })
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "elbet-bank-icons" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          return reject(new Error(url + " " + res.statusCode));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch (e) {}
        reject(err);
      });
  });
}

async function main() {
  fs.mkdirSync(destDir, { recursive: true });
  for (const [id, folder] of Object.entries(banks)) {
    const listing = await getJson(
      "https://api.github.com/repos/SnorSnor9998/Payment-Icon/contents/Banks/" + folder
    );
    const rou = listing.find((item) => /_ROU\.svg$/i.test(item.name)) || listing.find((item) => /\.svg$/i.test(item.name));
    if (!rou) throw new Error("No SVG for " + folder);
    const dest = path.join(destDir, id + ".svg");
    await download(rou.download_url, dest);
    console.log(id, rou.name, fs.statSync(dest).size);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
