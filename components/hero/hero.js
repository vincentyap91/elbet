(function (Nexa) {
  let template;

  function render(el) {
    if (el.dataset.ready === "true") return;
    el.dataset.ready = "true";

    const slides = Nexa.takeChildren(el).filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const node = Nexa.cloneTemplate(template);
    const track = Nexa.qs("[data-ref='track']", node);
    const prev = Nexa.qs("[data-ref='prev']", node);
    const next = Nexa.qs("[data-ref='next']", node);
    const dotsWrap = Nexa.qs("[data-ref='dots']", node);
    const viewport = Nexa.qs(".hero__viewport", node);
    const stage = Nexa.qs(".hero__stage", node);

    slides.forEach((slide) => {
      slide.classList.add("hero__slide");
      track.append(slide);
    });

    prev.innerHTML = '<img src="assets/images/icons/banner-arrow-left.png" alt="" />';
    next.innerHTML = '<img src="assets/images/icons/banner-arrow-right.png" alt="" />';

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero__dot";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      if (dotsWrap) dotsWrap.append(dot);
      return dot;
    });
    if (dotsWrap && dots.length > 1) dotsWrap.hidden = false;

    let index = 0;
    let peek = false;
    let autoTimer = 0;
    let resumeTimer = 0;
    let autoScrolling = false;
    let hovering = false;
    const AUTO_MS = 4000;

    try {
      peek = window.matchMedia("(max-width: 767px)").matches;
    } catch {
      /* ignore */
    }

    function reducedMotion() {
      try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        return false;
      }
    }

    function fineHover() {
      try {
        return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      } catch {
        return false;
      }
    }

    function pageReady() {
      return document.documentElement.classList.contains("is-ready");
    }

    function mark() {
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach((dot, i) => {
        const on = i === index;
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function scrollToActive(smooth) {
      const slide = slides[index];
      if (!slide) return;
      const left = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
      autoScrolling = true;
      viewport.scrollTo({
        left: Math.max(0, left),
        behavior: smooth && !reducedMotion() ? "smooth" : "auto",
      });
      window.setTimeout(function () {
        autoScrolling = false;
      }, smooth && !reducedMotion() ? 700 : 50);
    }

    function setTransform(animate) {
      if (reducedMotion()) {
        track.classList.remove("is-instant");
        track.style.transform = "";
        return;
      }
      const next = "translate3d(" + -index * 100 + "%,0,0)";
      if (!animate) {
        track.classList.add("is-instant");
        track.style.transform = next;
        void track.offsetWidth;
        track.classList.remove("is-instant");
        return;
      }
      track.classList.remove("is-instant");
      track.style.transform = next;
    }

    function paint(animate) {
      mark();
      if (peek) {
        track.style.transform = "";
        track.classList.remove("is-instant");
        scrollToActive(animate);
        return;
      }
      setTransform(animate);
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearTimeout(autoTimer);
        autoTimer = 0;
      }
      el.dataset.heroAuto = "off";
    }

    function clearResume() {
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = 0;
      }
    }

    function canAuto() {
      if (slides.length < 2) return false;
      if (!pageReady()) return false;
      if (document.hidden) return false;
      if (hovering && fineHover() && !peek) return false;
      return true;
    }

    function tick() {
      autoTimer = 0;
      if (!canAuto()) return;
      go(1, false);
      scheduleAuto();
    }

    function scheduleAuto() {
      if (autoTimer || !canAuto()) return;
      autoTimer = window.setTimeout(tick, AUTO_MS);
      el.dataset.heroAuto = "on";
    }

    function startAuto() {
      if (!canAuto()) return;
      if (autoTimer) return;
      scheduleAuto();
    }

    function restartAuto() {
      stopAuto();
      clearResume();
      startAuto();
    }

    function go(dir, fromUser) {
      if (!slides.length) return;
      const prevIndex = index;
      index = (index + dir + slides.length) % slides.length;
      const wrapped = Math.abs(index - prevIndex) > 1;
      paint(!wrapped);
      if (fromUser) restartAuto();
    }

    function goTo(i, fromUser) {
      if (!slides.length) return;
      const prevIndex = index;
      index = ((i % slides.length) + slides.length) % slides.length;
      const wrapped = Math.abs(index - prevIndex) > 1;
      paint(!wrapped);
      if (fromUser) restartAuto();
    }

    prev.addEventListener("click", () => go(-1, true));
    next.addEventListener("click", () => go(1, true));
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => goTo(i, true));
    });

    let touchX = null;
    viewport.addEventListener(
      "touchstart",
      (event) => {
        if (peek) return;
        touchX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      (event) => {
        if (peek || touchX == null) return;
        const dx = event.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) return;
        go(dx < 0 ? 1 : -1, true);
      },
      { passive: true }
    );

    let scrollTick = 0;
    viewport.addEventListener(
      "scroll",
      () => {
        if (!peek) return;
        window.cancelAnimationFrame(scrollTick);
        scrollTick = window.requestAnimationFrame(() => {
          const mid = viewport.scrollLeft + viewport.clientWidth / 2;
          let nearest = 0;
          let best = Infinity;
          slides.forEach((slide, i) => {
            const center = slide.offsetLeft + slide.offsetWidth / 2;
            const dist = Math.abs(center - mid);
            if (dist < best) {
              best = dist;
              nearest = i;
            }
          });
          if (nearest !== index) {
            index = nearest;
            mark();
          }
          if (!autoScrolling) {
            stopAuto();
            clearResume();
            resumeTimer = window.setTimeout(restartAuto, 1500);
          }
        });
      },
      { passive: true }
    );

    if (stage) {
      stage.addEventListener("mouseenter", () => {
        if (!fineHover() || peek) return;
        hovering = true;
        stopAuto();
      });
      stage.addEventListener("mouseleave", () => {
        if (!fineHover() || peek) return;
        hovering = false;
        startAuto();
      });
    }

    function onBreak(event) {
      peek = event.matches;
      paint(false);
      restartAuto();
    }

    try {
      const mq = window.matchMedia("(max-width: 767px)");
      if (mq.addEventListener) mq.addEventListener("change", onBreak);
      else mq.addListener(onBreak);
    } catch {
      /* ignore */
    }

    window.addEventListener("resize", () => {
      if (peek) scrollToActive(false);
      else paint(false);
    });

    el.append(node);
    paint(false);
    window.requestAnimationFrame(() => paint(false));

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    function armAuto() {
      startAuto();
    }
    Nexa.on("app:ready", armAuto);
    if (Nexa.ready && typeof Nexa.ready.then === "function") Nexa.ready.then(armAuto);
    if (pageReady()) armAuto();
    else {
      const readyWatch = new MutationObserver(function () {
        if (!pageReady()) return;
        readyWatch.disconnect();
        armAuto();
      });
      readyWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }
  }

  Nexa.defineHero = async function defineHero() {
    if (customElements.get("ui-hero")) return;
    template = await Nexa.loadTemplate("hero");
    customElements.define(
      "ui-hero",
      class extends HTMLElement {
        connectedCallback() {
          render(this);
        }
      }
    );
  };
})(window.Nexa = window.Nexa || {});
