(function (Nexa) {
  const BROWSE_PAGES = { slots: true, "fast-game": true };
  const PROVIDER_PAGES = { esports: true, sports: true, live: true };
  const MOBILE_VENDOR_INLINE = 6;

  function imgSrc(item) {
    return item.image || item.fallback || "";
  }

  function vendorProviders(config) {
    return config.providers.filter(function (p) {
      return p.id !== "all" && p.image;
    });
  }

  function pillProviders(config) {
    const marked = config.providers.filter(function (p) {
      return p.pill;
    });
    return marked.length ? marked : config.providers;
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

  function renderVendorTile(p, isActive) {
    const inner = p.image
      ? '<img src="' + p.image + '" alt="' + p.label + '" />'
      : '<span class="catalog-vendor-tile__label">' + p.label + "</span>";
    return (
      '<button type="button" class="catalog-vendor-tile' +
      (isActive ? " is-active" : "") +
      '" data-catalog-provider="' +
      p.id +
      '" role="tab" aria-selected="' +
      (isActive ? "true" : "false") +
      '">' +
      inner +
      "</button>"
    );
  }

  function renderProviders(root, pageKey) {
    const grid = Nexa.qs("[data-catalog-providers]", root);
    const config = Nexa.CATALOG[pageKey];
    if (!grid || !config || !config.providers) return;
    grid.innerHTML = config.providers.map(renderProviderCard).join("");
  }

  function setProviderActive(roots, providerId) {
    roots.forEach(function (root) {
      if (!root) return;
      Nexa.qsa("[data-catalog-provider]", root).forEach(function (el) {
        const on = el.getAttribute("data-catalog-provider") === providerId;
        el.classList.toggle("is-active", on);
        if (el.getAttribute("role") === "tab") {
          el.setAttribute("aria-selected", on ? "true" : "false");
        }
      });
    });
  }

  function renderLogoChip(p, isActive) {
    const active = isActive ? " is-active" : "";
    const selected = isActive ? "true" : "false";
    if (p.hot) {
      return (
        '<button type="button" class="catalog-logo-chip catalog-logo-chip--hot' +
        active +
        '" data-catalog-provider="' +
        p.id +
        '" role="tab" aria-selected="' +
        selected +
        '">' +
        '<img src="assets/images/slots/hotgames.png" alt="HOT GAMES" />' +
        '<span class="catalog-logo-chip__badge">Popular</span>' +
        '<span class="catalog-logo-chip__fire" aria-hidden="true">🔥</span>' +
        "</button>"
      );
    }
    return (
      '<button type="button" class="catalog-logo-chip' +
      active +
      '" data-catalog-provider="' +
      p.id +
      '" role="tab" aria-selected="' +
      selected +
      '" aria-label="' +
      p.label +
      '">' +
      '<img src="' +
      p.image +
      '" alt="' +
      p.label +
      '" />' +
      "</button>"
    );
  }

  function renderBrowse(root, pageKey) {
    const config = Nexa.CATALOG[pageKey];
    if (!config) return;

    const pills = Nexa.qs("[data-catalog-pills]", root);
    const chips = Nexa.qs("[data-catalog-chips]", root);
    const vendors = Nexa.qs("[data-catalog-vendors]", root);
    const viewAllBtn = Nexa.qs("[data-catalog-view-all]", root);
    const gamesEl = Nexa.qs("[data-catalog-games]", root);
    const types = Nexa.qs("[data-catalog-types]", root);
    const search = Nexa.qs("[data-catalog-search]", root);
    if (!gamesEl) return;

    const vendorsList = vendorProviders(config);
    const pillList = pillProviders(config);
    let activeProvider = "all";
    let query = "";
    let vendorsExpanded = false;

    if (pills) {
      pills.innerHTML = pillList
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
    }

    if (chips) {
      const chipItems = [{ id: "all", label: "HOT GAMES", hot: true }].concat(vendorsList);
      chips.innerHTML = chipItems
        .map(function (p) {
          return renderLogoChip(p, activeProvider === p.id);
        })
        .join("");
    }

    function paintVendorGrid() {
      if (!vendors) return;
      const list = vendorsExpanded ? vendorsList : vendorsList.slice(0, MOBILE_VENDOR_INLINE);
      vendors.innerHTML = list
        .map(function (p) {
          return renderVendorTile(p, activeProvider === p.id);
        })
        .join("");
    }

    function updateViewAll() {
      if (!viewAllBtn) return;
      if (vendorsList.length > MOBILE_VENDOR_INLINE) {
        viewAllBtn.hidden = false;
        viewAllBtn.textContent = vendorsExpanded ? "View Less Vendors" : "View All Vendors";
        viewAllBtn.setAttribute("aria-expanded", vendorsExpanded ? "true" : "false");
      } else {
        viewAllBtn.hidden = true;
      }
    }

    function toggleVendorGrid() {
      vendorsExpanded = !vendorsExpanded;
      paintVendorGrid();
      updateViewAll();
    }

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

    function selectProvider(providerId) {
      activeProvider = providerId;
      setProviderActive([pills, chips, vendors], providerId);
      paintGames();
    }

    if (pills) {
      pills.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-catalog-provider]");
        if (!btn) return;
        selectProvider(btn.getAttribute("data-catalog-provider"));
      });
    }

    if (chips) {
      chips.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-catalog-provider]");
        if (!btn) return;
        selectProvider(btn.getAttribute("data-catalog-provider"));
      });
    }

    if (vendors) {
      paintVendorGrid();
      updateViewAll();
      vendors.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-catalog-provider]");
        if (!btn) return;
        selectProvider(btn.getAttribute("data-catalog-provider"));
      });
    }

    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", toggleVendorGrid);
    }

    if (types) {
      types.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-catalog-type]");
        if (!btn) return;
        Nexa.qsa("[data-catalog-type]", types).forEach(function (el) {
          const on = el === btn;
          el.classList.toggle("is-active", on);
          el.setAttribute("aria-selected", on ? "true" : "false");
        });
      });
    }

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
