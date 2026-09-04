# ELBET design system

Visual identity lock: [`PROJECT_DESIGN.md`](../PROJECT_DESIGN.md) (Precision Lobby). Homepage **structure** lock: [`LAYOUT_LOCK.md`](../LAYOUT_LOCK.md). This folder stays the CSS source of truth. If art direction and a token disagree, update the token to match the lock — do not special-case a page.

| File | Role |
| --- | --- |
| [tokens.css](tokens.css) | Color, space, radius, shadow, layout, motion |
| [typography.css](typography.css) | Type roles and scale |
| [components.css](components.css) | Visual rules for UI |
| [responsive.css](responsive.css) | Breakpoints and layout behavior |

Do not invent hex values, pixel spacing, or new radii in page CSS. Use tokens. `css/main.css` imports this folder first.

Eclbet is a **UX / layout reference** for the locked lobby skeleton. If a cloned chrome piece needs to match ECLBET **behavior**, still map every fill, text, hover, and selected state to tokens in [`tokens.css`](tokens.css). Never paste operator greys (`#2d2e30`, `#333435`, `#b2b2b2`).

---

## Shipped locks (do not drift)

These are already in the product. Match them. Do not “improve” with a second ratio, mint pagers, or cropped home art.

| Surface | Ratio / size | Color / type | Gap |
| --- | --- | --- | --- |
| Lobby desktop hero | 1300 × 320 (`--shell-banner-height`) | Image `cover` | Top `--shell-banner-top`, bottom `--shell-banner-bottom` |
| Lobby mobile hero | **1:1** `--shell-home-banner-ratio-mobile` | `object-fit: contain`; active ring `--color-primary` | Peek `--shell-hero-peek`; dots `--shell-hero-dot` |
| Inner-page mobile hero | `--shell-banner-ratio-mobile` (`1080 / 867`) | `cover` | `--space-4` stack |
| Home pager dots | `--shell-hero-dot` (8px) | Active `--color-primary`; idle primary mixed into `--color-bg` | `--space-2` between dots |
| Section title → content | — | `--text-xl`, `--weight-medium` | `--shell-title-gap` (16px) |
| Lobby section → section | — | — | `--shell-section-gap` (60px) |
| Header / sidebar / main | 78px / 62px / 1300px | Surfaces from tokens | See [`LAYOUT_LOCK.md`](../LAYOUT_LOCK.md) |
| Wordmark | `assets/images/logo.png` | Tracking `--tracking-logo` | Do not replace the file |
| Boot splash | `logo-animated.svg` | Field `--color-bg` | Plays once ~2s |

`--color-success` is **not** a pager or nav color. It is wins / odds-up only.

---

## Identity

**ELBET** — a dark, precise betting product. Gold is the go-color, not a wash.

- Field is warm charcoal, not navy-blue chrome.
- **Primary** is gold: deposits, Join, active nav, selected states.
- **Secondary** is periwinkle: quieter actions and information.
- **Accent** is copper: promos, heat, featured offers — never the default button.
- **Live** is a distinct rose pulse, separate from error.

Dark is the default skin. Light is the same system with paper surfaces; do not restyle components per theme.

---

## Color

| Token | Use |
| --- | --- |
| `--color-primary` | Primary buttons, active nav, focus, brand mark |
| `--color-secondary` | Secondary buttons, info badges |
| `--color-accent` | Promos, featured, copper highlights |
| `--color-bg` | Page canvas |
| `--color-surface` | Cards, inputs, default panels |
| `--color-surface-elevated` | Header drawer, modal, footer, elevated cards |
| `--color-border` | Hairline structure |
| `--color-text-primary` | Titles and primary copy |
| `--color-text-secondary` | Supporting copy, inactive nav |
| `--color-text-muted` | Captions, placeholders, legal |
| `--color-success` | Wins, odds drifting up |
| `--color-warning` | Pending, limits |
| `--color-error` | Failures, odds drifting down, destructive |
| `--color-live` | Live markets and the live badge |

Hover companions: `--color-*-hover`. Text on fills: `--color-on-primary`, `--color-on-accent`, etc.

Aliases (`--color-text`, `--color-danger`, `--color-bg-elevated`) exist so older component CSS still compiles. New work should use the names in the table.

---

## Typography

| Role | Class / element | Token |
| --- | --- | --- |
| Display | `.type-display`, `h1` | `--font-display`, `--text-3xl` / `--text-display` on tablet+ |
| Heading | `.type-heading`, `h2`–`h4` | Display face, tight leading |
| Body | `.type-body`, `body` | `--font-body`, `--text-md` |
| Caption | `.type-caption` | `--text-sm`, secondary color |
| Label | `.type-label` | Uppercase, wide tracking, `--text-xs` |
| Numeric | `.type-numeric`, `.odds` | Tabular lining figures |

Stack is system-first (Avenir Next / Segoe UI / PingFang) so the site runs with no font CDN. Optional webfonts may be dropped into `assets/fonts/` later without changing roles.

Betting values must always use tabular numbers so columns do not jump.

---

## Spacing

4px base. Use the scale, not ad-hoc pixels.

`1 2 3 4 5 6 7 8 9 10` → 4, 8, 12, 16, 24, 32, 40, 48, 64, 80px.

