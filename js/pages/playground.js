(function (Nexa) {
  Nexa.ready.then(function () {
    document.querySelector("[data-demo='open-modal']")?.addEventListener("click", () => {
      Nexa.emit("app:modal:open", {
        title: "Shared modal",
        body: "This dialog is the site-wide modal host. Any page can open it through the event bus.",
        size: "md",
      });
    });

    document.querySelector("[data-demo='toast-success']")?.addEventListener("click", () => {
      Nexa.emit("app:toast:show", { type: "success", message: "Saved. Toast is a shared host." });
    });

    document.querySelector("[data-demo='toast-danger']")?.addEventListener("click", () => {
      Nexa.emit("app:toast:show", { type: "danger", message: "Something went wrong." });
    });
  });
})(window.Nexa = window.Nexa || {});
