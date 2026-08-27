# NEXA

Pure HTML, CSS, and JavaScript betting-site foundation. No React, Vue, Angular, Next, Nuxt, Tailwind, or Bootstrap.

**Build reference:** [ARCHITECTURE.md](ARCHITECTURE.md)  
**Homepage layout lock:** [LAYOUT_LOCK.md](LAYOUT_LOCK.md)  
**Visual source of truth:** [design-system/MASTER.md](design-system/MASTER.md)  
**Art direction:** [PROJECT_DESIGN.md](PROJECT_DESIGN.md)

## Run

Serve the project root (component loading uses `fetch`):

```bash
python -m http.server 5173
```

Open [http://localhost:5173/](http://localhost:5173/) for the lobby layout shell, or [playground.html](http://localhost:5173/playground.html) for shared components.

`index.html` is the ECLBET-inspired **layout** homepage (placeholder content). Visual redesign waits until the layout lock in `LAYOUT_LOCK.md` is lifted. Other product URLs remain empty shells.

## New page

Copy `_template.html`. Do not duplicate header, sidebar, nav, footer, or chat markup.
