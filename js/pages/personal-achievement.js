(function (Nexa) {
  const data = Nexa.ACHIEVEMENTS;

  function money(n) {
    return "MYR " + Number(n).toLocaleString("en-US");
  }

  function bindAccordion(root) {
    Nexa.qsa("[data-acc-trigger]", root).forEach(function (trigger, i) {
      const acc = trigger.closest(".event-acc");
      const panel = acc.querySelector("[data-acc-panel]");
      if (!panel.id) panel.id = "event-acc-" + i;
      trigger.setAttribute("aria-controls", panel.id);
    });
    root.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-acc-trigger]");
      if (!trigger) return;
      const acc = trigger.closest(".event-acc");
      const panel = acc.querySelector("[data-acc-panel]");
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  }

  function nextBonus(turnover) {
    const tier = data.tiers.find(function (item) {
      return turnover < item.turnover;
    });
    return tier ? tier.turnover : data.tiers[data.tiers.length - 1].turnover;
  }

  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='personal-achievement']");
    if (!root) return;
    bindAccordion(root);

    const state = { range: "weekly", game: "live" };
    const claimed = {};

    function source() {
      return state.range === "last" ? data.lastWeek : data.games;
    }

    function render() {
      const game = source()[state.game];
      const turnover = game.turnover;
      const next = nextBonus(turnover);
      Nexa.setText(Nexa.qs("[data-pa-game-label]", root), game.label);
      Nexa.setText(Nexa.qs("[data-pa-turnover]", root), money(turnover));
      Nexa.setText(Nexa.qs("[data-pa-next]", root), money(next));
      const fill = Nexa.qs("[data-pa-fill]", root);
      const track = Nexa.qs("[data-pa-track]", root);
      const pct = Math.min(100, (turnover / next) * 100);
      fill.style.width = pct + "%";
      if (track) {
        track.setAttribute("aria-valuenow", String(Math.round(pct)));
        track.setAttribute("aria-valuetext", money(turnover) + " of " + money(next));
      }

      const nextTier = data.tiers.find(function (item) {
        return turnover < item.turnover;
      });
      const currentId = nextTier ? nextTier.id : data.tiers[data.tiers.length - 1].id;

      Nexa.qs("[data-pa-tiers]", root).innerHTML = data.tiers
        .map(function (tier) {
          const met = turnover >= tier.turnover;
          const taken = !!claimed[state.range + "-" + state.game + "-" + tier.id];
          const claimable = met && !taken;
          const current = !met && tier.id === currentId;
          const stateClass = taken ? "is-claimed" : claimable ? "is-claimable" : current ? "is-current" : "is-locked";
          const action = taken
            ? '<p class="pa-tier__claimed">Claimed</p>'
            : '<button type="button" class="btn ' +
              (claimable ? "btn--primary" : "btn--ghost") +
              '" data-pa-claim="' +
              tier.id +
              '"' +
              (claimable ? "" : " disabled") +
              ">Claim</button>";
          return (
            '<article class="pa-tier ' +
            stateClass +
            '">' +
            '<p class="pa-tier__threshold">Turnover<br />' +
            money(tier.turnover) +
            " or above</p>" +
            '<img class="pa-tier__art" src="' +
            tier.art +
            '" alt="" />' +
            '<p class="pa-tier__bonus-label">Bonus</p>' +
            '<p class="pa-tier__bonus">' +
            money(tier.bonus) +
            "</p>" +
            action +
            "</article>"
          );
        })
        .join("");
    }

    function setGroup(attr, value) {
      Nexa.qsa("[" + attr + "]", root).forEach(function (btn) {
        const on = btn.getAttribute(attr) === value;
        btn.classList.toggle("is-active", on);
        if (btn.getAttribute("role") === "tab") btn.setAttribute("aria-selected", String(on));
      });
    }

    root.addEventListener("click", function (event) {
      const range = event.target.closest("[data-pa-range]");
      const game = event.target.closest("[data-pa-game]");
      const claim = event.target.closest("[data-pa-claim]");
      if (range) {
        state.range = range.getAttribute("data-pa-range");
        setGroup("data-pa-range", state.range);
        render();
        return;
      }
      if (game) {
        state.game = game.getAttribute("data-pa-game");
        setGroup("data-pa-game", state.game);
        render();
        return;
      }
      if (!claim || claim.disabled) return;
      if (!Nexa.get("isLoggedIn")) {
        const body = document.createElement("p");
        body.innerHTML = 'Sign in to claim this bonus. <a class="btn btn--primary" href="login.html">Log in</a>';
        Nexa.emit("app:modal:open", { title: "Sign in required", body: body });
        return;
      }
      claimed[state.range + "-" + state.game + "-" + claim.getAttribute("data-pa-claim")] = true;
      Nexa.emit("app:toast:show", { message: "Bonus claimed.", type: "success" });
      render();
    });

    render();
  });
})(window.Nexa = window.Nexa || {});
