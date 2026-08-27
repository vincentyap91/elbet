# PROJECT_DESIGN.md

Visual identity lock for NEXA. This file is the art direction.

- [`design-system/MASTER.md`](design-system/MASTER.md) is the token/CSS source of truth.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) is the UX/component architecture.
- [`LAYOUT_LOCK.md`](LAYOUT_LOCK.md) is the homepage **structure** lock (currently ON).

If this lock and a token disagree, change the token to match this file. Do not special-case a page.

**Structure vs look:** the lobby **skeleton** is implemented and locked (ECLBET-inspired IA). This file still governs **visual identity**. Colors always come from NEXA tokens, even when a chrome piece is cloned from ECLBET. Do not use this document to reorder homepage blocks while `LAYOUT_LOCK.md` is ON.

---

## Design read

**Reading this as: a dual-product sportsbook + casino lobby for people who already know how a betting site works, with a premium dense product language (calm chrome, gold go-color, loud live data), leaning toward native CSS + the existing NEXA token system. Not a marketing landing page. Not a mint flood.**

Taste Skill dials (product UI, not the landing-page baseline of 8 / 6 / 4):

| Dial | Value | Why |
| --- | --- | --- |
| `DESIGN_VARIANCE` | **6** | Familiar betting IA. Originality is craft, not experimental layout. |
| `MOTION_INTENSITY` | **4** | Energy from odds, live, and press states. Not looping glows. |
| `VISUAL_DENSITY` | **7** | Cockpit-lite: a lot on screen, grouped. Not an art gallery. Not a sticker wall. |

Audience: scanners. They look for **Join / Deposit / next bet / next game**. They do not need a manifesto hero.

Quiet constraints: money, age, and trust. Contrast, tap size, and one primary CTA beat spectacle.

---

## Brand thesis

**NEXA Precision Lobby** — a betting desk, not a carnival.

High energy comes from **live content** (odds ticks, tables, in-play). The chrome stays still so the data can be loud.

Metaphor: **broadcast control room + private members desk.** Tight type, hairline structure, one signal light on the board.

**The signal is gold.** It means go: Join, Deposit, selected odd, active route. It is a point light, not a wash. Copper is promo pigment only. Live rose is a status, not a brand.

---

## Positioning (so this does not become another template)

Three looks we refuse, using the **same tokens we already have**:

| Look | Tell | NEXA instead |
| --- | --- | --- |
| Eclbet / SE aggregator | Gold-black, red Join, celebrity strip, Function mega-menu, sponsor wall as first screen | Charcoal field, gold go-color, locked ECLBET skeleton |
| Crypto-casino mint flood | Mint on header, hero, buttons, and card glows | Gold only on proceed + selected + focus. Surfaces stay charcoal |
| LLM casino / landing | Inter, purple mesh, centered hero, pill CTAs, three equal “Fast / Safe / VIP” cards, eyebrow on every section | Geometric sans, split banner, dual radius, one display title per page, match rows |

Palette stays. The identity is **how little gold we spend**, and **how sports vs casino geometry differs**.

---

## Split: 70% familiar / 30% ours

### Keep (UX architecture — do not reinvent)

From the Eclbet UX analysis, keep the **habits**, not the look:

- Sticky header: brand, product links, language, auth
- Products as siblings: Sports · Casino · Live · Promos · Account
- Desktop top nav + mobile 5-item bottom nav with the **same names**
- After login: balance + Deposit in the header
- Casino as a filterable card grid
- Sports as list/rail of matches with tappable odds
- Promos as a first-class route, not five synonym menus
- Support reachable without login
- One primary CTA per view (Join **or** Deposit **or** Play)

### Change (vs copying ECLBET as a brand)

- No Function mega-dump as a cloned menu, no Transfer in primary nav
- Money tools live in Account
- **Homepage block order is not the older NEXA lobby recipe.** While [`LAYOUT_LOCK.md`](LAYOUT_LOCK.md) is ON, the page is: banner → shortcuts → providers → transactions → sponsors | ambassador → app → footer. In-play rails and casino grids are later surfaces, not a reason to reshuffle this page.

### Original 30% (the visual signature)

These five tells should be visible in a one-second glance:

1. **Dual geometry** — sharp odds/inputs vs softer game tiles.
2. **Numeric voice** — tabular (later mono) figures for odds, stake, balance. Money has its own type.
3. **Signal active language** — 2px gold underline / 1px gold odd border. Never filled nav chips, never gold bloom.
4. **Display type once per page** — banner title only. Section titles stay product-sized.
5. **Uneven promo pair** — 2/3 + 1/3, copper wash on featured only. Not three equal cards.

