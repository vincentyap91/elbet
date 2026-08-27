/**
 * Embeds components/<name>/<name>.html into js/fragments.js
 * so the site can open as file:// without fetch.
 *
 * Usage: node scripts/build-fragments.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const componentsDir = path.join(root, "components");
const outFile = path.join(root, "js", "fragments.js");

const fragments = {};
for (const name of fs.readdirSync(componentsDir).sort()) {
  const htmlPath = path.join(componentsDir, name, `${name}.html`);
  if (!fs.existsSync(htmlPath)) continue;
  fragments[name] = fs.readFileSync(htmlPath, "utf8");
}

const body = `window.Nexa = window.Nexa || {};
Nexa.FRAGMENTS = ${JSON.stringify(fragments, null, 2)};
`;

fs.writeFileSync(outFile, body);
console.log(`Wrote ${outFile} (${Object.keys(fragments).length} fragments)`);
