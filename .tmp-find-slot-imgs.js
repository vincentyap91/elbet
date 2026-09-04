const fs = require("fs");
const h = fs.readFileSync(".tmp-slots.html", "utf8");
const base = (h.match(/baseImgUrl":"([^"]+)"/) || [])[1] || "https://staging-ecl.xyz";
console.log("baseImgUrl", base);

const folders = [...h.matchAll(/img_folder":"([^"]+)"/g)].map((x) => x[1]);
console.log("folders", [...new Set(folders)].slice(0, 30));

// Pull compact game objects: "name":"...","gameId":"...","img":"..."
const games = [];
const re = /"name":"([^"]{2,120})"[^}]{0,400}?"img":"([^"]+)"/g;
let m;
while ((m = re.exec(h))) {
  games.push({ name: m[1], img: m[2] });
}
console.log("gamePairs", games.length);
const want = [
  "Big Bass",
  "Ocean",
  "Fish",
  "Sic Bo",
  "Dragon Tiger",
  "Roulette",
  "Hold",
  "Blackjack",
  "Baccarat",
  "Mega Fishing",
  "Cash God",
  "Olympus",
  "Sugar Rush",
  "Sweet Bonanza",
  "Starlight",
  "Mahjong",
  "Jelly",
  "Dolphin",
  "Lion",
  "Fury",
  "Anubis",
  "Triple Pot",
  "Lucky Road",
];
for (const g of games) {
  if (want.some((w) => g.name.includes(w))) {
    console.log(JSON.stringify(g));
  }
}

// Also find setting_path img_folder near hot games
const pathRe = /"img_folder":"([^"]+)","img_width":(\d+),"img_height":(\d+)/g;
const paths = [];
while ((m = pathRe.exec(h))) paths.push(m[1]);
console.log("uniquePaths", [...new Set(paths)]);
