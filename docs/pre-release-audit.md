# Pre-release cleanup audit — 2026-09-04

## Scope and safeguards

This audit covers every project-owned source file, route/layout, service,
context, type, stylesheet, configuration file, README, loading document and
existing browser test. Generated Next output, dependency source and ignored
audit artifacts were inspected where needed; they are not application source.
Environment files and secret values were not opened or edited.

The working tree already contained loading/cache changes, the removal of
`src/app/loading-test/page.tsx`, and other UI edits before this audit. Those
changes were preserved. The lists below describe **only this audit's changes**,
relative to a byte-for-byte snapshot taken before editing.

Before deletion, a TypeScript AST reference scan resolved local literal imports,
re-exports and dynamic imports. Repository-wide text searches checked remaining
references, configuration, documentation and tests. The four removed files have
no import consumers, no side-effect imports, and no route, metadata or build
convention role. The live dynamic import of FallingRoses was retained.

## Exact changes

| File changed | Cleanup and evidence |
| --- | --- |
| `src/components/memory/carousel/MemoryCarousel.tsx` | Removed `isMountedRef`, its write-only mount/unmount effect, and the now-unused `useRef`/`useEffect` imports. Nothing ever read that ref. JSX, swipe logic, indices, handlers, routing, styles and timings are unchanged. |
| `src/app/globals.css` | Removed unused `.romantic-gradient`, `.text-balance`, `.animation-delay-200`, `.animation-delay-400`, `.animation-delay-600`, `.animate-pulse-soft` and `.animate-fade-in-up`, plus the last two classes' exclusively used keyframes. Removed the earlier identical `gradient` keyframes, a commented-out gradient implementation and obsolete rose-animation revision comments. No active selector or animation definition changed. |
| `package.json` | Removed four unused direct dependencies listed below. Scripts and retained dependency ranges are unchanged. |
| `package-lock.json` | Updated with npm for those removals. No retained package version changed. Zod remains a development dependency of lint tooling. npm also recorded four existing optional bundled-package metadata entries under Tailwind's WASM package; no new direct dependency was introduced. |
| `tsconfig.json` | Removed the redundant explicit story-directory include; the existing `**/*.ts` and `**/*.tsx` patterns already include it. Compiler options and exclusions are unchanged. |
| `README.md` | Corrected the obsolete manual-registration/read-only dashboard descriptions, condensed stale scaffold history, documented the current RAM provider and regression suites, and corrected the claim that changing token storage alone would migrate auth. Backend integration instructions were retained. |
| `docs/pre-release-audit.md` | Added this audit report. |

| File deleted | Proof/reason |
| --- | --- |
| `src/app/lib/utils.ts` | Unreferenced `cn` wrapper; its only two imports were otherwise unused direct dependencies. It was not a route. |
| `src/components/memory/index.ts` | Entire file was commented-out exports, several pointing to absent old components; nothing imported the file. |
| `src/components/welcome/WelcomeAnimation.tsx` | No imports or runtime consumers. Its scoped heart animations were never mounted. The live falling roses remain unchanged. |
| `src/styles/theme.ts` | Unreferenced exported object/type. It did not configure Tailwind; active theme values come from globals.css and the root layout. |

Direct dependencies removed: **clsx, tailwind-merge, lucide-react, zod**.
The first two were used only by the deleted helper; the latter two had no
application imports. Zod is still locked for ESLint's React hooks tooling.
Fonts, Heroicons, Framer Motion, React, Next, Tailwind and all required build/lint
dependencies were retained. No public route or asset was deleted in this audit.

## Behavior preservation

- Services, API/data types, auth contexts, token storage, the memory provider,
  route layouts, pages and gates are byte-identical to the audit baseline.
- Setup, Spotify, date handling, uploads, story content and all rendered JSX are
  unchanged. The sole active-component edit removes an unread ref/effect.
- The production route manifest is unchanged.
- Before/after compiled CSS was compared by selector, enclosing at-rules and
  declaration. No retained declaration changed. Removed generated utilities and
  unused color variables belonged to the unreachable welcome/theme files; their
  consumers were checked against the remaining source. Active loader geometry,
  colors, delays, Safari handling and animations remain intact.
- The shared PublishedMemory response/promise still lives only in the memory
  layout's client provider, keyed by memory ID and view token. Refresh still
  fetches. Cached navigation still reuses the response. No cache/auth changes
  were made to obtain these results.

## Findings intentionally kept

These are findings or review candidates, not changes made by this cleanup.

