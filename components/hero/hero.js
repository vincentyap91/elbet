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
