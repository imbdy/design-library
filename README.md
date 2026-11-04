# Liquid Atelier / Personal Design Library

An atmospheric personal UI/UX design portfolio and library. The site presents the library itself as an in-progress piece, with a cinematic architectural backdrop, liquid-glass depth, and a fixed interactive workspace for exploring future studies without a traditional page scroll.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Structure

- `src/data/projects.js` — project content model.
- `src/components/` — reusable shell, preview, card, detail, add-design, and icon components.
- `src/App.jsx` — page composition and library interactions.
- `src/styles.css` — semantic design tokens, responsive layout, and visual language.

The “Add design” flow stores the collection in the current browser's `localStorage`. It accepts an optional preview image URL and source URL; no upload service or backend is implied. The current color system is derived from the six supplied source colors: `#0A0F14`, `#0F3D3E`, `#2E6F73`, `#7FB3B8`, `#EADCC8`, and `#C6601F`.

## Visual asset

`public/atmosphere-interior-bright.jpg` is a locally stored [Unsplash photograph of a modern dining room with warm natural light](https://unsplash.com/photos/modern-dining-room-with-warm-natural-light-raTBX-Mo4x8), used as the bright architectural backdrop. It is softly tinted and layered beneath the interface so the portfolio content remains legible while the environment stays visible.
