(function (Nexa) {
  let template;

  function activate(root, id) {
    Nexa.qs("[data-ref='list']", root).querySelectorAll("[role='tab']").forEach((tab) => {
      const on = tab.dataset.tab === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", String(on));
    });
    Nexa.qs("[data-ref='panels']", root).querySelectorAll("[data-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== id;
    });
  }

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const children = Nexa.takeChildren(el);
    const node = Nexa.cloneTemplate(template);
    const list = Nexa.qs("[data-ref='list']", node);
    const panels = Nexa.qs("[data-ref='panels']", node);
    const root = Nexa.qs("[data-ref='root']", node);

    children.forEach((child) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      if (child.hasAttribute("data-tab") && !child.hasAttribute("data-panel")) {
        child.classList.add("tabs__tab");
        child.setAttribute("role", "tab");
        list.append(child);
      } else if (child.hasAttribute("data-panel")) {
        child.classList.add("tabs__panel");
        child.setAttribute("role", "tabpanel");
        panels.append(child);
      }
    });

    const first = Nexa.qs("[data-tab]", list);
    if (first) activate(root, first.dataset.tab);

    list.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-tab]");
      if (tab) activate(root, tab.dataset.tab);
    });

    el.append(node);
  }

  Nexa.defineTabs = async function defineTabs() {
    if (customElements.get("ui-tabs")) return;
    template = await Nexa.loadTemplate("tabs");

    customElements.define(
      "ui-tabs",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