| Area | Finding and reason retained |
| --- | --- |
| Dependency advisory | npm audit reports **one high-severity advisory**, [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8), for transitive `nanoid@3.3.17` through PostCSS/Next. It concerns custom generators with size zero. Inspected PostCSS call sites use `nanoid/non-secure` with size 6; application code does not import nanoid. This is not proof of safety across all tooling paths. Kept because it is required transitively and upgrading dependency behavior is outside a removal-only cleanup. A separately validated patch update should be considered before release. |
| Missing logo asset | Home and story/carousel fallbacks reference `/images/logo.png`, but this checkout has no `public/images/logo.png` or public assets directory. Kept the references because removing/replacing the brand asset changes UI. Deployment must supply the intended asset. Browser regression tests stub optimized image responses, so their success does not validate real assets. |
| Image host policy | `next.config.ts` permits any HTTPS image hostname. Narrowing it requires the real backend/storage host contract and could break existing uploaded images. |
| API wrappers/types | Uncalled `adminService.createOrder`, detail methods, generic client methods and exported data types remain. The README explicitly documents manual order creation as an integration fallback; removing API-facing contracts was prohibited. |
| Setup duplication | Image acceptance lists, image validators, story serializers and initial draft fallbacks repeat across wizard steps. Consolidation would touch save/upload behavior; working logic was retained. |
| Setup failures and async work | SetupWizard catches all initial data-load failures and creates an empty draft. It has no cancellation guard for that request. Changing error or stale-response behavior would change the setup flow. |
| PIN and secret timers | PinGate's 1.5-second reset and SecretSection's 1.2-second reset have no unmount cleanup and can overlap repeated attempts. They are bounded timers, not proven accumulating leaks; changing them would affect existing PIN/date interaction timing. |
| Dashboard polling | The 15-second interval is cleaned up, but slow requests can overlap and an in-flight response is not cancelled after logout/unmount. No deduplication/cancellation or 401 behavior was introduced. |
| Token/session storage | Existing localStorage admin tokens and sessionStorage memory tokens, expiry rules, storage exceptions and redirects are unchanged. Refresh still briefly traverses the memory entry route during provider hydration; existing tests confirm this without an empty PIN/card shell. Optimizing that traversal would change routing/auth. |
| Cache freshness | Backend revocations and published-data changes are observed on the next actual request. No revalidation/polling was added to the intentionally shared RAM cache. |
| Accessibility | Carousel dots and the PIN clear icon lack accessible names; several labels are not programmatically associated with inputs; some clickable cards/photos are pointer-only. Many non-form buttons omit `type`. Existing non-form ancestry avoids accidental form submission today. Retained for a separately scoped accessibility change to controls and interaction behavior. |
| Tailwind/class issues | `md:min-h`, `mb-`, `romantic-linear`, `error-glass`, `shadow-glow` and `shadow-soft` have no generated definitions in this build. PinInput also concatenates the error and filled/unfilled class branches without a separating space. Correcting these would alter visible styling, which was prohibited. They were not repurposed or hidden with CSS. |
| Language/compatibility | The root document is `lang="ar"` while much fixed UI is English. Safari backface, viewport and scrollbar rules, dynamic no-SSR falling roses, and mounted guards remain: removing them could affect accessibility, hydration or appearance. |
| Animation/state patterns | CounterCard's delayed initial time avoids server/client clock output mismatches and clears its interval. PageTransition clears its timers; memory-session subscriptions remove their listeners/timer. SpecialMessage's random answer does not change initial visible markup. No new hydration error was observed in navigation tests. |
| Historical docs/generated files | Backend integration notes cannot be revalidated from this frontend alone and were retained as historical context. AGENTS.md/CLAUDE.md, Next-generated declarations, lockfiles, ignored browser binaries/screenshots and development configuration are not dead production routes. The root and 404 pages are Next conventions and remain. |

No application debug logging, debugger statements, additional abandoned loading
routes, module-global published-data cache, or other unreferenced application
component was found. Absence of a discovered issue is not a security guarantee.

## Verification

Final check results are recorded after removing the temporary isolated test app.

- Baseline: TypeScript (including unused-local/parameter checks), lint and
  production build passed before edits.
- `tests/memory-navigation.mjs`: passed unchanged in Chrome 1440px and WebKit
  390px. Covers real PIN/router/Link navigation, next/previous/Home/history,
  one protected GET with zero cached loader mounts, fresh reload/deep-link GETs,
  token headers/isolation/replacement/expiry, missing sessions, 401 and stale-401
  handling, visible errors, no content persisted to storage, and Setup isolation.
- `tests/home-refresh.mjs`: passed unchanged in Chrome and WebKit 390px. Empty
  RAM and hard refresh show no card or carousel before data, one initial fetch,
  roseIvory/pendulum loading, then cached Home → Story → Home without another GET.
- Older ignored `build/loading-audit.cjs`: initially failed because it sampled
  a detached SSR loader (`isConnected: false`, empty computed position). A
  temporary runner changed only its mock API port and sampled a connected node;
  all original assertions were retained. Passed in Chrome 1440px and WebKit
  390px/320px: Home/Story/Setup/Admin loading, errors, polling recovery, token
  redirects, removed-route 404, reduced motion, bounds and stable reveal.
- Tests use an isolated production build with a loopback mock API and synthetic
  tokens/data. No production backend calls, real orders, image uploads or
  publishing were exercised. WebKit on Windows is not a physical iPhone test.
- There is no package test script or additional checked-in unit-test suite.
- npm advisory audit: one high, zero critical; intentionally unresolved as above.

Final checks:

| Check | Result |
| --- | --- |
| `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` | Passed, no diagnostics. |
| `npm run lint` | Passed, no warnings or errors. |
| `npm run build` | Passed; production route manifest unchanged. |
| Both checked-in browser suites | Passed unchanged, Chrome and WebKit 390px. |
| Legacy loading assertions | Passed with the temporary connected-node sampler, all three viewports; original harness race disclosed above. |
| Dependency advisory audit | One high-severity nanoid advisory remains; not a clean security bill of health. |

The temporary test server was stopped and its app copy/junction removed. The
root build reports no workspace-root warning; that warning occurred only while
the isolated test copy temporarily introduced a second lockfile under `build/`.
