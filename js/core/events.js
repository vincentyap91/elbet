(function (Nexa) {
  const listeners = new Map();

  Nexa.on = function on(type, handler) {
    document.addEventListener(type, handler);
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(handler);
    return function () {
      Nexa.off(type, handler);
    };
  };

  Nexa.off = function off(type, handler) {
    document.removeEventListener(type, handler);
    listeners.get(type)?.delete(handler);
  };

  Nexa.emit = function emit(type, detail) {
    document.dispatchEvent(new CustomEvent(type, { detail: detail || {}, bubbles: true }));
  };
})(window.Nexa = window.Nexa || {});
