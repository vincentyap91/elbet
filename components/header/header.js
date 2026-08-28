(function (Nexa) {
  Nexa.initHeader = function initHeader() {
    const header = Nexa.qs(".site-header");
    if (!header || header.dataset.ready === "true") return;
    header.dataset.ready = "true";

    const drawer = Nexa.qs("[data-drawer]", header);
    const overlay = Nexa.qs("[data-drawer-overlay]", header);
    const toggle = Nexa.qs("[data-action='nav-toggle']", header);
    const account = Nexa.qs(".site-header__account", header);

    if (account && !account.innerHTML) {
      account.innerHTML = Nexa.iconSvg("user");
    }

    function isOpen() {
      return header.classList.contains("is-nav-open");
    }

    function setOpen(open) {
      header.classList.toggle("is-nav-open", open);
      document.body.classList.toggle("is-nav-open", open);
      if (drawer) {
        drawer.setAttribute("aria-hidden", String(!open));
        if (open) drawer.removeAttribute("inert");
        else drawer.setAttribute("inert", "");
      }
      if (overlay) overlay.setAttribute("aria-hidden", String(!open));
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
      Nexa.emit("app:nav:toggle", { open });
    }

    header.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "theme-toggle") Nexa.toggleTheme();
      if (action === "nav-toggle") {
        setOpen(!isOpen());
        return;
      }
      if (action === "nav-close") {
        setOpen(false);
        return;
      }
      if (action === "live-chat" || action === "chat-open") {
        setOpen(false);
      }

      const link = event.target.closest("a[href]");
      if (link && drawer?.contains(link)) setOpen(false);
    });

    header.addEventListener("click", (event) => {
      const langBtn = event.target.closest("[data-lang]");
      if (!langBtn || !drawer?.contains(langBtn)) return;
      Nexa.qsa("[data-lang]", drawer).forEach((el) => {
        el.classList.toggle(
          "is-active",
          el.dataset.lang === langBtn.dataset.lang && el.dataset.region === langBtn.dataset.region
        );
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) setOpen(false);
    });

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (event) => {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else desktop.addListener(onBreakpoint);
  };
})(window.Nexa = window.Nexa || {});
