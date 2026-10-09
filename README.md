# APCOSYS Brand System

Live: https://imonsergey.github.io/Apco-components-lib/

React + TypeScript + Vite. The production APCOSYS website at https://imonsergey.github.io/apcoweb/ is the visual reference; this repository is the **reusable design-system source**.

## Sections

- **Components:** 28 extracted animations and UI patterns, including product GSAP scenes, CTA controls, FAQ, search, navigation and pricing.
- **Foundations:** logos for both themes, 17 semantic color roles, Instrument Sans and IBM Plex Mono, type scales, spacing/radii, layout, responsive breakpoints and motion.
- **Icons:** original APCOSYS icon set, offline Feather + regular Phosphor SVG catalogs and interactive [Morphicons](https://www.morphicons.com/) examples.
- **Guidelines:** constraints, states, accessibility, recommended usage and source links.

## Install

```sh
npm ci
npm run dev
npm run build
```

`postinstall` runs `scripts/generate-icons.mjs`, which converts pinned local npm icon data to SVG sprites and the searchable manifest. Nothing is downloaded by the browser from a third-party icon service.

## Design tokens

- `src/styles/tokens.css` — preserved published colors, fonts and layout; CSS source of truth.
- `src/styles/theme-page.css` — dark-theme semantic overrides.
- `src/styles/system-primitives.css` — portable spacing and component aliases (normalized extension).
- `src/tokens/apcosys.tokens.json` — auditable light/dark token export and source references.
- `public/tokens/apcosys.tokens.json` — downloadable identical export.
- `public/assets/brand/` — brand wordmark and standalone symbol variants for light and dark contexts.

Do not casually replace approved page geometry with new primitives. The spacing normalization and minimum 44px touch target are **system recommendations**, not claims that the published site already enforced all of them.

## Source boundaries

- `src/components/ui`: original UI components (including DoubleButton, AnimatedPrice, AnimatedDetails, BillingSwitch).
- `src/components/system`: standalone adapters preserving the page's published class treatment.
- `src/index.ts`: stable source-first import entry; includes reusable `LibraryIcon` independent of the docs UI.
- `src/visuals`: source animation engines; product previews make no backend calls.
- `src/brand`: documentation/gallery pages, not production components.
- `src/gallery`: gallery mounts only.

Original user's reference archives contain 4 SVG brand marks and 274 Feather / 1050 Phosphor SVGs. Logotype palette variants and the original website geometry inform the brand gallery. Feather and Phosphor catalogs are built from maintained official MIT Iconify packages; **their names/paths may differ from individual Figma-exported SVGs**, so treat the 2 sets as normalized extensions, not byte-identical copies of the archives.

## Licensing

Website icons and APCOSYS logo: first-party brand assets. Feather and Phosphor: MIT (third-party assets); Lucide: ISC; Morphicons: MIT. Retain license/attribution notices in redistributed work. Avoid combining stroke and fill families within a single navigation toolbar.

## Workflow

- Prefer tokens and existing components before creating new CSS.
- Compare every adjustment with the production `apcoweb` site at mobile, desktop and short-desktop widths.
- Respect keyboard focus, contrast, reduced motion and visibility-based animation cleanup.
- Build/typecheck with `npm run build`. CI publishes GitHub Pages from main.

This is a source-first library, not an npm package. It can be split into a versioned design-system package later without putting the docs/gallery runtime into shipped components.
