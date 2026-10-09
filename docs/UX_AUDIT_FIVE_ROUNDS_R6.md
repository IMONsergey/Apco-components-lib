# APCOSYS Design Library — five-round UX/UI audit

Date: 9 October 2026  
Project: `IMONsergey/Apco-components-lib`  
Scope: Foundations, Icons, Morphicons, Guides, Components, global documentation, both themes, responsive layouts.

## Objective

Make the library a direct, readable product design reference. Approved design rules must be visible without opening additional disclosure controls. Maintain the published APCOSYS visual system; do not invent mock graphics, new interactions or extra admin panels.

## Round 1 — Information architecture and visibility

**Finding:** Important references were hidden in accordions even though pages had substantial available space. Layout breakpoints, border radii, contrast, logo usage, icon options, states, Morphicons, ten design rules, examples and component usage snippets required unnecessary expansion.

**Changes:** Removed content disclosure wrappers from these references. Sections are ordinary readable articles with headings. Navigation accordions stay as navigation, not content hiding. Component code remains on its documentation page, now visible by default.

**Result:** The reading order is predictable. No "+" controls obscure essential tokens or rules.

## Round 2 — Layout and alignment

**Finding:** The old nested panels produced repeated padding, uneven controls and large blank areas. Four long layout values competed in a constrained row. Icon options were placed in a detached strip and Morphicons appeared inside a panel inside another panel.

**Changes:** A single reference-block structure for auxiliary rules; consistent borders, section spacing and headings. Direct horizontal alignment for Size and Stroke selects. Morphicons and icon-state previews share the normal page grid, without an extra framed sheet. Layout metrics use a responsive grid: three columns on wide pages, two on midsize screens, one on mobile. Improved border radii and breakpoint table sizing on narrow viewports.

**Result:** No artificial empty space below closed reference panels; long values wrap inside their cells.

## Round 3 — Token comprehension

**Finding:** Source values and CSS token names were not all immediately available. The layout reference omitted wide-screen and mobile gutter variants.

**Changes:** Every color row displays its purpose, the CSS custom-property name and its active HEX value, with the existing copy-format control preserved. Layout now documents six real entries: maximum content width, base desktop gutter, wide-screen gutter, mobile gutter, header height and section spacing. The responsive table exposes all eight documented ranges.

**Source of truth:** `src/tokens/apcosys.tokens.json`; no numeric values changed.

## Round 4 — Responsive behavior and wayfinding

**Finding:** Revealing more reference content risks overflow and creates longer pages without useful destinations.

**Changes:** Mapped page contents to actual visible sections. Foundation TOC links now include relevant subdivisions (e.g. responsive breakpoints, contrast, radii); Icons links include size/stroke, states and Morphicons. Standardized grid breakpoints and control alignment.

**Coverage:** Automated checks at 375, 599, 899, 1440 and 1920 px, for Layout, Colors, Icons and Guides; theme switching included. Existing responsive tests for the gallery and mobile navigation remain.

## Round 5 — Regression and publication gate

**Test result:** 28/28 Playwright browser tests passed in the audited branch. Production build and design-system consistency checks passed. Source audit verified 17 semantic colors in both themes, 286 Feather icons, 1,527 Phosphor icons and four brand assets.

**Test issue resolved:** The original viewport test incorrectly searched for “Dark theme” after theme switching. It now selects the theme control and checks that the actual `data-theme` changes in either direction.

**Non-goals:** No changes to published `apcoweb`; no rebuild of the original animated components, no replacement of approved fonts, palette or artwork.

## Remaining quality work, intentionally outside these five rounds

- Manual screen-reader and focus-order review to supplement automated behavioral tests.
- Pixel-diff visual regression snapshots for every interactive component and each brand theme.
- Safe consolidation of historic CSS overrides with proof of pixel equivalence.

**Principle:** Visible by default for essential design reference; controls only where interaction is necessary.
