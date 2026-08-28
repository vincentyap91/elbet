(function (Nexa) {
  let template;

  function closeAll(except) {
    document.querySelectorAll("ui-dropdown .dropdown.is-open").forEach((root) => {
      if (except && root === except) return;
      root.classList.remove("is-open");
      Nexa.qs("[data-ref='menu']", root).hidden = true;
      Nexa.qs("[data-ref='trigger']", root).setAttribute("aria-expanded", "false");
    });
  }

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const items = Nexa.takeChildren(el);
    const node = Nexa.cloneTemplate(template);
    const root = Nexa.qs("[data-ref='root']", node);
    const trigger = Nexa.qs("[data-ref='trigger']", node);
    const menu = Nexa.qs("[data-ref='menu']", node);
    const icon = Nexa.qs("[data-ref='icon']", node);
    const label = Nexa.attr(el, "label", "Menu");
    const isMega = Nexa.attr(el, "data-variant") === "mega";

    Nexa.setText(Nexa.qs("[data-ref='label']", node), label);
    icon.innerHTML = Nexa.iconSvg("chevron");

    if (isMega) {
      root.classList.add("dropdown--mega");
      const panel = document.createElement("div");
      panel.className = "dropdown__panel";
      const groups = items.filter(
        (item) => item.nodeType === Node.ELEMENT_NODE && item.classList.contains("dropdown__group")
      );

      function decorateItem(item) {
        item.classList.add("dropdown__item");
        item.setAttribute("role", "menuitem");
        return item;
      }

      function buildRow(nodes) {
        const row = document.createElement("div");
        row.className = "dropdown__row";
        nodes.forEach((item) => {
          if (item.nodeType !== Node.ELEMENT_NODE) return;
          row.append(decorateItem(item));
        });
        return row;
      }

      if (groups.length) {
        panel.classList.add("dropdown__panel--groups");
        groups.forEach((source) => {
          const group = document.createElement("div");
          group.className = "dropdown__group";
          const groupLabel = Nexa.attr(source, "data-label");
          if (groupLabel) {
            const heading = document.createElement("p");
            heading.className = "dropdown__group-label";
            heading.textContent = groupLabel;
            group.append(heading);
          }
          group.append(buildRow(Nexa.takeChildren(source)));
          panel.append(group);
        });
      } else {
        panel.append(buildRow(items));
      }

      menu.append(panel);
    } else {
      items.forEach((item) => {
        if (item.nodeType !== Node.ELEMENT_NODE) return;
        item.classList.add("dropdown__item");
        item.setAttribute("role", "menuitem");
        menu.append(item);
      });
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = !root.classList.contains("is-open");
      closeAll();
      root.classList.toggle("is-open", open);
      menu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    });

    menu.addEventListener("click", (event) => {
      const item = event.target.closest("[role='menuitem']");
      if (!item) return;

      if (item.dataset.action) {
        closeAll();
        return;
      }

      event.stopPropagation();
      Nexa.emit("app:dropdown:select", { value: item.dataset.value || item.textContent.trim() });
      closeAll();
    });

    el.append(node);
  }

  Nexa.defineDropdown = async function defineDropdown() {
    if (customElements.get("ui-dropdown")) return;
    template = await Nexa.loadTemplate("dropdown");

    document.addEventListener("click", () => closeAll());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAll();
    });

    customElements.define(
      "ui-dropdown",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
