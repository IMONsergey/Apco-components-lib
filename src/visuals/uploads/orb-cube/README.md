# APCOSYS · OrbCubeLoader

Isolated React 19 / TypeScript / Canvas 2D loading visual, refactored from the supplied Originkit-style code. The component is **not connected to the site or application**.

## Layout

Copy `src/visuals/orb-cube/` into the matching directory in a React + Vite + TypeScript project. The TSX imports its CSS directly. No new packages are needed.

## Usage

```tsx
import OrbCubeLoader from './visuals/orb-cube/OrbCubeLoader';

// Overlay on a dark background, localized accessible text:
<OrbCubeLoader label="Loading search results" size={160} />

// Adaptive size and a semantic theme token:
<OrbCubeLoader
  className="search-loading-orb"
  label="Загрузка результатов поиска"
  color="var(--brand-mark)"
  density={300}
  fps={30}
/>

// Mount only when the actual API request is pending:
{isLoading && <OrbCubeLoader label="Загрузка" />}
```

```css
.search-loading-orb { width: clamp(92px, 12vw, 180px); height: auto; aspect-ratio: 1; }
```

## Props

| Prop | Default | Purpose |
| --- | --- | --- |
| `label` | `'Loading'` | Accessible status, localize in calling UI |
| `size` | CSS 160px | Square dimensions, otherwise control with class/style |
| `color` | `'#FFFFFF'` | Dot color; supports `var(--token)` and theme inheritance |
| `density` | `450` | Number of points (30–450) |
| `dotSize` | `1.63` | Relative radius multiplier |
| `speed` | `1` | 1 cycle per 4.6 seconds; `0` holds frame |
| `fps` | `30` | Frame-rate budget (1–60) |
| `paused` | `false` | Display current static frame and suspend animation |
| `className`, `style` | — | Presentation overrides |

## Runtime behavior

- Original spherical dots → rounded cube → sphere cycle, 3D rotation, depth opacity and perspective retained.
- Point positions are precomputed; projected dot storage is reused instead of allocating in each frame.
- Fit sampling runs after resizing, not every rendered frame; no global unbounded cache.
- Device pixel ratio limited to 2; drawing only occurs at configured fps.
- `ResizeObserver` resizes the canvas, `IntersectionObserver` halts offscreen frames, page visibility halts background frames.
- System `prefers-reduced-motion: reduce` renders a static frame instead of looping.
- Non-interactive. The screen reader hears the `role=status` label; the canvas remains decorative.
- Works without GSAP, Originkit and app-specific imports.

## Scope

This is **only** a prepared visual component: no insertion into `App.tsx`, routing, loading state machine, or backend request interception. In `IMONsergey/Apco` the current repository contains design/knowledge assets, not the SaaS production frontend; `IMONsergey/apcoweb` is the React/Vite reference for source conventions.
