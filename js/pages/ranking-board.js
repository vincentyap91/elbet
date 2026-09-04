(function (Nexa) {
  const data = Nexa.RANKING_BOARD;

  function bindAccordion(root) {
    Nexa.bindAccordion(root);
  }

  function stamp() {
    const now = new Date();
    const pad = function (n) {
      return String(n).padStart(2, "0");
    };
    return (
      now.getFullYear() +
      "-" +
      pad(now.getMonth() + 1) +
      "-" +
      pad(now.getDate()) +
      " " +
      pad(now.getHours()) +
      ":" +
      pad(now.getMinutes()) +
      ":" +
      pad(now.getSeconds())
    );
  }

  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='ranking-board']");
    if (!root) return;
    bindAccordion(root);

    const state = { board: "ranking", range: "daily", game: "live" };

    function rows() {
      return data.boards[state.board][state.range][state.game] || [];
    }

    function render() {
      const list = rows();
      const table = Nexa.qs("[data-rb-table]", root);
      const empty = Nexa.qs("[data-rb-empty]", root);
      table.hidden = list.length === 0;
      empty.hidden = list.length > 0;
      Nexa.qs("[data-rb-rows]", root).innerHTML = list
        .map(function (row) {
          const placeMod = row.place <= 3 ? " event-place--" + row.place : "";
          return (
            "<tr" +
            (row.you ? ' class="is-you"' : "") +
            '><td class="event-place' +
            placeMod +
            '">#' +
            row.place +
            '</td><td class="tx-table__name">' +
            row.nick +
            "</td><td>" +
            row.region +
            '</td><td class="event-num">' +
            row.winning +
            '</td><td class="event-num">' +
            row.prize +
            "</td></tr>"
          );
        })
        .join("");

      const mine = list.find(function (row) {
        return row.you;
      });
      Nexa.setText(Nexa.qs("[data-rb-mine]", root), mine ? "#" + mine.place : "-");
      Nexa.setText(Nexa.qs("[data-rb-turnover]", root), mine ? "USD " + mine.winning : "USD 0");
      Nexa.setText(Nexa.qs("[data-rb-place]", root), mine ? "Place " + mine.place : "");
      Nexa.setText(
        Nexa.qs("[data-rb-updated]", root),
        "Latest updated: " + stamp() + ". Result updates every 30 minutes."
      );
    }

    function setGroup(attr, value) {
      Nexa.qsa("[" + attr + "]", root).forEach(function (btn) {
        const on = btn.getAttribute(attr) === value;
        btn.classList.toggle("is-active", on);
        if (btn.getAttribute("role") === "tab") btn.setAttribute("aria-selected", String(on));
      });
    }

    root.addEventListener("click", function (event) {
      const board = event.target.closest("[data-rb-board]");
      const range = event.target.closest("[data-rb-range]");
      const game = event.target.closest("[data-rb-game]");
      if (board) {
        state.board = board.getAttribute("data-rb-board");
        setGroup("data-rb-board", state.board);
        render();
      } else if (range) {
        state.range = range.getAttribute("data-rb-range");
        setGroup("data-rb-range", state.range);
        render();
      } else if (game) {
        state.game = game.getAttribute("data-rb-game");
        setGroup("data-rb-game", state.game);
        render();
      }
    });

    render();
  });
})(window.Nexa = window.Nexa || {});