- Control padding: `--space-2` / `--space-4`
- Card inner: `--space-card` (`--space-4`)
- Section heading → first content: `--shell-title-gap` (`--space-4`, 16px). Use this for every page section title. Do not invent a local margin.
- Section rhythm: `--space-section` (grows at tablet and desktop)

---

## Radius

| Token | Shape |
| --- | --- |
| `--radius-sm` | Odds, inputs, icon buttons, chips |
| `--radius-md` | Buttons, dropdowns |
| `--radius-lg` | Cards, banners, modals, game tiles |
| `--radius-pill` | Badges, live dot |

Sports controls are sharp (`--radius-sm`). Casino tiles and banners are softer (`--radius-lg`). Primary buttons are `--radius-md`, never pills.

---

## Shadows

| Token | Use |
| --- | --- |
| `--shadow-sm` | Quiet lift (promo default) |
| `--shadow-md` | Dropdowns, elevated cards, toasts |
| `--shadow-lg` | Modals |
| `--shadow-live` | Live badge 1px ring (no bloom) |

Shadows use `--color-shadow`, so they track the theme.

---

## Layout

| Token | Value / behavior |
| --- | --- |
| `--layout-max` | 80rem content cap (inner product pages) |
| `--shell-main-width` | 81.25rem (1300px) lobby column — **layout lock** |
| `--shell-header-height` / `--shell-sidebar-width` | 78px / 62px chrome |
| `--gutter-mobile` | `--space-4` |
| `--gutter-tablet` | `--space-6` (≥768) |
| `--gutter-desktop` | `--space-8` (≥1024) |
| `--container-gutter` | Switches with the gutters above |
| `--space-section` | Vertical gap between major blocks |
| `--space-card` / `--card-min` | Card padding and grid minimum |

Lobby geometry uses the `--shell-*` tokens in [`tokens.css`](tokens.css). Do not restyle the homepage into a different tree while [`LAYOUT_LOCK.md`](../LAYOUT_LOCK.md) is ON.

Inner pages still use `.container` / `<ui-container>`. Do not hard-code page width.

---

## Components

Visual CSS lives in [components.css](components.css). HTML/JS still live under `components/`.

**Buttons** — Primary = gold fill, dark text. Secondary = periwinkle fill. Ghost = border only. Danger = error fill. Never use copper as the default Join/Deposit button.

**Cards** — Surface + border. Elevated drops the border and uses `--shadow-md`. Outlined is a quiet frame.

**Navigation** — Desktop: underline in primary. Mobile: hamburger + bottom bar; active tint is primary. Logo tracking is `--tracking-logo` (0.04em). Skip link is the first focusable control in the header.

**Sidebar** — Overlay rail. Surfaces `--color-surface` / `--color-surface-elevated`. Labels `--color-text-muted`. Rows `--color-text-secondary`. Selected language, hover bar, and scrollbar `--color-primary`.

**Tabs** — Same underline language as desktop nav.

**Inputs** — Surface fill, border, primary focus ring. Errors recolor border and hint only. When an input has a trailing button on the right, wrap both in `.control-inline` (`.control-inline--sm` / `--lg` for size). Input and button share `--control-inline-height`; never mix `--tap-min` with `--control-height-sm` on the same row.

**Dropdowns** — Surface trigger, elevated menu, `--shadow-md`.

**Modals** — Sheet on mobile, centered card from tablet. Overlay uses `--color-overlay`.

**Badges** — Pill. Live badge adds a pulse dot and `--shadow-live`. Accent badge is copper (promo), not primary.

**Betting odds** — Compact numeric control, `--radius-sm`. Up = success, down = error, live = live glow. Selected = gold fill. Locked is faded, not restyled.

**Game cards** — 4:3 media, name + provider. Desktop hover reveals play overlay and a slight image scale. Mobile does not rely on hover.

**Promotion cards** — Elevated surface. Featured uses a copper wash, not a gold operator gradient. Lobby promo pair is 2/3 + 1/3 (`.promo-grid`).

**Lobby recipes** — `.banner` split copy/media, `.chip-row` / `.chip` for quick access, `.rail` / `.rail-match` for in-play, `.match-list` / `.match-row` for sports lists, `.promo-grid` for the uneven offer pair, `.provider-list` for studio names. Do not invent a second set of these classes in page CSS.

---

## Responsive

| Name | Width | Behavior |
| --- | --- | --- |
| sm | 640 | Type display steps up; dropdowns unclamp |
| md | 768 | Tablet gutters, footer columns, modal centers |
| lg | 1024 | Desktop nav on, mobile nav off, desktop gutters |
| xl | 1280 | Slightly looser card grids |

Mobile first. Tap targets stay `--tap-min` (44px). Page and footer add bottom padding under `lg` so the tab bar does not cover content.

`@media` cannot read CSS variables; the px values are duplicated from `--bp-*`. If a breakpoint changes, update **both** the token and every matching `@media`.

---

## How to change the look

1. Palette / spacing / radius → `tokens.css`
2. Type roles → `typography.css`
3. Component appearance → `components.css`
4. Breakpoint behavior → `responsive.css`
5. Refresh. Do not patch a single page to “look different”.

New product UI (game card, odds, promo) should reuse these classes before new CSS is written.
