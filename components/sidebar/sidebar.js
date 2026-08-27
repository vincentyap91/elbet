(function (Nexa) {
  Nexa.initSidebar = function initSidebar() {
    const sidebar = document.querySelector(".site-sidebar");
    if (!sidebar || sidebar.dataset.ready === "true") return;
    sidebar.dataset.ready = "true";

    const panel = sidebar.querySelector(".sidebar-wrapper");
    const mini = sidebar.querySelector(".sidebar-mini__wrapper");
    const toggles = Nexa.qsa("[data-sidebar-toggle]", sidebar);

    function isMini() {
      return sidebar.classList.contains("is-mini");
    }

    function setMini(collapsed) {
      sidebar.classList.toggle("is-mini", collapsed);
      panel.classList.toggle("sidebar-wrapper__hide", collapsed);
      mini.classList.toggle("sidebar-mini__wrapper-show", collapsed);
      Nexa.qsa(".sidebar-burger-menu", mini).forEach((icon) => {
        icon.classList.toggle("sidebar-burger-menu__hide", collapsed);
      });
      toggles.forEach((btn) => {
        const open = !collapsed;
        btn.setAttribute("aria-expanded", String(open));
        btn.setAttribute("aria-label", open ? "Collapse menu" : "Open menu");
      });
    }

    function selectLang(lang, region) {
      Nexa.qsa("[data-lang]", sidebar).forEach((el) => {
        if (!el.classList.contains("sidebar-child__language")) return;
        el.classList.toggle(
          "selected",
          el.dataset.lang === lang && el.dataset.region === region
        );
      });
    }

    sidebar.addEventListener("click", (event) => {
      if (event.target.closest("[data-sidebar-toggle]")) {
        setMini(!isMini());
        return;
      }

      const liveChat = event.target.closest("[data-action='live-chat']");
      if (liveChat) {
        event.preventDefault();
        document.querySelector(".chat-dock")?.click();
        return;
      }

      const langBtn = event.target.closest("[data-lang]");
      if (langBtn) {
        selectLang(langBtn.dataset.lang, langBtn.dataset.region);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !isMini()) setMini(true);
    });

    setMini(true);
  };
})(window.Nexa = window.Nexa || {});
