(function (Nexa) {
  const FAILSAFE_MS = 3000;

  async function start() {
    const failsafe = window.setTimeout(() => {
      document.documentElement.classList.add("is-ready");
    }, FAILSAFE_MS);

    Nexa.initTheme();
    Nexa.hydrate();

    try {
      await Nexa.boot();
    } catch (error) {
      console.error("App boot failed", error);
    }

    window.clearTimeout(failsafe);
    document.documentElement.classList.add("is-ready");
    Nexa.markReady();
    Nexa.emit("app:ready");
  }

  start();
})(window.Nexa = window.Nexa || {});
