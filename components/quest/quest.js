(function (Nexa) {
  var MQ = "(min-width: 768px)";
  var lastTrigger = null;
  var desktopOpen = false;

  function questData() {
    return Nexa.QUEST || { items: [], status: null };
  }

  function badgeClass(cadence) {
    var key = String(cadence || "").toUpperCase();
    if (key === "DAILY") return "badge badge--danger";
    if (key === "SPECIAL") return "badge badge--warning";
    return "badge badge--info";
  }

  function formatMoney(value, currency) {
    var n = Number(value);
    if (!isFinite(n)) return String(value || "");
    var cur = currency || "MYR";
    return (
      cur +
      " " +
      n.toLocaleString("en-MY", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function resolveStatus() {
    var data = questData().status || {};
    var vip = Nexa.VIP;
    var tier = Nexa.get("vipTier") || data.tier || "Bronze";
    if (vip && typeof vip.currentDeposit === "number") {
      return {
        tier: tier,
        currentDepositLabel: data.currentDepositLabel || "Current Deposit:",
        currentDeposit: formatMoney(vip.currentDeposit, vip.currency || "MYR"),
        nextTierLabel: data.nextTierLabel || "Amount Required for Next Tier Upgrade:",
        nextTierAmount: formatMoney(vip.amountRequired, vip.currency || "MYR"),
      };
    }
    return {
      tier: tier,
      currentDepositLabel: data.currentDepositLabel || "Current Deposit:",
      currentDeposit: data.currentDeposit || "MYR 0.00",
      nextTierLabel: data.nextTierLabel || "Amount Required for Next Tier Upgrade:",
      nextTierAmount: data.nextTierAmount || "MYR 0.00",
    };
  }

  function syncStatus(root) {
    if (!root) return;
    var status = resolveStatus();
    var trophySrc =
      typeof Nexa.vipTrophySrc === "function"
        ? Nexa.vipTrophySrc(status.tier)
        : "assets/images/vip/Bronze.png";
    Nexa.qsa("[data-quest-trophy]", root).forEach(function (el) {
      el.src = trophySrc;
    });
    Nexa.qsa("[data-quest-tier]", root).forEach(function (el) {
      el.textContent = status.tier;
    });
    Nexa.qsa("[data-quest-deposit-label]", root).forEach(function (el) {
      el.textContent = status.currentDepositLabel;
    });
    Nexa.qsa("[data-quest-deposit]", root).forEach(function (el) {
      el.textContent = status.currentDeposit;
    });
    Nexa.qsa("[data-quest-next-label]", root).forEach(function (el) {
      el.textContent = status.nextTierLabel;
    });
    Nexa.qsa("[data-quest-next]", root).forEach(function (el) {
      el.textContent = status.nextTierAmount;
    });
  }

  function buildDesktopItem(item) {
    var li = document.createElement("li");
    li.className = "quest-card";

    var top = document.createElement("div");
    top.className = "quest-card__top";
    var title = document.createElement("h3");
    title.className = "quest-card__title";
    title.textContent = item.title;
    var badge = document.createElement("span");
    badge.className = badgeClass(item.cadence);
    badge.textContent = item.cadence;
    top.append(title, badge);

    var body = document.createElement("div");
    body.className = "quest-card__body";
    var icon = document.createElement("img");
    icon.className = "quest-card__icon";
    icon.src = item.icon;
    icon.alt = "";
    var status = document.createElement("span");
    status.className = "quest-card__status";
    status.textContent = item.status;
    var go = document.createElement("a");
    go.className = "btn btn--primary btn--sm quest-card__go";
    go.href = item.href;
    go.textContent = "Go";
    body.append(icon, status, go);

    li.append(top, body);
    return li;
  }

  function buildMobileItem(item) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    link.className = "quest-card--row";
    link.href = item.href;

    var top = document.createElement("div");
    top.className = "quest-card__top";
    var title = document.createElement("h3");
    title.className = "quest-card__title";
    title.textContent = item.title;
    var badge = document.createElement("span");
    badge.className = badgeClass(item.cadence);
    badge.textContent = item.cadence;
    top.append(title, badge);

    var main = document.createElement("div");
    main.className = "quest-card__main";
    var icon = document.createElement("img");
    icon.className = "quest-card__icon";
    icon.src = item.icon;
    icon.alt = "";
    var status = document.createElement("span");
    status.className = "quest-card__status";
    status.textContent = item.status;
    var chevron = document.createElement("img");
    chevron.className = "quest-card__chevron";
    chevron.src = "assets/images/icons/detail-arrow-right.svg";
    chevron.alt = "";
    main.append(icon, status, chevron);

    link.append(top, main);
    li.append(link);
    return li;
  }

  function fillList(list, mode) {
    if (!list) return;
    var frag = document.createDocumentFragment();
    (questData().items || []).forEach(function (item) {
      frag.append(mode === "mobile" ? buildMobileItem(item) : buildDesktopItem(item));
    });
    list.replaceChildren(frag);
  }

  function modalTemplate() {
    return document.getElementById("quest-modal-template");
  }

  function hydrateMarkup() {
    var panel = dropdown();
    if (panel) {
      fillList(Nexa.qs('[data-quest-list="desktop"]', panel), "desktop");
      syncStatus(panel);
    }

    var tpl = modalTemplate();
    if (tpl && tpl.content) {
      fillList(tpl.content.querySelector('[data-quest-list="mobile"]'), "mobile");
      syncStatus(tpl.content);
    }
  }

  function desktopMq() {
    return window.matchMedia(MQ);
  }

  function isDesktop() {
    return desktopMq().matches;
  }

  function header() {
    return Nexa.qs(".site-header");
  }

  function dropdown() {
    return Nexa.qs("[data-quest-dropdown]");
  }

  function triggers() {
    return Nexa.qsa("[data-action='quest-toggle']");
  }

  function setTriggersExpanded(open) {
    triggers().forEach(function (el) {
      el.setAttribute("aria-expanded", String(open));
    });
  }

  function restoreFocus() {
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      try {
        lastTrigger.focus();
      } catch (e) {
        /* ignore */
      }
    }
  }

  function closeDesktop(opts) {
    opts = opts || {};
    var root = header();
    var panel = dropdown();
    if (!root || !desktopOpen) {
      if (panel && !panel.hidden && root && !root.classList.contains("is-quest-open")) {
        panel.hidden = true;
      }
      setTriggersExpanded(false);
      return;
    }
    desktopOpen = false;
    root.classList.remove("is-quest-open");
    setTriggersExpanded(false);
    var ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 220;
    window.setTimeout(function () {
      if (!desktopOpen && panel) panel.hidden = true;
      if (!opts.silent) restoreFocus();
    }, ms);
  }

  function openDesktop(trigger) {
    var root = header();
    var panel = dropdown();
    if (!root || !panel) return;
    lastTrigger = trigger || lastTrigger;
    Nexa.emit("app:modal:close");
    syncStatus(panel);
    panel.hidden = false;
    void panel.offsetWidth;
    root.classList.add("is-quest-open");
    desktopOpen = true;
    setTriggersExpanded(true);
  }

  function toggleDesktop(trigger) {
    if (desktopOpen) closeDesktop();
    else openDesktop(trigger);
  }

  function openMobile(trigger) {
    lastTrigger = trigger || lastTrigger;
    closeDesktop({ silent: true });
    var tpl = modalTemplate();
    var body = null;
    if (tpl) {
      var frag = Nexa.cloneTemplate(tpl);
      body = frag.firstElementChild;
    }
    if (!body) {
      body = document.createElement("div");
      body.className = "quest-panel quest-panel--mobile";
    }
    syncStatus(body);
    Nexa.emit("app:modal:open", {
      title: "Quest",
      size: "lg",
      body: body,
    });
    setTriggersExpanded(true);
  }

  function closeMobile() {
    Nexa.emit("app:modal:close");
  }

  function openForTrigger(trigger) {
    if (isDesktop() && trigger && trigger.classList.contains("site-header__quest")) {
      toggleDesktop(trigger);
      return;
    }
    openMobile(trigger);
  }

  Nexa.initQuest = function initQuest() {
    var root = header();
    if (!root || root.dataset.questReady === "true") return;
    root.dataset.questReady = "true";

    hydrateMarkup();

    var panel = dropdown();
    document.addEventListener(
      "click",
      function (event) {
        var toggle = event.target.closest("[data-action='quest-toggle']");
        if (toggle) {
          event.preventDefault();
          event.stopPropagation();
          if (root.classList.contains("is-nav-open")) {
            root.classList.remove("is-nav-open");
            document.body.classList.remove("is-nav-open");
            var drawer = Nexa.qs("[data-drawer]", root);
            var overlay = Nexa.qs("[data-drawer-overlay]", root);
            var navToggle = Nexa.qs("[data-action='nav-toggle']", root);
            if (drawer) {
              drawer.setAttribute("aria-hidden", "true");
              drawer.setAttribute("inert", "");
            }
            if (overlay) overlay.setAttribute("aria-hidden", "true");
            if (navToggle) {
              navToggle.setAttribute("aria-expanded", "false");
              navToggle.setAttribute("aria-label", "Open menu");
            }
          }
          if (root.classList.contains("is-account-open")) {
            root.classList.remove("is-account-open");
            var accountMenu = Nexa.qs("[data-account-menu]", root);
            if (accountMenu) accountMenu.hidden = true;
            Nexa.qsa("[data-action='account-toggle']", root).forEach(function (el) {
              el.setAttribute("aria-expanded", "false");
            });
          }
          openForTrigger(toggle);
          return;
        }

        if (event.target.closest("[data-action='quest-close']")) {
          event.preventDefault();
          closeDesktop();
          return;
        }

        if (
          desktopOpen &&
          panel &&
          !panel.contains(event.target) &&
          !event.target.closest("[data-action='quest-toggle']")
        ) {
          closeDesktop({ silent: true });
        }
      },
      true
    );

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (desktopOpen) closeDesktop();
    });

    Nexa.on("app:modal:closed", function () {
      setTriggersExpanded(desktopOpen);
      if (!desktopOpen) restoreFocus();
    });

    var mq = desktopMq();
    function onBreakpoint() {
      closeDesktop({ silent: true });
      closeMobile();
      setTriggersExpanded(false);
    }
    if (mq.addEventListener) mq.addEventListener("change", onBreakpoint);
    else mq.addListener(onBreakpoint);
  };
})(window.Nexa = window.Nexa || {});
