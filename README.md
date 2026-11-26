# Liz Novikova Portfolio

A static Astro portfolio for Liz Novikova’s artwork and writing.

## Run locally

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`.

## Edit content

- **Projects:** `src/content/projects/` for titles, descriptions, covers, and media references.
- **Homepage ribbon:** `src/pages/index.astro` for the preview order.
- **Writing:** `src/lib/writings.ts` for the index and `src/content/writings/` for full essays.
- **Bio and contact:** `src/pages/bio.astro`.
- **Media:** `src/assets/` for source images and `public/media/` for files served as-is.

## Build and test

```sh
npm run build
npm test
```

The Playwright suite uses Google Chrome and starts its own preview server. Deploy the generated `dist/` directory to a static host.
