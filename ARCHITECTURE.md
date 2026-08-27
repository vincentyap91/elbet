# NEXA architecture

Pure HTML, CSS, and JavaScript. No React, Vue, Angular, Next, Nuxt, Tailwind, or Bootstrap.

Eclbet is a UX reference only. Visual identity, tokens, and branding in this repo are original.

**Homepage layout is locked.** Follow [`LAYOUT_LOCK.md`](LAYOUT_LOCK.md) for block order and chrome geometry. Do not invent a different lobby structure while that lock is ON.

This file is the build reference. Follow it when adding pages or components.

## How to run

Double-click `index.html` (or any page in the project root). Links, CSS, and scripts are relative, so `file://` works.

A local server is optional:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173/` or `http://localhost:5173/playground.html`.

`pages/index.html` is the same lobby with `<base href="../">` so it still loads root assets.

## Folder map

```text
/
  _template.html              copy this to start a new page
  playground.html              component lab, not a product page
  index.html                  lobby (double-click this)
  pages/index.html            same lobby, opened from /pages
  playground.html             component lab, not a product page
  ARCHITECTURE.md             this file
  LAYOUT_LOCK.md              homepage structure lock (ON until approved)
  design-system/              visual source of truth (MASTER.md + tokens)
  components/<name>/          one folder per component: .html + .css + .js
  css/                        reset, base, layout, utilities, main.css entry
  js/boot.js                  classic-script loader (file:// safe)
  js/fragments.js             embedded component HTML for file://
  js/app.js                   start
  js/core/                    loader, events, store, theme, templates, icons
  js/pages/                   page-only scripts
  js/data/api.js              swap mock → live later
  scripts/build-fragments.js  regenerate js/fragments.js after HTML edits
  data/*.json
  assets/
```

## Two component layers

1. **Shell / layout** — Header, Sidebar, Nav, Footer, Mobile nav, Chat dock, Modal host, Toast host.  
   Pages place `<div data-include="header"></div>`. Markup lives once in `components/<name>/<name>.html`.

2. **Atoms / widgets** — Button, Icon button, Card, Container, Badge, Dropdown, Tabs, Loading, Empty.  
   Pages write `<ui-button variant="primary">Join</ui-button>`. Light DOM custom elements (no Shadow DOM) clone the HTML template so designers can style with normal CSS.

## Boot order

1. Inline theme script (avoids a light/dark flash)
2. `css/main.css`
3. `js/boot.js` loads core + components as classic scripts
4. `js/app.js` → theme → store → register elements → inject includes → init shell → `app:ready`
5. Optional `js/pages/<page>.js` waits on `Nexa.ready`

## Page contract

Every page is a normal `.html` file:

```html
<link rel="stylesheet" href="css/main.css" />
<body>
  <div data-include="header"></div>
  <div data-include="sidebar"></div>
  <div data-include="nav"></div>
  <main class="page" data-page="home"><!-- only this page --></main>
  <div data-include="footer"></div>
  <div data-include="chat"></div>
  <div data-include="mobile-nav"></div>
  <div data-include="modal"></div>
  <div data-include="toast"></div>
  <script src="js/boot.js"></script>
</body>
```

Homepage (`index.html`) uses `data-layout="shell"` and the section order in `LAYOUT_LOCK.md`. Other routes may keep empty `ui-container` shells until they are designed.

## Homepage (layout-locked)

```text
Header (fixed)
Sidebar (fixed overlay, 62px)
Main (1300px centered)
  Hero → Shortcuts → Providers → Transactions → Sponsors | Ambassador → App
Footer (inside main column)
Chat dock (fixed)
```

Sidebar does not offset main. Details and tokens: [`LAYOUT_LOCK.md`](LAYOUT_LOCK.md).

Copy `_template.html`. Do not copy a finished page and delete content.

## CSS

- **Visual source of truth:** [`design-system/MASTER.md`](design-system/MASTER.md)
- Tokens, type, component look, and breakpoints live in `design-system/`
- `css/main.css` imports that folder; do not put raw hex or spacing in page CSS
- `data-theme="dark|light"` on `<html>` switches token values only

## JavaScript

- Classic scripts (no ES modules), no bundler, no npm — so double-clicking HTML works
- Shared APIs live on `window.Nexa`
- Pages talk to chrome through **attributes**, **data-include**, **events**, and **store**
- Do not query inside Header/Modal internals from a page script
- Static component HTML may be injected. Dynamic user data uses `textContent`

### Events

| Event | Detail |
| --- | --- |
| `app:ready` | boot finished |
| `app:modal:open` | `{ title, body, size }` |
| `app:modal:close` | — |
| `app:toast:show` | `{ type, message, timeout }` |
| `app:theme:changed` | `{ theme }` |
| `app:nav:toggle` | `{ open }` |
| `app:auth:changed` | `{ isLoggedIn }` |

## How an update reaches every page

There is one copy of each component. Over HTTP, `loader.js` fetches `components/<name>/<name>.html` (sessionStorage cache in the same tab). Over `file://`, it uses the copy in `js/fragments.js`. Custom elements upgrade every `<ui-*>` on the page, including those inside Header.

After you edit a component `.html` file:

- Refresh is enough if you are on `http://localhost`
- For double-click / `file://`, run `node scripts/build-fragments.js` then refresh

