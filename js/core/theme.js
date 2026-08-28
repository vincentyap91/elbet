(function (Nexa) {
  const KEY = "elbet:theme";

  Nexa.getTheme = function getTheme() {
    return document.documentElement.dataset.theme || "dark";
  };

  Nexa.applyTheme = function applyTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore private mode */
    }
    Nexa.emit("app:theme:changed", { theme: next });
    return next;
  };

  Nexa.toggleTheme = function toggleTheme() {
    return Nexa.applyTheme(Nexa.getTheme() === "dark" ? "light" : "dark");
  };

  Nexa.initTheme = function initTheme() {
    let stored = "dark";
    try {
      stored = localStorage.getItem(KEY) || "dark";
    } catch {
      stored = "dark";
    }
    Nexa.applyTheme(stored);
  };
})(window.Nexa = window.Nexa || {});
