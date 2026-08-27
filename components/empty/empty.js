(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const children = Nexa.takeChildren(el);
    const node = Nexa.cloneTemplate(template);
    const icon = Nexa.qs("[data-ref='icon']", node);
    const action = Nexa.qs("[data-ref='action']", node);

    icon.innerHTML = Nexa.iconSvg(Nexa.attr(el, "icon", "empty"));
    Nexa.setText(Nexa.qs("[data-ref='title']", node), Nexa.attr(el, "title", "Nothing here yet"));
    Nexa.setText(Nexa.qs("[data-ref='desc']", node), Nexa.attr(el, "description", ""));
    action.append(...children);
    el.append(node);
  }

  Nexa.defineEmpty = async function defineEmpty() {
    if (customElements.get("ui-empty")) return;
    template = await Nexa.loadTemplate("empty");

    customElements.define(
      "ui-empty",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
