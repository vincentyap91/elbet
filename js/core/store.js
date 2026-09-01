(function (Nexa) {
  const KEY = "elbet:store";
  const AUTH_FILE = /^[a-z0-9][a-z0-9._-]*\.html$/i;
  const AUTH_BLOCKED = /^(login|register|forgot-password)\.html$/i;

  const state = {
    theme: "dark",
    isLoggedIn: false,
    username: "",
    displayName: "",
    vipTier: "Bronze",
    balance: 0,
    betSlipCount: 0,
  };

  function applyAuthClass() {
    const on = !!state.isLoggedIn;
    document.documentElement.classList.toggle("is-logged-in", on);
    if (document.body) document.body.classList.toggle("is-logged-in", on);
  }

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
    if (key === "isLoggedIn") {
      applyAuthClass();
      Nexa.emit("app:auth:changed", { isLoggedIn: value });
    }
    return value;
  };

  function persist() {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          isLoggedIn: state.isLoggedIn,
          username: state.username,
          displayName: state.displayName,
          vipTier: state.vipTier,
          balance: state.balance,
          betSlipCount: state.betSlipCount,
        })
      );
    } catch {
      /* ignore */
    }
  }

  Nexa.login = function login(profile) {
    const name = String((profile && profile.username) || "").trim() || "Player";
    state.username = name;
    state.displayName = String((profile && profile.displayName) || name).trim() || name;
    state.vipTier = String((profile && profile.vipTier) || "Bronze");
    if (profile && typeof profile.balance === "number") {
      state.balance = profile.balance;
    } else if (!state.balance) {
      state.balance = 16.06;
    }
    Nexa.set("isLoggedIn", true);
  };

  Nexa.logout = function logout() {
    state.username = "";
    state.displayName = "";
    state.vipTier = "Bronze";
    Nexa.set("isLoggedIn", false);
  };

  Nexa.hydrate = function hydrate() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (typeof saved.isLoggedIn === "boolean") state.isLoggedIn = saved.isLoggedIn;
      if (typeof saved.username === "string") state.username = saved.username;
      if (typeof saved.displayName === "string") state.displayName = saved.displayName;
      if (typeof saved.vipTier === "string") state.vipTier = saved.vipTier;
      if (typeof saved.balance === "number") state.balance = saved.balance;
      if (typeof saved.betSlipCount === "number") state.betSlipCount = saved.betSlipCount;
    } catch {
      /* ignore */
    }
    applyAuthClass();
  };

  Nexa.safeNext = function safeNext(raw) {
    if (!raw) return "index.html";
    const decoded = String(raw).trim();
    if (!decoded || decoded.indexOf("//") === 0) return "index.html";
    if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return "index.html";
    let file = decoded.split("?")[0].split("#")[0].replace(/^\.\//, "");
    file = file.replace(/^.*\//, "");
    if (!AUTH_FILE.test(file) || AUTH_BLOCKED.test(file)) return "index.html";
    const rest = decoded.slice(decoded.indexOf(file) + file.length);
    if (rest && !/^[?#]/.test(rest)) return "index.html";
    return file + rest;
  };

  Nexa.loginUrl = function loginUrl(next) {
    return "login.html?next=" + encodeURIComponent(Nexa.safeNext(next));
  };

  Nexa.currentNext = function currentNext(flag) {
    let file = location.pathname.split("/").pop() || "index.html";
    if (!AUTH_FILE.test(file)) file = "index.html";
    const params = new URLSearchParams(location.search);
    if (flag === "voucher") params.set("voucher", "1");
    const query = params.toString();
    return file + (query ? "?" + query : "") + (location.hash || "");
  };

  Nexa.requireAuth = function requireAuth(next) {
    if (Nexa.get("isLoggedIn")) return true;
    window.location.href = Nexa.loginUrl(next || Nexa.currentNext());
    return false;
  };

  Nexa.openVoucherModal = function openVoucherModal() {
    const body = document.createElement("div");
    body.className = "voucher-modal";
    body.innerHTML =
      '<label class="field">' +
      '<span class="sr-only">Redemption code</span>' +
      '<input class="field__control" type="text" data-voucher-code placeholder="Enter redemption code" autocomplete="off" />' +
      "</label>" +
      '<ol class="voucher-modal__rules">' +
      "<li>Users must verify email address and phone number to redeem the voucher code.</li>" +
      "<li>Users who redeem this voucher code cannot change their registered name. We strongly recommend that users use their full name as per IC when claiming the voucher to avoid any issues with withdrawal after winning.</li>" +
      "</ol>";

    const footer = document.createElement("button");
    footer.type = "button";
    footer.className = "btn btn--primary btn--full";
    footer.textContent = "Submit";
    footer.addEventListener("click", function () {
      const input = body.querySelector("[data-voucher-code]");
      const code = input && input.value.trim();
      if (!code) {
        Nexa.emit("app:toast:show", { type: "warning", message: "Enter a redemption code." });
        return;
      }
      Nexa.emit("app:modal:close");
      Nexa.emit("app:toast:show", { type: "success", message: "Voucher submitted." });
    });

    Nexa.emit("app:modal:open", {
      title: "Voucher (Promo Code)",
      size: "sm",
      body: body,
      footer: footer,
    });
  };
})(window.Nexa = window.Nexa || {});
