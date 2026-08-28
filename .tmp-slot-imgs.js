const fs = require("fs");
const h = fs.readFileSync(".tmp-slots.html", "utf8");
const names = [
  "Wild West Gold",
  "Big Bass Bonanza",
  "Age of the Gods",
  "Bubble Pop",
  "Three Little Pigs",
  "Panda Dragon Boat",
];
for (const n of names) {
  const key = `"name":"${n}"`;
  const i = h.indexOf(key);
  if (i < 0) {
    console.log("missing", n);
    continue;
  }
  const chunk = h.slice(i, i + 200);
  const img = chunk.match(/"image":"([^"]+)"/);
  console.log(n, img ? img[1] : chunk);
}