- Change `components/header/header.html` → refresh any page → all headers update
- Change `components/button/button.css` → Header Join + playground buttons change together
- Change `--color-accent` in tokens → all accents change
- Change `data-theme` → no component files need edits

If a fragment looks stale, close the tab or clear sessionStorage (`nexa:include:*`).

## Responsive

- Mobile first
- `< 1024px`: hamburger drawer + bottom `mobile-nav`; extra padding on `.page` and footer
- `≥ 1024px`: desktop nav, mobile nav hidden
- Tap targets use `--tap-min` (44px)
- Card grids: `repeat(auto-fill, minmax(var(--card-min), 1fr))`

## Component usage

### Header, Sidebar, Nav, Footer, Mobile nav, Chat

Do not paste their markup. Use `data-include`. Edit the files under `components/header`, `sidebar`, `nav`, `mobile-nav`, `footer`, `chat`.

On `data-layout="shell"` desktop, the old top `site-nav` bar is hidden; product links live in header dropdowns. Do not reintroduce a second desktop nav bar on the homepage while the layout lock is ON.

Nav highlight: set `data-page` on `<main>` to `home`, `casino`, `live`, `sports`, `promotions`, or `account`.

### Container

```html
<ui-container>…</ui-container>
<ui-container size="sm">…</ui-container>
<ui-container size="lg">…</ui-container>
```

Or the class `.container` / `.container--sm` / `.container--lg` from `layout.css`.

### Button

```html
<ui-button variant="primary">Join</ui-button>
<ui-button variant="secondary" size="sm">Filter</ui-button>
<ui-button variant="ghost" href="login.html">Log in</ui-button>
<ui-button variant="danger" disabled>Locked</ui-button>
<ui-button variant="primary" block>Full width</ui-button>
```

`variant`: `primary` | `secondary` | `ghost` | `danger`  
`size`: `sm` | `md` | `lg`

### Icon button

```html
<ui-icon-button name="search" label="Search"></ui-icon-button>
<ui-icon-button name="menu" variant="ghost"></ui-icon-button>
```

Icon names live in `js/core/icons.js`.

### Card

```html
<ui-card variant="elevated">
  <div data-slot="media"></div>
  <h3 class="card__title">Title</h3>
  <p class="card__meta">Meta</p>
</ui-card>
```

`variant`: `default` | `elevated` | `outlined`

### Badge

```html
<ui-badge variant="success">Live</ui-badge>
```

`variant`: `accent` | `success` | `warning` | `danger` | `info`

### Dropdown

```html
<ui-dropdown label="Odds">
  <button type="button" data-value="decimal">Decimal</button>
  <button type="button" data-value="fractional">Fractional</button>
</ui-dropdown>
```

### Tabs

```html
<ui-tabs>
  <button type="button" data-tab="a">A</button>
  <button type="button" data-tab="b">B</button>
  <div data-panel="a">Panel A</div>
  <div data-panel="b">Panel B</div>
</ui-tabs>
```

### Modal

One host per page (`data-include="modal"`). Open from any script:

```js
Nexa.emit("app:modal:open", { title: "Sign in", body: "Coming soon", size: "sm" });
```

`body` may be a string or a DOM node. Do not inject untrusted HTML.

### Toast

```js
Nexa.emit("app:toast:show", { type: "success", message: "Deposited", timeout: 3000 });
```

`type`: `info` | `success` | `warning` | `danger`

### Loading / Empty

```html
<ui-loading label="Loading"></ui-loading>
<ui-loading variant="skeleton" lines="3"></ui-loading>
<ui-empty title="No games" description="Try another category.">
  <ui-button variant="primary">Browse</ui-button>
</ui-empty>
```

## How to modify a component

| Goal | File |
| --- | --- |
| Structure | `components/<name>/<name>.html` |
| Look | `design-system/components.css` |
| Behaviour | `components/<name>/<name>.js` |
| Colour / space / radius | `design-system/tokens.css` |
| Type | `design-system/typography.css` |
| Breakpoints | `design-system/responsive.css` |
| New icon | `js/core/icons.js` |

Designers can edit HTML/CSS without Node.

## How to add a component

1. Create `components/foo/foo.html`, `foo.css`, `foo.js`
2. Put visual rules in `design-system/components.css` (tokens only). Keep `foo.css` for host-only tweaks
3. Import `foo.css` from `css/main.css` if it is not already covered by the design system
4. If it is **shell**: pages add `<div data-include="foo"></div>`; attach `Nexa.initFoo()` and call it from `js/core/loader.js`; add the script to `js/boot.js`
5. If it is **atom**: `customElements.define("ui-foo", …)` and call `Nexa.defineFoo()` from the loader; add the script to `js/boot.js`
6. Run `node scripts/build-fragments.js` so `file://` has the new markup
7. Show it on `playground.html`
8. Document the public API here (attributes + events only)

Name folders with lowercase kebab-case. Loader only fetches names matching `^[a-z0-9-]+$`.

## Data later

Pages should call `js/data/api.js`, not `fetch` the JSON files directly. Today `api.js` delegates to `mock.js`. Replacing that one file is enough to point at a real backend.

## Out of scope until the next pass

- Homepage **visual** redesign (layout is already locked — see `LAYOUT_LOCK.md`)
- Game cards, promo banners, age gate as a different IA
- Real payments, odds, or bet-slip engine
</contents>
