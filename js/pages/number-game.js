(function (Nexa) {
  const data = Nexa.NUMBER_GAME;

  function toast(message, type) {
    Nexa.emit("app:toast:show", { message: message, type: type || "info" });
  }

  function money(n) {
    return Number(n).toLocaleString("en-US");
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function remainMs() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const my = new Date(utc + 8 * 3600000);
    const target = new Date(my.getFullYear(), my.getMonth(), my.getDate(), data.drawHour, data.drawMinute, 0, 0);
    if (target.getTime() <= my.getTime()) target.setDate(target.getDate() + 1);
    return target.getTime() - my.getTime();
  }

  function formatRemain(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return pad(d) + " d : " + pad(h) + " h : " + pad(m) + " m : " + pad(s) + " s";
  }

  function randomFour() {
    return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  }

  function rowHtml(item) {
    const you = item.you ? ' class="is-you"' : "";
    return (
      "<tr" +
      you +
      '><td class="tx-table__name">' +
      item.nick +
      "</td><td>" +
      item.region +
      '</td><td class="event-num">' +
      item.predicted +
      "</td></tr>"
    );
  }

  function recordRowHtml(item) {
    return (
      "<tr><td>" +
      item.no +
      '</td><td class="event-num">' +
      item.predicted +
      "</td><td>" +
      item.datetime +
      "</td></tr>"
    );
  }

  function chunk(list, size) {
    const out = [];
    for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
    return out;
  }

  function pageSlice(list, page, pageSize) {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }

  function renderPager(el, page, totalPages, attr) {
    if (!el) return;
    if (totalPages <= 1) {
      el.innerHTML = "";
      return;
    }
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) {
      buttons.push(
        '<button type="button" class="tc-pager__btn' +
          (i === page ? " is-active" : "") +
          '" data-' +
          attr +
          '-page="' +
          i +
          '" aria-label="Page ' +
          i +
          '"' +
          (i === page ? ' aria-current="page"' : "") +
          ">" +
          i +
          "</button>"
      );
    }
    if (page < totalPages) {
      buttons.push(
        '<button type="button" class="tc-pager__btn" data-' +
          attr +
          '-page="' +
          (page + 1) +
          '" aria-label="Next page">&gt;</button>'
      );
    }
    el.innerHTML = buttons.join("");
  }

  function tableWrap(caption, heads, bodyHtml) {
    return (
      '<div class="event-table-wrap"><table class="tx-table"><caption class="sr-only">' +
      caption +
      "</caption><thead><tr>" +
      heads
        .map(function (h) {
          return "<th scope=\"col\">" + h + "</th>";
        })
        .join("") +
      "</tr></thead><tbody>" +
      bodyHtml +
      "</tbody></table></div>"
    );
  }

  function bindTabs(root) {
    function show(id) {
      Nexa.qsa(".event-pills [data-event-tab]", root).forEach(function (btn) {
        const on = btn.getAttribute("data-event-tab") === id;
        btn.classList.toggle("is-active", on);
        if (btn.getAttribute("role") === "tab") btn.setAttribute("aria-selected", String(on));
      });
      Nexa.qsa("[data-event-panel]", root).forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-event-panel") !== id;
      });
    }

    root.addEventListener("click", function (event) {
      const tab = event.target.closest("[data-event-tab]");
      if (!tab) return;
      show(tab.getAttribute("data-event-tab"));
    });
  }

  function openBody(html, title) {
    const body = document.createElement("div");
    body.innerHTML = html;
    Nexa.emit("app:modal:open", { title: title, body: body, size: "lg" });
  }

  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='number-game']");
    if (!root) return;

    bindTabs(root);

    Nexa.setText(Nexa.qs("[data-ng-iteration]", root), data.iteration + "th");
    Nexa.setText(Nexa.qs("[data-ng-grand]", root), "USD " + money(data.grandUsd));
    Nexa.setText(Nexa.qs("[data-ng-local]", root), "Local Currency: " + data.localCurrency + " " + money(data.grandLocal));
    Nexa.setText(Nexa.qs("[data-ng-tickets-left]", root), String(data.ticketsLeft));

    const pity = data.pity || {};
    const pityCurrent = Number(pity.current) || 0;
    const pityMax = Math.max(1, Number(pity.max) || 300);
    const pityPct = Math.max(0, Math.min(100, (pityCurrent / pityMax) * 100));
    const attemptsEl = Nexa.qs("[data-ng-pity-attempts]", root);
    if (attemptsEl) {
      const count = document.createElement("span");
      count.className = "ng-pity__count";
      count.textContent = pityCurrent + "/" + pityMax;
      const unit = document.createElement("span");
      unit.className = "ng-pity__unit";
      unit.textContent = pity.attemptsSuffix || "Attempt(s)";
      attemptsEl.replaceChildren(count, unit);
    }
    Nexa.setText(
      Nexa.qs("[data-ng-pity-reward]", root),
      (pity.currency || data.localCurrency || "MYR") + " " + money(pity.reward || 0)
    );
    Nexa.setText(Nexa.qs("[data-ng-pity-hint]", root), pity.subtitle || "");
    Nexa.setText(Nexa.qs("[data-ng-pity-note]", root), pity.note || "");
    const pityBar = Nexa.qs("[data-ng-pity-bar]", root);
    const pityFill = Nexa.qs("[data-ng-pity-fill]", root);
    if (pityBar) {
      pityBar.setAttribute("aria-valuemin", "0");
      pityBar.setAttribute("aria-valuemax", String(pityMax));
      pityBar.setAttribute("aria-valuenow", String(pityCurrent));
    }
    if (pityFill) pityFill.style.width = pityPct + "%";
    const pityScale = Nexa.qs("[data-ng-pity-scale]", root);
    if (pityScale && Array.isArray(pity.scale)) {
      pityScale.innerHTML = pity.scale
        .map(function (n) {
          return (
            "<span>" +
            n +
            '<span class="ng-pity__scale-unit"> Attempt</span></span>'
          );
        })
        .join("");
    }

    const countdown = Nexa.qs("[data-ng-countdown]", root);
    function tick() {
      Nexa.setText(countdown, formatRemain(remainMs()));
    }
    tick();
    const timer = window.setInterval(tick, 1000);

    const nets = Nexa.qs("[data-ng-nets]", root);
    nets.innerHTML = data.nets
      .map(function (net) {
        return (
          '<article class="ng-net">' +
          '<p class="ng-net__amount">USD ' +
          money(net.amount) +
          "</p>" +
          '<div class="ng-net__row"><img class="ng-net__icon" src="' +
          net.icon +
          '" alt="" />' +
          net.address +
          "</div></article>"
        );
      })
      .join("");

    Nexa.qs("[data-ng-latest]", root).innerHTML = data.latest.map(rowHtml).join("");

    const pastEl = Nexa.qs("[data-ng-past]", root);
    if (pastEl) {
      pastEl.innerHTML = (data.past || [])
        .map(function (batch) {
          return (
            '<article class="pd-card">' +
            '<img class="pd-card__icon" src="assets/images/number-game/icon-game.svg" alt="" />' +
            '<h2 class="pd-card__title">Number Game</h2>' +
            '<p class="pd-card__dates">' +
            batch.batch +
            "th · No of Batch · " +
            batch.period +
            "</p>" +
            '<div class="pd-card__status"><span class="badge">Ended</span></div>' +
            '<p class="pd-card__prize">USD ' +
            money(batch.grandUsd) +
            '</p><p class="pd-card__prize-label">Grand Prize Total</p>' +
            '<p class="pd-card__dates">Mini Prize Pool · USD ' +
            money(batch.miniUsd) +
            " · " +
            money(batch.totalPredicted) +
            " predicted</p>" +
            '<p class="pd-card__ended-label">Date Ended</p>' +
            '<p class="pd-card__ended">' +
            batch.endedLabel +
            "</p>" +
            '<div class="pd-card__actions">' +
            '<button type="button" class="btn btn--ghost" data-ng-rules>Rules</button>' +
            '<button type="button" class="btn btn--primary" data-ng-past-check data-batch="' +
            batch.batch +
            '">Check Now</button>' +
            "</div></article>"
          );
        })
        .join("");
    }

    const PAGE_SIZE = 30;
    const COLS = 3;
    const COL_SIZE = PAGE_SIZE / COLS;

    function bindBoard(opts) {
      const colsEl = Nexa.qs(opts.colsSel, root);
      const pagerEl = Nexa.qs(opts.pagerSel, root);
      const searchEl = Nexa.qs(opts.searchSel, root);
      if (!colsEl) return;
      let page = 1;
      let query = "";

      function filtered() {
        const q = query.trim().toLowerCase();
        if (!q) return opts.rows.slice();
        return opts.rows.filter(function (row) {
          return opts.match(row, q);
        });
      }

      function paint() {
        const rows = filtered();
        const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
        if (page > totalPages) page = totalPages;
        const slice = pageSlice(rows, page, PAGE_SIZE);
        const groups = chunk(slice, COL_SIZE);
        while (groups.length < COLS) groups.push([]);
        colsEl.innerHTML = groups
          .map(function (group, index) {
            return tableWrap(
              opts.caption + " column " + (index + 1),
              opts.heads,
              group.map(opts.rowHtml).join("") ||
                '<tr><td colspan="' +
                  opts.heads.length +
                  '">No results</td></tr>'
            );
          })
          .join("");
        renderPager(pagerEl, page, totalPages, opts.pageAttr);
      }

      if (searchEl) {
        searchEl.addEventListener("input", function () {
          query = searchEl.value || "";
          page = 1;
          paint();
        });
      }

      if (pagerEl) {
        pagerEl.addEventListener("click", function (event) {
          const btn = event.target.closest("[data-" + opts.pageAttr + "-page]");
          if (!btn) return;
          page = Number(btn.getAttribute("data-" + opts.pageAttr + "-page")) || 1;
          paint();
        });
      }

      paint();
    }

    bindBoard({
      colsSel: "[data-ng-all-cols]",
      pagerSel: "[data-ng-all-pager]",
      searchSel: "[data-ng-all-search]",
      pageAttr: "ng-all",
      rows: data.predictions || data.latest || [],
      heads: ["Nickname", "Region", "Predicted"],
      caption: "All predictions",
      rowHtml: rowHtml,
      match: function (row, q) {
        return (
          String(row.nick).toLowerCase().indexOf(q) !== -1 ||
          String(row.region).toLowerCase().indexOf(q) !== -1 ||
          String(row.predicted).indexOf(q) !== -1
        );
      },
    });

    const recordBoard = Nexa.qs("[data-ng-record-board]", root);
    if (recordBoard && (data.myRecord || []).length) {
      bindBoard({
        colsSel: "[data-ng-record-cols]",
        pagerSel: "[data-ng-record-pager]",
        searchSel: "[data-ng-record-search]",
        pageAttr: "ng-record",
        rows: data.myRecord,
        heads: ["No.", "Predicted", "Date and time"],
        caption: "My record",
        rowHtml: recordRowHtml,
        match: function (row, q) {
          return (
            String(row.no).indexOf(q) !== -1 ||
            String(row.predicted).indexOf(q) !== -1 ||
            String(row.datetime).toLowerCase().indexOf(q) !== -1
          );
        },
      });
    }

    let mode = "manual";
    let numbers = [""];
    const consoleEl = Nexa.qs("[data-ng-console]", root);

    function renderConsole() {
      if (mode === "auto") {
        consoleEl.innerHTML =
          '<div class="ng-spin__row"><label class="ng-spin__index" for="ng-auto-count">Tickets</label>' +
          '<select class="ng-spin__field" id="ng-auto-count" data-ng-auto-count>' +
          [1, 2, 3, 4, 5].map(function (n) {
            return '<option value="' + n + '">' + n + "</option>";
          }).join("") +
          '</select><p class="event-note">Auto fills random 4-digit numbers on submit.</p></div>';
        return;
      }
      consoleEl.innerHTML =
        numbers
          .map(function (value, index) {
            return (
              '<div class="ng-spin__row">' +
              '<span class="ng-spin__index">' +
              (index + 1) +
              ".</span>" +
              '<div class="control-inline control-inline--sm">' +
              '<input class="ng-spin__field" data-ng-num="' +
              index +
              '" inputmode="numeric" maxlength="4" placeholder="0000" value="' +
              value +
              '" aria-label="Ticket ' +
              (index + 1) +
              ' number" />' +
              (index === numbers.length - 1
                ? '<button type="button" class="icon-btn icon-btn--ghost icon-btn--sm" data-ng-add aria-label="Add ticket"><img src="assets/images/number-game/icon-add.svg" alt="" /></button>'
                : "") +
              "</div>" +
              (index === 0
                ? '<div class="ng-spin__actions"><button type="button" class="btn btn--ghost btn--sm" data-ng-random>Random All</button><button type="button" class="btn btn--ghost btn--sm" data-ng-reset>Reset</button></div>'
                : "") +
              "</div>"
            );
          })
          .join("");
    }

    renderConsole();

    root.addEventListener("click", function (event) {
      const modeBtn = event.target.closest("[data-ng-mode]");
      if (modeBtn) {
        mode = modeBtn.getAttribute("data-ng-mode");
        Nexa.qsa("[data-ng-mode]", root).forEach(function (btn) {
          const on = btn === modeBtn;
          btn.classList.toggle("is-active", on);
          if (btn.getAttribute("role") === "tab") btn.setAttribute("aria-selected", String(on));
        });
        renderConsole();
        return;
      }
      if (event.target.closest("[data-ng-add]")) {
        if (numbers.length >= data.ticketsLeft) {
          toast("No more tickets available.", "warning");
          return;
        }
        numbers.push("");
        renderConsole();
        return;
      }
      if (event.target.closest("[data-ng-random]")) {
        numbers = numbers.map(randomFour);
        renderConsole();
        return;
      }
      if (event.target.closest("[data-ng-reset]")) {
        numbers = numbers.map(function () {
          return "";
        });
        renderConsole();
        return;
      }
      if (event.target.closest("[data-ng-submit]")) {
        if (!Nexa.get("isLoggedIn")) {
          openBody('<p>Sign in to submit a Number Game ticket.</p><p><a class="btn btn--primary" href="login.html">Log in</a></p>', "Sign in required");
          return;
        }
        if (data.ticketsLeft < 1) {
          toast("No tickets left this round.", "warning");
          return;
        }
        toast("Ticket submitted for the next draw.", "success");
        return;
      }
      if (event.target.closest("[data-ng-rules]")) {
        openBody("<p>" + data.rules + "</p>", "Number Game rules");
        return;
      }
      const pastCheck = event.target.closest("[data-ng-past-check]");
      if (pastCheck) {
        const id = Number(pastCheck.getAttribute("data-batch"));
        const batch = (data.past || []).find(function (item) {
          return item.batch === id;
        });
        if (!batch) return;
        openBody(
          '<div class="ng-past__metrics ng-past__metrics--3">' +
            '<div class="ng-past__metric"><p class="ng-past__metric-label">ETH</p><p class="ng-past__metric-value event-num">' +
            batch.eth +
            "</p></div>" +
            '<div class="ng-past__metric"><p class="ng-past__metric-label">TRC20</p><p class="ng-past__metric-value event-num">' +
            batch.trc +
            "</p></div>" +
            '<div class="ng-past__metric"><p class="ng-past__metric-label">BEP20</p><p class="ng-past__metric-value event-num">' +
            batch.bep +
            "</p></div></div>" +
            '<p class="event-note">Winning numbers for batch ' +
            batch.batch +
            " · " +
            batch.endedLabel +
            "</p>",
          batch.batch + "th · Number Game"
        );
        return;
      }
      if (event.target.closest("[data-ng-tutorial]")) {
        openBody(
          '<div style="aspect-ratio:16/9"><iframe title="Number Game tutorial" src="' +
            data.tutorialUrl +
            '" width="100%" height="100%" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>',
          "Video Tutorial"
        );
        return;
      }
      if (event.target.closest("[data-ng-jackpot-info]")) {
        openBody("<p>" + data.rules + "</p>", "Grand Jackpot");
      }
    });

    consoleEl.addEventListener("input", function (event) {
      const field = event.target.closest("[data-ng-num]");
      if (!field) return;
      field.value = field.value.replace(/\D/g, "").slice(0, 4);
      numbers[Number(field.getAttribute("data-ng-num"))] = field.value;
    });

    window.addEventListener(
      "pagehide",
      function () {
        window.clearInterval(timer);
      },
      { once: true }
    );
  });
})(window.Nexa = window.Nexa || {});
