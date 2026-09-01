(function (Nexa) {
  Nexa.initHeader = function initHeader() {
    const header = Nexa.qs(".site-header");
    if (!header || header.dataset.ready === "true") return;
    header.dataset.ready = "true";

    const drawer = Nexa.qs("[data-drawer]", header);
    const overlay = Nexa.qs("[data-drawer-overlay]", header);
    const toggle = Nexa.qs("[data-action='nav-toggle']", header);
    const account = Nexa.qs(".site-header__account", header);
    const userToggle = Nexa.qs("[data-action='account-toggle']", header);
    const accountMenu = Nexa.qs("[data-account-menu]", header);

    if (account && !account.innerHTML) {
      account.innerHTML = Nexa.iconSvg("user");
    }

    Nexa.qsa("[data-icon]", header).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });

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

    function isAccountOpen() {
      return header.classList.contains("is-account-open");
    }

    function setAccountOpen(open) {
      header.classList.toggle("is-account-open", open);
      if (userToggle) userToggle.setAttribute("aria-expanded", String(open));
      if (accountMenu) {
        if (open) accountMenu.removeAttribute("hidden");
        else accountMenu.setAttribute("hidden", "");
      }
    }

    function syncAuthChrome() {
      const displayName = Nexa.get("displayName") || Nexa.get("username") || "Player";
      const username = Nexa.get("username") || displayName;
      const vip = Nexa.get("vipTier") || "Bronze";
      Nexa.qsa("[data-auth-name]", header).forEach(function (el) {
        Nexa.setText(el, displayName);
      });
      Nexa.qsa("[data-auth-user]", header).forEach(function (el) {
        Nexa.setText(el, username);
      });
      Nexa.qsa("[data-auth-vip]", header).forEach(function (el) {
        Nexa.setText(el, vip);
      });
    }

    header.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "theme-toggle") Nexa.toggleTheme();
      if (action === "nav-toggle") {
        setAccountOpen(false);
        setOpen(!isOpen());
        return;
      }
      if (action === "nav-close") {
        setOpen(false);
        return;
      }
      if (action === "account-toggle") {
        event.preventDefault();
        setAccountOpen(!isAccountOpen());
        return;
      }
      if (action === "voucher") {
        event.preventDefault();
        setOpen(false);
        setAccountOpen(false);
        if (!Nexa.get("isLoggedIn")) {
          if (typeof Nexa.requireAuth === "function") {
            Nexa.requireAuth(Nexa.currentNext("voucher"));
          } else {
            window.location.href = "login.html?next=" + encodeURIComponent("index.html?voucher=1");
          }
          return;
        }
        if (typeof Nexa.openVoucherModal === "function") Nexa.openVoucherModal();
        return;
      }
      if (action === "logout") {
        event.preventDefault();
        setAccountOpen(false);
        Nexa.logout();
        window.location.href = "index.html";
        return;
      }
      if (action === "live-chat" || action === "chat-open") {
        setOpen(false);
        setAccountOpen(false);
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

    document.addEventListener("click", (event) => {
      if (!isAccountOpen()) return;
      if (header.contains(event.target) && event.target.closest(".site-header__user")) return;
      setAccountOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (isAccountOpen()) setAccountOpen(false);
      if (isOpen()) setOpen(false);
    });

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (event) => {
      if (event.matches) setOpen(false);
      else setAccountOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else desktop.addListener(onBreakpoint);

    syncAuthChrome();
    Nexa.on("app:auth:changed", syncAuthChrome);
  };
})(window.Nexa = window.Nexa || {});
