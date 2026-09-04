(function (Nexa) {
  const NAME = /^[a-z0-9-]+$/;

  async function injectIncludes(root) {
    const slots = Nexa.qsa("[data-include]", root || document);
    if (!slots.length) return;

    await Promise.all(
      slots.map(async (slot) => {
        const name = slot.getAttribute("data-include") || "";
        if (!NAME.test(name)) return;
        const html = await Nexa.loadFragment(name);
        const wrap = document.createElement("div");
        wrap.innerHTML = html;
        const frag = document.createDocumentFragment();
        while (wrap.firstChild) frag.appendChild(wrap.firstChild);
        slot.replaceWith(frag);
      })
    );

    if (document.querySelector("[data-include]")) {
      await injectIncludes(document);
    }
  }

  Nexa.ensureCollapseInner = function (panel) {
    if (!panel || panel.classList.contains("profile-acc__panel")) return;
    if (panel.querySelector(":scope > .collapse-inner")) return;
    const inner = document.createElement("div");
    inner.className = "collapse-inner";
    while (panel.firstChild) inner.appendChild(panel.firstChild);
    panel.appendChild(inner);
  };

  Nexa.syncCollapsible = function (panel, open) {
    if (!panel) return;
    Nexa.ensureCollapseInner(panel);
    panel.classList.toggle("is-open", open);
    if (open) panel.hidden = false;
  };

  Nexa.setCollapsible = function (panel, open) {
    if (!panel) return;
    Nexa.ensureCollapseInner(panel);
    if (panel._collapseTimer) {
      window.clearTimeout(panel._collapseTimer);
      panel._collapseTimer = 0;
    }
    if (open) {
      panel.hidden = false;
      void panel.offsetHeight;
      panel.classList.add("is-open");
      return;
    }
    panel.classList.remove("is-open");
    if (panel.hidden) return;
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 160 : 240;
    panel._collapseTimer = window.setTimeout(function () {
      panel.hidden = true;
      panel._collapseTimer = 0;
    }, ms);
  };

  Nexa.bindAccordion = function (root) {
    if (!root) return;
    Nexa.qsa("[data-acc-trigger]", root).forEach(function (trigger, i) {
      const acc = trigger.closest(".event-acc");
      const panel = acc ? acc.querySelector("[data-acc-panel]") : Nexa.qsa("[data-acc-panel]", root)[i];
      if (!panel) return;
      if (!panel.id) panel.id = "acc-panel-" + i;
      trigger.setAttribute("aria-controls", panel.id);
      Nexa.syncCollapsible(panel, trigger.getAttribute("aria-expanded") === "true");
    });
    root.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-acc-trigger]");
      if (!trigger || !root.contains(trigger)) return;
      const acc = trigger.closest(".event-acc");
      const panel = acc ? acc.querySelector("[data-acc-panel]") : null;
      if (!panel) return;
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      Nexa.setCollapsible(panel, !open);
      if (acc) acc.classList.toggle("is-open", !open);
    });
  };

  function markNav() {
    const page =
      document.querySelector("[data-page]")?.dataset.page ||
      (location.pathname.split("/").pop() || "index.html").replace(".html", "") ||
      "home";
    const key = page === "index" ? "home" : page;
    Nexa.qsa("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === key);
    });
  }

  Nexa.boot = async function boot() {
    await Promise.all([
      Nexa.defineButton(),
      Nexa.defineIconButton(),
      Nexa.defineBadge(),
      Nexa.defineCard(),
      Nexa.defineContainer(),
      Nexa.defineDropdown(),
      Nexa.defineEmpty(),
      Nexa.defineLoading(),
      Nexa.defineTabs(),
      Nexa.defineHero(),
    ]);

    await injectIncludes();
    Nexa.initHeader();
    Nexa.initNav();
    Nexa.initSidebar();
    Nexa.initFooter();
    Nexa.initMobileNav();
    Nexa.initChat();
    Nexa.initModal();
    Nexa.initToast();
    markNav();
  };
})(window.Nexa = window.Nexa || {});
