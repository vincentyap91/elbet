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
    return (
      "<tr><td class=\"tx-table__name\">" +
      item.nick +
      "</td><td>" +
      item.region +
      '</td><td class="event-num">' +
      item.predicted +
      "</td></tr>"
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
    Nexa.qs("[data-ng-all]", root).innerHTML = data.latest
      .concat(data.latest.map(function (item, i) {
        return { nick: item.nick, region: item.region, predicted: randomFour() + (i % 9) };
      }))
      .map(rowHtml)
      .join("");

    Nexa.qs("[data-ng-history]", root).innerHTML = data.history
      .map(function (draw) {
        return (
          '<article class="ng-history__card"><p class="ng-history__date">' +
          draw.date +
          '</p><div class="ng-history__prizes">' +
          '<article class="ng-net"><p class="ng-net__amount">' +
          draw.eth +
          '</p><div class="ng-net__row"><img class="ng-net__icon" src="assets/images/number-game/eth.png" alt="" />ETH</div></article>' +
          '<article class="ng-net"><p class="ng-net__amount">' +
          draw.trc +
          '</p><div class="ng-net__row"><img class="ng-net__icon" src="assets/images/number-game/trc20.png" alt="" />TRC20</div></article>' +
          '<article class="ng-net"><p class="ng-net__amount">' +
          draw.bep +
          '</p><div class="ng-net__row"><img class="ng-net__icon" src="assets/images/number-game/bep20.png" alt="" />BEP20</div></article>' +
          "</div></article>"
        );
      })
      .join("");

    if (Nexa.get("isLoggedIn")) {
      Nexa.qs("[data-ng-record]", root).innerHTML =
        '<h2 class="event-empty__title">No tickets this round</h2><p class="event-empty__desc">Submit a number on the Current tab to see it here.</p>';
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
