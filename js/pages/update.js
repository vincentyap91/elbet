(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='update']");
    if (!root || !Nexa.UPDATES) return;

    Nexa.qsa("[data-icon]", root).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });

    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "";
    const item = Nexa.UPDATES.byId(id);
    if (!item) {
      if (typeof Nexa.isFigmaCapture === "function" && Nexa.isFigmaCapture()) return;
      location.replace("updates.html" + (location.hash || ""));
      return;
    }

    const dateEl = Nexa.qs("[data-update-date]", root);
    const titleEl = Nexa.qs("[data-update-title]", root);
    const effectiveWrap = Nexa.qs("[data-update-effective-wrap]", root);
    const effectiveEl = Nexa.qs("[data-update-effective]", root);
    const bodyEl = Nexa.qs("[data-update-body]", root);
    const comparison = Nexa.qs("[data-update-comparison]", root);
    const tableTitle = Nexa.qs("[data-update-table-title]", root);
    const tableWrap = Nexa.qs("[data-update-table]", root);
    const action = Nexa.qs("[data-update-action]", root);
    const actionTitle = Nexa.qs("[data-update-action-title]", root);
    const actionBody = Nexa.qs("[data-update-action-body]", root);
    const closing = Nexa.qs("[data-update-closing]", root);

    if (dateEl) dateEl.textContent = item.date || "";
    if (titleEl) titleEl.textContent = item.title || "";
    document.title = "ELBET · " + (item.title || "Update");
    if (effectiveWrap) effectiveWrap.hidden = !item.effectiveDate;
    if (effectiveEl) effectiveEl.textContent = item.effectiveDate || "";
    if (bodyEl) {
      bodyEl.innerHTML = (item.body || [])
        .map(function (p) {
          return "<p>" + p + "</p>";
        })
        .join("");
    }
    if (action) action.hidden = !item.actionTitle && !item.actionBody;
    if (actionTitle) actionTitle.textContent = item.actionTitle || "";
    if (actionBody) actionBody.textContent = item.actionBody || "";
    if (closing) {
      const paragraphs = item.closing || [];
      closing.hidden = !paragraphs.length;
      closing.innerHTML = paragraphs
        .map(function (p) {
          return "<p>" + p + "</p>";
        })
        .join("");
    }
    if (tableWrap) {
      if (!item.table) {
        if (comparison) comparison.hidden = true;
      } else {
        if (comparison) comparison.hidden = false;
        if (tableTitle) tableTitle.textContent = item.table.caption || "What's Changing?";
        const headers = item.table.headers
          .map(function (h) {
            return "<th>" + h + "</th>";
          })
          .join("");
        const rows = item.table.rows
          .map(function (row) {
            return (
              "<tr>" +
              row
                .map(function (cell) {
                  return "<td>" + cell + "</td>";
                })
                .join("") +
              "</tr>"
            );
          })
          .join("");
        tableWrap.innerHTML =
          '<table class="content-table"><thead><tr>' +
          headers +
          "</tr></thead><tbody>" +
          rows +
          "</tbody></table>";
      }
    }
  });
})(window.Nexa = window.Nexa || {});
