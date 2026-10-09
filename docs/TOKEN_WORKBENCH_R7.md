# Token workbench (R7)

9 October 2026 — scoped changes to **Brand styles → Colors**.

## Product decision

The original color table remains a read-only reference. **Try color changes** enters a separate editable draft with the same 17 semantic roles. This prevents accidental changes to the approved brand system and retains the existing one-click HEX/CSS-variable copy workflow.

The draft uses the browser's local storage, keyed separately for light and dark themes. Empty/default entries are omitted and an invalid HEX value is rejected on blur. There is no new account, backend, published-site link, or deployment side effect.

Only one preview is rendered before edits. After a token changes, side-by-side approved/draft previews appear, with dynamic body/card and button-text contrast readings. Each reading uses a 4.5:1 AA indicator for normal-size text; it is not a certification of the entire interface.

## Exports

- **Copy CSS:** changed semantic variables only, in light/dark theme selectors.
- **Download draft JSON:** complete token manifest with edits applied, labelled as a draft.
- **Download design tokens (approved):** original, immutable manifest.
- **Reset all:** removes overrides for both themes from this browser.

The CSS source and original JSON are unchanged. Existing brand assets, components, icon registry and responsive geometry are unaffected.

## Quality gates

- TypeScript + production Vite build.
- Source token consistency test.
- Existing documentation, source-parity and mobile navigation browser tests.
- Additional Playwright cases for edit, validation, persistence, reset, theme separation, clipboard/export and horizontal overflow at 375/599/899/1440/1920 px.
- Desktop and mobile screenshots checked locally.

## Limitations

A draft is local to one browser, not collaboration/version control. The preview uses a representative interface sample; it does not validate all design-system components or certify WCAG compliance. Applying exported overrides to a production project remains a deliberate engineering action.
