# R10 — less friction, fewer interruptions

Baseline: `d80f16534c92b5918f90265a5f60c1d6962aded2` (R9). Scope: documentation UI only, in the existing review branch. Main, approved assets, production component code and source tokens remain unchanged.

## Reproduced problems

| User action | R9 observation | R10 result |
| --- | --- | --- |
| Apply the first color change on a 375px viewport | The field moved down 499.33px as a second preview and actions appeared above it | The field stays in place; the regression allows at most 1px and measured 0px |
| Start using the mobile palette editor | First field at document Y=763px before edits, then Y=1262px after the first edit | First field at Y=566px; one compact preview instead of a growing comparison stack |
| Return from a component detail | Category changed to All and scroll reset to 0 | Previous category, search, scroll and card focus restored; measured 1708px → 1708px |
| Leave and revisit Icons | Size reset to 24px and search cleared | Family, size, stroke, search and loaded-result limit survive navigation within the session |
| Use keyboard search on a 375×420 viewport | Selected eighth result was below the visible results viewport | Selection scrolls only as far as needed to remain visible |
| Paste shorthand or plain HEX | Valid values such as `09f` or `1122aa` were rejected | Normalized to canonical `#RRGGBB`; invalid input and Escape remain safe |
| Undo the last change | Focused Undo button disappeared and focus fell to the document body | Controls retain their layout; focus moves to the available Redo action |

These measurements concern specified browser interactions, not every possible scroll or animation state.

## What became simpler

Colors now has **one** compact draft sample. The second reference preview, repeated edit counts, promotional eyebrow, extra status tags and duplicate contrast indicators were removed. Approved values remain beside edited values; contrast pairs remain visible in their own section, outside the editable sample colors.

Every foundation page uses the same **Edit draft / View reference** entry point. The page title stays first; the compact draft actions follow it, rather than becoming a new panel above the heading. A reserved action row appears when entering edit mode, before any value changes. Changing a value no longer inserts a large new block above the active field. Copy status does not change button width. Section resets move to a quiet footer rather than competing with the page title.

Edit modes are remembered for this app session, independently for each foundation. Returning to a page does not require reopening the editor. Reload starts in reference mode; the existing local draft storage and Undo/Redo boundaries are unchanged.

## What became more predictable

The component Back action and browser Back restore the actual catalog context. The result count reflects the active filter. Multi-word component search matches words across the name and description instead of requiring one contiguous phrase.

The icon browser preserves existing controls rather than adding more controls or a separate management screen. Explicit icon deep links still select the matching icon. Switching icon families in place does not unnecessarily jump the page or move keyboard focus into unrelated content.

Heavy visual engines still stop/unmount offscreen. Simple interactive component examples remain mounted after first exposure, so a disclosure does not unexpectedly reset just because the user scrolled past it.

Manual color-copy fallback appears in the clicked row rather than far above it. Numeric and HEX fields select their values on focus, and HEX accepts optional `#`, three-digit shorthand and surrounding whitespace. Colors are stored and exported in the same canonical format as before.

Keyboard search keeps the active option visible on short screens and ignores composition events. Route restoration does not repeatedly steal focus from an already focused input. A hidden local navigation duplicate and the redundant focused-page scroll effect were removed.

## Verification

- Production TypeScript/Vite build: passed.
- Approved JSON/CSS, asset and icon consistency gate: passed.
- Full Chromium Playwright suite: **71/71 passed**, including **11 R10 user-flow tests** plus the retained R9 accessibility, export, integrity, error-recovery and responsive checks.
- Additional targeted engine smoke: Chromium, Firefox and WebKit at 375px and 1440px; five user flows each, **30/30 checks passed**. These cover editing/reference/Undo, theme and overflow, navigation, short-screen keyboard search and catalog return.
- First-edit movement in those six engine/width combinations: **0px**.
- Current mobile and desktop documentation states inspected visually.

Older test expectations were updated where the intended UX changed: one preview instead of two, one edit-action label, and a remembered edit state. Source integrity, reference/draft isolation, invalid-value protection and accessibility checks remain active.

## Boundaries

No new backend, accounts, token groups, dashboard, theme manager or side panel. Cross-browser checks are targeted smoke tests, not the entire 71-test suite in every engine or a real-device certification. The draft remains local, and portable token aliases still require deliberate integration into a consuming project.

Commands: `npm run build`, `npm run test:design-system`, `npm run test:ux`. Optional targeted engine checks: install the required Playwright browsers, start the dev server, then `npm run audit:cross-browser`; `AUDIT_URL` and `AUDIT_OUTPUT` override its server and evidence directory.

References: [scrollIntoView nearest](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), [focus without scrolling](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus), [Playwright browser engines](https://playwright.dev/docs/browsers).
