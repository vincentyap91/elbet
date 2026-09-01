(function (Nexa) {
  var VIEWS = ["deposit", "withdrawal", "transfer", "history", "wallet", "profile", "banking", "rebates"];

  function data() {
    return Nexa.ACCOUNT || {};
  }

  function money(value) {
    return Number(value || 0).toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function initials(name) {
    return String(name || "")
      .split(/\s+/)
      .map(function (part) {
        return part.charAt(0);
      })
      .join("")
      .slice(0, 3)
      .toUpperCase();
  }

  function balance() {
    var n = Nexa.get("balance");
    if (typeof n === "number" && n > 0) return n;
    return data().balance || 0;
  }

  function viewFromUrl() {
    var view = new URLSearchParams(location.search).get("view") || "deposit";
    if (view === "rebates") {
      window.location.replace("rebates.html");
      return "deposit";
    }
    if (VIEWS.indexOf(view) === -1) view = "deposit";
    if (view === "wallet" && window.matchMedia("(min-width: 768px)").matches) return "transfer";
    return view;
  }

  function setView(root, view) {
    var mobileProfile = isMobileProfile(view);
    root.classList.toggle("is-profile-chrome", view === "profile" || view === "banking");

    Nexa.qsa("[data-money-panel]", root).forEach(function (panel) {
      var name = panel.getAttribute("data-money-panel");
      if (mobileProfile && (name === "profile" || name === "banking")) {
        panel.hidden = false;
      } else {
        panel.hidden = name !== view;
      }
    });

    var security = Nexa.qs("[data-profile-acc='security']", root);
    if (security) {
      security.hidden = !mobileProfile;
    }

    Nexa.qsa("[data-money-nav]", root).forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-money-nav") === view);
    });
    var tabView = view === "wallet" ? "wallet" : view;
    Nexa.qsa("[data-money-tab]", root).forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-money-tab") === tabView);
    });
    Nexa.qsa("[data-profile-tab]", root).forEach(function (link) {
      var key = link.getAttribute("data-profile-tab");
      link.classList.toggle("is-active", key === "info" && (view === "profile" || view === "banking"));
    });
    var titles = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      transfer: "Transfer",
      wallet: "Wallet",
      history: "History",
      profile: "Profile",
      banking: "Banking Details",
      rebates: "Rebates",
    };
    document.title = "ELBET · " + (titles[view] || "Account");
    syncProfileAccordions(root, view);
  }

  function isMobileProfile(view) {
    return window.matchMedia("(max-width: 767px)").matches && (view === "profile" || view === "banking");
  }

  function syncProfileAccordions(root, view) {
    var mobile = window.matchMedia("(max-width: 767px)").matches;
    Nexa.qsa("[data-profile-acc]", root).forEach(function (acc) {
      var key = acc.getAttribute("data-profile-acc");
      var trigger = Nexa.qs("[data-profile-acc-trigger]", acc);
      var panel = Nexa.qs("[data-profile-acc-panel]", acc);
      if (!trigger || !panel) return;
      var open = !mobile
        ? key === "personal" || key === "banking"
        : (view === "banking" ? key === "banking" : key === "personal");
      if (key === "security") open = false;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      acc.classList.toggle("is-open", open);
    });
  }

  function fillProfile(root) {
    var profile = data().profile || {};
    var username = Nexa.get("username") || "vincenthuei91";
    var setVal = function (sel, value) {
      Nexa.qsa(sel, root).forEach(function (el) {
        el.value = value || "";
      });
    };
    setVal("[data-profile-username]", username);
    setVal("[data-profile-fullname]", profile.fullName);
    setVal("[data-profile-email]", profile.email);
    setVal("[data-profile-mobile]", profile.mobile);
    setVal("[data-profile-nick]", profile.nick);
    setVal("[data-profile-dob]", profile.dob);
    setVal("[data-banking-name]", profile.fullName);
  }

  function bankById(id) {
    return (data().banks || []).find(function (b) {
      return b.id === id;
    });
  }

  function renderSavedBanks(root) {
    var rows = Nexa.qs("[data-banking-rows]", root);
    var mobile = Nexa.qs("[data-banking-saved-mobile]", root);
    var list = data().savedBanks || [];
    if (rows) {
      if (!list.length) {
        rows.innerHTML = '<tr><td class="money-table__empty" colspan="4">No bank accounts yet</td></tr>';
      } else {
        rows.innerHTML = list
          .map(function (bank) {
            return (
              "<tr><td>" +
              bank.name +
              "</td><td>" +
              bank.number +
              '</td><td><span class="banking-status">' +
              (bank.verified
                ? '<span class="banking-status__check" data-icon="check" aria-hidden="true"></span> Verified'
                : "Pending") +
              '</span></td><td><button type="button" class="banking-action" data-banking-remove="' +
              bank.id +
              '" aria-label="Remove">×</button></td></tr>'
            );
          })
          .join("");
        Nexa.qsa("[data-icon]", rows).forEach(function (el) {
          if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
        });
      }
    }
    if (mobile) {
      mobile.innerHTML = list
        .map(function (bank) {
          return (
            '<div class="banking-saved__row">' +
            "<strong>" +
            bank.name +
            '</strong> <span class="banking-status__check" data-icon="check" aria-hidden="true"></span>' +
            "<span>" +
            bank.number +
            "</span></div>"
          );
        })
        .join("");
      Nexa.qsa("[data-icon]", mobile).forEach(function (el) {
        if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
      });
    }
  }

  function openPasswordModal() {
    var body = document.createElement("div");
    body.className = "profile-password-modal";
    body.innerHTML =
      '<label class="field"><span class="field__label">Current Password</span>' +
      '<input class="field__control" type="password" data-pw-current autocomplete="current-password" /></label>' +
      '<label class="field"><span class="field__label">New Password</span>' +
      '<input class="field__control" type="password" data-pw-new autocomplete="new-password" /></label>' +
      '<label class="field"><span class="field__label">Confirm Password</span>' +
      '<input class="field__control" type="password" data-pw-confirm autocomplete="new-password" /></label>';
    var footer = document.createElement("div");
    footer.className = "profile-password-modal__footer";
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "btn btn--ghost";
    cancel.textContent = "Cancel";
    cancel.setAttribute("data-action", "modal-close");
    var save = document.createElement("button");
    save.type = "button";
    save.className = "btn btn--primary";
    save.textContent = "Save";
    save.addEventListener("click", function () {
      var cur = body.querySelector("[data-pw-current]");
      var neu = body.querySelector("[data-pw-new]");
      var conf = body.querySelector("[data-pw-confirm]");
      if (!cur.value || !neu.value || !conf.value) {
        toast("warning", "Fill in all password fields.");
        return;
      }
      if (neu.value !== conf.value) {
        toast("warning", "New passwords do not match.");
        return;
      }
      Nexa.emit("app:modal:close");
      toast("success", "Password updated.");
    });
    footer.append(cancel, save);
    Nexa.emit("app:modal:open", {
      title: "Change Password",
      body: body,
      footer: footer,
      size: "sm",
    });
  }

  function fillSummary(root) {
    var acc = data();
    var name = Nexa.get("displayName") || Nexa.get("username") || "Player";
    var vip = Nexa.get("vipTier") || "Bronze";
    Nexa.qsa("[data-auth-name]", root).forEach(function (el) {
      Nexa.setText(el, name);
    });
    Nexa.qsa("[data-auth-vip]", root).forEach(function (el) {
      Nexa.setText(el, vip);
    });
    Nexa.qsa("[data-money-currency]", root).forEach(function (el) {
      Nexa.setText(el, acc.currency || "MYR");
    });
    Nexa.qsa("[data-money-balance]", root).forEach(function (el) {
      Nexa.setText(el, money(balance()));
    });
    Nexa.setText(Nexa.qs("[data-money-required]", root), money(acc.amountRequired));
    Nexa.setText(Nexa.qs("[data-money-limit]", root), money(acc.withdrawLimit));
    Nexa.setText(Nexa.qs("[data-money-freq]", root), String(acc.withdrawFrequency || 4));
    Nexa.setText(Nexa.qs("[data-money-registered]", root), acc.registered || "—");
    Nexa.qsa("[data-money-reminder]", root).forEach(function (el) {
      Nexa.setText(el, acc.reminder || "");
    });
    Nexa.qsa("[data-icon]", root).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });
  }

  function renderMethods(root) {
    var wrap = Nexa.qs("[data-deposit-methods]", root);
    if (!wrap) return;
    wrap.replaceChildren();
    (data().methods || []).forEach(function (method, index) {
      if (index === 0 && !deposit.method) deposit.method = method.id;
      var active = method.id === deposit.method;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "money-method" + (active ? " is-active" : "");
      btn.setAttribute("data-deposit-method", method.id);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.innerHTML =
        '<span class="money-method__icon" aria-hidden="true">' +
        Nexa.iconSvg(method.icon || "card") +
        "</span><span class=\"money-method__label\">" +
        method.label +
        "</span>";
      if (method.badge) {
        var badge = document.createElement("span");
        badge.className = "money-method__badge";
        badge.textContent = method.badge;
        btn.append(badge);
      }
      if (method.help) {
        var help = document.createElement("span");
        help.className = "money-method__help";
        help.setAttribute("data-deposit-method-help", method.id);
        help.setAttribute("role", "img");
        help.setAttribute("aria-label", "Offline banking help");
        help.innerHTML = Nexa.iconSvg("help");
        btn.append(help);
      }
      wrap.append(btn);
    });
  }

  var deposit = { method: "", channel: "" };

  function methodById(id) {
    return (data().methods || []).find(function (m) {
      return m.id === id;
    });
  }

  function currentMethod() {
    return methodById(deposit.method) || (data().methods || [])[0];
  }

  /** Channel entries are either a bank id from ACCOUNT.banks or a full object. */
  function channelsOf(method) {
    return ((method && method.channels) || []).map(function (entry) {
      if (typeof entry !== "string") return entry;
      return bankById(entry) || { id: entry, name: entry };
    });
  }

  function currentChannel() {
    var list = channelsOf(currentMethod());
    return (
      list.find(function (c) {
        return c.id === deposit.channel;
      }) || list[0]
    );
  }

  function hasRange(channel) {
    return !!channel && channel.min != null && channel.max != null;
  }

  /** Methods with no limits at all (crypto) drop the row; mixed methods show dashes. */
  function rangeLabel(channel, channels) {
    if (hasRange(channel)) return money(channel.min) + " - " + money(channel.max);
    return channels.some(hasRange) ? "-- - --" : "";
  }

  function renderChannels(root) {
    var wrap = Nexa.qs("[data-deposit-banks]", root);
    var method = currentMethod();
    if (!wrap || !method) return;
    Nexa.setText(Nexa.qs("[data-deposit-channel-label]", root), method.channelLabel || "Bank");
    var active = currentChannel();
    var channels = channelsOf(method);
    wrap.replaceChildren();
    channels.forEach(function (channel) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "money-bank" + (active && channel.id === active.id ? " is-active" : "");
      btn.setAttribute("data-deposit-bank", channel.id);
      btn.setAttribute("aria-pressed", active && channel.id === active.id ? "true" : "false");
      var mark = channel.logo
        ? '<img class="money-bank__logo" src="' + Nexa.asset(channel.logo) + '" alt="" />'
        : '<span class="money-bank__mark">' + (channel.abbr || initials(channel.name)) + "</span>";
      var range = rangeLabel(channel, channels);
      btn.innerHTML =
        mark +
        '<span class="money-bank__name">' +
        channel.name +
        "</span>" +
        (range ? '<span class="money-bank__range">' + range + "</span>" : "");
      wrap.append(btn);
    });
  }

  function syncDepositSections(root) {
    var sections = (currentMethod() || {}).sections || [];
    Nexa.qsa("[data-deposit-section]", root).forEach(function (el) {
      el.hidden = sections.indexOf(el.getAttribute("data-deposit-section")) === -1;
    });
  }

  function renderNetworks(root, channel) {
    var wrap = Nexa.qs("[data-deposit-networks]", root);
    if (!wrap) return;
    wrap.replaceChildren();
    ((channel && channel.networks) || []).forEach(function (network, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "money-chain" + (index === 0 ? " is-active" : "");
      btn.setAttribute("data-deposit-network", network);
      btn.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      btn.textContent = network;
      wrap.append(btn);
    });
  }

  function fillDepositDetails(root) {
    var method = currentMethod();
    var channel = currentChannel();
    if (!method) return;

    Nexa.qsa("[data-deposit-account]", root).forEach(function (el) {
      var key = el.getAttribute("data-deposit-account");
      el.value = ((channel && channel.account) || {})[key] || "";
    });

    renderNetworks(root, channel);
    var rate = Nexa.qs("[data-deposit-rate]", root);
    if (rate) rate.value = (channel && channel.rate) || "";
    var address = Nexa.qs("[data-deposit-address]", root);
    if (address) address.value = (channel && channel.address) || "";
    var qr = Nexa.qs("[data-deposit-qr]", root);
    if (qr && !qr.innerHTML.trim()) qr.innerHTML = Nexa.iconSvg("qr");

    var tutorial = Nexa.qs("[data-deposit-tutorial]", root);
    if (tutorial) tutorial.href = data().tutorialUrl || "#";

    var amount = Nexa.qs("[data-deposit-amount]", root);
    if (amount) {
      var min = channel && channel.min != null ? channel.min : data().depositMin;
      var max = channel && channel.max != null ? channel.max : data().depositMax;
      amount.min = String(min);
      amount.max = String(max);
      amount.placeholder = "Min. " + money(min) + " / Max. " + money(max);
    }

    fillSelect(Nexa.qs("[data-deposit-gateway]", root), method.gatewayChannels || []);

    var receiptAt = Nexa.qs("[data-deposit-receipt-at]", root);
    if (receiptAt && !receiptAt.value) {
      var now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      receiptAt.value = now.toISOString().slice(0, 16);
    }

    Nexa.qsa("[data-deposit-copy]", root).forEach(function (btn) {
      if (!btn.innerHTML.trim()) btn.innerHTML = Nexa.iconSvg("copy");
    });
    Nexa.qsa("[data-icon]", root).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });
  }

  function renderDeposit(root) {
    renderChannels(root);
    syncDepositSections(root);
    fillDepositDetails(root);
  }

  function selectMethod(root, id) {
    if (deposit.method === id) return;
    deposit.method = id;
    deposit.channel = "";
    Nexa.qsa("[data-deposit-method]", root).forEach(function (btn) {
      var on = btn.getAttribute("data-deposit-method") === id;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderDeposit(root);
  }

  function copyValue(root, key) {
    var field =
      key === "address"
        ? Nexa.qs("[data-deposit-address]", root)
        : Nexa.qs("[data-deposit-account='" + key + "']", root);
    if (!field || !field.value) return;
    var done = function () {
      toast("success", "Copied to clipboard.");
    };
    /* The async clipboard needs document focus, so keep a selection fallback. */
    var legacy = function () {
      field.removeAttribute("readonly");
      field.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      field.setAttribute("readonly", "");
      if (ok) done();
      else toast("warning", "Copy failed. Select the text manually.");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(field.value).then(done, legacy);
      return;
    }
    legacy();
  }

  function renderPresets(root) {
    var wrap = Nexa.qs("[data-deposit-presets]", root);
    if (!wrap) return;
    wrap.replaceChildren();
    (data().presets || []).forEach(function (amount) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "money-preset";
      btn.setAttribute("data-deposit-preset", String(amount));
      btn.textContent = amount >= 1000 ? amount.toLocaleString("en-US") : String(amount);
      wrap.append(btn);
    });
  }

  function renderWithdrawBanks(root) {
    var wrap = Nexa.qs("[data-withdraw-banks]", root);
    if (!wrap) return;
    wrap.replaceChildren();
    (data().banks || []).forEach(function (bank) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "money-bank-mini";
      btn.setAttribute("data-withdraw-pick", bank.id);
      btn.setAttribute("aria-label", bank.name);
      btn.innerHTML = bank.logo
        ? '<img src="' + bank.logo + '" alt="" />'
        : "<span>" + initials(bank.name) + "</span>";
      wrap.append(btn);
    });
  }

  function syncWithdrawBank(root, id) {
    var select = Nexa.qs("[data-withdraw-bank]", root);
    if (select && id) select.value = id;
    var current = select ? select.value : "";
    Nexa.qsa("[data-withdraw-pick]", root).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-withdraw-pick") === current);
    });
  }

  function fillSelect(select, items, placeholder) {
    if (!select) return;
    select.replaceChildren();
    if (placeholder) {
      var empty = document.createElement("option");
      empty.value = "";
      empty.textContent = placeholder;
      select.append(empty);
    }
    items.forEach(function (item) {
      var opt = document.createElement("option");
      opt.value = item.id || item;
      opt.textContent = item.name || item;
      select.append(opt);
    });
  }

  function renderRollover(root) {
    var acc = data();
    var currency = acc.currency || "MYR";
    Nexa.qsa("[data-rollover]", root).forEach(function (wrap) {
      var rows = (acc.rollover || [])
        .map(function (row) {
          return "<tr><th scope=\"row\">" + row.label + "</th><td>" + currency + " " + money(row.value) + "</td></tr>";
        })
        .join("");
      wrap.innerHTML =
        '<h2 class="money-rollover__title">Promotion Rollover Status</h2>' +
        "<table><tbody>" +
        rows +
        "</tbody></table>";
    });
  }

  function renderWallets(root) {
    var acc = data();
    var wallets = acc.wallets || [];
    var html =
      '<label class="money-wallet__auto"><span>Automatic Credit To Game:</span>' +
      '<span class="money-switch"><input type="checkbox" checked data-wallet-auto /><span></span></span></label>' +
      '<p class="money-wallet__main">Main Wallet Balance</p>' +
      '<p class="money-wallet__sum">' +
      (acc.currency || "MYR") +
      " " +
      money(balance()) +
      "</p>" +
      '<div class="money-wallet__list">';
    wallets.forEach(function (wallet) {
      if (wallet.main) return;
      var mark = wallet.icon
        ? '<span class="money-wallet__logo money-wallet__logo--icon" aria-hidden="true">' +
          Nexa.iconSvg(wallet.icon) +
          "</span>"
        : wallet.logo
          ? '<img class="money-wallet__logo" src="' + wallet.logo + '" alt="" />'
          : "";
      html +=
        '<div class="money-wallet__row">' +
        '<span class="money-wallet__name">' +
        mark +
        "<span>" +
        wallet.name +
        "</span></span>" +
        "<strong>" +
        money(wallet.amount) +
        "</strong>" +
        '<span class="money-wallet__actions"><button type="button" class="money-pill money-pill--out" data-wallet-move="out" data-wallet-id="' +
        wallet.id +
        '">OUT</button>' +
        '<button type="button" class="money-pill money-pill--in" data-wallet-move="in" data-wallet-id="' +
        wallet.id +
        '">IN</button></span></div>';
    });
    html +=
      "</div>" +
      '<p class="money-wallet__total"><span>Total</span><strong>' +
      (acc.currency || "MYR") +
      " " +
      money(balance()) +
      "</strong></p>" +
      '<button type="button" class="btn btn--success btn--full money-submit" data-money-transfer-all>Transfer all to Main Wallet</button>' +
      '<p class="money-wallet__tickets"><span>Ticket(s)</span><span>' +
      (acc.tickets || 0) +
      "</span></p>";
    Nexa.qsa("[data-wallet-root]", root).forEach(function (el) {
      el.innerHTML = html;
    });
  }

  function toast(type, message) {
    Nexa.emit("app:toast:show", { type: type, message: message });
  }

  Nexa.ready.then(function () {
    var root = Nexa.qs("[data-page='account']");
    if (!root) return;
    if (!Nexa.get("balance")) Nexa.set("balance", data().balance || 16.06);

    var view = viewFromUrl();
    if (view === "transfer" && new URLSearchParams(location.search).get("view") === "wallet") {
      /* desktop mapped wallet → transfer; keep showing transfer chrome */
    }
    setView(root, view);
    fillSummary(root);
    fillProfile(root);
    var methodParam = new URLSearchParams(location.search).get("method");
    if (methodParam && methodById(methodParam)) deposit.method = methodParam;
    renderMethods(root);
    renderPresets(root);
    renderDeposit(root);
    fillSelect(Nexa.qs("[data-withdraw-bank]", root), data().banks || [], "Please select");
    fillSelect(Nexa.qs("[data-banking-bank]", root), data().banks || [], "Please select");
    renderWithdrawBanks(root);
    renderSavedBanks(root);
    var withdrawSelect = Nexa.qs("[data-withdraw-bank]", root);
    if (withdrawSelect) {
      withdrawSelect.addEventListener("change", function () {
        syncWithdrawBank(root);
      });
    }
    fillSelect(Nexa.qs("[data-transfer-from]", root), data().wallets || [], "- Please select -");
    fillSelect(Nexa.qs("[data-transfer-to]", root), data().wallets || []);
    renderRollover(root);
    renderWallets(root);
    Nexa.setText(Nexa.qs("[data-transfer-available]", root), money(balance()));

    var date = Nexa.qs("[data-history-date]", root);
    if (date && !date.value) {
      var now = new Date();
      date.value = now.toISOString().slice(0, 10);
    }

    window.addEventListener("resize", function () {
      setView(root, viewFromUrl());
    });

    root.addEventListener("click", function (event) {
      var accTrigger = event.target.closest("[data-profile-acc-trigger]");
      if (accTrigger && window.matchMedia("(max-width: 767px)").matches) {
        var acc = accTrigger.closest("[data-profile-acc]");
        var panel = acc && Nexa.qs("[data-profile-acc-panel]", acc);
        if (acc && panel) {
          var open = accTrigger.getAttribute("aria-expanded") === "true";
          accTrigger.setAttribute("aria-expanded", open ? "false" : "true");
          panel.hidden = open;
          acc.classList.toggle("is-open", !open);
        }
        return;
      }
      if (event.target.closest("[data-profile-dob-submit]")) {
        var dob = Nexa.qs("[data-profile-dob]", root);
        if (!dob || !dob.value) {
          toast("warning", "Select a date of birth.");
          return;
        }
        data().profile = data().profile || {};
        data().profile.dob = dob.value;
        toast("success", "Date of birth saved.");
        return;
      }
      if (event.target.closest("[data-profile-password]")) {
        openPasswordModal();
        return;
      }
      if (event.target.closest("[data-profile-edit]")) {
        toast("info", "Avatar upload is not available in this demo.");
        return;
      }
      if (event.target.closest("[data-profile-help]")) {
        toast("info", "Balance updates every few minutes after deposits and bets settle.");
        return;
      }
      var bankingMode = event.target.closest("[data-banking-mode]");
      if (bankingMode) {
        Nexa.qsa("[data-banking-mode]", root).forEach(function (btn) {
          btn.classList.toggle("is-active", btn === bankingMode);
        });
        return;
      }
      if (event.target.closest("[data-banking-add-toggle]")) {
        var form = Nexa.qs("[data-banking-form]", root);
        if (form) form.classList.toggle("is-open");
        return;
      }
      if (event.target.closest("[data-banking-submit]")) {
        var bankSelect = Nexa.qs("[data-banking-bank]", root);
        var number = Nexa.qs("[data-banking-number]", root);
        if (!bankSelect || !bankSelect.value) {
          toast("warning", "Select a bank.");
          return;
        }
        if (!number || !String(number.value).trim()) {
          toast("warning", "Enter an account number.");
          return;
        }
        var bankMeta = bankById(bankSelect.value);
        data().savedBanks = data().savedBanks || [];
        data().savedBanks.push({
          id: bankSelect.value + "-" + Date.now(),
          name: bankMeta ? bankMeta.name : bankSelect.value,
          number: String(number.value).trim(),
          verified: true,
        });
        number.value = "";
        bankSelect.value = "";
        renderSavedBanks(root);
        toast("success", "Bank account added.");
        return;
      }
      var removeBank = event.target.closest("[data-banking-remove]");
      if (removeBank) {
        var rid = removeBank.getAttribute("data-banking-remove");
        data().savedBanks = (data().savedBanks || []).filter(function (b) {
          return b.id !== rid;
        });
        renderSavedBanks(root);
        toast("info", "Bank account removed.");
        return;
      }
      var methodHelp = event.target.closest("[data-deposit-method-help]");
      if (methodHelp) {
        event.preventDefault();
        event.stopPropagation();
        toast("info", "Offline banking uses your registered bank details. Contact live chat if you need help.");
        return;
      }
      var method = event.target.closest("[data-deposit-method]");
      if (method) {
        selectMethod(root, method.getAttribute("data-deposit-method"));
        return;
      }
      var bank = event.target.closest("[data-deposit-bank]");
      if (bank) {
        deposit.channel = bank.getAttribute("data-deposit-bank");
        renderChannels(root);
        fillDepositDetails(root);
        return;
      }
      var network = event.target.closest("[data-deposit-network]");
      if (network) {
        Nexa.qsa("[data-deposit-network]", root).forEach(function (btn) {
          var on = btn === network;
          btn.classList.toggle("is-active", on);
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
        return;
      }
      var copyBtn = event.target.closest("[data-deposit-copy]");
      if (copyBtn) {
        copyValue(root, copyBtn.getAttribute("data-deposit-copy"));
        return;
      }
      var preset = event.target.closest("[data-deposit-preset]");
      if (preset) {
        Nexa.qsa("[data-deposit-preset]", root).forEach(function (btn) {
          btn.classList.toggle("is-active", btn === preset);
        });
        var amount = Nexa.qs("[data-deposit-amount]", root);
        if (amount) amount.value = preset.getAttribute("data-deposit-preset");
        return;
      }
      if (event.target.closest("[data-deposit-submit]")) {
        var dep = Nexa.qs("[data-deposit-amount]", root);
        if (!dep || !dep.value) {
          toast("warning", "Enter a deposit amount.");
          return;
        }
        toast("success", "Deposit request submitted.");
        return;
      }
      var mode = event.target.closest("[data-withdraw-mode]");
      if (mode) {
        Nexa.qsa("[data-withdraw-mode]", root).forEach(function (btn) {
          btn.classList.toggle("is-active", btn === mode);
        });
        return;
      }
      var pick = event.target.closest("[data-withdraw-pick]");
      if (pick) {
        syncWithdrawBank(root, pick.getAttribute("data-withdraw-pick"));
        return;
      }
      if (event.target.closest("[data-withdraw-add]")) {
        toast("info", "Add bank is not available in this demo.");
        return;
      }
      if (event.target.closest("[data-withdraw-submit]")) {
        var wAmt = Nexa.qs("[data-withdraw-amount]", root);
        var wBank = Nexa.qs("[data-withdraw-bank]", root);
        if (!wBank || !wBank.value) {
          toast("warning", "Select a bank.");
          return;
        }
        if (!wAmt || !wAmt.value) {
          toast("warning", "Enter a withdrawal amount.");
          return;
        }
        toast("success", "Withdrawal request submitted.");
        return;
      }
      if (event.target.closest("[data-transfer-max]")) {
        var field = Nexa.qs("[data-transfer-amount]", root);
        if (field) field.value = String(balance());
        return;
      }
      if (event.target.closest("[data-transfer-submit]")) {
        var from = Nexa.qs("[data-transfer-from]", root);
        var to = Nexa.qs("[data-transfer-to]", root);
        var amt = Nexa.qs("[data-transfer-amount]", root);
        if (!from || !from.value || !to || !to.value) {
          toast("warning", "Choose From and To wallets.");
          return;
        }
        if (from.value === to.value) {
          toast("warning", "Choose two different wallets.");
          return;
        }
        if (!amt || !amt.value) {
          toast("warning", "Enter a transfer amount.");
          return;
        }
        toast("success", "Transfer submitted.");
        return;
      }
      var move = event.target.closest("[data-wallet-move]");
      if (move) {
        toast("success", move.getAttribute("data-wallet-move") === "in" ? "Transferred in." : "Transferred out.");
        return;
      }
      if (event.target.closest("[data-money-transfer-all]")) {
        toast("success", "All balances moved to Main Wallet.");
        return;
      }
      if (event.target.closest("[data-money-refresh]")) {
        fillSummary(root);
        renderWallets(root);
        toast("info", "Balance updated.");
        return;
      }
      var range = event.target.closest("[data-history-range]");
      if (range) {
        Nexa.qsa("[data-history-range]", root).forEach(function (btn) {
          btn.classList.toggle("is-active", btn === range);
        });
      }
    });
  });
})(window.Nexa = window.Nexa || {});
