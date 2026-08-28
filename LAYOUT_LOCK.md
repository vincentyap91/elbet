# Layout lock

**Status: ON** — until this file is changed to `OFF` after explicit approval.

The homepage skeleton follows the ECLBET **structure** (block order, chrome relationship, proportions). Palette always comes from [`design-system/tokens.css`](design-system/tokens.css) (charcoal field, gold `--color-primary`). Do not paste operator greys into CSS.

Visual redesign (Taste, Impeccable, motion polish) is a later phase. While this lock is on, do not invent an alternative homepage layout.

Canonical page: [`index.html`](index.html) (`pages/index.html` is the same page with `<base href="../">`).

---

## Locked tree

```text
BODY  data-layout="shell"
│
├── HEADER          fixed, full viewport width
├── LEFT SIDEBAR    overlay rail on the left gutter (does not push main)
├── MAIN            1300px, horizontally centered
│   ├── HERO BANNER
│   ├── EVENT SHORTCUTS     4 cards, one row
│   ├── GAME PROVIDERS      horizontal scroll
│   ├── BETTING TRANSACTION  tabs + view more + table
│   ├── SPONSORS | AMBASSADOR  one row, two columns
│   ├── RECENT PAYOUT          full-width rail
│   ├── MOBILE APP
│   └── FOOTER              inside the 1300px column
└── CHAT DOCK       fixed bottom-right
```

Header inner row matches the same 1300px axis as main. Sidebar sits in the leftover left gutter and does **not** become a flex column that shifts main to the right.

---

## Do not change (while lock is ON)

- Header position (fixed top, full width) or inner hierarchy (brand → 3 dropdowns | utilities)
- Sidebar position (fixed left overlay) or its relationship to main (overlay, not content offset)
- Main content alignment (centered 1300px column)
- Order and placement of: hero, shortcuts, providers, transactions, sponsors/ambassador, recent payout, mobile app
- Sponsors and ambassador as **one row** (video left, profile right); Recent Payout as the next full-width rail
- Footer as two bands (5 link columns, then brand/social) **inside** the main column — not a full-bleed bar under the sidebar
- Chat dock as a fixed bottom-right strip
- Hero prev/next arrows
- Provider row as a horizontal rail (not a wrapping logo grid)
- Transaction tabs + View more + table

Do **not** restore the old ELBET lobby order (in-play rail → match list → casino grid → uneven promos).

---

## Allowed while lock is ON

- ELBET name, placeholder copy, placeholder fills
- Token colors, type, and surfaces **without** moving boxes. When cloning ECLBET layout or copy, still paint with ELBET tokens — never the live site’s gold/grey hex.
- Wiring real data into the same slots
- Bugfixes that keep the same geometry

---

## Desktop measures (1920×1080 reference)

| Piece | Token / value |
| --- | --- |
| Header height | `--shell-header-height` → 78px |
| Sidebar width | `--shell-sidebar-width` → 62px |
| Main width | `--shell-main-width` → 1300px |
| Horizontal gutter | `(viewport − 1300) / 2` (≈302px at 1920) |
| Banner | 1300 × 320 (`--shell-banner-height`), top gap `--shell-banner-top` |
| Banner arrows | `--shell-arrow-size` 40px, vertically centered on banner |
| Shortcut cards | 4 × height `--shell-shortcut-height` 70px, gap `--shell-shortcut-gap` 10px |
| Provider tiles | `--shell-provider-width` × `--shell-provider-height` |
| Section gaps | `--shell-section-gap` 60px; shortcuts use `--shell-block-gap` |
| Section title → content | `--shell-title-gap` 16px |
| Table | `--shell-table-height`; row `--shell-row-height` |
| Trust row gap | `--shell-trust-gap` 70px |
| Sponsor video | `--shell-trust-media-width` left column; ambassador on the right |
| Payout rail | full 1300px main width, below the trust row |
| App promo | `--shell-app-height`; left copy `--shell-app-left` |
| Chat | `--shell-chat-width` × `--shell-chat-height` |
| Shared radius | `--shell-radius` 15px |

Tokens live in [`design-system/tokens.css`](design-system/tokens.css). Do not replace these with ad-hoc page pixels.

---

## Files that own the skeleton

| Region | Structure | Geometry |
| --- | --- | --- |
| Page order | `index.html` | `css/pages/home.css` |
| Header | `components/header/header.html` | `design-system/components.css` |
| Sidebar | `components/sidebar/sidebar.html` | `components/sidebar/sidebar.css` |
| Hero | `components/hero/` | `components/hero/hero.css` |
| Shortcuts | `index.html` + `shortcut-card` | `components/shortcut-card/shortcut-card.css` |
| Providers | `index.html` + `provider-card` | `components/provider-card/provider-card.css` |
| Transactions | `index.html` + `ui-tabs` | `components/transaction-table/transaction-table.css` |
| Trust / app / footer placement | `index.html` / `components/footer/` | `css/pages/home.css`, `design-system/components.css` |
| Chat | `components/chat/` | `components/chat/chat.css` |

Shared chrome is included via `data-include`. Do not duplicate header/sidebar/footer markup on a page.

---

## Breakpoints (structure only)

| Range | Behavior |
| --- | --- |
| ≥1440px | 1300px column, no extra horizontal padding on `.shell-main` |
| 1024–1439px | Same tree; main `min(1300px, 100% − 48px)`; sidebar still overlay |
| 768–1023px | Sidebar hidden; shortcuts 2×2; trust and app stack; table scrolls sideways |
| &lt;768px | Compact header; bottom mobile nav; chat can shrink — **do not reorder sections** |

---

## How to lift the lock

1. Explicit approval that the layout is accepted.
2. Set **Status** at the top of this file to `OFF`.
3. Then visual work may follow [`PROJECT_DESIGN.md`](PROJECT_DESIGN.md) **without** changing this tree unless a new layout spec is written.
