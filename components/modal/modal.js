(function (Nexa) {
  function getRoot() {
    return Nexa.qs("[data-modal-root]");
  }

  function close() {
    const root = getRoot();
    if (!root) return;
    root.hidden = true;
    document.body.classList.remove("is-modal-open");
    root.classList.remove("modal--alert");
    const dialog = Nexa.qs("[data-ref='dialog']", root);
    if (dialog) dialog.classList.remove("modal__dialog--sm", "modal__dialog--lg", "modal__dialog--alert");
    Nexa.emit("app:modal:closed");
  }

  function open(detail) {
    detail = detail || {};
    const root = getRoot();
    if (!root) return;
    const dialog = Nexa.qs("[data-ref='dialog']", root);
    const body = Nexa.qs("[data-ref='body']", root);
    const footer = Nexa.qs("[data-ref='footer']", root);

    dialog.classList.remove("modal__dialog--sm", "modal__dialog--lg", "modal__dialog--alert");
    root.classList.remove("modal--alert");
    dialog.setAttribute("aria-labelledby", "modal-title");
    dialog.removeAttribute("aria-label");
    if (detail.size === "sm" || detail.size === "lg") {
      dialog.classList.add(`modal__dialog--${detail.size}`);
    }
    if (detail.variant === "alert") {
      root.classList.add("modal--alert");
      dialog.classList.add("modal__dialog--alert");
      if (detail.size !== "lg") dialog.classList.add("modal__dialog--sm");
    }

    const titleEl = Nexa.qs("[data-ref='title']", root);
    Nexa.setText(titleEl, detail.title || "");
    if (titleEl) titleEl.hidden = !detail.title;
    if (!detail.title) {
      dialog.removeAttribute("aria-labelledby");
      dialog.setAttribute("aria-label", detail.label || "Alert");
    }

    body.replaceChildren();
    footer.replaceChildren();

    if (detail.body instanceof Node) {
      body.append(detail.body);
    } else {
      Nexa.setText(body, detail.body || "");
    }

    if (detail.footer instanceof Node) {
      footer.append(detail.footer);
    }

    root.hidden = false;
    document.body.classList.add("is-modal-open");
  }

  Nexa.initModal = function initModal() {
    const root = getRoot();
    if (!root || root.dataset.ready === "true") return;
    root.dataset.ready = "true";

    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-action='modal-close']")) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !root.hidden) close();
    });

    Nexa.on("app:modal:open", (event) => open(event.detail));
    Nexa.on("app:modal:close", close);
  };
})(window.Nexa = window.Nexa || {});
