(function (Nexa) {
  const svg = (path) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  Nexa.ICONS = {
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"/>'),
    profile:
      '<svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"><path d="M10 0C4.579 0 0 4.579 0 10C0 15.421 4.579 20 10 20C15.421 20 20 15.421 20 10C20 4.579 15.421 0 10 0ZM10 5C11.727 5 13 6.272 13 8C13 9.728 11.727 11 10 11C8.274 11 7 9.728 7 8C7 6.272 8.274 5 10 5ZM4.894 14.772C5.791 13.452 7.287 12.572 9 12.572H11C12.714 12.572 14.209 13.452 15.106 14.772C13.828 16.14 12.015 17 10 17C7.985 17 6.172 16.14 4.894 14.772Z"/></svg>',
    home: svg('<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>'),
    wallet: svg('<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 10h18M16 13.5h2"/>'),
    headset: svg('<path d="M4 13a8 8 0 0116 0"/><path d="M4 13v3a2 2 0 002 2h1v-7H6a2 2 0 00-2 2z"/><path d="M20 13v3a2 2 0 01-2 2h-1v-7h1a2 2 0 012 2z"/>'),
    casino: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none"/>'),
    live: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>'),
    sports: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>'),
    promo: svg('<path d="M4 12l8-8 8 3-8 13z"/><circle cx="10" cy="8" r="1.2" fill="currentColor" stroke="none"/>'),
    theme: svg('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    chevron: svg('<path d="M6 9l6 6 6-6"/>'),
    prev: svg('<path d="M15 6l-6 6 6 6"/>'),
    next: svg('<path d="M9 6l6 6-6 6"/>'),
    mail: svg('<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 8l8 6 8-6"/>'),
    chat: svg('<path d="M5 6h14v10H8l-3 3z"/>'),
    message: svg('<path d="M5 6h14v10H8l-3 3z"/>'),
    pin: svg('<path d="M9 4h6l-1 6h3l-5 5-5-5h3L9 4z"/><path d="M12 15v5"/>'),
    smile: svg('<circle cx="12" cy="12" r="8"/><path d="M8.5 14s1.5 2 3.5 2 3.5-2 3.5-2"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>'),
    whatsapp: svg('<path d="M6.5 18.5l-1.2 3 3.2-1.1A8 8 0 1 0 6.5 18.5z"/><path d="M9.2 10.2c.2-.4.3-.4.6-.4h.5c.2 0 .4.1.5.3l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .4 1 1.4 2.3 2.4 3.8 3.1.2.1.4 0 .5-.1l.6-.5c.2-.1.4-.1.6 0l1.4.8c.2.1.3.3.2.6v.5c0 .3-.1.5-.4.6-1.4.6-3 .4-4.6-.4-1.7-.9-3.2-2.3-4.2-4.1-.8-1.4-1-2.9-.5-4.2z"/>'),
    check: svg('<path d="M5 12l5 5 9-10"/>'),
    trophy: svg(
      '<path d="M8 4h8v3.2A4 4 0 0112 11a4 4 0 01-4-3.8V4z"/><path d="M8 6H6.2A2.2 2.2 0 008.4 8.4"/><path d="M16 6h1.8A2.2 2.2 0 0115.6 8.4"/><path d="M12 11v3"/><path d="M9.5 19h5"/><path d="M10 14h4v5h-4z"/>'
    ),
    logout: svg('<path d="M9 7H7a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M15 12H9"/><path d="M13 9l4 3-4 3"/>'),
    alert: svg('<path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 17h.01"/>'),
    info: svg('<circle cx="12" cy="12" r="8"/><path d="M12 11v6M12 8h.01"/>'),
    empty: svg('<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 10h16"/>'),
    history: svg('<path d="M4.8 12a7.2 7.2 0 107.2-7.2"/><path d="M4 6.5V12h5.2"/><path d="M12 8v4.2l2.8 1.6"/>'),
    card: svg('<rect x="3" y="7" width="14" height="10" rx="2"/><path d="M3 11h14M7 14h3"/><path d="M19 9c1.2 1.2 1.2 3.2 0 4.4"/><path d="M20.8 7.2c2.2 2.2 2.2 5.8 0 8"/>'),
    bank: svg('<path d="M4 10l8-6 8 6"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/><path d="M4 18h16"/>'),
    crypto: svg('<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>'),
    qr: svg('<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="M13 13h3v3h-3zM18 13h2M13 18h2M17 17h3v3h-3z"/>'),
    atm: svg('<rect x="5" y="4" width="14" height="16" rx="2"/><rect x="8" y="7" width="8" height="5" rx="0.5"/><path d="M8 15h8"/>'),
    clock: svg('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
    calendar: svg('<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 4v4M16 4v4M4 11h16"/>'),
    phone: svg('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>'),
    refresh: svg('<path d="M21 12a9 9 0 1 1-2.3-6"/><path d="M21 3v6h-6"/>'),
    edit: svg('<path d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"/><path d="M13.5 7l3.5 3.5"/>'),
    help: svg('<circle cx="12" cy="12" r="8"/><path d="M9.6 9.4a2.4 2.4 0 114.2 1.6c-.7.7-1.8 1.2-1.8 2.5"/><path d="M12 17h.01"/>'),
    coin: svg('<circle cx="12" cy="12" r="8"/><path d="M12 7v10M9.5 9.2c.7-.8 1.6-1.2 2.5-1.2 1.7 0 3 1 3 2.4s-1.3 2.2-3.2 2.2h-1.2c-1.8 0-3.1.9-3.1 2.2 0 1.4 1.4 2.4 3.2 2.4 1 0 1.9-.4 2.6-1.1"/>'),
    dots: svg('<circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 6.5A2.5 2.5 0 0012.5 4H6a2 2 0 00-2 2v6.5A2.5 2.5 0 006.5 15"/>'),
    play: svg('<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 10l3.5 2-3.5 2z" fill="currentColor" stroke="none"/>'),
  };

  Nexa.iconSvg = function iconSvg(name) {
    return Nexa.ICONS[name] || Nexa.ICONS.dots;
  };
})(window.Nexa = window.Nexa || {});
