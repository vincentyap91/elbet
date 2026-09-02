(function (Nexa) {
  function money(value) {
    return Number(value || 0).toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  Nexa.fillMoneyShell = function fillMoneyShell(root) {
    if (!root) return;
    const acc = Nexa.ACCOUNT || {};
    const name = Nexa.get("displayName") || Nexa.get("username") || "Player";
    const vip = Nexa.get("vipTier") || "Bronze";
    let bal = Nexa.get("balance");
    if (typeof bal !== "number" || bal <= 0) bal = acc.balance || 0;

    Nexa.qsa("[data-auth-name]", root).forEach(function (el) {
      Nexa.setText(el, name);
    });
    Nexa.qsa("[data-auth-vip]", root).forEach(function (el) {
      Nexa.setText(el, vip);
    });
    if (typeof Nexa.vipTrophySrc === "function") {
      var trophySrc = Nexa.vipTrophySrc(vip);
      Nexa.qsa("[data-vip-trophy]", root).forEach(function (el) {
        if (el.tagName === "IMG") el.src = trophySrc;
      });
    }
    Nexa.qsa("[data-money-currency]", root).forEach(function (el) {
      Nexa.setText(el, acc.currency || "MYR");
    });
    Nexa.qsa("[data-money-balance]", root).forEach(function (el) {
      Nexa.setText(el, money(bal));
    });
    Nexa.setText(Nexa.qs("[data-money-required]", root), money(acc.amountRequired));
    Nexa.setText(Nexa.qs("[data-money-limit]", root), money(acc.withdrawLimit));
    Nexa.setText(Nexa.qs("[data-money-freq]", root), String(acc.withdrawFrequency || 4));
    Nexa.setText(Nexa.qs("[data-money-registered]", root), acc.registered || "—");
    Nexa.qsa("[data-icon]", root).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });
  };

  Nexa.ready.then(function () {
    const root = Nexa.qs(".money-page");
    if (!root) return;
    const page = document.querySelector("[data-page]")?.dataset.page || "";
    if (page === "account") return;
    Nexa.fillMoneyShell(root);

    root.addEventListener("click", function (event) {
      if (!event.target.closest("[data-money-refresh]")) return;
      Nexa.fillMoneyShell(root);
      Nexa.emit("app:toast:show", { type: "info", message: "Balance updated." });
    });
  });
})(window.Nexa = window.Nexa || {});
