(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const name = Nexa.attr(el, "name", "dots");
    const label = Nexa.attr(el, "label", name);
    const variant = Nexa.attr(el, "variant", "plain");
    const size = Nexa.attr(el, "size", "md");

    const node = Nexa.cloneTemplate(template);
    const control = Nexa.qs("[data-ref='control']", node);
    control.classList.add(`icon-btn--${variant}`);
    if (size !== "md") control.classList.add(`icon-btn--${size}`);
    control.setAttribute("aria-label", label);
    control.innerHTML = Nexa.iconSvg(name);

    [...el.attributes].forEach((item) => {
      if (item.name.startsWith("data-action") || item.name === "data-action") {
        control.setAttribute(item.name, item.value);
      }
    });

    el.replaceChildren(node);
  }

  Nexa.defineIconButton = async function defineIconButton() {
    if (customElements.get("ui-icon-button")) return;
    template = await Nexa.loadTemplate("icon-button");

    customElements.define(
      "ui-icon-button",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
