(function (Nexa) {
  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='updates']");
    if (!root || !Nexa.UPDATES) return;

    const list = Nexa.qs("[data-update-list]", root);
    const detailPage =
      location.protocol === "file:" || /\.html$/i.test(location.pathname)
        ? "update.html"
        : "update";
    if (!list) return;

    list.innerHTML = Nexa.UPDATES.items
      .map(function (item) {
        const thumbExtra = item.thumbClass ? " " + item.thumbClass : "";
        return (
          '<a class="content-update-row" href="' +
          detailPage +
          "?id=" +
          encodeURIComponent(item.id) +
          '">' +
          '<p class="content-update-row__date">' +
          item.date +
          "</p>" +
          '<div class="content-update-row__main">' +
          '<div class="content-update__thumb' +
          thumbExtra +
          '"><img src="' +
          item.thumb +
          '" alt="" loading="lazy" /></div>' +
          '<div class="content-update-row__copy">' +
          '<div class="content-update-row__meta">' +
          '<span class="content-update-row__tag">' +
          '<img src="assets/images/icon-page/update.png" alt="" /> Update</span>' +
          "</div>" +
          '<h2 class="content-update-row__title">' +
          item.title +
          "</h2>" +
          '<p class="content-update-row__summary">' +
          item.summary +
          "</p>" +
          "</div>" +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  });
})(window.Nexa = window.Nexa || {});
