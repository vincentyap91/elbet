(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const labelNodes = Nexa.takeChildren(el);
    const variant = Nexa.attr(el, "variant", "primary");
    const size = Nexa.attr(el, "size", "md");
    const href = Nexa.attr(el, "href");
    const disabled = Nexa.hasAttr(el, "disabled");

    const node = Nexa.cloneTemplate(template);
    const sourceControl = Nexa.qs("[data-ref='control']", node);
    const label = Nexa.qs("[data-ref='label']", node);

    const control = href ? document.createElement("a") : document.createElement("button");
    control.className = sourceControl.className;
    control.classList.add(`btn--${variant}`, `btn--${size}`);
    if (Nexa.hasAttr(el, "full") || Nexa.hasAttr(el, "block")) control.classList.add("btn--full");
    control.dataset.ref = "control";

    if (href) {
      control.href = href;
    } else {
      control.type = "button";
    }

    if (disabled) {
      control.classList.add("is-disabled");
      control.setAttribute("aria-disabled", "true");
      if (!href) control.disabled = true;
    }

    label.append(...labelNodes);
    control.append(label);
    sourceControl.replaceWith(control);
    el.append(node);
  }

  Nexa.defineButton = async function defineButton() {
    if (customElements.get("ui-button")) return;
    template = await Nexa.loadTemplate("button");

    customElements.define(
      "ui-button",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
