/**
 * Downloads ECLBET homepage image assets into assets/images.
 * Usage: node scripts/download-eclbet-assets.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const root = path.resolve(__dirname, "..");
const files = [
  ["https://www.eclbet04.com/static/images/ECLBET/logo/logo.png", "assets/images/logo.png"],
  ["https://www.eclbet04.com/static/images/burger_menu_left.svg", "assets/images/icons/burger-menu.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-banner-arrow-left.png", "assets/images/icons/banner-arrow-left.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-banner-arrow-right.png", "assets/images/icons/banner-arrow-right.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-quest.svg", "assets/images/icons/quest.svg"],
  ["https://www.eclbet04.com/static/images/chat/chat.png", "assets/images/icons/chat.png"],
  ["https://www.eclbet04.com/static/images/icon-page/menu.png", "assets/images/icons/menu.png"],
  ["https://www.eclbet04.com/static/images/icons/icon_triangle_solid_white.svg", "assets/images/icons/triangle.svg"],

  ["https://staging-ecl.xyz/ecl/images/bg/1787728927771--p1-desktop.jpg", "assets/images/banners/01-p1-desktop.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1786200639072--Desktop_Banner_JW_V2_General.jpg", "assets/images/banners/02-jw-v2.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1778650990106--Desktop-Xclusive.jpg", "assets/images/banners/03-xclusive.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1769763695540--Homepage-Banner_JW_General2.jpg", "assets/images/banners/04-jw-general.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1756788797522--Desktop_Deposit-Crypto_General.jpg", "assets/images/banners/05-deposit-crypto.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1756789037686--Desktop-Crypto-Withdrawal-General.jpg", "assets/images/banners/06-crypto-withdrawal.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1742544233354--Desktop%20banner%20EN.jpg", "assets/images/banners/07-desktop-en.jpg"],
  ["https://staging-ecl.xyz/ecl/images/bg/1780571016745--Football_ECL_EN_1920x467.png", "assets/images/banners/08-football.png"],

  ["https://staging-ecl.xyz/ecl/images/others/home-number-game.gif", "assets/images/shortcuts/number-game.gif"],
  ["https://staging-ecl.xyz/ecl/images/others/home-ranking-board.gif", "assets/images/shortcuts/ranking-board.gif"],
  ["https://staging-ecl.xyz/ecl/images/others/home-prediction.gif", "assets/images/shortcuts/prediction.gif"],
  ["https://staging-ecl.xyz/ecl/images/others/home-personal-achievement.gif", "assets/images/shortcuts/personal-achievement.gif"],
  ["https://www.eclbet04.com/static/images/menu/icon-number-game.svg", "assets/images/shortcuts/icon-number-game.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-ranking-board.svg", "assets/images/shortcuts/icon-ranking-board.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-prediction.svg", "assets/images/shortcuts/icon-prediction.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-personal-achievement.svg", "assets/images/shortcuts/icon-personal-achievement.svg"],

  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/EBET.jpg", "assets/images/providers/ebet.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/EVO.jpg", "assets/images/providers/evo.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/GP.jpg", "assets/images/providers/gp.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/HG.jpg", "assets/images/providers/hg.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/PP.jpg", "assets/images/providers/pp.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/PT.jpg", "assets/images/providers/pt.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/SG.jpg", "assets/images/providers/sg.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/AG.jpg", "assets/images/providers/ag.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/allbet.jpg", "assets/images/providers/allbet.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/DG.jpg", "assets/images/providers/dg.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/WM.jpg", "assets/images/providers/wm.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Live%20casino/winfinity.jpg", "assets/images/providers/winfinity.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/SPADE.jpg", "assets/images/providers/spade.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/CQ9.jpg", "assets/images/providers/cq9.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/JOKER.jpg", "assets/images/providers/joker.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Sports/cmd.jpg", "assets/images/providers/cmd.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Sports/MAXBET.jpg", "assets/images/providers/maxbet.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Esports/INPLAY.jpg", "assets/images/providers/inplay.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Esports/SABA.jpg", "assets/images/providers/saba.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Esports/TF.jpg", "assets/images/providers/tf.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/PLAYNGO.jpg", "assets/images/providers/playngo.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/DREAMTECH.jpg", "assets/images/providers/dreamtech.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/TOPTREND.jpg", "assets/images/providers/toptrend.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Slots/Crowd-play.jpg", "assets/images/providers/crowd-play.jpg"],
  ["https://www.eclbet04.com/static/images/game-provider/my/Sports/M8BET.jpg", "assets/images/providers/m8bet.jpg"],

  ["https://www.eclbet04.com/static/images/menu/icon-live-chat.webp", "assets/images/menu/icon-live-chat.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-facebook-messenger.webp", "assets/images/menu/icon-facebook-messenger.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-telegram.webp", "assets/images/menu/icon-telegram.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-instagram.webp", "assets/images/menu/icon-instagram.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-twitter.webp", "assets/images/menu/icon-twitter.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-contact-html.webp", "assets/images/menu/icon-phone.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-email-html.webp", "assets/images/menu/icon-email.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-my.webp", "assets/images/menu/flag-my.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-sg.webp", "assets/images/menu/flag-sg.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-vn.webp", "assets/images/menu/flag-vn.webp"],
  ["https://www.eclbet04.com/static/images/menu/icon-esports.svg", "assets/images/menu/icon-esports.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-sports.svg", "assets/images/menu/icon-sports.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-live-casino.svg", "assets/images/menu/icon-live-casino.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-slots-game.svg", "assets/images/menu/icon-slots-game.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-lottery-4d.svg", "assets/images/menu/icon-lottery-4d.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-fast-game.svg", "assets/images/menu/icon-fast-game.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-slots.svg", "assets/images/menu/icon-slots.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-vip.svg", "assets/images/menu/icon-vip.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-quest.svg", "assets/images/menu/icon-quest.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-sponsor.svg", "assets/images/menu/icon-sponsor.svg"],

  ["https://www.eclbet04.com/static/images/social-media/icon-facebook.svg", "assets/images/social/facebook.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-instagram.svg", "assets/images/social/instagram.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-telegram.svg", "assets/images/social/telegram.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-twitter.svg", "assets/images/social/twitter.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-youtube.svg", "assets/images/social/youtube.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-instragram.webp", "assets/images/social/instagram-photo.webp"],

  ["https://www.eclbet04.com/static/images/others/ambassador-jacky.png", "assets/images/ambassador-jacky.png"],
  ["https://staging-ecl.xyz/ecl/images/s3/anj.png", "assets/images/sponsor-anj.png"],
  ["https://www.eclbet04.com/static/images/ECLBET/home/download-app.webp", "assets/images/app/download-app.webp"],
  ["https://www.eclbet04.com/static/images/others/download-app-store.webp", "assets/images/app/app-store.webp"],
  ["https://www.eclbet04.com/static/images/others/download-google-play.webp", "assets/images/app/google-play.webp"],

  ["https://www.eclbet04.com/static/images/icons/icon-deposit.svg", "assets/images/icons/deposit.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-withdrawal.svg", "assets/images/icons/withdrawal.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-transfer.svg", "assets/images/icons/transfer.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-wallet.svg", "assets/images/icons/wallet.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-history.svg", "assets/images/icons/history.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-inbox.svg", "assets/images/icons/inbox.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-promotion.svg", "assets/images/icons/promotion.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-vip.svg", "assets/images/icons/vip.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-voucher.svg", "assets/images/icons/voucher.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-live-chat.svg", "assets/images/icons/live-chat.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-close.svg", "assets/images/icons/close.svg"],
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Referer: "https://www.eclbet04.com/my",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return fetchBuffer(new URL(res.headers.location, url).href).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(res.statusCode + " " + url));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error("timeout " + url));
    });
  });
}

(async () => {
  let ok = 0;
  let fail = 0;
  for (const [url, dest] of files) {
    const out = path.join(root, dest);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    try {
      const buf = await fetchBuffer(url);
      fs.writeFileSync(out, buf);
      ok += 1;
      console.log("OK", dest, buf.length);
    } catch (err) {
      fail += 1;
      console.error("FAIL", dest, err.message);
    }
  }
  console.log("Done", { ok, fail, total: files.length });
  if (fail) process.exit(1);
})();
