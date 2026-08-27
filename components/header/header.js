(function (Nexa) {
  Nexa.initHeader = function initHeader() {
    const header = Nexa.qs(".site-header");
    if (!header || header.dataset.ready === "true") return;
    header.dataset.ready = "true";

    const drawer = Nexa.qs("[data-drawer]", header);

    header.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "theme-toggle") Nexa.toggleTheme();
      if (action === "nav-toggle") {
        const open = drawer.hidden;
        drawer.hidden = !open;
        Nexa.emit("app:nav:toggle", { open });
      }
    });
  };
})(window.Nexa = window.Nexa || {});
