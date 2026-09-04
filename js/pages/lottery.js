(function (Nexa) {
  function bindLotteryTabs(root) {
    const tabsEl = Nexa.qs("[data-lottery-tabs]", root);
    const results = Nexa.qsa(".lottery-result[data-lottery-id]", root);
    if (!tabsEl || !results.length) return;

    tabsEl.innerHTML = results
      .map(function (card, i) {
        const id = card.getAttribute("data-lottery-id");
        const nameEl = Nexa.qs(".lottery-result__name", card);
        const name = nameEl ? nameEl.textContent.trim() : id;
        return (
          '<button type="button" class="event-pill' +
          (i === 0 ? " is-active" : "") +
          '" data-lottery-tab="' +
          id +
          '" role="tab">' +
          name +
          "</button>"
        );
      })
      .join("");

    function showResult(id) {
      results.forEach(function (card) {
        card.classList.toggle("is-active", card.getAttribute("data-lottery-id") === id);
      });
      Nexa.qsa("[data-lottery-tab]", tabsEl).forEach(function (btn) {
        const active = btn.getAttribute("data-lottery-tab") === id;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });
    }

    tabsEl.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-lottery-tab]");
      if (!btn) return;
      showResult(btn.getAttribute("data-lottery-tab"));
    });
  }

  Nexa.ready.then(function () {
    const root = document.querySelector("[data-page='4d']");
    if (!root) return;
    Nexa.bindAccordion(root);
    bindLotteryTabs(root);
  });
})(window.Nexa = window.Nexa || {});
