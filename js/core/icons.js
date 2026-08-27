(function (Nexa) {
  const svg = (path) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  Nexa.ICONS = {
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"/>'),
    home: svg('<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>'),
    casino: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none"/>'),
    live: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>'),
    sports: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>'),
    promo: svg('<path d="M4 12l8-8 8 3-8 13z"/><circle cx="10" cy="8" r="1.2" fill="currentColor" stroke="none"/>'),
    theme: svg('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    chevron: svg('<path d="M6 9l6 6 6-6"/>'),
    prev: svg('<path d="M15 6l-6 6 6 6"/>'),
    next: svg('<path d="M9 6l6 6-6 6"/>'),
    chat: svg('<path d="M5 6h14v10H8l-3 3z"/>'),
    check: svg('<path d="M5 12l5 5 9-10"/>'),
    alert: svg('<path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 17h.01"/>'),
    info: svg('<circle cx="12" cy="12" r="8"/><path d="M12 11v6M12 8h.01"/>'),
    empty: svg('<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 10h16"/>'),
    dots: svg('<circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
  };

  Nexa.iconSvg = function iconSvg(name) {
    return Nexa.ICONS[name] || Nexa.ICONS.dots;
  };
})(window.Nexa = window.Nexa || {});
