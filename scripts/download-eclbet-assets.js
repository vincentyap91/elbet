/**
 * Downloads ECLBET image assets into assets/images.
 * Usage: node scripts/download-eclbet-assets.js [--force]
 * --force re-downloads files smaller than 4KB (placeholder/error pages).
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const root = path.resolve(__dirname, "..");
const force = process.argv.includes("--force");
const MIN_BYTES = 4096;
/** Brand logo is locked. Never download over assets/images/logo.png. */
const PROTECTED = new Set(["assets/images/logo.png"]);
const files = [
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
  ["https://www.eclbet04.com/static/images/menu/icon-games.gif", "assets/images/menu/icon-games.gif"],
  ["https://www.eclbet04.com/static/images/menu/icon-events.gif", "assets/images/menu/icon-events.gif"],
  ["https://www.eclbet04.com/static/images/menu/icon-function.gif", "assets/images/menu/icon-function.gif"],
  ["https://www.eclbet04.com/static/images/menu/icon-contact.svg", "assets/images/menu/icon-contact.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-faq.svg", "assets/images/menu/icon-faq.svg"],
  ["https://www.eclbet04.com/static/images/menu/icon-ranking.svg", "assets/images/menu/icon-ranking.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-arrow-down.svg", "assets/images/icons/arrow-down.svg"],
  ["https://www.eclbet04.com/static/images/account.svg", "assets/images/icons/account.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-color-facebook.svg", "assets/images/social/facebook-color.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-color-instagram.svg", "assets/images/social/instagram-color.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-color-youtube.svg", "assets/images/social/youtube-color.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-color-telegram.svg", "assets/images/social/telegram-color.svg"],
  ["https://www.eclbet04.com/static/images/social-media/icon-color-twitter.svg", "assets/images/social/twitter-color.svg"],

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
  ["https://www.eclbet04.com/static/images/icons/icon-sponsor.svg", "assets/images/icons/sponsor.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-voucher.svg", "assets/images/icons/voucher.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-ticket-center.svg", "assets/images/icons/ticket-center.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-transaction.svg", "assets/images/icons/transaction.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-rebates.svg", "assets/images/icons/rebates.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-update.svg", "assets/images/icons/update.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-vip.svg", "assets/images/icons/vip.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-live-chat.svg", "assets/images/icons/live-chat.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-close.svg", "assets/images/icons/close.svg"],

  ["https://www.eclbet04.com/static/images/footer/icon-footer-home-unselect.png", "assets/images/nav/home-unselect.png"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-home-selected.svg", "assets/images/nav/home-selected.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-chat-unselect.svg", "assets/images/nav/chat-unselect.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-chat-selected.svg", "assets/images/nav/chat-selected.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-live-chat-unselect.png", "assets/images/nav/live-chat-unselect.png"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-live-chat-selected.svg", "assets/images/nav/live-chat-selected.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-wallet-unselect.png", "assets/images/nav/wallet-unselect.png"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-wallet-selected.svg", "assets/images/nav/wallet-selected.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-profile-unselect.png", "assets/images/nav/profile-unselect.png"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-profile-unselect.svg", "assets/images/nav/profile-unselect.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-profile-selected.svg", "assets/images/nav/profile-selected.svg"],
  ["https://www.eclbet04.com/static/images/footer/icon-footer-profile-selected.png", "assets/images/nav/profile-selected.png"],

  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/number-game2.webp", "assets/images/number-game/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/ranking.webp", "assets/images/ranking/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/prediction.webp", "assets/images/prediction/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/personal-achievement.webp", "assets/images/achievements/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/ticket-center.webp", "assets/images/ticket-center/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/ticket-center.webp", "assets/images/ticket-center/hero-mobile.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/vip.webp", "assets/images/vip/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/vip.webp", "assets/images/vip/hero-mobile.webp"],

  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/esports.webp", "assets/images/esports/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/sports.webp", "assets/images/sports/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/live-casino.webp", "assets/images/live/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/slots.webp", "assets/images/slots/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/lottery-4d.webp", "assets/images/4d/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/fast-games.webp", "assets/images/fast-game/hero.webp"],

  /* Category page icons (reference H1 row) */
  ["https://www.eclbet04.com/static/images/icon-page/esports.png", "assets/images/icon-page/esports.png"],
  ["https://www.eclbet04.com/static/images/icon-page/sports.png", "assets/images/icon-page/sports.png"],
  ["https://www.eclbet04.com/static/images/icon-page/live-casino.png", "assets/images/icon-page/live-casino.png"],
  ["https://www.eclbet04.com/static/images/icon-page/slots.png", "assets/images/icon-page/slots.png"],
  ["https://www.eclbet04.com/static/images/icon-page/lottery-4d.png", "assets/images/icon-page/lottery-4d.png"],
  ["https://www.eclbet04.com/static/images/icon-page/promotion.png", "assets/images/icon-page/promotion.png"],
  ["https://www.eclbet04.com/static/images/icon-page/update.png", "assets/images/icon-page/update.png"],

  /* Promotion / Updates heroes + cards */
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/update.webp", "assets/images/update/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/update.webp", "assets/images/update/hero-mobile.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/desktop/promotions.webp", "assets/images/promotion/hero.webp"],
  ["https://www.eclbet04.com/static/images/ECLBET/banners/en/mobile/promotions.webp", "assets/images/promotion/hero-mobile.webp"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_b265nCqf_20251002170206.jpg", "assets/images/promotion/welcome.jpg"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_1RrCAHGK_20251002170325.jpg", "assets/images/promotion/birthday.jpg"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_Gz0TV54F_20251002170549.jpg", "assets/images/promotion/usdt-deposit.jpg"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_o0mQuf59_20251002170747.jpg", "assets/images/promotion/rebates-sport.jpg"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_IjqXMg76_20251002170347.jpg", "assets/images/promotion/rebates-casino.jpg"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_bJEGFyZR_20251002170610.jpg", "assets/images/promotion/rebates-slots.jpg"],
  ["https://platforms3-yzw03img-0ejj3sb721.s3.ap-northeast-1.amazonaws.com/2907e7d9a56a52c21e633a9f80b5021307cc28de/promo/en_WxOL3QDo_20251002171006.jpg", "assets/images/promotion/usdt-withdrawal.jpg"],
  ["https://www.eclbet04.com/static/images/promotion/voucher-en.png", "assets/images/promotion/voucher-en.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-arrow-left-circle.png", "assets/images/icons/arrow-left-circle.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-detail-arrow-left.svg", "assets/images/icons/detail-arrow-left.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-detail-arrow-right.svg", "assets/images/icons/detail-arrow-right.svg"],

  /* Esports providers (webp tiles from reference) */
  ["https://www.eclbet04.com/static/images/esports/saba-sport.webp", "assets/images/esports/saba-sport.webp"],
  ["https://www.eclbet04.com/static/images/esports/saba-esports.webp", "assets/images/esports/saba-esports.webp"],
  ["https://www.eclbet04.com/static/images/esports/inplay-matrix.webp", "assets/images/esports/inplay-matrix.webp"],
  ["https://www.eclbet04.com/static/images/esports/cmd368.webp", "assets/images/esports/cmd368.webp"],
  ["https://www.eclbet04.com/static/images/esports/tf-gaming.webp", "assets/images/esports/tf-gaming.webp"],
  ["https://www.eclbet04.com/static/images/esports/ia-gaming.webp", "assets/images/esports/ia-gaming.webp"],

  /* Sports providers */
  ["https://www.eclbet04.com/static/images/sports/images/saba-sport.webp", "assets/images/sports/saba-sport.webp"],
  ["https://www.eclbet04.com/static/images/sports/images/cmd368.webp", "assets/images/sports/cmd368.webp"],
  ["https://www.eclbet04.com/static/images/sports/images/bti.webp", "assets/images/sports/bti.webp"],

  /* Live casino providers */
  ["https://www.eclbet04.com/static/images/live-casino/images/evo-asia.webp", "assets/images/live/evo-asia.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/pp-club.webp", "assets/images/live/pp-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/pt-club.webp", "assets/images/live/pt-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/winfinity-club.webp", "assets/images/live/winfinity-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/on-casino.webp", "assets/images/live/on-casino.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/allbet-club.webp", "assets/images/live/allbet-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/dg-club.webp", "assets/images/live/dg-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/sg-club.webp", "assets/images/live/sg-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/ag-club.webp", "assets/images/live/ag-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/ezugi-club.webp", "assets/images/live/ezugi-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/gp-club.webp", "assets/images/live/gp-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/wm-club.webp", "assets/images/live/wm-club.webp"],
  ["https://www.eclbet04.com/static/images/live-casino/images/creedroomz.webp", "assets/images/live/creedroomz.webp"],

  /* 4D operator logos */
  ["https://www.eclbet04.com/static/images/lottery/logo_magnum.png", "assets/images/4d/logo-magnum.png"],
  ["https://www.eclbet04.com/static/images/lottery/logo_toto.png", "assets/images/4d/logo-toto.png"],
  ["https://www.eclbet04.com/static/images/lottery/logo_damacai.png", "assets/images/4d/logo-damacai.png"],
  ["https://www.eclbet04.com/static/images/lottery/logo_singapore.png", "assets/images/4d/logo-singapore.png"],
  ["https://www.eclbet04.com/static/images/lottery/logo_sabah.png", "assets/images/4d/logo-sabah.png"],
  ["https://www.eclbet04.com/static/images/lottery/logo_sandakan.png", "assets/images/4d/logo-sandakan.png"],
  ["https://www.eclbet04.com/static/images/lottery/logo_cashsweep.png", "assets/images/4d/logo-cashsweep.png"],

  /* Slots / fast-game browse chrome */
  ["https://www.eclbet04.com/static/images/slots/hotgames.png", "assets/images/slots/hotgames.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-search.svg", "assets/images/icons/icon-search.svg"],

  /* Slots vendor logos (mobile browse) */
  ["https://www.eclbet04.com/static/images/slots/img_pragmatic_v1.png", "assets/images/slots/vendors/pragmatic.png"],
  ["https://www.eclbet04.com/static/images/slots/img_playtech_v1.png", "assets/images/slots/vendors/playtech.png"],
  ["https://www.eclbet04.com/static/images/slots/sg_v1.png", "assets/images/slots/vendors/spade.png"],
  ["https://www.eclbet04.com/static/images/slots/va_gaming.png", "assets/images/slots/vendors/va.png"],
  ["https://www.eclbet04.com/static/images/slots/joker_v1.png", "assets/images/slots/vendors/joker.png"],
  ["https://www.eclbet04.com/static/images/slots/gameplay_v1.png", "assets/images/slots/vendors/gameplay.png"],
  ["https://www.eclbet04.com/static/images/slots/cq9_v1.png", "assets/images/slots/vendors/cq9.png"],
  ["https://www.eclbet04.com/static/images/slots/playngo_v1.png", "assets/images/slots/vendors/playngo.png"],
  ["https://www.eclbet04.com/static/images/slots/booming.png", "assets/images/slots/vendors/booming.png"],
  ["https://www.eclbet04.com/static/images/slots/jili.png", "assets/images/slots/vendors/jili.png"],
  ["https://www.eclbet04.com/static/images/slots/nextspin.png", "assets/images/slots/vendors/nextspin.png"],
  ["https://www.eclbet04.com/static/images/slots/fachai.png", "assets/images/slots/vendors/fachai.png"],
  ["https://www.eclbet04.com/static/images/slots/haba.png", "assets/images/slots/vendors/haba.png"],
  ["https://www.eclbet04.com/static/images/slots/relaxgaming.png", "assets/images/slots/vendors/relaxgaming.png"],
  ["https://www.eclbet04.com/static/images/slots/redtiger.png", "assets/images/slots/vendors/redtiger.png"],
  ["https://www.eclbet04.com/static/images/slots/jdb.png", "assets/images/slots/vendors/jdb.png"],
  ["https://www.eclbet04.com/static/images/slots/advantplay.png", "assets/images/slots/vendors/advantplay.png"],
  ["https://www.eclbet04.com/static/images/slots/microplus.png", "assets/images/slots/vendors/microplus.png"],
  ["https://www.eclbet04.com/static/images/slots/btg.png", "assets/images/slots/vendors/btg.png"],
  ["https://www.eclbet04.com/static/images/slots/netent.png", "assets/images/slots/vendors/netent.png"],
  ["https://www.eclbet04.com/static/images/slots/nolimitcity_new.png", "assets/images/slots/vendors/nolimitcity.png"],
  ["https://www.eclbet04.com/static/images/slots/hacksaw_ig.png", "assets/images/slots/vendors/hacksaw.png"],
  ["https://www.eclbet04.com/static/images/slots/fastspin.png", "assets/images/slots/vendors/fastspin.png"],
  ["https://www.eclbet04.com/static/images/slots/dreamtech_v1.png", "assets/images/slots/vendors/dreamtech.png"],
  ["https://www.eclbet04.com/static/images/slots/fatpanda.png", "assets/images/slots/vendors/fatpanda.png"],
  ["https://www.eclbet04.com/static/images/slots/inout.png", "assets/images/slots/vendors/inout.png"],
  ["https://www.eclbet04.com/static/images/slots/playace.png", "assets/images/slots/vendors/playace.png"],
  ["https://www.eclbet04.com/static/images/slots/aviatrix.png", "assets/images/slots/vendors/aviatrix.png"],

  /* Slots hot games */
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20olympecl.png", "assets/images/games/eclbet-olympus.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20wraanu.png", "assets/images/games/fury-of-anubis.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20olympgold.png", "assets/images/games/gates-of-olympus-ss.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20olympx-v2.gif", "assets/images/games/gates-of-olympus-1000.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v88/499.png", "assets/images/games/cash-god-x4096.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20sugarrushx-v2.gif", "assets/images/games/sugar-rush-1000.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vswaysmajhng3p.png", "assets/images/games/mahjong-wins-triple-pot.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20swbon2500.png", "assets/images/games/sweet-bonanza-2500.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20starprss.png", "assets/images/games/starlight-princess-ss.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v3/gpas_mgaogkol_pop_v2.png", "assets/images/games/aotg-king-olympus.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v88/466.png", "assets/images/games/mahjong-self-drawn-3.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20sugrushss.png", "assets/images/games/sugar-rush-ss.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20starlightx-v2.gif", "assets/images/games/starlight-princess-1000.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20fruitswx-v2.gif", "assets/images/games/sweet-bonanza-1000.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20payanyvol.png", "assets/images/games/jelly-express.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v3/dnr.png", "assets/images/games/dolphin-reef.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vswaystrpgug.png", "assets/images/games/triple-pot-diamond.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v6/146_189/S-FM04.png", "assets/images/games/fury-max-lucky-road.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v6/146_189/S-SA03.png", "assets/images/games/secrets-of-anubis.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v3/gpas_liman_pop.png", "assets/images/games/lion-mania.png"],

  /* Game thumbnails (reference CDN) */
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20olympecl.png", "assets/images/games/olympus.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20fruitsw-v2.gif", "assets/images/games/sweet-bonanza.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20olympgate.gif", "assets/images/games/gates-of-olympus.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs20starlight-v2.gif", "assets/images/games/starlight-princess.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs40wildwest.gif", "assets/images/games/wild-west-gold.gif"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs10bbbonanza.png", "assets/images/games/big-bass.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v3/aogro.jpg", "assets/images/games/age-of-the-gods.jpg"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/vs10bblpop1.jpg", "assets/images/games/bubble-pop.jpg"],
  ["https://cdv2defn.cloudcdnetw.com/games/v90/INOUT_chicken-road.png", "assets/images/games/chicken-road.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/1301.png", "assets/images/games/aviator.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/ar10plinko.png", "assets/images/games/plinko.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/ar1minehnt.png", "assets/images/games/mines.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/ar1limboplus.png", "assets/images/games/limbo.png"],
  ["https://godeftmc029ak.cloudcdnetw.com/img/?img=games/v45/GAMEID_62_EN.png", "assets/images/games/dice.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/1320.png", "assets/images/games/crash-x.png"],
  ["https://godeftmc029ak.cloudcdnetw.com/img/?img=games/v45/GAMEID_232_EN.png", "assets/images/games/tower.png"],
  ["https://godeftmc029ak.cloudcdnetw.com/img/?img=games/v45/GAMEID_236_EN.png", "assets/images/games/wheel.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/kna.png", "assets/images/games/keno-blast.png"],
  ["https://cdv2defn.cloudcdnetw.com/games/v3/gpas_cashitmpjp_pop.png", "assets/images/games/coin-flip.jpg"],
  ["https://cdv2defn.cloudcdnetw.com/games/v21/ar1spire.png", "assets/images/games/rocket.png"],

  ["https://www.eclbet04.com/static/images/icons/icon-timer-ng.svg", "assets/images/number-game/icon-timer.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon_calander_draw_date.png", "assets/images/number-game/icon-calendar.png"],
  ["https://www.eclbet04.com/static/images/icons/icon_number_game.svg", "assets/images/number-game/icon-game.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-add-circle.svg", "assets/images/number-game/icon-add.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-information-question.svg", "assets/images/number-game/icon-info.svg"],
  ["https://www.eclbet04.com/static/images/icons/icon-light-bulb.svg", "assets/images/number-game/icon-bulb.svg"],
  ["https://www.eclbet04.com/static/images/others/number-game-daily-drawing.gif", "assets/images/number-game/drawing.gif"],
  ["https://www.eclbet04.com/static/images/others/fire-animation.gif", "assets/images/number-game/fire.gif"],
  ["https://staging-ecl.xyz/ecl/images/s3/ETH_JACKPOT.png", "assets/images/number-game/eth.png"],
  ["https://staging-ecl.xyz/ecl/images/s3/TRC20_JACKPOT.png", "assets/images/number-game/trc20.png"],
  ["https://staging-ecl.xyz/ecl/images/s3/BEP20_JACKPOT.png", "assets/images/number-game/bep20.png"],
  ["https://staging-ecl.xyz/ecl/images/s3/GRAND_JACKPOT.png", "assets/images/number-game/grand.png"],

  ["https://www.eclbet04.com/static/images/icons/icon-gold-1.png", "assets/images/achievements/gold-1.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-gold-2.png", "assets/images/achievements/gold-2.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-gold-3.png", "assets/images/achievements/gold-3.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-gold-4.png", "assets/images/achievements/gold-4.png"],
  ["https://www.eclbet04.com/static/images/icons/icon-gold-5.png", "assets/images/achievements/gold-5.png"],
  ["https://www.eclbet04.com/static/images/avatar/nba-players/1.png", "assets/images/achievements/avatar.png"],
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
    const destNorm = dest.replace(/\\/g, "/");
    if (PROTECTED.has(destNorm) || destNorm === "assets/images/logo.png") {
      console.log("PROTECTED", dest);
      continue;
    }
    const out = path.join(root, dest);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    if (fs.existsSync(out) && !force && fs.statSync(out).size >= MIN_BYTES) {
      ok += 1;
      console.log("SKIP", dest);
      continue;
    }
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
  if (fail) process.exitCode = 1;
})();
