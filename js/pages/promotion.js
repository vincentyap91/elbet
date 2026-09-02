(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='promotion']");
    if (!root || !Nexa.PROMOTIONS) return;

    Nexa.qsa("[data-icon]", root).forEach(function (el) {
      if (!el.innerHTML.trim()) el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });

    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "";
    const item = Nexa.PROMOTIONS.byId(id);
    if (!item) {
      if (typeof Nexa.isFigmaCapture === "function" && Nexa.isFigmaCapture()) return;
      location.replace("promotions.html" + (location.hash || ""));
      return;
    }

    const title = Nexa.qs("[data-promo-title]", root);
    const termsBefore = Nexa.qs("[data-promo-terms-before]", root);
    const termsAfter = Nexa.qs("[data-promo-terms-after]", root);
    const tableWrap = Nexa.qs("[data-promo-table]", root);
    const example = Nexa.qs("[data-promo-example]", root);
    const track = Nexa.qs("[data-promo-track]", root);
    const gallery = item.gallery && item.gallery.length ? item.gallery : [item.image];
    const splitAt = Math.min(item.tableAfterTerm || item.terms.length, item.terms.length);

    if (title) title.textContent = item.detailTitle || item.title;
    document.title = "ELBET · " + (item.detailTitle || item.title);
    if (termsBefore) {
      termsBefore.innerHTML = (item.terms || [])
        .slice(0, splitAt)
        .map(function (line) {
          return "<li>" + line + "</li>";
        })
        .join("");
    }
    if (termsAfter) {
      const remainingTerms = (item.terms || []).slice(splitAt);
      termsAfter.hidden = !remainingTerms.length;
      termsAfter.start = splitAt + 1;
      termsAfter.innerHTML = remainingTerms
        .map(function (line) {
          return "<li>" + line + "</li>";
        })
        .join("");
    }
    if (example) {
      example.hidden = !item.example;
      const lines = Array.isArray(item.example) ? item.example : [item.example];
      example.innerHTML = lines
        .filter(Boolean)
        .map(function (line) {
          return "<span>" + line + "</span>";
        })
        .join("");
    }
    if (tableWrap) {
      if (!item.table) {
        tableWrap.hidden = true;
      } else {
        tableWrap.hidden = false;
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
          '<table class="content-table"><caption>' +
          (item.table.caption || "") +
          "</caption><thead><tr>" +
          headers +
          "</tr></thead><tbody>" +
          rows +
          "</tbody></table>";
      }
    }

    if (track) {
      track.innerHTML = gallery
        .map(function (src) {
          return '<div class="promo-detail__slide"><img src="' + src + '" alt="' + item.title + '" /></div>';
        })
        .join("");
    }

    let index = 0;
    function go(dir) {
      if (!gallery.length || !track) return;
      index = (index + dir + gallery.length) % gallery.length;
      track.style.transform = "translateX(" + index * -100 + "%)";
    }

    const prev = Nexa.qs("[data-promo-prev]", root);
    const next = Nexa.qs("[data-promo-next]", root);
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });
  });
})(window.Nexa = window.Nexa || {});
