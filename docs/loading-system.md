# Memory data and loading flow

## Why navigation fetched the memory again

HomeGate and StoryGate previously had independent state and effects. Each called
`getPublishedMemory(memoryId, viewToken)`, even though the response already
contains every story. Leaving Home unmounted its state. StoryGate consequently
requested the same complete payload; returning Home requested it again.
The existing carousel already uses `router.push`, and story navigation already
uses Next Link. Neither needed changing.

## Shared memory session

The new `src/app/m/[memoryId]/layout.tsx` mounts a client
`PublishedMemoryProvider`. Next preserves that layout between Home and Story
routes. It adds no DOM wrapper and performs no server-side authenticated fetch.

- The provider retains one PublishedMemory and its request promise in RAM.
- Both gates read the same context. StoryGate selects its story locally.
- Home -> Story -> next -> previous -> Home reuses the successful response.
- A pending request is also shared, including React Strict Mode effect replay.
- Only the Home and Story route segments start a published-memory request.
  PIN and Setup retain their existing verification/status/setup calls.
- Cache identity includes the memory ID and exact view token. A changed, removed,
  expired or rejected token remounts the session provider and discards its data.
- Refreshing the document creates a fresh provider and performs a new fetch.
  A direct deep link without an already loaded provider also fetches.
- PublishedMemory is never stored in localStorage, sessionStorage, cookies, a
  service worker, or a server/module-global cache. Existing token storage remains.

## Session validation and failures

`getMemoryToken` retains the existing expiry rules. A useSyncExternalStore
subscription observes token writes/clears, expiry timers, focus, visibility,
pageshow and relevant storage events. The token is also re-read on navigation,
including Story -> Story, before cached content is reused.

Missing or expired view tokens keep the existing redirect to `/m/[memoryId]`.
A 401 clears the complete memory session and triggers that redirect. Response
handlers verify that the requesting session is still current; a late success or
401 from a previous token cannot populate or invalidate its replacement.

The backend still validates bearer tokens on actual requests. Remote revocations
or changes to published data become visible on the next network request.
This cache does not claim to validate server-side state without contacting it.

Existing API error messages remain visible. Story lookup and `notFound()` are
unchanged. PIN verification, token lifetimes, setup, publishing, payloads,
endpoints and database models are unchanged.

## Loading presentation

`InfinityLoader` remains the single in-flow pendulum. Its page variant now has
only the existing roseIvory background and pendulum: no Infinity heading, visible
loading text, or added gradient. A screen-reader-only status remains for
accessibility. The original pendulum dimensions, ruby color and swing are kept.

Page loading is limited to an initial uncached request or a session transition.
Cached Memory navigation mounts no page loader. The existing content entrance
animations remain unchanged.

Setup/Admin section loaders retain their in-card/in-flow behavior, delayed reveal
and error precedence. The root and admin layouts, carousel, story UI, Spotify,
date and image-upload inputs remain untouched by the shared-cache change.
The development-only loading-test route remains removed.

## Verification

- TypeScript, ESLint and the production build pass.
- `tests/memory-navigation.mjs` uses the actual PIN buttons, carousel button,
  Next links and browser history against an isolated production build and mock API.
- Desktop Chrome (1440px) and mobile WebKit (390px) both verified exactly one
  published-memory GET and zero page-loader mounts through the complete cached
  navigation loop.
- Tests also cover refresh, uncached story deep links, bearer headers, separate
  memories, token replacement and live expiry, missing tokens, 401 cleanup,
  a late old-session 401, visible API errors, no content in browser storage,
  and no published-memory fetch in Setup.
- The initial loader is checked for roseIvory, no extra gradient or heading, and
  a screen-reader-only label.

The browser checks use mocked APIs and WebKit on Windows. A physical iPhone and
live-backend publishing were not used.

To rerun, create an isolated copy of the app and build/start it on port 3100 with
`NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4312`. Run
`node tests/memory-navigation.mjs` with Playwright available.
`PLAYWRIGHT_MODULE` can point to an existing Playwright package directory;
`PLAYWRIGHT_BROWSERS_PATH` can point to installed browser binaries.
The test starts its own mock API on port 4312. Do not point the test app at a
production API. Temporary app copies should be removed afterward so their
generated TypeScript files are not included in the main project's checks.
