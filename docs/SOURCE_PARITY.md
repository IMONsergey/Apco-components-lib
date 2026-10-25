# Sources and reuse boundaries

Updated 25 October 2026 for the client-facing design library.

## Source versions

| Scope | Source | Revision | Use in this library |
| --- | --- | --- | --- |
| Original brand assets, website controls and decorative visuals | [Apco-components-lib](https://github.com/IMONsergey/Apco-components-lib) | `4f3769b4be2ab7eeecb8f8dc4b5b2aa84360e665` · 9 October 2026 | Existing local components, tokens and assets retained; their public interfaces and usage documentation are extended. |
| Current website product and API excerpts | [APCOCLEAR2](https://github.com/IMONsergey/APCOCLEAR2/tree/92cb513b50f209d991ea5c7c50591fbbe263db7e) | `92cb513b50f209d991ea5c7c50591fbbe263db7e` · 25 October 2026 | Current React markup, scoped styles, SVG artwork and native playback ported into the library. |
| SaaS behavior and component conventions | [Assaasdev](https://github.com/IMONsergey/Assaasdev/tree/7cb2bcfef00acf17cd02f3110fa8cdd1108861e2) | `7cb2bcfef00acf17cd02f3110fa8cdd1108861e2` · 25 October 2026 | Standalone, locally interactive teaching examples. They demonstrate interface composition and state handling; they are not a copy of the application backend. |

The linked source revisions define the comparison baseline. Updating either product does not automatically update this library.

## Component mapping

| Library area | Local source | Notes |
| --- | --- | --- |
| Brand assets | `public/assets/brand/` | Existing wordmarks and symbols; light and dark variants remain separate assets. |
| Marketing colors and typography | `src/tokens/apcosys.tokens.json`, `src/styles/tokens.css`, `src/styles/theme-page.css` | 17 semantic color roles. Public JSON must match source JSON. The font filenames identify their language coverage. |
| Website controls | `src/components/ui/`, `src/components/system/` | Buttons, billing switch, modal, disclosure, locale selector and pricing card. Callbacks and navigation are provided by the consuming application. |
| Current website product excerpts | `src/visuals/product/ProductScene.tsx`, `src/visuals/application/` | Five public scene IDs remain stable: query, results, host, evidence and suggestions. The suggestions ID now presents refinement of a query. |
| Current website API excerpt | `src/visuals/api/ApiScene.tsx`, `src/visuals/application/ApplicationApiScene.tsx` | Account API key, example credit balances and plan limits. Replaces the obsolete datasets/request illustration. |
| Decorative visuals | `src/visuals/dots/`, `flow/`, `globe/`, `shapes/`, `waves/`, `uploads/` | Existing visual engines retained. Decorative illustrations are not network data or product capabilities. |
| SaaS primitives and patterns | `src/saas/` | Self-contained examples using local demonstration state and reserved/example identifiers. Source references and dependencies accompany the examples. |
| Icon catalog | `src/components/ui/Icon.tsx`, `src/components/system/LibraryIcon.tsx`, `scripts/generate-icons.mjs` | Native icons plus locally generated Feather and Phosphor sprites. Preserve third-party notices. |

## Adapters in the current scenes

The current marketing source uses application-level translation, asset and pricing helpers. The library replaces those dependencies with small local adapters:

- `sceneContent.ts` supplies English scene copy and bundled paths for four source SVG assets. Selecting a language in the locale-control preview does not translate the documentation or every scene.
- `site-plans.ts` and `pricing.ts` provide the shared plan amounts and API rate text.
- CSS defines the original scene's spacing and type tokens within `.application-scene`; preview themes are scoped with `data-tone`.
- The native playback clock pauses off-screen, in a hidden tab, on explicit pause and for reduced-motion preferences. Cleanup cancels animation frames and observers.
- The surrounding React wrappers keep the established `ProductScene` and `ApiScene` import paths. Both accept `paused`; `ProductScene` retains `scene`.

The obsolete GSAP web-component files are removed. Current product excerpts render readable HTML without loading those engines and do not make API requests.

## Pricing and locale contract

| Plan | Monthly billing | Annual monthly equivalent | Annual total |
| --- | ---: | ---: | ---: |
| Free | $0 | $0 | $0 |
| Plus | $50 | $40 | $480 |
| Expert | $300 | $240 | $2,880 |
| Business | $900 | $720 | $8,640 |

Annual billing applies the 20% discount once to the monthly list price. The previous `$40 / month` Plus value was an annual equivalent and must not be used as the monthly input to the pricing function.

The locale control demonstrates EN, RU and ZH selection, includes their flags and supports keyboard navigation. A consuming application must connect the selected locale to its own translations and routes.

## Product boundaries

- A preview is not evidence that an API operation exists or has been integrated.
- Unknown totals must stay unknown. Numbered total-page pagination is appropriate only when a source supplies a total; next/previous behavior uses the source's continuation signal.
- Account API keys in examples are masked or explicitly fake. Copying a sample does not provision a credential.
- Demo selection of a plan does not create an order or charge a payment method.
- Scanner scheduling, credit accounting, authorization and organization roles are backend contracts. Confirm the relevant application's API behavior before integration.
- A CVE association is context, not confirmation that a host is exploitable.

## Verification

Run the maintained checks from the repository root:

```sh
npm ci
npm run build
npm run test:design-system
npm run test:ux
```

The design-system check validates token parity, SVG sprite counts and brand asset presence. The browser suite verifies interaction and layout behavior. Integration into another application still requires checking its global styles, asset paths, routing and real API responses.
