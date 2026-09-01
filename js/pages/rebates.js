(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='rebates']");
    if (!root) return;

    Nexa.qsa("[data-icon]", root).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });

    root.addEventListener("click", function (event) {
      if (event.target.closest("[data-profile-edit]")) {
        Nexa.emit("app:toast:show", {
          type: "info",
          message: "Avatar upload is not available in this demo.",
        });
        return;
      }
      if (event.target.closest("[data-profile-help]")) {
        Nexa.emit("app:toast:show", {
          type: "info",
          message: "Balance updates every few minutes after deposits and bets settle.",
        });
      }
    });

    Nexa.qsa("[data-acc-trigger]", root).forEach(function (trigger, i) {
      const panel = Nexa.qsa("[data-acc-panel]", root)[i];
      if (!panel) return;
      trigger.addEventListener("click", function () {
        const open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
        const acc = trigger.closest(".rebate-acc");
        if (acc) acc.classList.toggle("is-open", !open);
      });
    });

    Nexa.qsa("[data-rebate-claim]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        const kind = btn.getAttribute("data-rebate-claim");
        if (kind === "voucher") {
          const code = (Nexa.qs("[data-rebate-code]", root)?.value || "").trim();
          if (!code) {
            Nexa.emit("app:toast:show", {
              type: "error",
              message: "Enter a promo code first.",
            });
            return;
          }
        }
        btn.disabled = true;
        btn.textContent = "Claimed";
        Nexa.emit("app:toast:show", {
          type: "success",
          message: kind === "voucher" ? "Voucher claimed." : "Birthday bonus claimed.",
        });
      });
    });
  });
})(window.Nexa = window.Nexa || {});
