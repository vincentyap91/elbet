const fs = require("fs");
const h = fs.readFileSync(".tmp-fast-game.html", "utf8");
const names = ["Aviator", "Dice", "Chicken Road", "Crash X", "Tower", "Wheel", "Keno Blast", "Coin Flip", "Rocket", "Plinko", "Mines", "Limbo+"];
for (const n of names) {
  let idx = 0;
  while (true) {
    const key = `"name":"${n}"`;
    const i = h.indexOf(key, idx);
    if (i < 0) break;
    const chunk = h.slice(i, i + 180);
    const img = chunk.match(/"img":"([^"]+)"/) || chunk.match(/"image":"([^"]+)"/);
    console.log(n, img ? img[1] : "no img");
    idx = i + key.length;
    break;
  }
}
