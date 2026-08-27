(function (Nexa) {
  Nexa.qs = function qs(selector, root) {
    return (root || document).querySelector(selector);
  };

  Nexa.qsa = function qsa(selector, root) {
    return [...(root || document).querySelectorAll(selector)];
  };

  Nexa.setText = function setText(el, value) {
    if (el) el.textContent = value == null ? "" : String(value);
  };

  Nexa.takeChildren = function takeChildren(el) {
    const nodes = [];
    while (el.firstChild) nodes.push(el.removeChild(el.firstChild));
    return nodes;
  };

  Nexa.moveChildren = function moveChildren(from, to) {
    Nexa.takeChildren(from).forEach((node) => to.appendChild(node));
  };

  Nexa.attr = function attr(el, name, fallback) {
    return el.getAttribute(name) ?? (fallback == null ? "" : fallback);
  };

  Nexa.hasAttr = function hasAttr(el, name) {
    return el.hasAttribute(name);
  };
})(window.Nexa = window.Nexa || {});
