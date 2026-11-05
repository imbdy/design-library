# My Design Library

A personal archive of interface studies, experiments, and design work by Abdallah Obeidat — presented like a quiet, sunlit reading room: collections on paper, one glass navigation bar, and an About page that closes the catalogue.

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

- `src/data/projects.js` — categories, per-collection presentation (`categoryDetails`: description, cover motif, tint), and the seed projects.
- `src/data/profile.js` — name, About copy, and contact links. A link with an empty `href` is hidden.
- `src/components/`
  - `AppFrame` — floating glass navigation (Library / About) with a sliding active tab.
  - `CategoryCard`, `CategoryCover` — the collection shelf and its drawn SVG covers (replaced by a design's preview image once one exists).
  - `DesignCard`, `ArtifactFace` — designs inside a collection.
  - `InspectionView` — design detail dialog (`Esc`, `←` / `→`).
  - `ArtifactPanel` — add / edit a design.
  - `AboutSection` — about, contact and colophon.
- `src/App.jsx` — page composition, collection drill-down, search / sort, persistence.
- `src/styles.css` — tokens, layout, and responsive rules.

Opening a collection updates the URL (`#collection/websites`, `#collection/all`), so the browser's back button returns to the shelf and collections can be linked directly.

The collection is stored in the current browser's `localStorage` (key `liquid-atelier-projects`). "Add design" (also `Ctrl/⌘ + K`) accepts a preview image URL or a local image file, plus collection, tags, supporting images, and a source URL. No backend is involved.

## Visual system

- **Paper** `#F6F3EC` page, `#FCFBF7` surfaces, **sand** `#ECE5D8` for the About sheet.
- **Ink** `#22202E` text, `#5F5A70` secondary text (≥ 4.5:1 on every surface).
- **Iris** `#5A549E` — the single accent: active states, focus rings, counts, links.
- Cover tints from one family: lavender `#E6E3F1`, sand `#EEE6D8`, pearl `#E7E7EB`.

Typography pairs **Newsreader** (display, with its italic for emphasis) with **Hanken Grotesk** (interface and body). Glass is used only for the navigation. Motion is limited to hover lift, view fades, and the nav indicator, and is disabled under `prefers-reduced-motion`.

On desktop the library overview is composed to fit one viewport (≥ 900 × 700); on mobile the collections become a scrollable index.
