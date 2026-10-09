# APCOSYS Design Library — R8 foundation editing and five UX passes

Date: 9 October 2026
Based on: `feat/token-draft-workbench-r7`; merge target `main`.

## Goal

A designer can inspect and test relevant foundation values without touching the approved APCOSYS design system. The interface stays a direct reference, not an admin-like token management product.

### Round 1 — Information architecture / simplicity

Observed: Color drafts existed, while Typography / Spacing / Radii / Layout / Motion were entirely static. Separate management screens would increase navigation and user confusion.

Changed: inline edit modes on the existing five foundation pages and a shared draft model. The approved values stay visible. Radius editing shares the Spacing switch; duplicate controls and extra panels are avoided. A global draft toolbar only appears when there is something to export.

### Round 2 — Token semantics / correctness

Observed: not every published value is a simple scalar. Typography has `clamp()` expressions and body-text responsive variants; desktop/mobile gutters and heights are compound rules. Pretending they are directly interchangeable inputs would destroy the approved responsive system.

Changed: Typography editing uses an explicit 70–130% specimen scale with a separate draft-extension field, *without replacing the source size expression*. Layout edits are limited to the single 1760px maximum width. All compound layout rules remain documented but uneditable. Motion editing is limited to discrete disclosure/theme durations. The original token JSON, brand colors and upstream components are unchanged.

### Round 3 — Error prevention and recovery

Changed: strict allowlists, numeric ranges and increments, invalid-field rejection, keyboard Enter/Escape behavior, section-specific reset, global reset and manual clipboard fallback. State persistence uses a versioned local schema, sanitizes unknown entries and migrates valid R7 color drafts. Approved/downloaded source never reads from the draft.

### Round 4 — Responsive, compact previews and accessibility

Changed: one typography sample per role, 4px grid bars that update without losing source token names, compact mobile radius rows, a bounded max-content-width reference bar and a simple motion demo respecting reduced-motion. Editors have explicit accessible names and visible edit modes.

Coverage: 340/375/599/899/1200/1920px routes and controls in browser tests; additional manual desktop/mobile screenshots.

### Round 5 — Export integrity and regression

One local draft combines both theme palettes, typography-preview scales, spacing, radii, max width and motion durations. Exported JSON is marked `draft: true` with `basedOnVersion`; portable CSS is clearly labelled as opt-in aliases except the published semantic colors. Tests cover both generated formats, invalid input, reload and reset.

Release gate (latest full rerun):
- TypeScript + Vite build
- Design-system integrity test for 17 colors × 2 themes, 286 Feather, 1527 Phosphor and 4 assets
- Playwright regression including existing component/source-fidelity tests plus unified-token tests
- Git diff validation; no main/publication changes without review

## Explicit limitations

This is a browser-local experiment, not a production theme editor. Type scale and portable aliases are intentional extension metadata; consuming products need explicit adoption. Contrast previews represent only the two shown text/surface pairs and do not certify WCAG compliance. External designers do not receive this draft unless exported manually.
