# Infinity Memories

A memory gift site: an **admin Dashboard** to register customers and hand
out their unique links, and a **customer-facing flow** where the customer
who received (or bought) the gift sets up their own memory - photos,
stories, a PIN - by verifying the email their order used. Connected
directly to the FastAPI backend via `fetch()` - no local database, no API
requests inside UI components.

## Important: who does what

This went through two corrections worth calling out explicitly, because
they change who's responsible for what:

- **The admin (Dashboard) does NOT enter customer/order data.** Orders
  arrive **automatically** the moment Shopify sends its `orders/create`
  webhook to the backend - the Dashboard is a **read-only, auto-refreshing
  view** of those orders (polls every 15 seconds) plus each customer's
  unique link. There is no "Add Customer" form in the main UI.
- **The admin does NOT create the memory's content either.** Their only
  real job is: configure the Shopify webhook once (the Dashboard has a
  collapsible panel showing the exact URL to paste into Shopify), then
  watch orders show up and hand out the links.
- **The customer sets up their own memory.** The first time they open
  their link, if it isn't set up yet, they land in the Setup wizard
  themselves - verifying the exact email their Shopify order used, then
  building the stories, photos, and PIN.
- **The recipient** (whoever the customer is gifting the memory to) is who
  actually enters the PIN afterward to view it.

If you're looking at this project's history and see earlier iterations
where the admin drove Setup directly with no email step, or manually typed
in customer data - those were intermediate versions, corrected to the flow
described above. `adminService.createOrder()` (manual order entry) still
exists in the services layer as a documented fallback for when Shopify is
unreachable, but nothing in the UI calls it - the Dashboard always relies
on the automatic sync.

## What was reviewed before anything was changed

Before any code was touched, the entire project was read end-to-end: every
page, every component, the mock data model (`data/memories.ts`), the dead
`lib/db.ts` (referenced a `db.json` that didn't exist - never actually
used anywhere), the routing (`(public)/`, `home/`, `inf/[slug]/`), and the
scaffolded-but-empty `(admin)/dashboard` and `(setup)/setup/[token]`
folders.

## What changed, and what didn't

**Preserved exactly:** every piece of visible UI on the customer-facing
side, every animation, every className, every line of written copy ("A
Special Memory Is Waiting For You", the SecretSection's day/month puzzle
text, "I hope we never stop making memories worth remembering.", etc).
`PinInput`, `NumericKeypad`, `WelcomeAnimation`, `FallingRoses`,
`SectionLabel`, `CounterCard`, `SpecialMessage`, `StoryUnfoldHero` needed
**zero** changes.

**What had to change, and why:**
- **Routing** — restructured from flat routes (`/`, `/home`, `/inf/[slug]`)
  to `/m/[memoryId]/...`, matching the backend's actual data model.
- **Data source** — every `import { memories } from "@/data/memories"` was
  replaced with a real backend fetch through `src/services/`. `lib/db.ts`
  and `data/memories.ts` were deleted.
- **`StoryContent`** — extended to accept multiple images (up to 3)
  instead of one, since the backend now supports that per story.
- **`MemoryCarousel` / `StoryNavigation`** — same visuals, adapted to route
  by story `id` instead of a `slug` (the backend has no slug concept).
- **Dashboard and Setup wizard** — genuinely new (the existing
  `(admin)/dashboard/page.tsx` was a bare placeholder).

## Backend changes made to support this project

Full details are in the backend's own README/CHANGELOG. Summary:

1. **A Memory can exist with no order behind it, AND an admin can register
   an order by hand** (`POST /api/admin/orders`) for deployments with no
   live Shopify webhook - internally reuses the exact same idempotent
   order-creation path a real Shopify webhook uses.
2. **Each Story gained `content_images` (up to 3) and its own
   `spotify_url`** - this backend previously modeled one image and one
   shared song per Memory; per-story images/songs are enforced
   server-side too (`5 stories` / `3 images per story` max).
3. A bug found while integration-testing this exact flow: publishing used
   to require `Memory.title`, but this project's wizard has no
   memory-level title field (only per-story names) - fixed to accept
   either.
4. *(Also present, unused by this project but harmless/additive: an admin
   token can authorize Setup calls directly, and `POST /api/admin/memories`
   creates a bare Memory with no order - leftovers from an earlier
   iteration of this same project, kept because other work in this
   conversation may still use them.)*

## Architecture

