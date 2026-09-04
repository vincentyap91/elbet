(function (Nexa) {
  const LIMIT = 120;
  const SEED = [
    {
      role: "admin",
      name: "Jane",
      text: "您好，关于您的问题可以直接联系我们的 24/7 在线客服寻求帮助的哦，谢谢。",
    },
    { role: "user", name: "wh**er", text: "Hi" },
    { role: "user", name: "wh**er", text: "Hi admin" },
    { role: "user", name: "te**93", text: "Pragmatic Slots maintainance?" },
    {
      role: "admin",
      name: "Olive",
      text: "Hello te**93. Sorry for the inconvenience, PP Slots and Club are currently under emergency maintenance until further notice at the moment, please try again later or play another club for now. Thank you for your understanding.",
    },
    { role: "user", name: "jo**93", text: "Admin" },
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function messageHtml(item) {
    if (item.role === "admin") {
      return (
        '<article class="chitchat__msg chitchat__msg--admin">' +
        '<p class="chitchat__meta"><span class="chitchat__admin">(Admin) ' +
        escapeHtml(item.name) +
        '</span><span class="chitchat__verified" aria-label="Verified">' +
        Nexa.iconSvg("check") +
        "</span></p>" +
        '<p class="chitchat__body">' +
        escapeHtml(item.text) +
        "</p></article>"
      );
    }
    return (
      '<article class="chitchat__msg">' +
      '<p class="chitchat__body"><strong>' +
      escapeHtml(item.name) +
      ":</strong> " +
      escapeHtml(item.text) +
      "</p></article>"
    );
  }

  Nexa.initChat = function initChat() {
    const dock = document.querySelector(".chat-dock");
    const panel = document.querySelector("[data-chitchat]");
    if (!dock || !panel || panel.dataset.ready === "true") return;
    panel.dataset.ready = "true";

    const log = panel.querySelector("[data-chitchat-log]");
    const form = panel.querySelector("[data-chitchat-form]");
    const input = panel.querySelector("[data-chitchat-input]");
    const count = panel.querySelector("[data-chitchat-count]");
    const rulesPanel = panel.querySelector("[data-chitchat-rules-panel]");
    const pinBtn = panel.querySelector("[data-chitchat-pin]");
    const closeBtn = panel.querySelector("[data-action='chitchat-close']");
    const emojiBtn = panel.querySelector("[data-chitchat-emoji]");
    const pinnedIcon = panel.querySelector(".chitchat__pinned-icon");

    if (pinBtn) pinBtn.innerHTML = Nexa.iconSvg("pin");
    if (closeBtn) closeBtn.innerHTML = Nexa.iconSvg("close");
    if (emojiBtn) emojiBtn.innerHTML = Nexa.iconSvg("smile");
    if (pinnedIcon) pinnedIcon.innerHTML = Nexa.iconSvg("pin");

    log.innerHTML = SEED.map(messageHtml).join("");

    function triggers() {
      return Nexa.qsa("[data-action='chat-open']");
    }

    function isOpen() {
      return !panel.hidden;
    }

    function place() {
      const header = document.querySelector(".site-header");
      const trigger = document.querySelector(".site-header__chat");
      const wide = window.matchMedia("(min-width: 1024px)").matches;

      if (!wide) {
        panel.style.top = "";
        panel.style.left = "";
        panel.style.right = "";
        panel.style.width = "";
        return;
      }

      const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
      panel.style.top = top + "px";

      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const width = panel.offsetWidth || 360;
        const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
        panel.style.left = left + "px";
        panel.style.right = "auto";
        panel.style.width = "";
      }
    }

    function setOpen(open) {
      panel.hidden = !open;
      document.body.classList.toggle("is-chitchat-open", open);
      panel.setAttribute("aria-hidden", String(!open));
      panel.setAttribute(
        "aria-modal",
        window.matchMedia("(min-width: 1024px)").matches ? "false" : String(open)
      );
      triggers().forEach(function (btn) {
        btn.setAttribute("aria-expanded", String(open));
        btn.classList.toggle("is-open", open);
        if (open) btn.classList.remove("has-unread");
      });
      if (open) {
        place();
        log.scrollTop = log.scrollHeight;
        window.setTimeout(function () {
          input && input.focus();
        }, 0);
      } else if (rulesPanel) {
        rulesPanel.hidden = true;
      }
    }

    function toggle() {
      setOpen(!isOpen());
    }

    function syncCount() {
      if (!count || !input) return;
      count.textContent = input.value.length + "/" + LIMIT;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const text = (input.value || "").trim();
      if (!text) return;
      log.insertAdjacentHTML("beforeend", messageHtml({ role: "user", name: "yo**u", text: text }));
      input.value = "";
      syncCount();
      log.scrollTop = log.scrollHeight;
    });

    input.addEventListener("input", syncCount);

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    panel.querySelector("[data-chitchat-rules]").addEventListener("click", function () {
      rulesPanel.hidden = !rulesPanel.hidden;
    });

    pinBtn.addEventListener("click", function () {
      const on = pinBtn.getAttribute("aria-pressed") === "true";
      pinBtn.setAttribute("aria-pressed", String(!on));
    });

    emojiBtn.addEventListener("click", function () {
      if (!input) return;
      if (input.value.length >= LIMIT) return;
      input.value += "\u263A";
      if (input.value.length > LIMIT) input.value = input.value.slice(0, LIMIT);
      syncCount();
      input.focus();
    });

    document.addEventListener("click", function (event) {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "chat-open") {
        event.preventDefault();
        toggle();
        return;
      }
      if (action === "chitchat-close") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (action === "live-chat") {
        event.preventDefault();
        setOpen(false);
        Nexa.emit("app:toast:show", {
          type: "info",
          message: "A live agent will pick this up shortly.",
          timeout: 2200,
        });
        return;
      }
      if (isOpen() && !event.target.closest("[data-chitchat]")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (isOpen()) place();
    });

    Nexa.on("app:chitchat:toggle", toggle);
    Nexa.on("app:chitchat:open", function () {
      setOpen(true);
    });
    Nexa.on("app:chitchat:close", function () {
      setOpen(false);
    });

    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "chitchat-title");
    triggers().forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-controls", "chitchat-panel");
    });
  };
})(window.Nexa = window.Nexa || {});
