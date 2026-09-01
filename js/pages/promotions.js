(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='promotions']");
    if (!root || !Nexa.PROMOTIONS) return;

    const data = Nexa.PROMOTIONS;
    const grid = Nexa.qs("[data-promo-grid]", root);
    const pills = Nexa.qs("[data-promo-pills]", root);
    const detailPage =
      location.protocol === "file:" || /\.html$/i.test(location.pathname)
        ? "promotion.html"
        : "promotion";
    let category = "all";

    function filtered() {
      if (category === "all") return data.items;
      return data.items.filter(function (item) {
        return item.categories.indexOf(category) >= 0;
      });
    }

    function renderPills() {
      if (!pills) return;
      pills.innerHTML = data.categories
        .map(function (cat) {
          const active = cat.id === category ? " is-active" : "";
          return (
            '<button type="button" class="event-pill' +
            active +
            '" data-promo-cat="' +
            cat.id +
            '">' +
            cat.label +
            "</button>"
          );
        })
        .join("");
    }

    function renderGrid() {
      if (!grid) return;
      const items = filtered();
      if (!items.length) {
        grid.innerHTML = '<p class="type-caption">No promotions in this category.</p>';
        return;
      }
      grid.innerHTML = items
        .map(function (item) {
          return (
            '<a class="promo-tile" href="' +
            detailPage +
            "?id=" +
            encodeURIComponent(item.id) +
            '">' +
            '<div class="promo-tile__media"><img src="' +
            item.image +
            '" alt="" loading="lazy" /></div>' +
            '<p class="promo-tile__caption">' +
            item.caption +
            "</p>" +
            "</a>"
          );
        })
        .join("");
    }

    function render() {
      renderPills();
      renderGrid();
    }

    root.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-promo-cat]");
      if (!btn) return;
      category = btn.getAttribute("data-promo-cat") || "all";
      render();
    });

    render();
  });
})(window.Nexa = window.Nexa || {});