---

## Exploration lock

Each row is a decision, not a mood board.

### Typography

| | Decision |
| --- | --- |
| Family | Geometric sans. **Intended:** Outfit or Geist, self-hosted later. **Until then:** Avenir Next / Segoe UI Variable Display. No Inter. No serif. |
| Display | Banner `h1` only. Tracking `--tracking-display` (`-0.025em`). Weight does hierarchy. Do not shout with `--text-display` on inner pages. Title ≤ 8 words, sentence case. |
| Section titles | `--text-xl`, sentence case, ≤ 4 words. No uppercase kicker on every block. |
| Body / nav | Same family, regular/medium. Nav is sentence case, not wide-tracking caps. |
| Numeric | Tabular lining figures on odds, balance, stake. Intended: IBM Plex Mono or Geist Mono **for numbers only**. This is the “you are in a book” tell. |
| Labels | `.type-label` uppercase is for **Live / Jackpot / New** chips only. Max one small-caps label per three sections. |
| CJK | PingFang SC / Noto Sans SC remain fallback. Do not mix a display serif into headlines. |
| Logo | Compact mark + NEXA. Tracking **0.04em** (not `--tracking-wide` 0.08em luxury slogan). |

Emphasis inside a headline: italic or bold of the **same** family. Never a random serif word.

### Card geometry

Documented mixed-radius system (Taste shape lock: mixed only when the rule is written and followed).

| Surface | Radius | Token target |
| --- | --- | --- |
| Odds, text inputs, icon buttons | Sharp instrument, 6px | `--radius-sm` (`0.375rem`) |
| Primary / secondary / ghost buttons, dropdowns | Confident rectangle, 10px | `--radius-md` → **0.625rem** (today 0.75rem; sync when implementing) |
| Game cards, banners, modals, promo tiles | Softer cover, 14–18px | `--radius-lg` (`1.125rem`) |
| Badges, live dot | Pill | `--radius-pill` |

**Dual geometry is the brand:** sports controls look like tools; casino tiles look like covers. Users should feel the product switch without a second color theme.

Match lists are **rows with hairline dividers**, not one card per match. Cards are for games and promos only (`VISUAL_DENSITY: 7`: generic card-in-card is banned).

Game card media: **4:3** crop. Title + provider under the image. No rating stars, no fire emoji, no provider-logo palace on the tile.

### Section rhythm

Dense **inside** a section. Generous **between** sections.

- Within a rail or grid: `--space-3` / `--space-card`
- Between homepage blocks: `--space-section` (already grows by breakpoint)
- No split-header (big title left + filler paragraph right). Headline stacked over content.
- Same ink field the whole page. Do not invert a “paper” band mid-scroll. Surface steps (`bg` → `surface` → `elevated`) are allowed; theme flips are not.

Layout families for **after the layout lock is lifted** (do not apply these as a new homepage tree while `LAYOUT_LOCK.md` is ON):

1. Split banner (copy left, media right)
2. Horizontal snap rail (in-play matches)
3. Horizontal snap rail (live tables) — second rail allowed because content type differs; do not add a third identical rail
4. Game card grid
5. Two promo tiles, uneven (2/3 + 1/3)
6. Footer columns

### Visual density

`VISUAL_DENSITY: 7`

- Show many markets and games. Hide duplicate chrome.
- Prefer `border` + gap over nested cards.
- One sticky header. No floating Quest, no second chat bubble over the lobby.
- Desktop: header 64px + subnav 52px. Nav is one line. Height cap 80px for any single chrome bar.
- Thumb targets stay `--tap-min`. Density is type and grouping, not smaller hit areas.
- Filters are a compact chip row or dropdown, not a second hero.

### Button shapes

- Not pills. Not stadium. Not gold.
- Primary = solid gold, dark text (`--color-on-primary`). High contrast, no glow.
- Ghost = hairline `--color-border`, no fill until hover.
- Secondary (periwinkle) = informational actions only. Never Join / Deposit.
- Label: 1–2 words (`Join`, `Log in`, `Deposit`, `Play`). No wrap at desktop.
- One intent per page: do not put Join in the banner and Register in the footer as competing labels. Pick one word for sign-up.

### Active states

