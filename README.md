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
npx playwright install chromium
npm run test:design-system
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

## Foundation drafts: inspect → try → export

**Brand styles** opens the approved reference. Essential values, code and examples are visible without expanding panels. **Edit draft** activates a separate local draft; **View reference** returns both labels and specimens to approved values. Reference copy always copies what is displayed, never an inactive draft.

| Foundation | Editable draft | Preserved reference |
| --- | --- | --- |
| Colors | 17 semantic roles, separately for light and dark | Source colors and logo assets |
| Typography | Five specimen size scales, 70–130%, 5% increments | Published responsive size expressions and font families |
| Spacing | 14 stable token names, 4–240px on a 4px grid | Original token identities and approved values |
| Corner radii | Three roles, 0–32px | Approved radii |
| Layout | Maximum content width, 960–2400px, 8px increments | Compound gutter, header and breakpoint rules |
| Motion | Disclosure and theme duration, 80–800ms, 20ms increments | Easing and hover range; reduced-motion behaviour |

**Enter or blur applies a valid input; Escape cancels the pending edit.** HEX accepts three or six digits, with an optional `#` and surrounding whitespace, then stores canonical `#RRGGBB`. Invalid inputs revert rather than corrupting the draft. Changed values show their approved origin. Colors uses one compact draft preview; reference values and the contrast section stay visible. The action row reserves its space before the first edit, so applying a value does not push the editor away. Both motion durations have live examples. Color contrast readings concern only the two demonstrated text/background pairs, not the entire design system.

### Recovery and storage

The shared draft survives navigation between all application pages. Each foundation also remembers its edit/reference mode within the current session; reload returns to reference mode. It is saved to this browser when local storage is available. Valid R7 color drafts migrate from `apcosys-palette-draft-v1` into `apcosys-design-draft-v2`; migration removes the legacy entry only after a successful write.

**Undo / Redo** retain up to 30 changes during the current app session, including section resets and **Reset all**. A combined Spacing / Radii reset is one undoable change. History is not persisted across reloads. When browser storage is blocked, the editor remains usable in memory and explicitly warns that a reload will lose the draft; download the JSON to preserve it. This is not a collaborative or cross-tab synchronized editor.

### CSS and JSON exports

A shared toolbar exports all edited sections. Clipboard feedback is bound to the actual value and expires; if permission is denied, selectable code is displayed instead. The approved JSON download always remains unchanged.

- **CSS:** edited color variables are scoped to the correct theme. Light overrides use `:root:not([data-theme="dark"])`, so adding them after the original theme stylesheet cannot leak a light value into dark mode. Non-color values use portable `--ds-*` aliases; components must explicitly adopt them.
- **JSON:** includes `draft: true`, `verificationStatus: "unverified-draft"`, `draftSchema: "apcosys-draft-v3"`, the source reference and sanitized `overrides`. The original verification label is not applied to edited values. `draftExtensions.spacingTokens` preserves stable CSS names even when spacing values change. Typography scales stay in explicit preview-extension metadata rather than silently rewriting published `clamp()` rules.

```css
/* Load source styles first, then the reviewed draft CSS. */
.example-panel {
  padding: var(--ds-space-4, 16px);
  border-radius: var(--ds-radius-panel, 7px);
}
```

There is no backend write, auto-publishing, font download or silent change to the approved product. Review an exported draft in the consuming interface before adopting it.

## Quality checks

The current audit is [R10: less friction, fewer interruptions](docs/AUDIT_R10.md); [R10 verification metadata](docs/verification-r10.json) records its tested scope. The [R9 integrity/accessibility audit](docs/AUDIT_R9.md) remains available as history. Earlier audits remain as history, not a claim that every subsequent state has been independently verified.

Pull requests to `main` run an isolated build, complete token consistency checks and browser tests in `.github/workflows/quality.yml`. Playwright uses its installed Chromium and a dedicated server on port 4276, never another agent's development server. The Pages workflow only publishes `main` and separately installs the required browser.

For reproducible accessibility reports and representative component screenshots, start `npm run dev` in another terminal, then run:

```sh
npm run audit:runtime
# Other server / comparison directory:
AUDIT_URL=http://127.0.0.1:5187/Apco-components-lib/ \
AUDIT_PHASE=after AUDIT_OUTPUT=artifacts/audit npm run audit:runtime
```

Optional targeted checks across three engines: `npx playwright install chromium firefox webkit`, then `npm run audit:cross-browser` against the running dev server. This is a focused smoke check, not a claim of exhaustive browser coverage.

The runtime audit examines six documentation routes in both themes and captures eight interface components at mobile and desktop widths. Generated evidence stays in ignored `artifacts/`; it is not included in the shipped application.

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
- **Mobile:** modal off-canvas navigation with focus containment, background scroll locking and focus restoration; documentation contents have a single readable column.
- **Search:** `⌘K` on macOS / `Ctrl+K` on other platforms or the search control in the header. The index includes routes, 28 components, icon names, colors and scalar token names for spacing, radius, type and motion. Arrow keys select and keep the active result visible, including on short screens; Enter opens it. Returning from a component restores its catalog filter and scroll position. Icon browsing preferences stay intact during the session.
- **Deep links:** `#overview`, `#foundations/colors`, `#foundations/typography`, `#components/button`, `#icons/phosphor`, `#guidelines/usage`.
- **Source of navigation:** `src/docs/navigation.ts` defines the hierarchy, section URLs, search index and the contextual table of contents. `src/docs/DocsChrome.tsx` contains only the shell interaction/accessible navigation, not design components.
- **Adding a page:** register its address and label in `src/docs/navigation.ts`, route it through `src/App.tsx`, and author page content under `src/brand/` or `src/docs/`. Keep implementation source code under `src/components/` and `src/visuals/`.

Legacy `#components`, `#foundations`, `#icons`, and `#guidelines` anchors still work. Invalid child routes return to a usable section reference rather than an empty page. A failed lazy demo shows a reload action while keeping the component code and navigation available. React demos, tokens and asset source remain separate from the docs UI.

