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
    try {
      peek = window.matchMedia("(max-width: 767px)").matches;
    } catch {
      /* ignore */
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
      viewport.scrollTo({ left: Math.max(0, left), behavior: smooth ? "smooth" : "auto" });
    }

    function sync(smooth) {
      mark();
      if (peek) {
        track.style.transform = "";
        scrollToActive(smooth);
      } else {
        track.style.transform = "translateX(" + index * -100 + "%)";
      }
    }

    function go(dir) {
      if (!slides.length) return;
      index = (index + dir + slides.length) % slides.length;
      sync(true);
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i;
        sync(true);
      });
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
        go(dx < 0 ? 1 : -1);
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
        });
      },
      { passive: true }
    );

    function onBreak(event) {
      peek = event.matches;
      sync(false);
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
    });

    el.append(node);
    sync(false);
    window.requestAnimationFrame(() => sync(false));
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
