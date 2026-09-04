(function (Nexa) {
  const fragmentCache = new Map();
  const templateCache = new Map();
  const CACHE_PREFIX = "elbet:include:v2:";

  function isFileProtocol() {
    return location.protocol === "file:";
  }

  Nexa.asset = function asset(path) {
    return (Nexa.root || "") + String(path).replace(/^\//, "");
  };

  function cacheGet(name) {
    if (isFileProtocol()) return null;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return null;
    }
    try {
      return sessionStorage.getItem(CACHE_PREFIX + name);
    } catch {
      return null;
    }
  }

  function cacheSet(name, html) {
    try {
      sessionStorage.setItem(CACHE_PREFIX + name, html);
    } catch {
      /* ignore quota */
    }
  }

  Nexa.loadFragment = async function loadFragment(name) {
    if (fragmentCache.has(name)) return fragmentCache.get(name);

    if (!isFileProtocol()) {
      try {
        const res = await fetch(Nexa.asset(`components/${name}/${name}.html`));
        if (res.ok) {
          const html = await res.text();
          cacheSet(name, html);
          fragmentCache.set(name, html);
          return html;
        }
      } catch {
        /* fall through to embedded fragments */
      }
    }

    if (Nexa.FRAGMENTS && Object.prototype.hasOwnProperty.call(Nexa.FRAGMENTS, name)) {
      const html = Nexa.FRAGMENTS[name];
      fragmentCache.set(name, html);
      return html;
    }

    const cached = cacheGet(name);
    if (cached) {
      fragmentCache.set(name, cached);
      return cached;
    }

    throw new Error(`Component "${name}" not found`);
  };

  Nexa.loadTemplate = async function loadTemplate(name) {
    if (templateCache.has(name)) return templateCache.get(name);
    const html = await Nexa.loadFragment(name);
    const parsed = document.createElement("template");
    parsed.innerHTML = html.trim();
    const tpl = parsed.content.querySelector("template") || parsed;
    templateCache.set(name, tpl);
    return tpl;
  };

  Nexa.cloneTemplate = function cloneTemplate(template) {
    const source = template.content ? template.content : template;
    return source.cloneNode(true);
  };
})(window.Nexa = window.Nexa || {});
