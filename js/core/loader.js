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
