const fs = require("fs");
const h = fs.readFileSync(".tmp-page-my-promotion.html", "utf8");
const i = h.indexOf("site-layout-body");
console.log(h.slice(i, i + 3500));
console.log("\n---META---");
console.log("rollup", (h.match(/"__rollupEntries__":\[[^\]]+\]/) || [])[0]);
console.log("baseImg", (h.match(/"baseImgUrl":"[^"]+"/) || [])[0]);
console.log("baseUrl", (h.match(/"baseUrl":"[^"]+"/) || [])[0]);
console.log("path", (h.match(/"path":"[^"]+"/) || [])[0]);
