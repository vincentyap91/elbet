(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const nodes = Nexa.takeChildren(el);
    const node = Nexa.cloneTemplate(template);
    const root = Nexa.qs("[data-ref='root']", node);
    const label = Nexa.qs("[data-ref='label']", node);
    root.classList.add(`badge--${Nexa.attr(el, "variant", "accent")}`);
    label.append(...nodes);
    el.append(node);
  }

  Nexa.defineBadge = async function defineBadge() {
    if (customElements.get("ui-badge")) return;
    template = await Nexa.loadTemplate("badge");

    customElements.define(
      "ui-badge",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
