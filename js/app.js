(function (Nexa) {
  const FAILSAFE_MS = 3000;
  const AUTH_FILE = /^[a-z0-9][a-z0-9._-]*\.html$/i;
  const AUTH_BLOCKED = /^(login|register|forgot-password)\.html$/i;

  function ensureAuthApi() {
    if (typeof Nexa.safeNext !== "function") {
      Nexa.safeNext = function safeNext(raw) {
        if (!raw) return "index.html";
        var decoded = String(raw).trim();
        if (!decoded || decoded.indexOf("//") === 0) return "index.html";
        if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return "index.html";
        var file = decoded.split("?")[0].split("#")[0].replace(/^\.\//, "");
        file = file.replace(/^.*\//, "");
        if (!AUTH_FILE.test(file) || AUTH_BLOCKED.test(file)) return "index.html";
        var rest = decoded.slice(decoded.indexOf(file) + file.length);
        if (rest && !/^[?#]/.test(rest)) return "index.html";
        return file + rest;
      };
    }
    if (typeof Nexa.loginUrl !== "function") {
      Nexa.loginUrl = function loginUrl(next) {
        return "login.html?next=" + encodeURIComponent(Nexa.safeNext(next));
      };
    }
    if (typeof Nexa.currentNext !== "function") {
      Nexa.currentNext = function currentNext(flag) {
        var file = location.pathname.split("/").pop() || "index.html";
        if (!AUTH_FILE.test(file)) file = "index.html";
        var params = new URLSearchParams(location.search);
        params.delete("figma-capture");
        if (flag === "voucher") params.set("voucher", "1");
        var query = params.toString();
        return file + (query ? "?" + query : "") + (location.hash || "");
      };
    }
    if (typeof Nexa.requireAuth !== "function") {
      Nexa.requireAuth = function requireAuth(next) {
        if (Nexa.get("isLoggedIn")) return true;
        window.location.href = Nexa.loginUrl(next || Nexa.currentNext());
        return false;
      };
    }
    if (typeof Nexa.login !== "function") {
      Nexa.login = function login(profile) {
        var name = String((profile && profile.username) || "").trim() || "Player";
        Nexa.set("username", name);
        Nexa.set("displayName", String((profile && profile.displayName) || name).trim() || name);
        Nexa.set("vipTier", String((profile && profile.vipTier) || "Bronze"));
        if (profile && typeof profile.balance === "number") Nexa.set("balance", profile.balance);
        else if (!Nexa.get("balance")) Nexa.set("balance", 16.06);
        Nexa.set("isLoggedIn", true);
      };
    }
    if (typeof Nexa.logout !== "function") {
      Nexa.logout = function logout() {
        Nexa.set("username", "");
        Nexa.set("displayName", "");
        Nexa.set("vipTier", "Bronze");
        Nexa.set("isLoggedIn", false);
      };
    }
    if (typeof Nexa.openVoucherModal !== "function") {
      Nexa.openVoucherModal = function openVoucherModal() {
        var body = document.createElement("div");
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
        var footer = document.createElement("button");
        footer.type = "button";
        footer.className = "btn btn--primary btn--full";
        footer.textContent = "Submit";
        footer.addEventListener("click", function () {
          var input = body.querySelector("[data-voucher-code]");
          var code = input && input.value.trim();
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
    }
  }

  const SPLASH_CYCLE_MS = 2000;
  const SPLASH_EXIT_MS = 320;
  let revealPromise = null;

  function hideSplash(urgent) {
    if (typeof Nexa.cancelBootSplash === "function") Nexa.cancelBootSplash();

    if (
      !urgent &&
      typeof Nexa.holdBootSplash === "function" &&
      Nexa.holdBootSplash()
    ) {
      document.documentElement.classList.add("is-ready");
      var held = document.getElementById("boot-splash");
      if (held && !held.dataset.holdBound) {
        held.dataset.holdBound = "1";
        held.classList.add("is-visible");
        held.addEventListener("click", function () {
          revealPromise = null;
          hideSplash(true);
        });
      }
      return Promise.resolve();
    }

    if (revealPromise) return revealPromise;

    revealPromise = new Promise(function (resolve) {
      const html = document.documentElement;
      const splash = document.getElementById("boot-splash");

      function leave() {
        html.classList.add("is-ready");
        if (!splash || !splash.parentNode) {
          resolve();
          return;
        }
        if (!splash.classList.contains("is-visible")) {
          splash.remove();
          resolve();
          return;
        }
        splash.classList.add("is-leaving");
        splash.setAttribute("aria-hidden", "true");
        window.setTimeout(function () {
          if (splash.parentNode) splash.remove();
          resolve();
        }, SPLASH_EXIT_MS);
      }

      if (!splash) {
        leave();
        return;
      }

      var reduced = false;
      try {
        reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        /* ignore */
      }

      function remainingCycle() {
        var start = Nexa.splashAnimAt || Nexa.splashMarkAt || Nexa.splashAt || performance.now();
        return Math.max(0, SPLASH_CYCLE_MS - (performance.now() - start));
      }

      function finishCycle() {
        html.classList.add("is-ready");
        var wait = 0;
        try {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) wait = 0;
          else if (urgent && typeof Nexa.holdBootSplash === "function" && Nexa.holdBootSplash()) wait = 0;
          else wait = remainingCycle();
        } catch {
          wait = remainingCycle();
        }
        window.setTimeout(leave, wait);
      }

      if (splash.classList.contains("is-visible") && (Nexa.splashAnimAt || reduced)) {
        finishCycle();
        return;
      }

      var tries = 0;
      var poll = window.setInterval(function () {
        tries += 1;
        if (
          !splash.parentNode ||
          (splash.classList.contains("is-visible") && (Nexa.splashAnimAt || reduced)) ||
          tries > 40
        ) {
          window.clearInterval(poll);
          finishCycle();
        }
      }, 50);
    });

    return revealPromise;
  }

  async function start() {
    const failsafe = window.setTimeout(() => {
      if (typeof Nexa.holdBootSplash === "function" && Nexa.holdBootSplash()) return;
      hideSplash(true);
    }, FAILSAFE_MS);

    Nexa.initTheme();
    Nexa.hydrate();
    ensureAuthApi();

    if (document.querySelector("[data-require-auth]") && !Nexa.get("isLoggedIn")) {
      if (typeof Nexa.isFigmaCapture === "function" && Nexa.isFigmaCapture()) {
        Nexa.login({ username: "Player", displayName: "Player", vipTier: "Bronze", balance: 16.06 });
      } else {
        window.location.replace(Nexa.loginUrl(Nexa.currentNext()));
        return;
      }
    }

    try {
      await Nexa.boot();
    } catch (error) {
      console.error("App boot failed", error);
    }

    document.addEventListener(
      "click",
      function (event) {
        var required = event.target.closest("[data-auth-required]");
        if (!required || Nexa.get("isLoggedIn")) return;
        event.preventDefault();
        var href = required.getAttribute("href");
        Nexa.requireAuth(href || Nexa.currentNext());
      },
      true
    );

    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get("voucher") === "1" && Nexa.get("isLoggedIn")) {
        params.delete("voucher");
        var clean = location.pathname.split("/").pop() || "index.html";
        var query = params.toString();
        history.replaceState({}, "", clean + (query ? "?" + query : "") + location.hash);
        Nexa.openVoucherModal();
      }
    } catch {
      /* ignore */
    }

    window.clearTimeout(failsafe);
    await hideSplash();
    Nexa.markReady();
    Nexa.emit("app:ready");
  }

  start();
})(window.Nexa = window.Nexa || {});
