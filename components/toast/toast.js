(function (Nexa) {
  function getRoot() {
    return Nexa.qs("[data-toast-root]");
  }

  function motionMs() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 200;
  }

  function dismiss(toast) {
    if (!toast || toast.dataset.leaving === "1") return;
    toast.dataset.leaving = "1";
    toast.classList.remove("is-open");
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      toast.remove();
    }
    toast.addEventListener("transitionend", function onEnd(event) {
      if (event.target !== toast) return;
      if (event.propertyName !== "transform" && event.propertyName !== "opacity") return;
      toast.removeEventListener("transitionend", onEnd);
      finish();
    });
    window.setTimeout(finish, motionMs() + 40);
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
    close.addEventListener("click", () => dismiss(toast));

    toast.append(message, close);
    root.append(toast);
    void toast.offsetWidth;
    toast.classList.add("is-open");

    const timeout = detail.timeout === 0 ? 0 : detail.timeout || 3200;
    if (timeout) {
      window.setTimeout(() => dismiss(toast), timeout);
    }
  }

  Nexa.initToast = function initToast() {
    const root = getRoot();
    if (!root || root.dataset.ready === "true") return;
    root.dataset.ready = "true";
    Nexa.on("app:toast:show", (event) => show(event.detail));
  };
})(window.Nexa = window.Nexa || {});
