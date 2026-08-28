(function (Nexa) {
  const KEY = "elbet:store";

  const state = {
    theme: "dark",
    isLoggedIn: false,
    balance: 0,
    betSlipCount: 0,
  };

  Nexa.get = function get(key) {
    return state[key];
  };

  Nexa.snapshot = function snapshot() {
    return { ...state };
  };

  Nexa.set = function set(key, value) {
    state[key] = value;
    persist();
    Nexa.emit("app:store:changed", { key, value });
    if (key === "isLoggedIn") Nexa.emit("app:auth:changed", { isLoggedIn: value });
    return value;
  };

  function persist() {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          isLoggedIn: state.isLoggedIn,
          balance: state.balance,
          betSlipCount: state.betSlipCount,
        })
      );
    } catch {
      /* ignore */
    }
  }

  Nexa.hydrate = function hydrate() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (typeof saved.isLoggedIn === "boolean") state.isLoggedIn = saved.isLoggedIn;
      if (typeof saved.balance === "number") state.balance = saved.balance;
      if (typeof saved.betSlipCount === "number") state.betSlipCount = saved.betSlipCount;
    } catch {
      /* ignore */
    }
  };
})(window.Nexa = window.Nexa || {});
