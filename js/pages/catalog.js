(function (Nexa) {
  const BROWSE_PAGES = { slots: true, "fast-game": true };
  const PROVIDER_PAGES = { esports: true, sports: true, live: true };

  function imgSrc(item) {
    return item.image || item.fallback || "";
  }

  function renderProviderCard(item) {
    const badge = item.badge ? '<span class="badge badge--accent">' + item.badge + "</span>" : "";
    const src = imgSrc(item);
    const fallback = item.fallback ? ' onerror="this.onerror=null;this.src=\'' + item.fallback + "'\"" : "";
    return (
      '<article class="catalog-card">' +
      '<a class="catalog-card__link" href="#">' +
      '<div class="catalog-card__visual">' +
      badge +
      '<img src="' +
      src +
      '" alt="' +
      item.name +
      '"' +
      fallback +
      " />" +
      '<span class="catalog-card__play"><span class="btn btn--primary">Play</span></span>' +
      "</div>" +
      '<p class="catalog-card__name">' +
      item.name +
      "</p>" +
      "</a>" +
      "</article>"
    );
  }

  function renderGameCard(game) {
    const src = imgSrc(game);
    const fallback = game.fallback ? ' onerror="this.onerror=null;this.src=\'' + game.fallback + "'\"" : "";
    return (
      '<article class="game-card">' +
      '<a class="game-card__link" href="#">' +
      '<div class="game-card__media">' +
      '<img src="' +
      src +
      '" alt="' +
      game.name +
      '"' +
      fallback +
      " />" +
      '<span class="game-card__play"><span class="btn btn--primary">Play</span></span>' +
      "</div>" +
      '<div class="game-card__body">' +
      '<p class="game-card__name">' +
      game.name +
      "</p>" +
      '<p class="game-card__provider">' +
      game.provider +
      "</p>" +
      "</div>" +
      "</a>" +
      "</article>"
    );
  }

  function renderProviders(root, pageKey) {
    const grid = Nexa.qs("[data-catalog-providers]", root);
    const config = Nexa.CATALOG[pageKey];
    if (!grid || !config || !config.providers) return;
    grid.innerHTML = config.providers.map(renderProviderCard).join("");
  }

  function renderBrowse(root, pageKey) {
    const config = Nexa.CATALOG[pageKey];
    if (!config) return;

    const pills = Nexa.qs("[data-catalog-pills]", root);
    const gamesEl = Nexa.qs("[data-catalog-games]", root);
    const search = Nexa.qs("[data-catalog-search]", root);
    if (!pills || !gamesEl) return;

    let activeProvider = "all";
    let query = "";

    pills.innerHTML = config.providers
      .map(function (p, i) {
        return (
          '<button type="button" class="event-pill' +
          (i === 0 ? " is-active" : "") +
          '" data-catalog-provider="' +
          p.id +
          '">' +
          p.label +
          "</button>"
        );
      })
      .join("");

    function filteredGames() {
      return config.games.filter(function (game) {
        const matchProvider = activeProvider === "all" || game.providerId === activeProvider;
        const q = query.trim().toLowerCase();
        const matchQuery = !q || game.name.toLowerCase().includes(q) || game.provider.toLowerCase().includes(q);
        return matchProvider && matchQuery;
      });
    }

    function paintGames() {
      const list = filteredGames();
      if (!list.length) {
        gamesEl.innerHTML = '<p class="catalog-browse__empty" role="status">No games match this filter.</p>';
        return;
      }
      gamesEl.innerHTML = list.map(renderGameCard).join("");
    }

    pills.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-catalog-provider]");
      if (!btn) return;
      activeProvider = btn.getAttribute("data-catalog-provider");
      Nexa.qsa("[data-catalog-provider]", pills).forEach(function (pill) {
        pill.classList.toggle("is-active", pill === btn);
      });
      paintGames();
    });

    if (search) {
      search.addEventListener("input", function () {
        query = search.value;
        paintGames();
      });
    }

    paintGames();
  }

  Nexa.initCatalogPage = function initCatalogPage() {
    const root = document.querySelector("[data-page]");
    if (!root) return;
    const pageKey = root.dataset.page;
    if (PROVIDER_PAGES[pageKey]) renderProviders(root, pageKey);
    if (BROWSE_PAGES[pageKey]) renderBrowse(root, pageKey);
  };

  Nexa.ready.then(function () {
    Nexa.initCatalogPage();
  });
})(window.Nexa = window.Nexa || {});
