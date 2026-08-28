const fs = require("fs");

function extractBody(html) {
  const i = html.indexOf("site-layout-body");
  const j = html.indexOf("footer-divider", i);
  return i >= 0 ? html.slice(i, j) : html;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseProviders(body) {
  const cards = [];
  const re = /<div class="[^"]*provider-card[^"]*"[\s\S]*?<\/div>\s*<\/div>/g;
  let m;
  while ((m = re.exec(body))) {
    const block = m[0];
    const ps = [...block.matchAll(/<p[^>]*>([^<]+)<\/p>/g)].map((x) => x[1].trim());
    if (ps.length) cards.push(ps);
  }
  // fallback: provider grid pattern
  if (!cards.length) {
    const alt = [...body.matchAll(/provider-name[^>]*>([^<]+)/g)].map((x) => x[1].trim());
    return alt;
  }
  return cards.map((p) => p.join(" / "));
}

function parsePage(p) {
  const html = fs.readFileSync(`.tmp-${p}.html`, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const body = extractBody(html);
  const banner = body.match(/desktop\/([^"']+\.webp)/)?.[1];

  const blocks = [];
  if (body.includes("banner-section")) blocks.push("Hero banner (image)");
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => stripTags(m[1]));
  h1s.forEach((h) => blocks.push(`H1: ${h}`));

  if (body.includes("gamelist-wrapper")) blocks.push("HOT GAMES rail (JS-populated gamelist-wrapper)");
  if (body.includes("slots-option")) blocks.push("Provider/category nav pills (slots-options)");
  if (body.includes("slots-search")) blocks.push("Search input");
  if (body.includes("gameslist-display")) blocks.push("Game grid (JS-populated gameslist-display__wrapper)");

  const providers = parseProviders(body);
  const providerSection = body.match(/Game Providers[\s\S]{0,12000}/)?.[0] || "";
  const providerNames = [...providerSection.matchAll(/<p>([^<]{2,40})<\/p>/g)]
    .map((m) => m[1].trim())
    .filter((n) => !/^(Play|New|On Live|Demo)$/i.test(n));

  if (providerNames.length) blocks.push(`Provider cards: ${[...new Set(providerNames)].join(", ")}`);

  if (body.includes("lottery-4d__payout") || body.includes("Payout")) {
    blocks.push("Payout section");
    if (body.includes("Big Forecast")) blocks.push("Big Forecast payout table");
    if (body.includes("Small Forecast")) blocks.push("Small Forecast payout table");
    if (body.includes("Bet Now")) blocks.push("Bet Now CTA");
  }
  if (body.includes("4D Result") || body.includes("4d-result")) blocks.push("4D Result boards");
  if (body.includes("accordion") || body.includes("rule-item") || body.includes("rules-wrapper")) blocks.push("Rules accordion");

  const h2s = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => stripTags(m[1]));
  h2s.forEach((h) => blocks.push(`H2: ${h}`));
  if (body.includes("betting-transaction")) {
    blocks.push("Betting Transaction tabs: All Bets | Top Daily Winner + View More");
  }

  // 4d lottery names
  const lotteries = ["Magnum", "Sports Toto", "Damacai", "Singapore 4D", "Sabah 88", "4STC 4D", "Cash Sweep"].filter((n) => body.includes(n));

  return { title, banner, h1s, h2s, blocks, providerNames: [...new Set(providerNames)], lotteries };
}

for (const p of ["esports", "sports", "livecasino", "slots", "4d", "fast-game"]) {
  const r = parsePage(p);
  console.log(JSON.stringify({ page: p, ...r }, null, 2));
  console.log("---");
}
