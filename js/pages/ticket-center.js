(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='ticket-center']");
    if (!root) return;

    const data = Nexa.TICKET_CENTER || {};
    const history = data.history || [];
    let filter = "all";
    let page = 1;
    const pageSize = data.pageSize || 5;

    const avail = typeof data.available === "number" ? data.available : (Nexa.ACCOUNT && Nexa.ACCOUNT.tickets) || 0;
    const max = data.max || 200;
    const progress = data.progress || 0;
    const progressMax = data.progressMax || 500;
    const pct = Math.min(100, Math.round((progress / progressMax) * 100));
    const remain = Math.max(0, progressMax - progress);

    Nexa.setText(Nexa.qs("[data-tc-count]", root), avail + " / " + max);
    Nexa.setText(Nexa.qs("[data-tc-progress-label]", root), progress + "/" + progressMax);
    Nexa.setText(Nexa.qs("[data-tc-progress-pct]", root), pct + "%");
    Nexa.setText(
      Nexa.qs("[data-tc-remain]", root),
      "Deposit " + (data.currency || "MYR") + remain + " more to unlock your next FREE ticket!"
    );

    const fill = Nexa.qs("[data-tc-fill]", root);
    const track = Nexa.qs("[data-tc-track]", root);
    if (fill) fill.style.width = pct + "%";
    if (track) {
      track.setAttribute("aria-valuenow", String(pct));
      track.setAttribute("aria-valuetext", pct + " percent");
    }

    const body = Nexa.qs("[data-tc-rows]", root);
    const pager = Nexa.qs("[data-tc-pager]", root);

    function filtered() {
      if (filter === "all") return history.slice();
      return history.filter(function (row) {
        return row.type === filter;
      });
    }

    function render() {
      const rows = filtered();
      const pages = Math.max(1, Math.ceil(rows.length / pageSize));
      if (page > pages) page = pages;
      const start = (page - 1) * pageSize;
      const slice = rows.slice(start, start + pageSize);

      if (!body) return;
      if (!slice.length) {
        body.innerHTML =
          '<tr><td class="tc-table__empty" colspan="4">No ticket history in this filter.</td></tr>';
      } else {
        body.innerHTML = slice
          .map(function (row) {
            const cls = row.type === "received" ? "is-plus" : "is-minus";
            return (
              "<tr>" +
              "<td>" +
              row.date +
              "</td>" +
              "<td>" +
              row.time +
              "</td>" +
              '<td class="tc-table__type">' +
              row.label +
              "</td>" +
              '<td class="tc-table__amount ' +
              cls +
              '">' +
              row.amount +
              "</td>" +
              "</tr>"
            );
          })
          .join("");
      }

      if (!pager) return;
      const buttons = [];
      const total = Math.min(pages, 5);
      for (let i = 1; i <= total; i++) {
        buttons.push(
          '<button type="button" class="tc-pager__btn' +
            (i === page ? " is-active" : "") +
            '" data-tc-page="' +
            i +
            '">' +
            i +
            "</button>"
        );
      }
      if (pages > 5) buttons.push('<span class="tc-pager__more" aria-hidden="true">…</span>');
      pager.innerHTML = buttons.join("");
    }

    Nexa.qsa("[data-tc-filter]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-tc-filter") || "all";
        page = 1;
        Nexa.qsa("[data-tc-filter]", root).forEach(function (el) {
          const on = el === btn;
          el.classList.toggle("is-active", on);
          el.setAttribute("aria-selected", on ? "true" : "false");
        });
        render();
      });
    });

    if (pager) {
      pager.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-tc-page]");
        if (!btn) return;
        page = Number(btn.getAttribute("data-tc-page")) || 1;
        render();
      });
    }

    const rulesBtn = Nexa.qs("[data-tc-rules]", root);
    if (rulesBtn) {
      rulesBtn.addEventListener("click", function () {
        Nexa.emit("app:modal:open", {
          title: "Rules & Regulations",
          size: "md",
          body: data.rules || "<p>Ticket rules are not available.</p>",
        });
      });
    }

    render();
  });
})(window.Nexa = window.Nexa || {});
