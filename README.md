# APCOSYS Components

[Gallery](https://imonsergey.github.io/Apco-components-lib/) · [APCOSYS site](https://imonsergey.github.io/apcoweb/)

20 independently previewed components from the APCOSYS website and the two supplied archives.

## Stack

React 19 · TypeScript 5 · Vite 8 · Canvas 2D · SVG · GSAP 3.13 · Web Animations API.

## Start

```bash
npm ci
npm run dev
npm run build
```

## Structure

- `src/visuals/{flow,dots,globe,waves,shapes}`: original website renderers.
- `src/visuals/{product,api}`: original GSAP product animations, with thin React mounts.
- `src/visuals/uploads`: original AIChatOrb and OrbCubeLoader sources.
- `src/components/ui`: site UI components, including CTA buttons and pricing switch.
- `src/styles/tokens.css`, `source-components.css`, `micro-motion.css`, `trust-marquee.css`, `theme-demos.css`: original website design variables and interaction styles.
- `src/gallery`, `src/App.tsx`: preview gallery only; not part of production components.
- `src/catalog.ts`: entry names, source paths, and integration examples.

Original website fonts are stored in `public/fonts`. Each card's source link opens the exact component or styling file.

Components are reused **from source**. This is not a published npm package. Custom-element product scenes are visual-only and make no backend calls. Both the gallery and the original website remain separate projects.

## CI

GitHub Actions builds TypeScript and Vite and publishes to GitHub Pages on `main`.
