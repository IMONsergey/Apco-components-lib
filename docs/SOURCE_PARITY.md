# APCOSYS component source-fidelity audit

Reference: `IMONsergey/apcoweb` published landing, current `main` at the time of audit (2026-10-09).

**Scope:** Each of the 28 gallery entries is classified. “Original” means a file was copied unchanged; “Port” preserves the source DOM, state and CSS with only host dependency removal; “Gallery adapter” means an integration surface that should not be passed off as a verbatim source component. All context-specific breakpoints are retained rather than replaced by a global responsive scaling rule.

## Components

| Gallery item | Provenance | Authoritative source | Parity contract |
| --- | --- | --- | --- |
| Turquoise Flow | Original engine | apcoweb `src/visuals/flow` | CSS / canvas renderer / visual state |
| Dot Cascade | Original engine | apcoweb `src/visuals/dots` | Canvas animation / layout |
| Signal Globe | Original engine | apcoweb `src/visuals/globe` | SVG and Canvas renderers |
| Ice Sphere Waves | Original engine | apcoweb `src/visuals/waves` | Responsive waves animation |
| Animated Rosette | Original engine | apcoweb `src/visuals/shapes` | SVG line geometry |
| Echo Rings | Original engine | apcoweb `src/visuals/shapes` | SVG motion geometry |
| AI Chat Orb | User-supplied source | provided `AIChatOrb.zip` | Preserve supplied original |
| OrbCube Loader | User-supplied source | provided `apcosys-orbcube-loader.zip` | Preserve supplied original |
| Query Sequence | Gallery adapter | apcoweb `src/visuals/product/product-scenes.js` | Original GSAP source, thin React lifecycle |
| Search Results | Gallery adapter | same product scenes | Original timed scene, inert UI |
| Host Intelligence | Gallery adapter | same product scenes | Original timed scene, inert UI |
| Evidence View | Gallery adapter | same product scenes | Original timed scene, inert UI |
| Suggestions | Gallery adapter | same product scenes | Original timed scene, inert UI |
| API Developer Demo | Gallery adapter | apcoweb `src/visuals/api/api-developer-demo.js` | Original GSAP source, React mount |
| Digit Odometer | Original | apcoweb `src/components/ui/AnimatedPrice.tsx` | Identical React source / WAAPI |
| Double Button | Original | apcoweb `src/components/ui/DoubleButton.tsx` | Identical React source / CSS states |
| Animated Details | Locale-free port | apcoweb `src/components/ui/AnimatedDetails.tsx` | Original interaction/height logic, translated copy |
| Partner Marquee | Gallery adapter | apcoweb `TrustMarquee.tsx` | Original animation/asset CSS; standalone gallery without surrounding copy |
| Billing Switch | Locale-free port | apcoweb `src/components/ui/BillingSwitch.tsx` | Original semantic radio/segmented DOM |
| Plan Button | Original CSS | apcoweb `src/components/sections/PricingSection.css` | Original CTA colors, hover and geometry |
| Plain Button | Standalone port | apcoweb `src/styles/site.css` | Original hover and color parity in both themes |
| Icon Button | Standalone port | apcoweb `src/styles/site.css` | Source 46px interactive control + original Icon |
| Search Input | Gallery adapter | apcoweb `src/styles/site.css` search form | Exact visual rules and keyboard-safe native form; no real search API |
| Navigation Disclosure | Locale-free port | apcoweb `src/components/Header.tsx`, `navigation.css` | Native anchors, Escape, focus and disclosure transitions |
| Language Control | Source port | apcoweb `src/components/ui/LanguageBadge.tsx` | Original trigger, flags, menu structure, keyboard support, locale independent |
| Use Case Tags | Original CSS + data adapter | apcoweb `AudienceSection.css` | Token colors and gap / typography |
| Pricing Card | Source port | apcoweb `PricingSection.tsx/css`, `content/site.ts` | Actual PLUS plan data, 384px source minimum, 32px gap, billing note and CTA; gallery never squashes source geometry |
| Modal Dialog | Locale-free port | apcoweb `src/components/ui/Modal.tsx`, `site.css` | Source native dialog, opening/closing WAAPI, scroll/focus handling and keyboard cancel |

## Fidelity rules

1. **Keep production CSS authoritative.** `src/styles/site-fidelity.css` contains extracted source rules for language/navigation, plan pricing and modals; preview-only layout constraints use separately named `.lib-preview--*` wrappers.
2. **Do not compress product components to fit thumbnail cards.** Grow the gallery preview or use a scroll container instead. Avoid `max-height:100%` on canonical cards and never set a blanket `transform:scale(...)`.
3. **Do not invent published content.** The source `PLUS` plan costs **$40 monthly**, includes **25 000 credits / 1 user**, and the CTA says **View Plus**. This contract is derived from current `src/content/site.ts`; the standalone plan data is explicitly versioned in `src/content/site-plans.ts`.
4. **Published theme semantics must be reused.** Do not apply the light `#e1e4e7` hover value on a dark surface or leave white button text on a light background.
5. **Port behavior, not only appearance.** Language menus require flags, disabled entries, keyboard behavior, right alignment and focus. Navigation requires anchors, keyboard focus and Escape. Modal uses the source focus-management logic.
6. **Gallery effects remain gallery concerns.** Visibility unmounting, card dimensions, preview backgrounds and source links must never modify the semantics of the component itself.
7. **Tests target source invariants.** `npm run test:ux` covers light/dark, controls, layout bounding boxes, keyboard handling, modal lifecycle, navigation and smaller screens. `npm run test:design-system` validates token parity and icon sprite completeness.

**Known boundary:** The six standalone product motion demonstrations use the published GSAP engines but intentionally do not reproduce backend interactions; a visual demo is not a functional search product. The UI wrappers above are portable extractions rather than claims of fully independent production applications.
