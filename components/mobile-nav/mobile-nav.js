(function (Nexa) {
  Nexa.initMobileNav = function initMobileNav() {
    const nav = document.querySelector(".mobile-nav");
    if (!nav || nav.dataset.ready === "true") return;
    nav.dataset.ready = "true";
    Nexa.qsa("[data-icon]", nav).forEach((el) => {
      el.innerHTML = Nexa.iconSvg(el.dataset.icon);
    });
  };
})(window.Nexa = window.Nexa || {});
