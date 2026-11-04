# Personal Design Library

The first milestone of a personal UI/UX design portfolio and library. The site is intentionally small and honest while the real body of work grows: it currently presents the library itself as an in-progress project and provides the browsing, filtering, and project-detail foundation for future studies.

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
- `src/components/` — reusable shell, preview, card, detail, and icon components.
- `src/App.jsx` — page composition and library interactions.
- `src/styles.css` — semantic design tokens, responsive layout, and visual language.