```
src/
├── services/            # ALL backend communication lives here
│   ├── apiClient.ts       # low-level fetch wrapper, error handling
│   ├── memoryService.ts    # status check, PIN verify, published content
│   ├── setupService.ts     # order-email verify, setup data, image upload, publish
│   ├── adminService.ts     # admin login, register/list orders
│   └── tokenStorage.ts     # admin token + per-memory setup/view/edit tokens
├── types/                # TypeScript types mirroring the backend's actual JSON shapes
├── contexts/
│   └── AdminAuthContext.tsx
├── components/
│   ├── setup/              # the 3-step Setup wizard (customer-facing)
│   ├── memory/, welcome/, shared/   # existing UI, adapted only where noted above
└── app/
    ├── page.tsx             # redirects to /login
    ├── (admin)/
    │   ├── login/
    │   └── dashboard/          # register a customer's order, list orders, copy links
    └── m/[memoryId]/
        ├── page.tsx + PinGate.tsx     # entry point - redirects to /setup if NOT_SETUP
        ├── setup/ + SetupGate.tsx      # customer's OWN setup: email verify -> wizard
        ├── home/                       # after a correct PIN
        └── inf/[storyId]/              # one story's full page
```

## The two flows

### Admin: watch orders come in, hand out links
1. `/login` — sign in.
2. `/dashboard` — orders appear here **automatically**, polling the
   backend every 15 seconds; nothing to enter or click to make an order
   show up. The first time, expand **"Not seeing new orders?"** to get the
   exact webhook URL to paste into Shopify (Settings → Notifications →
   Webhooks → `orders/creation`, JSON format) - that's the one manual step,
   done once in Shopify itself, not per-order.
3. For each order: copy its `/m/{memoryId}` link and hand it over with the
   physical gift (however you fulfill orders - this app doesn't do that
   part).

### Customer: set up their own memory
1. Opens their link (`/m/{memoryId}`) — since it's `NOT_SETUP`, they're
   sent straight to `/m/{memoryId}/setup`.
2. **Verify it's you** — they enter the same email their Shopify order
   used. A mismatch is rejected; this is what stops anyone who merely
   finds/scans the link from configuring someone else's memory.
3. **Step 1 - Stories** — up to 5 stories, each with a cover image, a
   name, and a date.
4. **Step 2 - Story Data** — for each story (tabbed): a message, up to 3
   memory images, a Spotify song.
5. **Step 3 - PIN** — create and confirm a 4-digit PIN.
6. Published — they can view it immediately (entering the PIN they just
   set) to confirm everything looks right before handing the gift over.

## How to connect this frontend to the backend

### 1. Start the backend and confirm it's up
```bash
curl http://localhost:8000/health   # -> {"status":"ok"}
```

### 2. Point this frontend at it
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
No trailing slash. Must be at the project root. Restart `npm run dev`
after changing it.

### 3. Allow this frontend's origin on the backend (CORS)
In the **backend's** `.env`:
```
CORS_ORIGINS=http://localhost:3000
```
The most common source of "nothing works" - check the browser DevTools
Network tab first if requests seem to silently fail.

### 4. Create your first admin and sign in
```bash
# from the backend's project folder
python -m scripts.create_admin --email you@example.com --password "SomeStrongPass1!"
```
Then `npm install && npm run dev`, visit `http://localhost:3000`, sign in.

### 5. Verify end-to-end
Since you may not have a live Shopify store handy while testing, simulate
the webhook the way the backend's own README describes (a signed
`orders/create` POST). The resulting order should appear on `/dashboard`
within 15 seconds automatically. Copy its link, open it in a new tab
(simulating the customer), verify with the same email the simulated order
used, complete the wizard, and confirm the PIN you set unlocks the memory.

## Verifying changes

```bash
npx tsc --noEmit   # type check - clean
npm run lint       # ESLint - clean
npm run build      # production build - clean
```

All three are clean, including the production build - fonts (Cormorant
Garamond, Luxurious Roman) are self-hosted via `@fontsource/*` rather than
fetched from Google Fonts at build time, so `npm run build` succeeds with
zero outbound network access required (no dependency on reaching
`fonts.googleapis.com`, which the original `next/font/google` setup
required and which fails in offline CI, restricted/firewalled build
servers, etc). Same font files, same font-family names - the visual result
is identical.

## Known trade-offs

- **Tokens live in `localStorage`/`sessionStorage`, not httpOnly cookies**
  - this app calls the backend directly from Client Components.
  `services/tokenStorage.ts` is the only file that would need to change to
  harden this further.
- **The PIN pad is fixed at exactly 4 digits**, matching the existing
  `PinInput`/`NumericKeypad` design.
- **One cover image per story plus up to 3 additional memory images** -
  matches what the backend stores per story; there's no separate
  memory-level gallery in this flow.
