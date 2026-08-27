(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const variant = Nexa.attr(el, "variant", "spinner");
    const label = Nexa.attr(el, "label", "Loading");
    const lines = Number(Nexa.attr(el, "lines", "3"));

    const node = Nexa.cloneTemplate(template);
    const root = Nexa.qs("[data-ref='root']", node);
    const spinner = Nexa.qs("[data-ref='spinner']", node);
    const labelEl = Nexa.qs("[data-ref='label']", node);
    const skeleton = Nexa.qs("[data-ref='skeleton']", node);

    if (variant === "skeleton") {
      root.classList.add("loading--skeleton");
      spinner.hidden = true;
      labelEl.hidden = true;
      skeleton.hidden = false;
      for (let i = 0; i < lines; i += 1) {
        const line = document.createElement("div");
        line.className = "loading__line";
        skeleton.append(line);
      }
    } else {
      Nexa.setText(labelEl, label);
    }

    el.append(node);
  }

  Nexa.defineLoading = async function defineLoading() {
    if (customElements.get("ui-loading")) return;
    template = await Nexa.loadTemplate("loading");

    customElements.define(
      "ui-loading",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
