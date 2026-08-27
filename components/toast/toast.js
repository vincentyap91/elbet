(function (Nexa) {
  function getRoot() {
    return Nexa.qs("[data-toast-root]");
  }

  function show(detail) {
    detail = detail || {};
    const root = getRoot();
    if (!root) return;

    const toast = document.createElement("div");
    toast.className = `toast toast--${detail.type || "info"}`;

    const message = document.createElement("p");
    message.className = "toast__message";
    Nexa.setText(message, detail.message || "");

    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast__close";
    close.setAttribute("aria-label", "Dismiss");
    close.innerHTML = Nexa.iconSvg("close");
    close.addEventListener("click", () => toast.remove());

    toast.append(message, close);
    root.append(toast);

    const timeout = detail.timeout === 0 ? 0 : detail.timeout || 3200;
    if (timeout) {
      window.setTimeout(() => toast.remove(), timeout);
    }
  }

  Nexa.initToast = function initToast() {
    const root = getRoot();
    if (!root || root.dataset.ready === "true") return;
    root.dataset.ready = "true";
    Nexa.on("app:toast:show", (event) => show(event.detail));
  };
})(window.Nexa = window.Nexa || {});
