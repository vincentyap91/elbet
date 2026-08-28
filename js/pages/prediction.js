(function (Nexa) {
  const events = Nexa.PREDICTION_EVENTS;
  const icons = {
    football: "assets/images/menu/icon-sports.svg",
    basketball: "assets/images/menu/icon-sports.svg",
  };

  function matches(item, filter) {
    if (filter === "all") return true;
    if (filter === "active-upcoming") return item.status === "active" || item.status === "upcoming";
    return item.status === filter;
  }

  function statusLabel(status) {
    if (status === "active") return "Active";
    if (status === "upcoming") return "Upcoming";
    return "Ended";
  }

  Nexa.ready.then(function () {
    const root = Nexa.qs("[data-page='prediction']");
    if (!root) return;

    const grid = Nexa.qs("[data-pd-grid]", root);
    const empty = Nexa.qs("[data-pd-empty]", root);
    let filter = "all";

    function render() {
      const list = events.filter(function (item) {
        return matches(item, filter);
      });
      empty.hidden = list.length > 0;
      grid.hidden = list.length === 0;
      grid.innerHTML = list
        .map(function (item) {
          const badge =
            item.status === "ended" ? "badge" : item.status === "active" ? "badge badge--live" : "badge badge--info";
          return (
            '<article class="pd-card">' +
            '<img class="pd-card__icon" src="' +
            icons[item.sport] +
            '" alt="" />' +
            '<h2 class="pd-card__title">' +
            item.title +
            "</h2>" +
            '<p class="pd-card__dates">' +
            item.dates +
            "</p>" +
            '<div class="pd-card__status"><span class="' +
            badge +
            '">' +
            statusLabel(item.status) +
            "</span></div>" +
            '<p class="pd-card__prize">' +
            item.prize +
            '</p><p class="pd-card__prize-label">Prize Pool</p>' +
            '<p class="pd-card__ended-label">Date Ended</p>' +
            '<p class="pd-card__ended">' +
            item.ended +
            "</p>" +
            '<div class="pd-card__actions">' +
            '<button type="button" class="btn btn--ghost" data-pd-rules="' +
            item.id +
            '" aria-label="Rules for ' +
            item.title +
            '">Rules</button>' +
            '<a class="btn btn--primary" href="login.html" aria-label="Check Now: ' +
            item.title +
            '">Check Now</a>' +
            "</div></article>"
          );
        })
        .join("");
    }

    root.addEventListener("click", function (event) {
      const tab = event.target.closest("[data-pd-status]");
      if (tab) {
        filter = tab.getAttribute("data-pd-status");
        Nexa.qsa("[data-pd-status]", root).forEach(function (btn) {
          const on = btn === tab;
          btn.classList.toggle("is-active", on);
          if (btn.getAttribute("role") === "tab") btn.setAttribute("aria-selected", String(on));
        });
        render();
        return;
      }
      const rules = event.target.closest("[data-pd-rules]");
      if (!rules) return;
      const item = events.find(function (eventItem) {
        return eventItem.id === rules.getAttribute("data-pd-rules");
      });
      if (!item) return;
      const body = document.createElement("p");
      body.textContent =
        "Predict the outcomes for " +
        item.title +
        " (" +
        item.dates +
        "). Prize pool " +
        item.prize +
        ". Sign in to submit picks. Demo data only.";
      Nexa.emit("app:modal:open", { title: item.title + " rules", body: body });
    });

    render();
  });
})(window.Nexa = window.Nexa || {});
