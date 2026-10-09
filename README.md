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
npm run test:ux
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
- `src/index.ts`: stable source-first import entry; includes reusable `LibraryIcon` independent of the docs UI. The icon component takes an optional `spriteBaseUrl` and defaults to `/icons/`, so it also works outside Vite.
- `src/visuals`: source animation engines; product previews make no backend calls.
- `src/brand`: documentation/gallery pages, not production components.
- `src/gallery`: gallery mounts only.

Original user's reference archives contain 4 SVG brand marks and 274 Feather / 1050 Phosphor SVGs. Logotype palette variants and the original website geometry inform the brand gallery. Feather and Phosphor catalogs are built from maintained official MIT Iconify packages; **their names/paths may differ from individual Figma-exported SVGs**, so treat the 2 sets as normalized extensions, not byte-identical copies of the archives.

## Licensing

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the exact extension packages and license references.


Website icons and APCOSYS logo: first-party brand assets. Feather and Phosphor: MIT (third-party assets); Lucide: ISC; Morphicons: MIT. Retain license/attribution notices in redistributed work. Avoid combining stroke and fill families within a single navigation toolbar.

## Workflow

- Prefer tokens and existing components before creating new CSS.
- Compare every adjustment with the production `apcoweb` site at mobile, desktop and short-desktop widths.
- Respect keyboard focus, contrast, reduced motion and visibility-based animation cleanup.
- Build/typecheck with `npm run build`. CI publishes GitHub Pages from main.

This is a source-first library, not an npm package. It can be split into a versioned design-system package later without putting the docs/gallery runtime into shipped components.

## Fidelity of published components

[Component-by-component source audit](docs/SOURCE_PARITY.md) classifies every item as an unchanged upstream source, an i18n-free port or a gallery adapter.

Import the production CSS token stack and the extracted source rules when reusing controls outside this gallery. Do not copy the gallery's card sizing rules into product interfaces.

```tsx
import { MotionProvider, PlanCard, LanguageBadge, SiteModal } from './index';
import './styles/tokens.css';
import './styles/theme-page.css';
import './styles/source-components.css';
import './styles/site-fidelity.css';

// Mount MotionProvider above controls and honor device reduced-motion preferences.
<MotionProvider><PlanCard id="plus" period="monthly" /></MotionProvider>
```

The original APCOSYS PLUS plan is $40 / month (not a placeholder $89).


## Documentation portal navigation

The published site is a responsive design-system documentation portal. Navigation is built into React and does not depend on an external docs/CMS platform.

- **Desktop:** fixed left navigation, a focused reading column, and a contextual table of contents on extra-wide screens. The sidebar can be collapsed.
- **Mobile:** an accessible off-canvas navigation menu; documentation contents have a single readable column.
- **Search:** `⌘K` on macOS / `Ctrl+K` on other platforms or the search control in the header. The indexed items include routes, 28 components and 17 color tokens. Arrow keys select and Enter opens a result.
- **Deep links:** `#overview`, `#foundations/colors`, `#foundations/typography`, `#components/button`, `#icons/phosphor`, `#guidelines/usage`.
- **Source of navigation:** `src/docs/navigation.ts` defines the hierarchy, section URLs, search index and the contextual table of contents. `src/docs/DocsChrome.tsx` contains only the shell interaction/accessible navigation, not design components.
- **Adding a page:** register its address and label in `src/docs/navigation.ts`, route it through `src/App.tsx`, and author page content under `src/brand/` or `src/docs/`. Keep implementation source code under `src/components/` and `src/visuals/`.

Legacy `#components`, `#foundations`, `#icons`, and `#guidelines` anchors still work. React demos, tokens and asset source remain separate from the docs UI.

