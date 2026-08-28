(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const slides = Nexa.takeChildren(el).filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const node = Nexa.cloneTemplate(template);
    const track = Nexa.qs("[data-ref='track']", node);
    const prev = Nexa.qs("[data-ref='prev']", node);
    const next = Nexa.qs("[data-ref='next']", node);

    slides.forEach((slide) => {
      slide.classList.add("hero__slide");
      track.append(slide);
    });

    prev.innerHTML = '<img src="assets/images/icons/banner-arrow-left.png" alt="" />';
    next.innerHTML = '<img src="assets/images/icons/banner-arrow-right.png" alt="" />';

    let index = 0;
    function go(dir) {
      if (!slides.length) return;
      index = (index + dir + slides.length) % slides.length;
      track.style.transform = "translateX(" + index * -100 + "%)";
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));

    const viewport = Nexa.qs(".hero__viewport", node);
    let touchX = null;
    viewport.addEventListener(
      "touchstart",
      (event) => {
        touchX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      (event) => {
        if (touchX == null) return;
        const dx = event.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) return;
        go(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );

    el.append(node);
  }

  Nexa.defineHero = async function defineHero() {
    if (customElements.get("ui-hero")) return;
    template = await Nexa.loadTemplate("hero");
    customElements.define(
      "ui-hero",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
