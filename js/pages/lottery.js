(function (Nexa) {
  function bindAccordion(root) {
    Nexa.qsa("[data-acc-trigger]", root).forEach(function (trigger, i) {
      const acc = trigger.closest(".event-acc");
      const panel = acc.querySelector("[data-acc-panel]");
      if (!panel.id) panel.id = "lottery-acc-" + i;
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

  Nexa.ready.then(function () {
    const root = document.querySelector("[data-page='4d']");
    if (root) bindAccordion(root);
  });
})(window.Nexa = window.Nexa || {});
