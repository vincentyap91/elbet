const fs = require("fs");
const pages = ["esports", "sports", "livecasino", "slots", "4d", "fast-game"];

for (const p of pages) {
  const html = fs.readFileSync(`.tmp-${p}.html`, "utf8");
  const start = html.indexOf("site-layout-body");
  const end = html.indexOf("footer-divider", start);
  const body = start >= 0 ? html.slice(start, end) : html;

  const banner = body.match(/banners\/en\/desktop\/([^"']+)/)?.[1];
  const h1Match = body.match(/<h1 class="form-title[^"]*"[^>]*>[\s\S]*?<\/h1>/);
  const h1Text = h1Match ? h1Match[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  );
  const h2s = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  );

  const playButtons = [...body.matchAll(/>(Play|Bet Now|Demo)<\/(p|a|button)/g)].map((m) => m[1]);
  const providerBlocks = [...body.matchAll(/class="[^"]*(?:provider|game-provider|club-card)[^"]*"[\s\S]{0,400}/g)];

  const cardTexts = [...body.matchAll(/(?:provider-card|game-provider|club)[^>]*>[\s\S]{0,300}?<p[^>]*>([^<]{2,50})<\/p>/gi)]
    .map((m) => m[1].trim())
    .filter((t) => !/play|demo|new|on live/i.test(t));

  const imgAlts = [...body.matchAll(/alt="([^"]{3,40})"/g)]
    .map((m) => m[1])
    .filter((a) => !/eclbet|lottery|close|question/i.test(a));

  const markers = [
    "gamelist-wrapper",
    "slots-option",
    "slots-search",
    "gameslist-display",
    "game-providers",
    "provider-list",
    "lottery-4d",
    "payout",
    "4d-result",
    "rules-accordion",
    "hot-games",
    "betting-transaction",
    "nav-pill",
    "section-title",
    "accordion",
    "rule",
  ].filter((c) => body.includes(c));

  console.log(`=== ${p} ===`);
  console.log("banner:", banner || "(none)");
  console.log("h1:", h1Text || h1s[0] || "(none)");
  console.log("all h1:", h1s.join(" | "));
  console.log("h2:", h2s.join(" | "));
  console.log("markers:", markers.join(", "));
  const uniqueNames = [...new Set([...cardTexts, ...imgAlts])].slice(0, 25);
  if (uniqueNames.length) console.log("visible names:", uniqueNames.join(", "));
  console.log("");
}
