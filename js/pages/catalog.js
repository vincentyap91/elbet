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
    let activeType = "all";
    let query = "";
    let vendorsExpanded = false;

    if (types && Array.isArray(config.types) && config.types.length) {
      types.innerHTML = config.types
        .map(function (t, i) {
          const on = i === 0;
          return (
            '<button type="button" class="event-pill' +
            (on ? " is-active" : "") +
            '" data-catalog-type="' +
            t.id +
            '" role="tab" aria-selected="' +
            (on ? "true" : "false") +
            '">' +
            t.label +
            "</button>"
          );
        })
        .join("");
      activeType = config.types[0].id || "all";
    }

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

    function matchType(game) {
      if (activeType === "all") return true;
      if (activeType === "top") return !!game.top;
      return (game.type || "slot") === activeType;
    }

    function filteredGames() {
      return config.games.filter(function (game) {
        const matchProvider = activeProvider === "all" || game.providerId === activeProvider;
        const q = query.trim().toLowerCase();
        const matchQuery = !q || game.name.toLowerCase().includes(q) || game.provider.toLowerCase().includes(q);
        return matchProvider && matchType(game) && matchQuery;
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
        activeType = btn.getAttribute("data-catalog-type") || "all";
        Nexa.qsa("[data-catalog-type]", types).forEach(function (el) {
          const on = el === btn;
          el.classList.toggle("is-active", on);
          el.setAttribute("aria-selected", on ? "true" : "false");
        });
        paintGames();
      });
    }

    if (search) {
      search.addEventListener("input", function () {
        query = search.value;
        paintGames();
      });
    }

    if (pageKey === "slots") bindSlotsMeta(root);

    paintGames();
  }

  function money(value) {
    return Number(value || 0).toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function slotsRebateLabel() {
    if (!Nexa.get("isLoggedIn")) return "0.00%";
    const vipLabel = String(Nexa.get("vipTier") || "Bronze").toLowerCase();
    const tiers = (Nexa.VIP && Nexa.VIP.tiers) || [];
    let tier = null;
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      if (String(t.label || "").toLowerCase() === vipLabel || String(t.id || "").toLowerCase() === vipLabel) {
        tier = t;
        break;
      }
    }
    if (!tier && tiers.length) tier = tiers[0];
    const slots = tier && tier.rebate && tier.rebate.slots;
    if (slots == null || slots === "") return "0.00%";
    return String(slots).indexOf("%") >= 0 ? String(slots) : Number(slots).toFixed(2) + "%";
  }

  function fillSlotsMeta(root) {
    const meta = Nexa.qs("[data-slots-meta]", root);
    if (!meta) return;
    let bal = Nexa.get("balance");
    if (typeof bal !== "number") bal = 0;
    Nexa.setText(Nexa.qs("[data-slots-wallet]", meta), money(bal));
    Nexa.setText(Nexa.qs("[data-slots-rebate]", meta), slotsRebateLabel());
    Nexa.qsa("[data-icon]", meta).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });
  }

  function bindSlotsMeta(root) {
    const meta = Nexa.qs("[data-slots-meta]", root);
    if (!meta) return;
    fillSlotsMeta(root);
    meta.addEventListener("click", function (event) {
      if (!event.target.closest("[data-slots-wallet-refresh]")) return;
      fillSlotsMeta(root);
      Nexa.emit("app:toast:show", { type: "info", message: "Balance updated." });
    });
    if (typeof Nexa.on === "function") {
      Nexa.on("app:auth:changed", function () {
        fillSlotsMeta(root);
      });
      Nexa.on("app:store:changed", function (payload) {
        if (!payload || payload.key === "balance" || payload.key === "vipTier") fillSlotsMeta(root);
      });
    }
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
