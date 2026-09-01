(function (Nexa) {
  function money(value) {
    return Number(value || 0).toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function trophyHtml(tier) {
    return (
      '<img class="vip-trophy" src="' +
      Nexa.asset(tier.icon) +
      '" alt="" width="434" height="434" loading="lazy" decoding="async" />'
    );
  }

  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='vip']");
    if (!root) return;

    const data = Nexa.VIP || {};
    const tiers = data.tiers || [];
    const currency = data.currency || "MYR";
    const currentId = data.currentTier || "bronze";
    const current = tiers.find(function (t) {
      return t.id === currentId;
    }) || tiers[1] || tiers[0];

    const nextUp = tiers[tiers.indexOf(current) + 1];
    const required = nextUp
      ? Math.max(0, (Number(nextUp.minDeposit) || 0) - (Number(data.currentDeposit) || 0))
      : Number(data.amountRequired) || 0;

    const tierLabel = current ? current.label : "Bronze";
    const depositLabel = currency + " " + money(data.currentDeposit);
    const requiredLabel = currency + " " + money(required);
    Nexa.qsa("[data-vip-tier]", root).forEach(function (el) {
      Nexa.setText(el, tierLabel);
    });
    Nexa.qsa("[data-vip-deposit]", root).forEach(function (el) {
      Nexa.setText(el, depositLabel);
    });
    Nexa.qsa("[data-vip-required]", root).forEach(function (el) {
      Nexa.setText(el, requiredLabel);
    });
    if (current && current.icon) {
      Nexa.qsa("[data-vip-trophy]", root).forEach(function (el) {
        el.src = Nexa.asset(current.icon);
      });
    }

    const currentIndex = Math.max(0, tiers.indexOf(current));
    const deposit = Number(data.currentDeposit) || 0;

    let tierRatio = 1;
    if (nextUp) {
      const floor = Number(current && current.minDeposit) || 0;
      const ceiling = Number(nextUp.minDeposit) || 0;
      tierRatio = ceiling > floor ? (deposit - floor) / (ceiling - floor) : 0;
      tierRatio = Math.max(0, Math.min(1, tierRatio));
    }

    // Every tier owns an equal slice of the rail so the marker always lands
    // above the label column of the tier that is highlighted.
    const slice = tiers.length ? 100 / tiers.length : 100;
    const railPct = Math.min(100, currentIndex * slice + tierRatio * slice);
    const tierPct = tierRatio * 100;

    const fill = Nexa.qs("[data-vip-fill]", root);
    const track = Nexa.qs("[data-vip-track]", root);
    const avatar = Nexa.qs("[data-vip-avatar]", root);
    const statusFill = Nexa.qs("[data-vip-status-fill]", root);
    const statusTrack = Nexa.qs("[data-vip-status-track]", root);
    const statusProgress = Nexa.qs("[data-vip-status-progress]", root);
    if (fill) fill.style.width = railPct + "%";
    if (avatar) avatar.style.left = railPct + "%";
    if (statusFill) statusFill.style.width = tierPct + "%";
    if (statusProgress) Nexa.setText(statusProgress, tierPct.toFixed(1) + "%");
    if (track) {
      track.setAttribute("aria-valuenow", String(Math.round(railPct)));
    }
    if (statusTrack) {
      statusTrack.setAttribute("aria-valuenow", String(Math.round(tierPct)));
    }

    const labels = Nexa.qs("[data-vip-labels]", root);
    if (labels) {
      labels.innerHTML = tiers
        .map(function (tier) {
          return (
            '<div class="vip-rail__label' +
            (tier.id === currentId ? " is-current" : "") +
            '">' +
            '<span class="vip-rail__name">' +
            tier.label +
            "</span>" +
            '<span class="vip-rail__min">' +
            tier.minLabel +
            "</span>" +
            "</div>"
          );
        })
        .join("");
    }

    const matrix = Nexa.qs("[data-vip-matrix]", root);
    if (matrix) {
      const head =
        "<thead><tr><th>Features</th>" +
        tiers
          .map(function (t) {
            return "<th>" + trophyHtml(t) + "<span>" + t.label + "</span></th>";
          })
          .join("") +
        "</tr></thead>";

      function cells(fn) {
        return tiers
          .map(function (t) {
            return "<td>" + fn(t) + "</td>";
          })
          .join("");
      }

      function channelCell(t) {
        let html = t.withdrawal.channels;
        if (t.withdrawal.vipChannels) {
          html +=
            '<br /><span class="vip-badge">VIP</span> Singapore, Cambodia and Vietnam banks';
        }
        return html;
      }

      const body =
        "<tbody>" +
        '<tr class="vip-matrix__group"><th colspan="' +
        (tiers.length + 1) +
        '"><span class="vip-matrix__icon" aria-hidden="true"></span> Membership</th></tr>' +
        "<tr><th>Renewable</th>" +
        cells(function (t) {
          return t.membership;
        }) +
        "</tr>" +
        '<tr class="vip-matrix__group"><th colspan="' +
        (tiers.length + 1) +
        '"><span class="vip-matrix__icon" aria-hidden="true"></span> Rebate</th></tr>' +
        "<tr><th>Live Casino</th>" +
        cells(function (t) {
          return t.rebate.live;
        }) +
        "</tr>" +
        "<tr><th>Sportsbook</th>" +
        cells(function (t) {
          return t.rebate.sports;
        }) +
        "</tr>" +
        "<tr><th>Slots</th>" +
        cells(function (t) {
          return t.rebate.slots;
        }) +
        "</tr>" +
        '<tr class="vip-matrix__group"><th colspan="' +
        (tiers.length + 1) +
        '"><span class="vip-matrix__icon" aria-hidden="true"></span> Bonus</th></tr>' +
        "<tr><th>Birthday</th>" +
        cells(function (t) {
          return t.bonus.birthday;
        }) +
        "</tr>" +
        "<tr><th>Upgrade</th>" +
        cells(function (t) {
          return t.bonus.upgrade;
        }) +
        "</tr>" +
        '<tr class="vip-matrix__group"><th colspan="' +
        (tiers.length + 1) +
        '"><span class="vip-matrix__icon" aria-hidden="true"></span> Withdrawal</th></tr>' +
        "<tr><th>Frequency</th>" +
        cells(function (t) {
          return t.withdrawal.frequency;
        }) +
        "</tr>" +
        "<tr><th>Amount</th>" +
        cells(function (t) {
          return t.withdrawal.amount;
        }) +
        "</tr>" +
        "<tr><th>Channels</th>" +
        cells(channelCell) +
        "</tr>" +
        "</tbody>";

      matrix.innerHTML = head + body;
    }

    const cards = Nexa.qs("[data-vip-cards]", root);
    if (cards) {
      cards.innerHTML = tiers
        .map(function (t) {
          return (
            '<article class="vip-card' +
            (t.id === currentId ? " is-current" : "") +
            '">' +
            trophyHtml(t) +
            '<p class="vip-card__badge">' +
            t.label +
            "</p>" +
            '<div class="vip-card__block">' +
            '<p class="vip-card__cat">Membership</p>' +
            "<p>Renewable: " +
            t.membership +
            "</p>" +
            "</div>" +
            '<div class="vip-card__block">' +
            '<p class="vip-card__cat">Rebate</p>' +
            "<p>Live Casino: " +
            t.rebate.live +
            "</p>" +
            "<p>Sportsbook: " +
            t.rebate.sports +
            "</p>" +
            "<p>Slots: " +
            t.rebate.slots +
            "</p>" +
            "</div>" +
            '<div class="vip-card__block">' +
            '<p class="vip-card__cat">Bonus</p>' +
            "<p>Birthday: " +
            t.bonus.birthday +
            "</p>" +
            "<p>Upgrade: " +
            t.bonus.upgrade +
            "</p>" +
            "</div>" +
            '<div class="vip-card__block">' +
            '<p class="vip-card__cat">Withdrawal</p>' +
            "<p>Frequency: " +
            t.withdrawal.frequency +
            "</p>" +
            "<p>Amount: " +
            t.withdrawal.amount +
            "</p>" +
            "<p>Channels: " +
            t.withdrawal.channels +
            (t.withdrawal.vipChannels
              ? ' <span class="vip-badge">VIP</span> Singapore, Cambodia and Vietnam banks'
              : "") +
            "</p>" +
            "</div>" +
            "</article>"
          );
        })
        .join("");
    }

    Nexa.qsa("[data-acc-trigger]", root).forEach(function (trigger, i) {
      const panel = Nexa.qsa("[data-acc-panel]", root)[i];
      if (!panel) return;
      trigger.addEventListener("click", function () {
        const open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
      });
    });
  });
})(window.Nexa = window.Nexa || {});
