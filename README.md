# APCOSYS / Motion Library

An independent, browsable gallery of **18** reusable visual and interaction components. The motion engines are copied directly from [apcoweb](https://github.com/IMONsergey/apcoweb) while the gallery and standalone adapter components live only in this repository.

**Gallery:** https://imonsergey.github.io/Apco-components-lib/

## Scope

| Group | Components | Rendering |
|---|---|---|
| Visual engines | Turquoise Flow, Dot Cascade, Signal Globe, Ice Sphere Waves, Rosette, Echo Rings, AI Chat Orb, OrbCube Loader | Canvas 2D / SVG / React |
| Product motion | Query, Results, Host, Evidence, Suggestions, API Developer Demo | Original DOM / SVG / GSAP custom elements |
| Interface motion | Digit Odometer, Double Button, Animated Details, Partner Marquee | React / WAAPI / CSS |

Each component is accompanied by its exact source path, usage snippet and isolated live preview. The product scenes are **visual demonstrations**, not forms, actual search requests or backend integrations.

## Run locally

Requires **Node 22.12+**.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The two original uploaded React components are committed directly as source files under `src/visuals/uploads/`. The original source implementation is preserved; each component has its own README, and no additional runtime dependency is required for either component.

## Integration

Import the original rendering components directly rather than importing the gallery interface.

```tsx
import TurquoiseFlow from './visuals/flow/TurquoiseFlow';
import SignalGlobe from './visuals/globe/SignalGlobe';
import OrbCubeLoader from './visuals/uploads/orb-cube/OrbCubeLoader';
import AIChatOrb from './visuals/uploads/ai-chat/AIChatOrb';

export function Example() {
  return <>
    <TurquoiseFlow theme="dark" fps={30} />
    <SignalGlobe fps={30} />
    <OrbCubeLoader size={160} color="#ffffff" />
    <AIChatOrb state="thinking" size={72} />
  </>;
}
```

For product animations, use the new thin wrappers around the **unchanged upstream custom elements**:

```tsx
import ProductScene from './visuals/product/ProductScene';
import ApiScene from './visuals/api/ApiScene';

<ProductScene scene="results" />
<ApiScene />
```

Products scenes accept `query`, `results`, `host`, `evidence` or `suggestions`. All DOM controls inside scenes are intentionally **inert**, with no API calls. `GSAP 3.13` is a direct runtime dependency, matching upstream.

### Technical principles

- React 19, TypeScript 5, Vite 8 and GSAP 3.13; versions pinned to the current upstream lockfile.
- Rendering engine JS / TSX and style modules preserved from upstream, not visually reimplemented.
- No global animation loop is created by the gallery. Previews are mounted only near the viewport; unmounted on exit.
- Device motion preference and document visibility are respected by original engines.
- Theme and speed in the gallery affect supported engines; self-contained demo scene timelines preserve upstream animation timing.
- Standalone API/product adapters own each custom element and clean up on unmount.
- SVG logo assets in `public/assets/partners/` remain local.
- Source is grouped by motion engine, not copied wholesale from the marketing site.

## Upstream and provenance

- `src/visuals/dots`, `flow`, `globe`, `shapes`, `waves` — exact copies from `IMONsergey/apcoweb`.
- `src/visuals/api/api-developer-demo.js` and `src/visuals/product/product-scenes.js` — original full GSAP engines.
- `src/components/ui/AnimatedPrice.tsx`, `DoubleButton.tsx`, `Icon.tsx`, `src/hooks/useMotion.ts`, `src/content/pricing.ts` — original implementation.
- `AnimatedDetails.tsx` — the original animation logic with the marketing site's locale wrapper removed, allowing use in isolation.
- `PartnerMarquee.tsx` — standalone extraction of the seamless two-copy motion pattern.
- `src/visuals/uploads/ai-chat/AIChatOrb.jsx` and `src/visuals/uploads/orb-cube/{OrbCubeLoader.tsx,OrbCubeLoader.css}` — original user-provided source files from both ZIP archives (verified byte-for-byte against a SHA-256 source manifest before committing).

This repository is a source library with a gallery, **not an npm package**. Components should be copied or imported into an application with compatible dependencies; the directory is not yet a published semver-stable API.

## Publishing

`.github/workflows/pages.yml` runs a clean `npm ci`, strict `tsc` build and GitHub Pages deployment on every `main` push. The site uses the Vite base path `/Apco-components-lib/`. The upstream `apcoweb` application is not modified.
