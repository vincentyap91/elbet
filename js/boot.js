(function () {
  const Nexa = (window.Nexa = window.Nexa || {});
  const script = document.currentScript;
  const src = script && script.src ? script.src : "";
  Nexa.root = src.replace(/js\/boot\.js(?:\?.*)?$/, "");
  if (Nexa.root && Nexa.root.slice(-1) !== "/") Nexa.root += "/";

  const files = [
    "js/core/dom.js",
    "js/core/events.js",
    "js/core/ready.js",
    "js/core/icons.js",
    "js/core/theme.js",
    "js/core/store.js",
    "js/fragments.js",
    "js/core/templates.js",
    "js/data/mock.js",
    "js/data/api.js",
    "components/button/button.js",
    "components/icon-button/icon-button.js",
    "components/badge/badge.js",
    "components/card/card.js",
    "components/container/container.js",
    "components/dropdown/dropdown.js",
    "components/empty/empty.js",
    "components/loading/loading.js",
    "components/tabs/tabs.js",
    "components/hero/hero.js",
    "components/header/header.js",
    "components/sidebar/sidebar.js",
    "components/chat/chat.js",
    "components/nav/nav.js",
    "components/footer/footer.js",
    "components/mobile-nav/mobile-nav.js",
    "components/modal/modal.js",
    "components/toast/toast.js",
    "js/core/loader.js",
    "js/app.js",
  ];

  const page = document.querySelector("[data-page]")?.dataset.page || "";
  if (page === "home" || page === "index") files.push("js/pages/home.js");
  if (page === "login" || page === "register" || page === "forgot") files.push("js/pages/auth.js");
  if (page === "playground") files.push("js/pages/playground.js");
  if (page === "number-game") files.push("js/data/number-game.js", "js/pages/number-game.js");
  if (page === "ranking-board") files.push("js/data/ranking-board.js", "js/pages/ranking-board.js");
  if (page === "prediction") files.push("js/data/prediction.js", "js/pages/prediction.js");
  if (page === "personal-achievement") files.push("js/data/achievements.js", "js/pages/personal-achievement.js");
  if (page === "esports" || page === "sports" || page === "live" || page === "slots" || page === "fast-game") {
    files.push("js/data/catalog.js", "js/pages/catalog.js");
  }
  if (page === "4d") files.push("js/pages/lottery.js");

  function loadNext(index) {
    if (index >= files.length) return;
    const next = document.createElement("script");
    next.src = Nexa.root + files[index];
    next.onload = function () {
      loadNext(index + 1);
    };
    next.onerror = function () {
      console.error("Failed to load", files[index]);
      loadNext(index + 1);
    };
    (document.body || document.head).appendChild(next);
  }

  loadNext(0);
})();
