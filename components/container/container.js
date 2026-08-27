(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const children = Nexa.takeChildren(el);
    const node = Nexa.cloneTemplate(template);
    const root = Nexa.qs("[data-ref='root']", node);
    const size = Nexa.attr(el, "size", "md");

    root.className = "container";
    if (size !== "md") root.classList.add(`container--${size}`);
    root.append(...children);
    el.append(node);
  }

  Nexa.defineContainer = async function defineContainer() {
    if (customElements.get("ui-container")) return;
    template = await Nexa.loadTemplate("container");

    customElements.define(
      "ui-container",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
