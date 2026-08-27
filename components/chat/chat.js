(function (Nexa) {
  Nexa.initChat = function initChat() {
    const dock = document.querySelector(".chat-dock");
    if (!dock || dock.dataset.ready === "true") return;
    dock.dataset.ready = "true";

    const icon = dock.querySelector("[data-icon]");
    if (icon) icon.innerHTML = Nexa.iconSvg(icon.dataset.icon);

    dock.addEventListener("click", () => {
      Nexa.emit("app:toast:show", {
        type: "info",
        message: "Chat placeholder",
        timeout: 2200,
      });
    });
  };
})(window.Nexa = window.Nexa || {});
