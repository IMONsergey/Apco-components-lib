# APCOSYS Design Library — R9 independent audit and hardening

Date: 9 October 2026. Baseline: `18292f8016ecda4e669f4d9b4cbcb500f70fad1c` (R8).
Scope: the documentation library and its draft workflows. Target: existing PR #1 / `feat/token-draft-workbench-r7`. The main branch, `apcoweb`, approved token values, fonts, logo geometry and source UI components are not changed by this audit.

## Summary

The audit reproduced failures in actual browser interactions, rather than treating the previous 36 green tests as sufficient proof. The release candidate now passes **60/60 Playwright tests**, including **24 new regression cases**. TypeScript/Vite build and full source/download token consistency checks pass.

The independent runtime audit checked six documentation routes in two themes: **12 page/theme combinations, zero axe violations** for its WCAG 2 A/AA and 2.1 AA rule tags. Separate tests check open navigation/search dialogs. These results do not constitute full manual screen-reader certification or all-browser WCAG compliance.

## 1. Reference/draft integrity — corrected critical behaviour

| Reproduced R8 failure | R9 correction and evidence |
| --- | --- |
| The approved color row displayed `#F6F6F6` but copied an inactive draft `#AABBCC`. | Reference copy now reads the source entry for the active theme. The test edits the draft, leaves edit mode and checks the actual clipboard. |
| Spacing showed an approved 16px label with a 28px draft bar. | Both the label and specimen use reference values outside edit mode. |
| Radius showed an approved 5px label with a 22px draft specimen. | Reference radius and its border state are restored; reference screenshots are compared before/after editing. |
| Escape blurred the input and committed valid pending HEX / numeric values. | Cancellation is explicitly tracked before blur. Enter applies; Escape cancels. Both input types have regression cases. |
| Edited JSON inherited the original `verifiedAgainst` label and spacing lost its CSS-name mapping. | Exports identify themselves as unverified drafts, separate source provenance and include sanitized overrides plus stable spacing token names. |
| A light CSS override could affect dark mode when appended after the source theme styles. | Light values use `:root:not([data-theme="dark"])`. A browser test applies exported CSS and checks actual computed variables in both themes. |

Changed cells expose their approved value without an extra disclosure. Comparison previews duplicate only when the selected theme actually has edits. Contrast labels use approved text colors, so a deliberately low-contrast experiment cannot make its own warning unreadable.

## 2. Safe editing, recovery and export

The numeric allowlists and defaults now live in one pure model. Unsupported keys, out-of-range numbers, wrong increments and arbitrary color strings are discarded before export. Tests cover malformed storage objects and attempted CSS injection values.

Undo/Redo retains up to 30 changes for the app session, including reset. Combined Spacing/Radii reset is atomic. Undo history is intentionally not persisted across reloads. The draft provider lives above page routing, so a temporarily unavailable storage API no longer destroys edits when navigating to Icons and back.

Storage failures now produce a visible warning: edits still work in memory, but must be exported before reload. Legacy color migration writes the new draft before removing the previous entry. Cross-tab synchronization and shared editing are not claimed.

One clipboard hook handles colors, exports, component code, guide snippets, icon code and Morphicons. Feedback resets when its content, theme or page changes, expires automatically and ignores stale asynchronous completions. Clipboard denial displays selectable content rather than silently failing.

## 3. Navigation and keyboard behaviour

Mobile navigation now has actual modal semantics, initial focus, Tab containment, an inert background, scroll locking and focus restoration. Selecting a page moves focus into its content. A desktop collapsed-sidebar setting no longer hides mobile navigation after resizing across its 1000px breakpoint.

Search restores keyboard focus to its opener, does not intercept slashes inside editable content and does not navigate when Enter activates its close button. Empty results cannot produce a negative active index. Prepared lowercase search fields avoid rebuilding the same strings on every keypress. Search includes scalar token names, not just colors and components.

The skip link focuses content without corrupting the route hash. Invalid or malformed routes fall back to a usable section. Breadcrumbs/page titles use readable labels. The guide table of contents includes the developer section, and back-to-top honours reduced motion.

## 4. Icons, readability and failure isolation

Feather's generator used an incorrectly escaped regular expression: nested fixed stroke widths remained in the SVG sprite. Removing them lets the selected stroke be inherited. Copied JSX now includes the selected size and stroke for native/Feather icons; Phosphor stays fill-based. The consistency gate verifies that generated Feather symbols do not contain nested `stroke-width` attributes.

Dark documentation text no longer uses the low-contrast action-fill color in place of a text accent. Current navigation uses primary ink. Disabled-state examples dim only the decorative glyph, not explanatory labels. Source variable names wrap rather than becoming inaccessible ellipses. Scrollable code examples are keyboard-focusable.

Both edited motion durations have live examples and respect reduced-motion preferences. A failed lazy animation is isolated to its preview: the title, source code and navigation remain usable, with a reload recovery action. A network-abort browser test verifies failure and subsequent recovery.

## 5. Responsive and visual checks

The new editing tests cover **320, 340, 375, 599, 899, 1000, 1001, 1440 and 1920px**, in both themes, using extreme valid values for Colors, Typography, Spacing, Layout and Motion. This adds 90 edited section/width/theme combinations and reference-mode checks. Existing component/mobile-navigation coverage remains.

A separate R8/R9 screenshot comparison covers eight interface components (Double Button, Plain Button, Search Input, Icon Button, Tags, Billing switch, Pricing Card and Plan button), in two themes at 375px and 1440px: **32 comparisons**. All dimensions match. **20 are pixel-exact**; the other 12 differ in only **4–47 pixels**, below **0.01%** of each image, with maximum per-channel differences of 1–7 on a 0–255 scale. These small raster differences are recorded, not described as pixel-exact. All 16 mobile captures are exact. The source component implementation and its approved style files are unchanged.

Reference radius comparisons normalize fractional element placement before capture: outward-rounded screenshot bounds otherwise include one unrelated background row. No component pixels are masked. Current desktop/mobile documentation states were also inspected visually.

## 6. Test and release gate

| Check | Result |
| --- | --- |
| TypeScript + production Vite build | Pass |
| Source/downloaded JSON deep equality | Pass |
| 17 semantic colors × two themes; 286 Feather, 1,527 Phosphor and four logo assets | Pass |
| Full Playwright suite | 60/60 passed locally |
| New R9 regression cases | 24, included above |
| Runtime axe audit | 12/12 route/theme combinations without violations in the selected rule tags |
| Representative component comparison | 32 checked; exact/tiny-difference breakdown above |
| GitHub main / published Pages / separate product repositories | Not modified |

The PR gets a dedicated read-only validation workflow. Browser installation is explicit in both validation and Pages pipelines. Tests use an isolated port and cannot accidentally pass against another development server. GitHub CI status is reported independently after pushing; local success is not presented as an already completed remote run.

## Remaining boundaries

This remains a local draft experiment, not a production theme-management backend. Typography is a specimen-scale extension; other portable `--ds-*` variables require explicit adoption by consuming components. Manual assistive-technology review, exhaustive WebKit/Firefox/mobile-device coverage, deterministic snapshots of all animation frames and consolidation of the entire historical CSS stack were not completed. Broad CSS rewrites without stronger visual coverage were deliberately excluded from this patch.

Reproduction: `npm run build`, `npm run test:design-system`, `npm run test:ux`; `npm run audit:runtime` against a running development server. See `verification-r9.json` for machine-readable evidence scope.

Technical references: [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [MDN custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots).
