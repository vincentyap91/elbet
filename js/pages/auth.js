(function (Nexa) {
  const SEND_WAIT_MS = 60000;

  function setIdle(button, idle) {
    if (!button) return;
    button.classList.toggle("is-idle", idle);
  }

  function filled(form) {
    return Nexa.qsa("input", form)
      .filter(function (input) {
        return input.offsetParent !== null && !input.disabled;
      })
      .every(function (input) {
        return input.value.trim().length > 0;
      });
  }

  function syncSubmit(form) {
    const idle = !filled(form);
    Nexa.qsa("[data-auth-submit]", form).forEach(function (button) {
      setIdle(button, idle);
    });
  }

  function switchPane(root, name) {
    Nexa.qsa("[data-auth-method]", root).forEach(function (btn) {
      const on = btn.getAttribute("data-auth-method") === name;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    Nexa.qsa("[data-auth-pane]", root).forEach(function (pane) {
      pane.hidden = pane.getAttribute("data-auth-pane") !== name;
    });
    Nexa.qsa("[data-auth-forgot]", root).forEach(function (link) {
      link.hidden = name === "sms" || name === "whatsapp";
    });
    const form = root.querySelector("[data-auth-form]");
    if (form) syncSubmit(form);
  }

  function bindMethods(root) {
    Nexa.qsa("[data-auth-method]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchPane(root, btn.getAttribute("data-auth-method"));
      });
    });
  }

  function bindReveal(root) {
    Nexa.qsa("[data-auth-reveal]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        const input = btn.parentElement.querySelector("input");
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.textContent = show ? "Hide" : "Show";
      });
    });
  }

  function bindSend(root) {
    Nexa.qsa("[data-auth-send]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        const pane =
          root.querySelector("[data-auth-pane]:not([hidden])") ||
          root.querySelector("[data-auth-step]:not([hidden])");
        const identity = pane && pane.querySelector("input");
        if (identity && !identity.value.trim()) {
          identity.focus();
          return;
        }
        let left = Math.floor(SEND_WAIT_MS / 1000);
        btn.disabled = true;
        btn.textContent = left + "s";
        const timer = window.setInterval(function () {
          left -= 1;
          if (left <= 0) {
            window.clearInterval(timer);
            btn.disabled = false;
            btn.textContent = "Send";
            return;
          }
          btn.textContent = left + "s";
        }, 1000);
      });
    });
  }

  function showLoginError() {
    const body = document.createElement("div");
    body.className = "auth-alert";
    body.innerHTML =
      '<div class="auth-alert__mark" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>' +
      "</div>" +
      '<p class="auth-alert__copy">[E-12] - Invalid Username or Password.<br />Attempts remaining : 0</p>';

    const footer = document.createElement("button");
    footer.type = "button";
    footer.className = "btn btn--primary";
    footer.textContent = "Ok";
    footer.setAttribute("data-action", "modal-close");

    Nexa.emit("app:modal:open", {
      title: "",
      label: "Sign-in error",
      variant: "alert",
      size: "sm",
      body: body,
      footer: footer,
    });
  }

  function initLogin(root) {
    bindMethods(root);
    bindReveal(root);
    bindSend(root);
    const form = root.querySelector("[data-auth-form]");
    if (!form) return;
    form.addEventListener("input", function () {
      syncSubmit(form);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!filled(form)) return;
      const pane = root.querySelector("[data-auth-pane]:not([hidden])") || form;
      const identity = pane.querySelector("input");
      const name = identity && identity.value.trim();
      if (!name) {
        showLoginError();
        return;
      }
      Nexa.login({ username: name, displayName: name, vipTier: "Bronze", balance: 16.06 });
      var next = new URLSearchParams(window.location.search).get("next");
      window.location.href = typeof Nexa.safeNext === "function" ? Nexa.safeNext(next) : next || "index.html";
    });
    syncSubmit(form);
  }

  function initForgot(root) {
    bindMethods(root);
    bindSend(root);
    const form = root.querySelector("[data-auth-form]");
    if (!form) return;
    form.addEventListener("input", function () {
      syncSubmit(form);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!filled(form)) return;
      Nexa.emit("app:toast:show", {
        type: "success",
        message: "If that account exists, a reset code is on the way.",
      });
    });
    syncSubmit(form);
  }

  function showStep(root, step) {
    Nexa.qsa("[data-auth-step]", root).forEach(function (pane) {
      pane.hidden = pane.getAttribute("data-auth-step") !== step;
    });
    const form = root.querySelector("[data-auth-form]");
    if (form) syncSubmit(form);
  }

  function initRegister(root) {
    bindSend(root);
    bindReveal(root);
    const form = root.querySelector("[data-auth-form]");
    if (!form) return;
    form.addEventListener("input", function () {
      syncSubmit(form);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!filled(form)) return;
      const current = root.querySelector("[data-auth-step]:not([hidden])");
      const step = current && current.getAttribute("data-auth-step");
      if (step === "1") {
        showStep(root, "2");
        return;
      }
      Nexa.emit("app:toast:show", {
        type: "success",
        message: "Account created. You can sign in now.",
      });
      window.setTimeout(function () {
        window.location.href = "login.html";
      }, 900);
    });
    showStep(root, "1");
  }

  Nexa.ready.then(function () {
    const page = document.querySelector("[data-page]");
    const name = page && page.dataset.page;
    if (name === "login") initLogin(page);
    if (name === "forgot") initForgot(page);
    if (name === "register") initRegister(page);
  });
})(window.Nexa = window.Nexa || {});