| Element | Active | Not |
| --- | --- | --- |
| Desktop nav | 2px mint underline, text primary | Filled chip, mint background bar |
| Mobile tab | Mint icon + label | Blob / pill background |
| Odds | 1px mint border + `--color-surface-hover`. Selected stake = mint fill | Outer glow, scale bounce |
| Tabs | Same underline as nav | Segmented control fill |
| Live | Rose text + 6px geometric dot | Flame icon, card-wide pulse |
| Focus | `--focus-ring` mint mix | Extra outline on top of glow |

### Gradients

Allowed:

1. Hero **scrim only**: horizontal fade from `--color-bg` over photography (max ~70% at the copy edge).
2. Featured promo: existing ~12% copper wash, corner-bound, not a full-card gold sweep.

Banned: mesh blobs, animated aurora, text-fill gradients on headlines, glow gradients behind buttons, purple/blue neon, gold operator sweeps.

### Glow effects

**Off by default.**

Allowed: `--shadow-live` on the live **badge** and live **odds control**, kept tight (already in tokens).

Banned: mint bloom on buttons, copper glow on promos, header glow, text shadow, animated pulse on a whole card.

Live energy = the **dot**, not a halo.

Elevated surfaces may use a **1px inset top highlight** (`color-mix` of white ~6% on dark, ink ~8% on light). That is edge light, not glow. Header blur is a desk-glass approximation on chrome only, never on game cards.

### Border treatment

- Default: 1px `--color-border` (cool, not white, not gold).
- Hover on tappable tiles: border `color-mix` toward primary (~40%). Thickness stays 1px.
- Featured promo: copper mix, still 1px.
- Odds rest: 1px border, surface fill. Selected: mint border. Live: live-colored border, no 2–3px arcade outline.
- No inner gold bevel. No 2px “selected stadium” rings.

### Icon treatment

- One stroke family (current set, Phosphor later if we add a library). Stroke ~1.75. No mixed filled-neon.
- No emoji in product UI.
- Live = geometric dot, not a flame.
- Nav icons on **mobile only**. Desktop nav is type.
- Provider marks appear in filters / game meta, not as a homepage logo palace.

### Banner composition

Split, left-aligned, **one story**. Display type lives here only.

```
[ optional kicker ]          [ photography / motion crop ]
[ title ≤ 8 words ]
[ line ≤ 20 words ]
[ one CTA ]
```

- Copy column ~40%, media ~60% on desktop. Stack: media above copy on mobile, or copy first if the title is the offer.
- Scrim from the left so type never sits on busy art.
- Not centered. Not a gradient blob. Not auto-rotating five offers. If multiple campaigns exist: dots or a quiet pager, pause on hover.
- Hero stack max 4 text elements (Taste). No trust strip, app-store badges, or “Play here, win here” inside the banner.
- No ambassador.

### Navigation treatment

- Type-first. Mint underline. Same labels everywhere.
- Logged-out: Log in (ghost) + Join (primary).
- Logged-in: tabular balance + Deposit. Avatar opens Account, not a 20-item Function list.
- Search is an icon that expands, or a compact field. Not a second hero.
- Language stays a utility, not a billboard.
- Drawer on small screens: list, hairline, mint on active. Not a mosaic of product tiles.

### Hover states

`MOTION_INTENSITY: 4`. Motion must be motivated: feedback, not decoration.

| Target | Hover | Active |
| --- | --- | --- |
| Button | Fill shift only | `scale(0.98)` |
| Odds | Border toward mint + 1px lift | `scale(0.98)` |
| Game card | Image `scale(1.03)`, play overlay | Overlay stays for focus |
| Promo | `--shadow-sm` → `--shadow-md` | — |
| Nav | Text → primary | Underline |

Duration: `--duration-fast` / `--duration-med`. Easing: `--ease-out`.

`prefers-reduced-motion`: no transform. Overlay may appear without fade.

Mobile game cards do not depend on hover. Play is always reachable (persistent play chip, or first tap reveals overlay, second tap plays).

No magnetic cursor, no marquee, no infinite float on cards.

---

## Sports vs casino (same system, different instrument)

| | Sports | Casino / Live |
| --- | --- | --- |
| Unit | Match **row** | Game **tile** |
| Radius | Odds `--radius-sm` | Card `--radius-lg` |
| Type | Numeric dominates | Title + media dominate |
| Motion | Odds flash up = success, down = error, **on the number** | Overlay play |
| Badge | Live on the row | Live / Jackpot on the tile |
| Empty | “No markets in this league” + change filter | “No games in this category” + clear filter |

