# Nordic Specimen Vault / Personal Design Library

A private experimental UI/UX design archive, presented as a digital exhibition: a Nordic architectural hall where every design is treated as an individual artifact — framed, labelled, and preserved.

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

- `src/data/projects.js` — project content model and categories.
- `src/components/` — shell (`AppFrame`), entrance hall (`VaultScene`), artifact framing (`ArtifactFace`, `Exhibit`), inspection chamber (`InspectionView`), acquisition panel (`ArtifactPanel`), brand mark and icons.
- `src/App.jsx` — page composition and library interactions.
- `src/styles.css` — semantic design tokens, responsive layout, and visual language.

The collection is stored in the current browser's `localStorage` (key `liquid-atelier-projects`). The "New artifact" flow (also reachable with `Ctrl/⌘+K`) accepts a preview image URL or a local image file, and supports categories, tags, supporting images, and a source URL. No upload service or backend is implied.

## Visual system

Five materials carry the whole composition:

- **Nordic Charcoal** `#1F2933` — the architectural foundation: walls, recesses, environment.
- **Fjord Gray** `#6B7280` — intermediate planes, smoked glass, dimensional blocks.
- **Cloud Gray** `#D1D5DB` — translucent partitions, mats, borders, quiet transitions.
- **Snow Cream** `#F7F7F2` — the canvas that presents the artwork and readable content.
- **Warm Wood** `#A68A64` — a rare, physical accent: plinths, rails, labels.

Typography pairs `Archivo` (signage-grotesque) with `DM Mono` (exhibition labels). Motion is controlled — a damped pointer parallax in the entrance hall, reveal-on-arrival for rooms, and respectful treatment of `prefers-reduced-motion`.

## Keyboard

- `Ctrl/⌘ + K` — introduce a new artifact
- `Esc` — leave the inspection chamber or acquisition panel
- `← / →` — move between adjacent exhibits while inspecting

## Visual asset

The visual environment is composed in CSS 3D and SVG filters and stays lightweight; the images in `public/` are project assets and are not required for the core layout.
