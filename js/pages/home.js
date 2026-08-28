(function (Nexa) {
  const LOOP_COPY_COUNT = 2;
  const SLIDE_INTERVAL_MS = 3000;

  const PAYOUTS = [
    { id: "payout-1", game: "Metal Slug: Hyakutaro", user: "s*******t", amount: "2.70", img: "assets/images/payouts/age-of-the-gods.png", provider: "PT" },
    { id: "payout-2", game: "Metal Slug: Hyakutaro", user: "s*******t", amount: "0.45", img: "assets/images/payouts/age-of-the-gods.png", provider: "PT" },
    { id: "payout-3", game: "Metal Slug: Hyakutaro", user: "s*******t", amount: "0.53", img: "assets/images/payouts/age-of-the-gods.png", provider: "PT" },
    { id: "payout-4", game: "Metal Slug: Hyakutaro", user: "s*******t", amount: "0.90", img: "assets/images/payouts/age-of-the-gods.png", provider: "PT" },
    { id: "payout-5", game: "Gladiators", user: "t*****2", amount: "5.00", img: "assets/images/payouts/bubble-pop.png", provider: "PT" },
    { id: "payout-6", game: "Gladiators", user: "t*****2", amount: "0.50", img: "assets/images/payouts/bubble-pop.png", provider: "PT" },
    { id: "payout-7", game: "Gladiators", user: "t*****2", amount: "1.55", img: "assets/images/payouts/bubble-pop.png", provider: "PT" },
    { id: "payout-8", game: "Ezugi", user: "s*******t", amount: "10.00", img: "assets/images/payouts/ezugi.webp", provider: "EZ" },
    { id: "payout-9", game: "Bonsai Bonanza", user: "t****w", amount: "2.00", img: "assets/images/payouts/panda-dragon-boat.png", provider: "PG" },
    { id: "payout-10", game: "Bonsai Bonanza", user: "t****w", amount: "6.00", img: "assets/images/payouts/three-little-pig.png", provider: "PG" },
  ];

  function buildLoop(payouts) {
    const loop = [];
    for (let copy = 0; copy < LOOP_COPY_COUNT; copy += 1) {
      payouts.forEach((item) => {
        loop.push(Object.assign({}, item, { loopKey: item.id + "-c" + copy }));
      });
    }
    return loop;
  }

  function cardHtml(item) {
    return (
      '<article class="recent-payout-card">' +
        '<a class="recent-payout-card__link" href="casino.html" aria-label="' + item.game + ", paid " + item.amount + '">' +
          '<div class="recent-payout-card__thumb">' +
            '<img src="' + item.img + '" alt="" loading="lazy" decoding="async" />' +
            '<span class="recent-payout-card__provider">' + item.provider + "</span>" +
          "</div>" +
          '<div class="recent-payout-card__details">' +
            '<p class="recent-payout-card__title">' + item.game + "</p>" +
            '<p class="recent-payout-card__user">' + item.user + "</p>" +
            '<p class="recent-payout-card__amount">' + item.amount + "</p>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  function initRecentPayout(root) {
    const viewport = root.querySelector("[data-payout-viewport]");
    const track = root.querySelector("[data-payout-track]");
    if (!viewport || !track || !PAYOUTS.length) return;

    const cycleLength = PAYOUTS.length;
    const loopPayouts = buildLoop(PAYOUTS);
    track.innerHTML = loopPayouts.map(cardHtml).join("");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      viewport.classList.add("recent-payout-carousel-viewport--scroll");
      track.classList.add("recent-payout-carousel-track--static");
      return;
    }

    let currentIndex = 0;
    let isTransitioning = true;
    let isPaused = false;
    let timer;

    function applyTransform() {
      track.style.transform = "translateX(calc(-1 * " + currentIndex + " * var(--payout-card-step)))";
    }

    function slideNext() {
      isTransitioning = true;
      track.classList.remove("recent-payout-carousel-track--instant");
      currentIndex += 1;
      applyTransform();
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(slideNext, SLIDE_INTERVAL_MS);
    }

    track.addEventListener("transitionend", function (event) {
      if (event.target !== track || event.propertyName !== "transform") return;
      if (currentIndex < cycleLength) return;
      isTransitioning = false;
      track.classList.add("recent-payout-carousel-track--instant");
      currentIndex = 0;
      applyTransform();
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          isTransitioning = true;
          track.classList.remove("recent-payout-carousel-track--instant");
        });
      });
    });

    root.addEventListener("mouseenter", function () {
      isPaused = true;
      window.clearInterval(timer);
    });
    root.addEventListener("mouseleave", function () {
      isPaused = false;
      startTimer();
    });
    root.addEventListener("focusin", function () {
      isPaused = true;
      window.clearInterval(timer);
    });
    root.addEventListener("focusout", function (event) {
      if (root.contains(event.relatedTarget)) return;
      isPaused = false;
      startTimer();
    });

    applyTransform();
    startTimer();
  }

  function initProviderMarquee(rail) {
    const track = rail.querySelector("[data-provider-track]");
    if (!track || track.dataset.marqueeReady === "true") return;
    track.dataset.marqueeReady = "true";

    const cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    const group = document.createElement("div");
    group.className = "provider-rail__group";
    cards.forEach(function (card) {
      group.appendChild(card);
    });
    track.appendChild(group);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      rail.classList.add("provider-rail--static");
      return;
    }

    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(clone.querySelectorAll("a"), function (link) {
      link.setAttribute("tabindex", "-1");
    });
    track.appendChild(clone);
    rail.classList.add("provider-rail--marquee");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          const entry = entries[0];
          rail.classList.toggle("provider-rail--paused", !entry || !entry.isIntersecting);
        },
        { threshold: 0 }
      );
      observer.observe(rail);
    }
  }

  Nexa.ready.then(function () {
    Nexa.qsa("[data-recent-payout]").forEach(initRecentPayout);
    Nexa.qsa("[data-provider-marquee]").forEach(initProviderMarquee);
  });
})(window.Nexa = window.Nexa || {});