Users should not feel two websites. They should feel two **instruments**.

---

## Color discipline (tokens stay, usage locks)

| Role | Token | Rule |
| --- | --- | --- |
| Energy / go | `--color-primary` (gold) | Join, Deposit, active nav, focus, selected odd. Small area. |
| Quiet action | `--color-secondary` | Informational only. Not a second brand. |
| Promo heat | `--color-accent` (copper) | Featured promo wash and kicker only. Never Join/Deposit. |
| Live | `--color-live` | Badge + live odds outline. Not headers, not large fills. |
| Field | `--color-bg` ink | Cool neutrals only. No warm beige. No pure `#000`. |

**Lila rule:** no purple/blue neon, no gold sweep, no rainbow.  
**One energy color:** if a control means “proceed,” it is gold.  
**Saturation:** gold may be bright. It is a point light, not a flood. Do not wash the header, hero, or page background with it.

Odds drift: up = `--color-success` on the figure, down = `--color-error` on the figure. Do not recolor the whole row.

---

## Copy register

One voice: short, operational, not hype.

Use: Join, Deposit, In play, Live, Odds, Play.  
Do not use: Unleash, Seamless, Next-gen, Play here win here, Elevate your experience.

No em dashes in UI copy. Use a period, comma, or colon.

Primary CTA intent is unique per page.

---

## Light theme

Same geometry, type, and signal language. Invert surfaces only.

Mint already darkens on paper for contrast (`--color-primary` light token). Copper and live stay semantic. Do not invent a second identity for light mode. Do not sandwich a dark carnival block inside a light page.

---

## Hierarchy (squint test)

When you blur the future lobby, you should still see:

1. Banner + one CTA
2. In-play numbers
3. Game covers
4. Two promo shapes
5. Quiet footer

You should **not** see: equal-weight modules, a gold header bar, or a mint Join.

---

## Token sync (when implementation starts — not homepage yet)

| Lock | Current token | Target |
| --- | --- | --- |
| Odds / inputs / icon buttons | `--radius-md` in several controls | `--radius-sm` on odds and icon buttons |
| Buttons | `--radius-md: 0.75rem` | `0.625rem` (10px) |
| Logo tracking | `--tracking-wide` (0.08em) | `0.04em` on the wordmark only |
| Numeric face | Segoe tabular | Self-host Geist Mono / IBM Plex Mono later |
| Display face | System geometric | Self-host Outfit / Geist later |

Do not add Tailwind, stock casino kits, or extra font CDNs. Self-host later if we leave system stacks.

---

## Pre-flight (before any future page ships)

- [ ] No Inter, no purple mesh, no mint Join
- [ ] Join / Deposit are gold, not copper, not red, not mint
- [ ] Buttons are not pills
- [ ] Glow only on live status
- [ ] Display type appears once (banner). Section titles stay `--text-xl`
- [ ] Homepage **visual** pass may follow the families below only after `LAYOUT_LOCK.md` is OFF; until then keep the locked ECLBET-inspired tree
- [ ] Desktop nav is one line
- [ ] Section eyebrows ≤ 1 per 3 sections
- [ ] Odds are tabular
- [ ] Promo pair is uneven, not three equal cards
- [ ] Contrast AA on CTAs and form text
- [ ] Mobile bottom nav matches desktop names
- [ ] No cloned ECLBET ambassador, Quest chrome, or provider-logo palace as branding; the locked homepage may keep a **placeholder** ambassador slot
- [ ] `prefers-reduced-motion` kills transforms

---

## Implementation note

1. Follow [`LAYOUT_LOCK.md`](LAYOUT_LOCK.md) for homepage structure until that lock is OFF.
2. Follow this file for look **only in the visual phase** (colors, type, surfaces — not a new IA).
3. Follow `ARCHITECTURE.md` for components and events.
4. Sync the token table above in `design-system/tokens.css` when implementing the visual pass.
5. Do not copy ECLBET color, type, or operator hex (`#FABB2E`, `#2d2e30`, `#b2b2b2`). Structure and copy reference is allowed; paint with [`design-system/tokens.css`](design-system/tokens.css). Cursor rule: [`.cursor/rules/theme-color.mdc`](.cursor/rules/theme-color.mdc).
6. Do not start a second design system.
