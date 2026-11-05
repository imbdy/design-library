# My Design Library

A personal archive of interface studies, experiments, and design work by Abdallah Obeidat — designed as a printed exhibition catalogue: a numbered ledger of collections, plates where the work is shown, and an About page that closes the document.

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

- `src/data/projects.js` — categories, per-collection presentation (`categoryDetails`: key `tone`, optional `description`), and the seed projects.
- `src/data/profile.js` — name, About copy, and contact links. A link with an empty `href` is hidden.
- `src/components/`
  - `AppFrame` — top bar (Library / About & contact); frosted only once content scrolls beneath it.
  - `CollectionIndex` — the ledger: numbered, ruled list of collections with real counts.
  - `DesignCard`, `ArtifactFace` — designs on the plate. Without a preview image a design shows a typographic title plate in its collection's tone.
  - `InspectionView` — design detail dialog (`Esc`, `←` / `→`).
  - `ArtifactPanel` — add / edit a design.
  - `AboutSection` — about, profile, contact and colophon.
- `src/App.jsx` — page composition (ledger + plate), search / sort, persistence.
- `src/styles.css` — tokens, layout, and responsive rules.

Choosing a collection swaps the plate in place and updates the URL (`#collection/websites`, `#collection/all`), so collections can be linked directly.

The collection is stored in the current browser's `localStorage` (key `liquid-atelier-projects`). "Add a design" (also `Ctrl/⌘ + K`) accepts a preview image URL or a local image file, plus collection, tags, supporting images, and a source URL. No backend is involved.

## Visual system

- **Paper** `#F4F1EA` page, `#FAF8F3` plates, **sand** `#E9E3D6` for About.
- **Ink** `#1F1D1A` text, `#6A6359` secondary text (≥ 4.5:1 on every surface).
- **Ink blue** `#2B4A8B` — the single accent, reserved for interaction and the current place.
- **Collection keys** — six muted paper tones (mist, sage, oat, clay, lilac, straw), shown as swatches in the ledger and as the ground of title plates.

Typography pairs **Newsreader** (display and the ledger, italic marks the current item) with **Schibsted Grotesk** (interface and body). Hairline rules and 3–6px corners carry the structure instead of cards and shadows. Motion is limited to plate fades, hover lifts, and rule/underline indicators, and is disabled under `prefers-reduced-motion`.

On desktop (≥ 900 × 660) the library fills exactly one viewport and the ledger stays pinned while a long plate scrolls; on mobile the ledger becomes a list and choosing a collection scrolls to its plate.
