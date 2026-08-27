(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const children = Nexa.takeChildren(el);
    const node = Nexa.cloneTemplate(template);
    const root = Nexa.qs("[data-ref='root']", node);
    const media = Nexa.qs("[data-ref='media']", node);
    const body = Nexa.qs("[data-ref='body']", node);
    const variant = Nexa.attr(el, "variant", "default");

    if (variant !== "default") root.classList.add(`card--${variant}`);

    children.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE && child.hasAttribute("data-slot") && child.getAttribute("data-slot") === "media") {
        media.hidden = false;
        media.append(child);
      } else {
        body.append(child);
      }
    });

    el.append(node);
  }

  Nexa.defineCard = async function defineCard() {
    if (customElements.get("ui-card")) return;
    template = await Nexa.loadTemplate("card");

    customElements.define(
      "ui-card",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
