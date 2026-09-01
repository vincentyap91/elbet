(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='inbox']");
    if (!root) return;

    const tabs = Nexa.qsa("[data-inbox-tab]", root);
    const panels = Nexa.qsa("[data-inbox-panel]", root);

    function show(name) {
      tabs.forEach(function (tab) {
        const on = tab.getAttribute("data-inbox-tab") === name;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach(function (row) {
        row.hidden = row.getAttribute("data-inbox-panel") !== name;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        show(tab.getAttribute("data-inbox-tab"));
      });
    });

    const readBtn = Nexa.qs("[data-inbox-read]", root);
    if (readBtn) {
      readBtn.addEventListener("click", function () {
        Nexa.emit("app:toast:show", {
          type: "info",
          message: "No unread messages.",
        });
      });
    }
  });
})(window.Nexa = window.Nexa || {});
