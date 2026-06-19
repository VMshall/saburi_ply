# Next.js Migration — Implementation Plan (Saburi Ply)

## Context

**Why this exists.** `NEXTJS_MIGRATION_PROMPT.md` (repo root) asks for a complete, staged implementation plan to migrate the Saburi Ply marketing site from **Vite 6 + React Router 6 SPA (pre-rendered with react-snap)** to **Next.js (App Router) on Vercel — pure SSG** for all in-app pages, with the blog left on external WordPress. This is an SEO- and performance-critical site whose business goal is to rank #1 in the Indian plywood category and for local "best plywood in <place>" searches, so the #1 constraint is **zero SEO regression**, then **cheap technical-SEO improvements**.

**What this plan is.** A PLAN — not implementation code. Actual code migration is a separate effort to be kicked off explicitly afterward.

**Decisions locked by the prompt** (designed within, not re-litigated): Next.js App Router on Vercel (Node runtime, NOT static export); pure SSG from typed TS data modules (no ISR/CMS now); blog stays on WordPress served at `/blog/*` via a Vercel rewrite; backend `apiv2.saburiply.com` external and untouched; keep Tailwind + shadcn/Radix + current design.

**Decisions confirmed with the stakeholder for this plan:**
- Product (22) + location (5) pages → **explicit route folders, each a thin file rendering one shared, data-driven template** (content in typed TS modules). Lowest migration risk; flips to `[slug]` later for free.

**Ground truth was re-verified against the repo** (3 exploration passes + 1 architecture pass). Drift from the prompt's assumptions is flagged inline and in §15. Key drift: forms use **vanilla `useState` + `yup`/regex (no react-hook-form, no zod)**; **JSON-LD already exists** and is richer than implied (`PageMeta.jsx` emits 5 schema types); the 5 state/city landing pages have **no `metaConfig` entries** (they wrongly inherit homepage meta — a pre-existing bug to fix); the root `saburiply.com` nginx file **does** contain the `/blog/1..5` 301s + a `/blogs/`→`:9000` proxy (but not the production `/blog/*`→WordPress rule).

---

## 0. Review Addendum — Post-Review Fixes (authoritative; supersedes any conflicting text in §§1–15)

A senior-engineering review re-verified this plan against the live repo. The claims held up (JSON-LD exists/5 types; the 5 location pages inherit homepage meta — a real pre-existing bug; forms are vanilla `useState`+yup with no RHF/zod; TanStack unused; `door-frame.php` targets a non-existent plural page). The review found **one must-fix architectural risk** plus corrections, captured here.

### 0.1 🔴 Trailing-slash ↔ WordPress blog (P1) — RESOLVED design

**Problem.** App routes are slash-*less* today (`/about`, `/products/x`; sitemap confirms), but WordPress canonicalizes blog URLs *with* a trailing slash (`/blog/<slug>/`). A single global `trailingSlash` boolean cannot serve both. With `trailingSlash:false`, Next 308-strips `/blog/x/` → `/blog/x` → rewrite → WP 301s back to `/blog/x/` → **redirect loop on ~35 ranking blog URLs.** §7's original "WP handles normalization" was an unsafe assumption — it depends on undocumented middleware-vs-trailingSlash ordering.

**Fix — take explicit control; do not depend on pipeline ordering:**
1. `next.config.mjs`: set **`skipTrailingSlashRedirect: true`** (disables Next's automatic slash redirect entirely → it can never strip the blog slash). Keep the `/blog` + `/blog/:path*` `rewrites()` to `WP_ORIGIN`.
2. Add **`middleware.ts`** that owns app-route slash policy (now that auto-redirect is off) and EXCLUDES `/blog`, so blog slashes pass through untouched:
```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // App routes are slash-less; 308-strip any trailing slash. /blog is excluded by the matcher.
  if (pathname !== '/' && pathname.endsWith('/')) {
    // Build from req.url, NOT req.nextUrl.clone(): mutating a cloned NextURL's pathname does
    // not re-serialize into the Location header in Next 14.2 (it self-loops /about/ → /about/).
    const url = new URL(req.url)
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!blog|api|_next/|.*\\..*).*)'] } // excludes blog, api, _next, static
```
3. WP canonical host (primary, unchanged): set `WP_HOME`/`WP_SITEURL = https://www.saburiply.com` so WP emits correct canonicals behind the rewrite. (X-Forwarded-Host injection only if WP can't be reconfigured — then add a `/blog`-scoped matcher.)
4. **Validation gate (on a preview deploy, before cutover):** curl the matrix `/blog/`, `/blog/<slug>/`, `/blog/<slug>` (no slash), `/about/`, `/about`. Assert: blog → 200 from WP with `canonical = …/blog/<slug>/` and **no loop**; `/about/` → single 308 → `/about`. Ship only if green.
5. **Fallback (unchanged):** if the external rewrite mishandles host/slash, serve `/blog/*` from the nginx edge and proxy the rest to Vercel.

### 0.2 Corrections & resolved open questions
- **Route count (P2):** the "~45 routes" figure in §4 and the Quality Bar was a miscount. Actual: **71 `<Route>` declarations (~3 commented) → ≈68 active = 39 element routes (36 SSG in-app + `/blog` + `/blog/:slug`→WP + `*` 404) + 29 `<Navigate>` 301s.** The §4/§5 enumeration is complete; only the total was wrong.
- **`saburi-door-frame.php` (resolves §15 Q2):** redirect to the **singular** `/products/saburi-smart-wpc-door-frame`. Verified `App.jsx:128` (singular route) vs `saburiply.com:95` (plural target = current prod bug, lands on no page).
- **QueryClientProvider (resolves §15 Q7):** verified **zero** `useQuery`/`useMutation` in the repo → **drop `QueryClientProvider` outright.** Also delete the unused `client/components/ui/form.tsx` (the only `react-hook-form` consumer) and drop the `react-hook-form` dep.
- **Blog `/blog/1..5` 301 destinations:** add the **trailing slash** to each target (`…/`) to match WP's canonical and avoid a 301→301 double-hop.
- **Pre-existing data bug:** `metaConfig.js:157` (`shuttering-plywood-india`) has `keywords` set to a copy of the description — fix when authoring `data/products.ts`; do not carry it forward.
- **Undocumented coupling:** `Footer.jsx:74-117` *fetches & parses `/sitemap.xml` at runtime* for a UI feature. The generated `app/sitemap.ts` serves valid XML at the same `/sitemap.xml`, so it should keep working — but verify the Footer sitemap UI post-migration (it's a runtime consumer, not just an SEO artifact).

---

## 1. Executive Summary

**Target architecture.** A Next.js App Router app on Vercel, Node runtime, every in-app route statically generated (`force-static`) from typed TS data modules under `data/`. One root `layout.tsx` owns `<html>`, a single `"use client"` `Providers` wrapper (QueryClient + Tooltip + Toaster + Sonner), and server-rendered `Navbar`/`Footer` shells with client islands. The 22 product and 5 location pages are explicit folders, each a thin `page.tsx` rendering a shared `ProductTemplate`/`LocationTemplate` fed by `data/products.ts` / `data/locations.ts`. SEO moves from react-helmet-async to the Metadata API (`generateMetadata` + `metadataBase`) plus a reusable server `<JsonLd>` component. Every legacy redirect (29 in-app `<Navigate>` + ~24 nginx `.php`/slug 301s) moves into `next.config` `redirects()`; `/blog/*` is a `rewrites()` passthrough to the WordPress origin; the dead React blog is deleted. Forms keep their current client UX but POST to a same-origin Next Route Handler proxy (`/api/forms/*`) so the external API and its CORS are untouched. `LazyImage` → `next/image`. react-snap, Vite, Netlify, and nginx's static-serve role are retired.

**Headline risks.** (1) Redirect/canonical parity — the `.php` 301 map + in-app redirects + www/https canonicalization must reproduce exactly, with no loops. (2) The WordPress `/blog/*` rewrite emitting correct `www.saburiply.com` canonicals (origin-host/X-Forwarded-Host config). (3) Per-page meta + the 5 JSON-LD schema types reproduced across ~36 pages with no loss. (4) `next/image` CLS regressions vs the current `LazyImage` behavior. (5) DNS cutover to Vercel without breaking `/blog/*` or `/saburi-panel-admin/*`.

---

## 2. Decision Log (options → recommendation → rationale)

| # | Decision | Options | Recommendation | Rationale |
|---|----------|---------|----------------|-----------|
| D1 | Rendering model | SSG / ISR / SSR / static-export | **Pure SSG, Node runtime** (locked) | Content rarely changes; SSG == ISR to Googlebot; content-velocity surface (blog) is already WP. Node runtime (not `output:'export'`) keeps `redirects()`/`rewrites()`/`next/image`. |
| D2 | Product/location page shape | (a) shared template + explicit folders; (b) `[slug]` dynamic + `generateStaticParams`; (c) preserve bespoke JSX | **(a) shared template + explicit folders** (confirmed) | Greppable, auditable URLs + per-page SEO overrides + DRY data-driven body; lowest risk to ranking pages. Data layer already supports flipping to `[slug]` later with no data change. |
| D3 | Routing/redirects | next.config `redirects()` vs middleware | **`redirects()` for all path 301s; Vercel domain config for www/https; middleware only if header injection needed** | `redirects()` is static-config, testable, runs at the edge. www/https belong at the domain layer. Middleware reserved for the WP-rewrite `X-Forwarded-Host` fallback. |
| D4 | Meta | keep helmet shim vs Metadata API | **Metadata API** (`generateMetadata`/static `metadata` + `metadataBase`) | Native SSR head, no client injection, better than helmet for crawlers; helmet removed entirely. |
| D5 | Structured data | preserve only vs strengthen | **Preserve all 5 existing types + strengthen** (specific `FAQPage` from data, add `WebSite` sitewide, add `areaServed` to location `LocalBusiness`) | JSON-LD is a primary ranking lever for the #1-in-category goal; strengthening is cheap once content is in typed data. |
| D6 | sitemap/robots | static in `/public` vs generated | **Generate via `app/sitemap.ts` + `app/robots.ts`** | Single source of truth (data modules) auto-fixes two bugs: drops the stale `/best-plywood-bangalore` URL and the 35 blog URLs now owned by WP. |
| D7 | Forms → API | direct CORS vs Route Handler proxy vs Server Actions | **Same-origin Route Handler proxy** (`/api/forms/[endpoint]`) | No backend/CORS change (out-of-scope API untouched); hides the apiv2 origin; keeps current client form UX. Server Actions rejected — would rewrite working forms for no SEO gain. |
| D8 | Images | keep `LazyImage` vs `next/image` | **`next/image`** behind a thin wrapper preserving the current API (skeleton, fade, aspectRatio) | Vercel image optimization now available; wrapper avoids touching dozens of call sites and preserves CLS guards. |
| D9 | TypeScript | big-bang strict vs incremental | **Incremental: keep `strict:false`, convert `.jsx`→`.tsx` opportunistically, tighten later** | An 80-file strict cleanup must not block or risk the SEO migration. |
| D10 | Blog | rebuild in Next vs leave on WP | **Leave on WordPress; rewrite `/blog/*`; delete dead React blog** (locked) | The ~35 `/blog/<slug>/` posts are real ranking assets on live WP; the React blog (5 stub posts) is dead code never served in prod. |
| D11 | Cutover strategy | big-bang vs strangler | **Strangler-friendly build, single DNS cutover with instant rollback** | Build/verify entirely on Vercel preview URLs; cut DNS once with www/redirect parity proven; revert instantly via Vercel deployments. |

---

## 3. Target Architecture

### `app/` router tree (chosen: explicit folders + shared templates)

```
app/
├── layout.tsx                 # <html><body>, Providers, Navbar, Footer; metadataBase; default metadata; sitewide JsonLd (Organization + WebSite)
├── providers.tsx              # "use client": QueryClient + TooltipProvider + Toaster + Sonner + <TopProgress/>
├── globals.css                # from client/global.css
├── not-found.tsx              # maps RR6 "*" NotFound; MUST return HTTP 404
├── error.tsx                  # "use client" top-level error boundary (new)
├── loading.tsx                # streaming fallback for client navigations
├── sitemap.ts                 # replaces public/sitemap.xml (from data modules)
├── robots.ts                  # replaces public/robots.txt
│
├── page.tsx                   # "/"  (Index)
│
├── about/
│   ├── page.tsx               # /about
│   ├── accreditation/page.tsx
│   ├── national-presence/page.tsx
│   ├── environment-stewardship/page.tsx
│   └── privacy-policy/page.tsx
├── gallery/page.tsx
├── contact/page.tsx
├── thank-you/page.tsx         # metadata.robots = noindex,follow
│
├── products/
│   ├── saburi-perennial/page.tsx
│   ├── … (22 folders total — one per slug) …
│   └── saburi-lam/page.tsx
│
├── best-plywood-andhra-pradesh/page.tsx
├── best-plywood-kerala/page.tsx
├── best-plywood-tamilnadu/page.tsx
├── best-plywood-telangana/page.tsx
├── plywood-dealers-bangalore/page.tsx
│
└── api/forms/[endpoint]/route.ts   # node-runtime proxy → apiv2

components/
├── Navbar.tsx, Footer.tsx          # client islands (mobile menu, subscribe form)
├── JsonLd.tsx                      # server: renders <script type="application/ld+json">
├── TopProgress.tsx                 # client: top-bar progress for client nav
├── SmartImage.tsx                  # client: next/image wrapper (skeleton + fade + aspectRatio)
├── templates/
│   ├── ProductTemplate.tsx         # shared product page (server shell + client islands)
│   └── LocationTemplate.tsx        # shared state/city page
├── islands/                        # ProductGallery, QuoteModalTrigger, carousels, animated sections
└── ui/                             # shadcn (54 → 48 after de-duping the 6 stub pairs), all .tsx

data/
├── types.ts                        # Product, Location, Seo, Faq, FeatureBadge, ProductImage
├── products.ts                     # 22 entries + getProduct(slug) accessor
├── locations.ts                    # 5 entries + getLocation(slug)  ← fixes missing-meta bug
└── site.ts                         # Organization/contact constants (from PageMeta.jsx:142-175)

config/
└── api.ts                          # client points at /api/forms/* (same origin)
```

**Each product/location `page.tsx` is ~5 lines** — pulls its entry from the data module, exports `metadata` via a builder, renders the shared template:

```tsx
// app/products/marine-plywood-india/page.tsx
import { ProductTemplate } from '@/components/templates/ProductTemplate'
import { getProduct } from '@/data/products'
import { buildProductMetadata } from '@/lib/seo'
export const dynamic = 'force-static'
const p = getProduct('marine-plywood-india')
export const metadata = buildProductMetadata(p)
export default function Page() { return <ProductTemplate product={p} /> }
```

### Provider / layout structure

- **Removed:** `HelmetProvider` (→ Metadata API), `BrowserRouter` (→ App Router), `ScrollToTop` smooth-scroll (→ App Router default scroll-to-top; re-add a tiny client component only if smooth scroll is required), the `hydrateRoot`/`createRoot` branch (`App.jsx:213-220`), the `App.jsx:207-210` sitemap hack.
- **`app/layout.tsx`** (server): `<html lang="en">`, `metadataBase: new URL('https://www.saburiply.com')`, default title/OG/Twitter/geo via `metadata`, favicons via `metadata.icons`; renders `<Providers>` with `<Navbar/>{children}<Footer/>` and sitewide `<JsonLd data={[organization, website]} />`.
- **`app/providers.tsx`** (`"use client"`): `TooltipProvider` → `{children}` + `<Toaster/>` + `<Sonner/>` + `<TopProgress/>`. (**`QueryClientProvider` dropped** per §0.2 — review confirmed zero `useQuery`/`useMutation` in the repo; don't ship dead TanStack wiring. Also delete the unused `ui/form.tsx`, the lone `react-hook-form` consumer.)

### Rendering-mode map

All in-app routes: **SSG** (`force-static`, no dynamic APIs). `/blog/*`: **WordPress via rewrite** (not a Next route). 404: `not-found.tsx` returning HTTP 404. No ISR, no SSR (documented as future only — see §15).

---

## 4. Route & Rendering Table

> All in-app pages render mode = **SSG (static)**. "Blog" rows are external WordPress via rewrite (not Next routes). Source: `client/App.jsx:100-184`.

| Current route | Next path | Render | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | SSG | Index; server shell + client islands (hero carousel, forms). |
| `/about` | `app/about/page.tsx` | SSG | |
| `/about/accreditation` | `app/about/accreditation/page.tsx` | SSG | |
| `/about/national-presence` | `app/about/national-presence/page.tsx` | SSG | |
| `/about/environment-stewardship` | `app/about/environment-stewardship/page.tsx` | SSG | |
| `/about/privacy-policy` | `app/about/privacy-policy/page.tsx` | SSG | |
| `/gallery` | `app/gallery/page.tsx` | SSG | |
| `/contact` | `app/contact/page.tsx` | SSG | Form island; `LocalBusiness` JSON-LD. |
| `/thank-you` | `app/thank-you/page.tsx` | SSG | `robots: noindex, follow`. Now prerendered (was missing from react-snap). Carry context via `?src=` query island (see §9). |
| `/products/saburi-perennial` … `/products/saburi-lam` (22) | `app/products/<slug>/page.tsx` (22 folders) | SSG | All render shared `ProductTemplate` from `data/products.ts`; `Product` + `FAQPage` + `BreadcrumbList` JSON-LD. |
| `/best-plywood-andhra-pradesh` | `app/best-plywood-andhra-pradesh/page.tsx` | SSG | `LocationTemplate`; `LocalBusiness`+`areaServed`. **Add missing meta.** |
| `/best-plywood-kerala` | `app/best-plywood-kerala/page.tsx` | SSG | **Add missing meta.** |
| `/best-plywood-tamilnadu` | `app/best-plywood-tamilnadu/page.tsx` | SSG | **Add missing meta.** |
| `/best-plywood-telangana` | `app/best-plywood-telangana/page.tsx` | SSG | **Add missing meta.** |
| `/plywood-dealers-bangalore` | `app/plywood-dealers-bangalore/page.tsx` | SSG | **Add missing meta.** |
| `/blog` | `rewrites()` → WordPress | WP | External; not a Next route. |
| `/blog/:slug` (~35 posts) | `rewrites()` → WordPress | WP | External; WP emits its own `Article` schema + canonicals. |
| `*` (NotFound) | `app/not-found.tsx` | 404 | Must return HTTP 404 (no soft-404). |
| `/career`, `/our-journey` | — | — | Components exist but commented out in routing (`App.jsx`); out of scope / future. |

**Coverage (corrected — see §0.2):** 36 SSG in-app pages + 2 blog rewrites (→WP) + 404 + 29 `<Navigate>` 301s (§5) = **≈68 active routes** (of 71 `<Route>` declarations; ~3 are commented-out). The earlier "45" was a miscount; this enumeration + §5 is complete.

---

## 5. Redirect Inventory & Migration

**Canonicalization (platform layer, not `redirects()`):**
- **non-www → www** and **apex → www**: Vercel Domains — add `saburiply.com` + `www.saburiply.com`, set **www as primary**; Vercel issues a permanent redirect apex→www. (Replaces nginx `server_name saburiply.com` 301.)
- **http → https**: automatic on Vercel.
- **Trailing slash (see §0.1)**: app routes stay slash-less via **`skipTrailingSlashRedirect:true` + `middleware.ts`** — NOT global `trailingSlash:false` (which would 301-loop the slash-ful WP blog). Blog keeps WP's trailing slash.

**A. In-app `<Navigate>` → `next.config redirects()` (29).** Source `client/App.jsx:143-179`.

| From | To | Status |
|---|---|---|
| `/best-plywood-kerela` | `/best-plywood-kerala` | 301 (typo fix) |
| `/best-plywood-bangalore` | `/plywood-dealers-bangalore` | 301 |
| `/saburi-perennial` | `/products/saburi-perennial` | 301 |
| `/saburi-club-h-plus` | `/products/saburi-club-h-plus` | 301 |
| `/saburi-titanium-plus` | `/products/saburi-titanium-plus` | 301 |
| `/fire-retardant-india` | `/products/fire-retardant-india` | 301 |
| `/marine-plywood-india` | `/products/marine-plywood-india` | 301 |
| `/saburi-perennial-blockboard` | `/products/saburi-perennial-blockboard` | 301 |
| `/saburi-fr-blockboard` | `/products/saburi-fr-blockboard` | 301 |
| `/block-board-india` | `/products/block-board-india` | 301 |
| `/saburi-gold-blockboard` | `/products/saburi-gold-blockboard` | 301 |
| `/flush-door-india` | `/products/flush-door-india` | 301 |
| `/saburi-flushdoor-scout` | `/products/saburi-flushdoor-scout` | 301 |
| `/flexi-plywood-india` | `/products/flexi-plywood-india` | 301 |
| `/saburi-scout-plywood` | `/products/saburi-scout-plywood` | 301 |
| `/shuttering-plywood-india` | `/products/shuttering-plywood-india` | 301 |
| `/saburi-modwud-pre-lam` | `/products/saburi-modwud-pre-lam` | 301 |
| `/saburi-modwud-plain` | `/products/saburi-modwud-plain` | 301 |
| `/saburi-smart-panel-pvc-board` | `/products/saburi-smart-panel-pvc-board` | 301 |
| `/saburi-smart-panel-wpc-board` | `/products/saburi-smart-panel-wpc-board` | 301 |
| `/saburi-smart-wpc-door-frame` | `/products/saburi-smart-wpc-door-frame` | 301 |
| `/saburi-hydramax-board` | `/products/saburi-hydramax-board` | 301 |
| `/saburi-neowud` | `/products/saburi-neowud` | 301 |
| `/saburi-lam` | `/products/saburi-lam` | 301 |
| `/blog/1` | `/blog/top-7-stylish-panel-door-for-your-home-interiors/` | 301 |
| `/blog/2` | `/blog/top-5-isi-certified-termite-proof-plywood-brands-in-india/` | 301 |
| `/blog/3` | `/blog/advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india/` | 301 |
| `/blog/4` | `/blog/top-7-trends-of-plywood-brand-in-india/` | 301 |
| `/blog/5` | `/blog/top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation/` | 301 |

> The 5 `/blog/N` redirects land at the WP slug **with trailing slash** (§0.2 — matches WP's canonical, avoids a 301→301 double-hop). Keep as `redirects()` (they fire **before** the `/blog/*` rewrite).

**B. nginx `.php`/slug 301s → `redirects()`.** Source root `saburiply.com`.

| From | To | Status |
|---|---|---|
| `/marine-plywood-india.php` | `/products/marine-plywood-india` | 301 |
| `/block-board-india.php` | `/products/block-board-india` | 301 |
| `/flush-door-india.php` | `/products/flush-door-india` | 301 |
| `/flexi-plywood-india.php` | `/products/flexi-plywood-india` | 301 |
| `/shuttering-plywood-india.php` | `/products/shuttering-plywood-india` | 301 |
| `/fire-retardant-india.php` | `/products/fire-retardant-india` | 301 |
| `/saburi-board.php` | `/products/saburi-gold-blockboard` | 301 |
| `/saburi-perennial.php` | `/products/saburi-perennial` | 301 |
| `/saburi-club.php` | `/products/saburi-club-h-plus` | 301 |
| `/saburi-door-frame.php` | `/products/saburi-smart-wpc-door-frame` | 301 ✅ **RESOLVED (§0.2):** use singular; nginx's plural `…-frames` target is a current prod bug (no such page). |
| `/saburi-h-plus.php` | `/products/saburi-club-h-plus` | 301 |
| `/saburi-scout-plywood.php` | `/products/saburi-scout-plywood` | 301 |
| `/modwud-particle-board.php` | `/products/saburi-modwud-plain` | 301 |
| `/brw_plywood.php` | `/products/marine-plywood-india` | 301 |
| `/block_board_gurjan.php` | `/products/block-board-india` | 301 |
| `/block-board.php` | `/products/block-board-india` | 301 |
| `/saburi-board` (no `.php`) | `/products/saburi-gold-blockboard` | 301 |
| **regex** `^/best-plywood-.*\.php$` | `/products/marine-plywood-india` | 301 (wildcard catch-all for legacy `.php` location pages) |

**C. Legacy aliases → `redirects()` / `rewrites()`:**
- `/blogs` → `/blog` (301); `/blogs/:path*` → `/blog/:path*` (301). (Replaces nginx `/blogs/`→`:9000`; the legacy plural alias now folds into the singular WP path.)
- `/saburi-panel-admin/*` → **subdomain** `admin.saburiply.com` (301) per prompt Q3; add that origin to the apiv2 CORS allowlist. (Out-of-scope admin SPA; noindex, zero SEO.)

**Implementation notes.**
- Next `redirects()` `permanent:true` returns **308**, not 301. Google treats 308 as permanent, but to byte-match the current 301s for old crawlers/SEO tools, set explicit `statusCode: 301` on the `.php`/legacy entries.
- The regex source uses Next's path-regex syntax: `{ source: '/:name(best-plywood-.*\\.php)', destination: '/products/marine-plywood-india', statusCode: 301 }`.
- **Ordering:** `redirects()` run before `rewrites()`, so `/blog/1..5` redirect first, then surviving `/blog/*` rewrites to WP. Verify no rule both redirects and is a live page (e.g. `/best-plywood-bangalore` must have **no** page and **no** reverse rule → no loop).

---

## 6. SEO Checklist (preserve + improve)

**Meta (Metadata API).** Port every `metaConfig.js` entry (title/description/keywords) + every `PageMeta.jsx` tag (canonical, OG, Twitter, geo/industry, favicons) into:
- Defaults + `metadataBase` + `title.template` + sitewide OG/Twitter/geo in `app/layout.tsx`.
- Static `metadata` per static page (about/gallery/contact/thank-you).
- `buildProductMetadata(p)` / `buildLocationMetadata(l)` reading `data/*` for templated pages; `alternates.canonical` set per page (relative → absolute www via `metadataBase`).
- **Fix (improve):** add first-class SEO entries for the 5 state/city pages (they currently fall back to homepage meta — `metaConfig.js` has no `/best-plywood-*` keys). Uncomment/restore the 2 product entries that were commented out (`saburi-flushdoor-scout`, `saburi-smart-panel-pvc-board`).

**Structured data (JSON-LD) — reusable server `<JsonLd>`; preserve all 5 existing + strengthen.** Source `PageMeta.jsx:135-192`.

| Schema | Where | Change |
|---|---|---|
| `Organization` | sitewide (root layout) — was home-only | Preserve; from `data/site.ts`. |
| `WebSite` | sitewide | **Add** (sitelinks-searchbox eligibility). |
| `BreadcrumbList` | every nested page | Preserve (derive from route/category). |
| `Product` | product template | Preserve; enrich with `certification`, `warrantyYears`, primary image from data. |
| `FAQPage` | product template | **Strengthen** — emit the page's real 5 Q&As from `data/products.ts` instead of the hardcoded generic 2-Q&A. |
| `LocalBusiness` | `/contact` + location pages | Preserve; **add `areaServed`** on location pages (key for "best plywood in <place>"). |
| `Article`/`BlogPosting` | — | Not our concern; WP emits it for `/blog/*`. Remove the dead blog `FAQPage`. |

**sitemap / robots / llms.txt.**
- `app/sitemap.ts` (generated): home + 7 static + 22 products + 5 locations (~35 URLs), absolute `https://www.saburiply.com`, from data modules. **Drop** the stale `/best-plywood-bangalore` and the 35 blog URLs (WP owns its own sitemap). **Delete `public/sitemap.xml`** (static file would shadow the route).
- `app/robots.ts` (generated): mirror current allow/disallow, `host` + `sitemap` absolute www; reference the WP blog sitemap (or a sitemap index). **Delete `public/robots.txt`.**
- `public/llms.txt`: keep static (served at `/llms.txt`).

**Canonicalization / consistency:** www-only, https-only, no trailing slash on app routes (blog keeps WP's). `metadataBase` guarantees canonicals never leak `localhost`/`*.vercel.app`.

**Core Web Vitals targets (ranking levers):** LCP < 2.5s, CLS < 0.1, INP < 200ms (mobile, p75). Levers: RSC server shells (less client JS), `next/image` with explicit dimensions + `priority` on LCP hero, route-level code-splitting, isolating `framer-motion`/`embla`/`react-select` into islands so page shells stay light. Validate against the three existing `lighthouse-report*.json` baselines at repo root.

---

## 7. Blog (WordPress) Rewrite + Trailing Slash

`next.config.mjs`:
```js
const WP_ORIGIN = process.env.WP_ORIGIN_HOST   // e.g. https://wp.saburiply.com (server-only)
export default {
  skipTrailingSlashRedirect: true, // §0.1 — app slash-strip lives in middleware.ts; blog slash preserved
  async redirects() { return [ /* §5 A+B+C, with statusCode:301 on legacy */ ] },
  async rewrites() {
    return [
      { source: '/blog', destination: `${WP_ORIGIN}/blog` },
      { source: '/blog/:path*', destination: `${WP_ORIGIN}/blog/:path*` },
    ]
  },
  images: { /* §8 */ },
}
```

- **Do NOT create `app/blog/`** — the rewrite owns `/blog*` (rewrites run before routing, so `not-found.tsx` never intercepts it).
- **Trailing slash (RESOLVED §0.1):** app routes are slash-less, WP blog URLs are slash-ful — a single `trailingSlash` boolean can't serve both, and `false` would 301-loop the blog. Use `skipTrailingSlashRedirect:true` + `middleware.ts` (strips app-route slashes, excludes `/blog`) so Next never touches the blog slash. Validate the §0.1 curl matrix before cutover.
- **Canonical-host correctness (highest blog risk):** WP, reached via `WP_ORIGIN`, may emit canonicals/OG at the origin host. Mitigate by setting WP `WP_HOME`/`WP_SITEURL` to `https://www.saburiply.com` (and/or honoring `X-Forwarded-Host`). If Vercel's external rewrite doesn't forward the public host, use **middleware** to inject `X-Forwarded-Host: www.saburiply.com` on `/blog/*`. **Verify post-cutover** by curling `https://www.saburiply.com/blog/<slug>/` and checking `<link rel="canonical">`.
- **Fallback (prompt Q3):** if the Vercel→WP rewrite proves impractical, keep nginx as the edge for `/blog/*` + `/saburi-panel-admin/*` only and proxy everything else to Vercel — acceptable stopgap, not the target.

---

## 8. Data & Forms

### Typed data layer (content out of JSX)

`data/types.ts` (sketch — icons stored as serializable `iconKey` strings, resolved to components in a client island):
```ts
export interface Seo { title: string; description: string; keywords?: string; canonical?: string; ogImage?: string }
export interface Faq { question: string; answerHtml: string }
export interface FeatureBadge { id: string; iconKey: string; title: string; sub: string }
export interface ProductImage { src: string; alt: string }
export interface Product {
  slug: string; name: string;
  category: 'plywood'|'blockboard'|'flushdoor'|'wpc-pvc'|'chipboard'|'laminate';
  seo: Seo; introHtml: string;
  features: string[]; applications: string[]; thicknesses: string[]; sizes: string[];
  featureBadges: FeatureBadge[]; faqs: Faq[]; images: ProductImage[];
  brochureUrl?: string; certification?: string; warrantyYears?: number;
}
export interface Location extends Omit<Product,'category'|'thicknesses'|'sizes'|'featureBadges'|'brochureUrl'|'certification'|'warrantyYears'> {
  state: string; city?: string; areaServed: string[];
}
```
- `data/products.ts` → 22 entries (extract inline arrays from each product page; canonical shape is `client/pages/SaburiGold.jsx`) + `getProduct(slug)` accessor (single CMS-swap point).
- `data/locations.ts` → 5 entries (state pages = `client/pages/SaburiBestPlywoodAP.jsx` shape) + `areaServed`; **this is where the missing state/city SEO is authored.**
- `data/site.ts` → Organization/contact constants (from `PageMeta.jsx:142-175`).
- Accessor pattern (`getX(slug) ?? notFound()`) keeps `generateMetadata`, JSON-LD, and a future `generateStaticParams`/CMS all reading one source.

### Forms → same-origin proxy (backend untouched)

`app/api/forms/[endpoint]/route.ts` (node runtime) allow-lists the 6 endpoints and forwards POSTs verbatim:

| Client call | Proxy path | Upstream |
|---|---|---|
| Contact page | `/api/forms/contact-us` | `${API_BASE}/contact-us` |
| ContactForm | `/api/forms/quote` | `${API_BASE}/quote` |
| EnquiryModal, MobileQuoteForm | `/api/forms/enquiry` | `${API_BASE}/enquiry` |
| Architect/Dealership/InteriorDesigner/BecomeOurPartner | `/api/forms/become-partner` | `${API_BASE}/become-partner` |
| QuoteModal | `/api/forms/save-data` | `${API_BASE}/save-data` |
| Footer subscribe | `/api/forms/subscribers` | `${API_ADMIN_BASE}/subscribers` |

- The handler passes the upstream **status + body through verbatim**, so existing client success/error handling (`response.ok`, `result.success`, `data.error.message`) is unchanged.
- **Env (server-only, no `NEXT_PUBLIC_`):** `API_BASE_URL=https://apiv2.saburiply.com/api/web/v1`, `API_ADMIN_BASE_URL=https://apiv2.saburiply.com/api/admin`, `WP_ORIGIN_HOST`. The browser only ever sees same-origin `/api/forms/*`; the apiv2 origin is never shipped to the client → no CORS, origin hidden.
- `config/api.ts` becomes `BASE='/api/forms'` + the endpoint map; the migration is a near-mechanical find/replace of `API_CONFIG.BASE_URL`/`ADMIN_BASE_URL` across ~10 form files. Forms stay client-side; keep current UX (redirect to `/thank-you`, toasts, brochure open).

---

## 9. Component & Code Migration

**Client/Server boundary rules.** Default = Server Component. Add `"use client"` only for: `useState/useEffect/useRef/useContext`, `window/document`, `usePathname/useRouter/useSearchParams`; all forms/dialogs; `react-select`, Radix dialogs/modals, `embla-carousel`, `framer-motion`, `lottie-react`, `recharts`, `react-day-picker`, `sonner`/`Toaster`; `Navbar` (mobile menu + active link), `Footer` (subscribe). Keep server: every `page.tsx`, static shells/prose, the static parts of `ProductTemplate`/`LocationTemplate` (spec tables, feature lists, FAQ text), `JsonLd`, `sitemap.ts`, `robots.ts`, the route handler.

**Islands-in-static pattern.** A server `page.tsx` → server `ProductTemplate` renders the static 90% and embeds client islands for the 10%: `<ProductGallery images={p.images}/>` (carousel index state from `SaburiGold.jsx:46-55`), a `<QuoteModalTrigger/>` holding the open boolean, animated sections. Pass static content into islands as props/`children` to keep client bundles small. Splitting the current monolithic product page into a thin server template + named islands is the main per-page effort, amortized across one shared template.

**Loader UX.** `app/loading.tsx` covers Suspense-style fallback on client nav; re-implement the `PageLoader` top-bar as a small client `<TopProgress/>` driven by `usePathname()` transitions (App Router has no `router.events`). Drop the `useTransition`/`displayLocation` machinery.

**Images.** `LazyImage.jsx` → `next/image` behind `<SmartImage>` preserving the current prop API (`aspectRatio`, `objectFit`, skeleton `animate-pulse`, 700ms fade via `onLoad`, error fallback) so call sites barely change. Every image needs explicit `width`/`height` or `fill` + sized parent (CLS); set `priority` on the LCP hero. **All images are local `/images/*`** — `remotePatterns` likely unneeded (add only if a product image moves to apiv2/CDN later).

**TypeScript.** Convert `.jsx`→`.tsx` opportunistically; keep `tsconfig` `strict:false` initially; re-point alias `@/*` from `client/*` to repo root (`@/components`, `@/data`, …); drop `@shared/*`.

**Dead code / cleanup (delete):** `client/pages/Blog.jsx`, `BlogDetails.jsx` (dead React blog), `FireRetardant_backup.jsx`, `netlify/` + `netlify.toml`, `shared/api.ts`, `AGENTS.md`, `vite.config.*`, `client/App.jsx` (replaced). De-dupe the **6 shadcn stub pairs** (button, breadcrumb, toast, toaster, sonner, tooltip) — delete the 1-line `.tsx` re-export, convert the real `.jsx`→`.tsx`. Strip the unused `next-themes` import in `sonner.jsx` (theme-switching unused). Remove deps: `react-router-dom`, `react-snap`, `react-helmet-async`, `express`, `serverless-http`, `cors`, `vite*`.

---

## 10. Tooling & Vercel Setup

- **`next.config.mjs`:** `redirects()` (§5), `rewrites()` (§7), `images` (§8), **`skipTrailingSlashRedirect:true`** (+ `middleware.ts`, §0.1). `output` UNSET (Node runtime).
- **Removed tooling:** react-snap (+postbuild), Vite config, Netlify (config + functions), nginx static-serve role. nginx retained only as the optional blog fallback edge (§7).
- **Tailwind/shadcn:** `content` globs → `app/**`, `components/**`, `data/**`; `components.json` unchanged.
- **Env per environment (Vercel):** `API_BASE_URL`, `API_ADMIN_BASE_URL`, `WP_ORIGIN_HOST` (Production + Preview, server-only); a `SITE_URL` constant (not `VERCEL_URL`) drives sitemap/robots/canonical absolute hosts.
- **Vercel project:** domains `www.saburiply.com` (primary) + `saburiply.com` (→www); per-PR preview deploys; instant rollback via deployments. Optional `@vercel/analytics` + Speed Insights.
- **ESLint/Prettier:** keep Prettier; adopt `eslint-config-next`.

---

## 11. Testing & Validation (prove no regression)

1. **Redirect tests (automated):** a table-driven script asserting every §5 row returns the right status + `Location`, run against the Vercel preview before cutover. Assert **no loops** and that the www/https canonicalization fires.
2. **Full-site crawl:** crawl the preview (e.g. Screaming Frog) vs production; diff URL inventory, status codes, canonicals, titles/descriptions, and indexability. Zero unexpected 404s; every old URL resolves or 301s exactly.
3. **Meta/JSON-LD parity:** snapshot each page's `<head>` + JSON-LD on preview vs prod; validate JSON-LD in Google Rich Results Test (Product/LocalBusiness/FAQ/Breadcrumb/Organization/WebSite).
4. **Lighthouse before/after:** compare preview vs the repo's `lighthouse-report*.json` baselines; CWV must not regress (targets in §6).
5. **Visual diff:** screenshot key templates (home, a product, a location, contact) desktop+mobile vs prod.
6. **Form E2E:** submit each form against the proxy (to a staging apiv2 or with upstream mocked); assert payload shape unchanged, success → `/thank-you`/toast/brochure.
7. **Blog rewrite:** curl `/blog/` + several `/blog/<slug>/` through the Vercel domain; confirm 200, WP HTML, and `canonical = https://www.saburiply.com/blog/<slug>/`. Confirm `/blogs/*`→`/blog/*` 301 and `/blog/1..5`→slug 301.
8. **404 correctness:** unknown app path returns HTTP 404 (not soft-200).

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation | Rollback |
|---|---|---|---|---|
| Missing/incorrect redirect → lost SEO equity | Med | High | Complete §5 inventory + automated redirect tests + crawl diff; flag the `saburi-door-frame(s)` plural/singular target | Re-add rule; instant Vercel revert |
| WP `/blog/*` canonical points to origin host (dup content) | Med | High | Set WP `WP_HOME/SITEURL`; honor/inject `X-Forwarded-Host`; post-cutover curl check | nginx-edge fallback for `/blog/*` |
| Per-page meta loss across ~36 pages | Med | High | Drive from `data/*`; head snapshot diff vs prod | Patch metadata; revert |
| `next/image` CLS regression | Med | Med | Explicit dimensions/`fill`, `priority` LCP, `<SmartImage>` preserves guards; Lighthouse gate | Revert image swap per page |
| Soft-404 (200 on not-found) | Low | High | Assert HTTP 404 in tests | Fix `not-found.tsx` |
| Redirect loop (www/apex or `/best-plywood-bangalore`) | Low | High | No reverse rules; loop assertions in tests | Revert config |
| `public/sitemap.xml` shadows `app/sitemap.ts` | Med | Med | Delete static files in the same change | Re-add/replace |
| Form proxy breaks payload contract | Low | High | Pass-through status+body verbatim; E2E per form | Point client back at apiv2 (temporary) |
| Hydration mismatch (react-select ids, `window` in render) | Med | Med | Stable `instanceId`; move `window` to `useEffect`; islands only | Patch component |
| DNS cutover breaks `/saburi-panel-admin/*` | Low | High | Move admin to `admin.saburiply.com` + 301 + CORS allowlist before cutover | nginx-edge fallback |

---

## 13. Rollback & Cutover

1. **Build & verify on Vercel preview** (no DNS change): run all §11 checks against the `*.vercel.app` URL until green.
2. **Pre-cutover dependencies:** give WP a stable origin host + www canonical config; move `/saburi-panel-admin/*` to `admin.saburiply.com` (301 + CORS); set all env vars in Vercel.
3. **Promote** the verified preview to Production.
4. **DNS cutover:** point `www.saburiply.com` (+ apex) at Vercel. Immediately re-run redirect + blog + 404 + canonical checks against the live domain.
5. **Rollback:** any failure → revert DNS and/or instant-rollback to the prior Vercel deployment; if only `/blog/*` misbehaves, switch to the nginx-edge fallback for blog while keeping Vercel for the app.
6. **Post-cutover:** submit the new `sitemap.xml` in Search Console; monitor coverage, redirects, and CWV for regressions.

---

## 14. Effort & Sequencing

**Strategy:** strangler-friendly build on Vercel previews, single DNS cutover (§13). Generic estimate (solo/small-team; the source prompt left timeline unspecified).

| Phase | Scope | Rough size | Exit criteria |
|---|---|---|---|
| P1 | Scaffold Next app: `layout`, `Providers`, `globals.css`, `next.config` (redirects+rewrites+metadataBase), Navbar/Footer islands; delete Vite/react-snap/helmet/RR | S–M | App builds; home renders; redirects resolve on preview |
| P2 | **Data layer** (`types`, `products` ×22, `locations` ×5, `site`) — extract inline content; author the 5 missing location SEO entries | **L (keystone)** | Typed data complete; accessors used by templates |
| P3 | Shared `ProductTemplate` + `LocationTemplate` (server shells + islands), `JsonLd`, metadata builders | M–L | One product + one location page pixel/meta-match prod |
| P4 | All 22+5 route folders + static pages + `not-found`/`error`/`loading`/`TopProgress` | M | Full route table live on preview |
| P5 | `sitemap.ts`/`robots.ts` (delete static); form proxy + `config/api.ts` sweep; de-dupe shadcn stubs | M | Forms submit via proxy; sitemap/robots correct |
| P6 | `next/image` via `<SmartImage>`; CLS/Lighthouse pass | M | CWV ≥ baseline |
| P7 | Full validation (§11), WP origin + admin-subdomain prep, cutover + monitor | M | All checks green; DNS cut; rollback ready |

**Critical path:** P1→P2→P3→P4→P7. **Parallelizable:** P2 data extraction (per-product), the form-proxy sweep (P5), and image migration (P6) can proceed alongside template work once types (P2 start) and one template (P3) exist.

---

## 15. Open Questions / Decisions Needing Human Input

1. **WordPress origin host (ops dependency, prompt Q3):** Can WP be given a stable origin host on the VPS + configured to emit `www.saburiply.com/blog/...` canonicals (WP_HOME/SITEURL, X-Forwarded-Host)? If not, lead with the nginx-edge fallback for `/blog/*`.
2. **Redirect target correctness — RESOLVED (§0.2):** `/saburi-door-frame.php` → **singular** `/products/saburi-smart-wpc-door-frame` (verified: the plural page doesn't exist; nginx's plural target is a current prod bug). Encode the singular 301.
3. **301 vs 308 for legacy `.php`:** acceptable to use Next's default 308 for permanent redirects, or force `statusCode:301` to byte-match today? (Plan assumes 301 for legacy parity.)
4. **Vercel plan/limits:** confirm Pro (commercial use) + image-optimization volume for the product imagery.
5. **`ScrollToTop` behavior:** accept App Router's default instant scroll-to-top, or re-add a smooth-scroll client component to match current feel?
6. **`/career`, `/our-journey`:** components exist but are commented out — drop entirely, or wire them up during the migration?
7. **TanStack Query — RESOLVED (§0.2):** verified zero `useQuery`/`useMutation` in the repo → `QueryClientProvider` dropped; also remove the unused `ui/form.tsx` + `react-hook-form` dep.

**Documented as future (NOT built now, per locked decisions):** ISR + on-demand revalidation (would apply if a CMS is adopted for product/location content — the `data/*` accessor seam is the slot-in point); headless-WordPress / MDX blog migration; visible breadcrumb UI (JSON-LD breadcrumbs already emitted); TypeScript `strict` tightening; redesign/new features; backend changes.

---

## QUALITY BAR — self-check

- [x] All routes accounted for: **≈68 active** (71 `<Route>` decls, ~3 commented) = 36 SSG pages (§4) + 2 blog→WP + 404 + 29 redirects (§5). (Corrected from "~45" — §0.2.)
- [x] Every redirect (29 in-app + 17 `.php` + wildcard regex + aliases) mapped to a concrete `redirects()`/`rewrites()`/domain mechanism (§5).
- [x] No route loses meta/canonical; sitemap/robots/llms.txt covered (§6).
- [x] JSON-LD specified per template as an active ranking lever — preserve 5 + strengthen (specific FAQPage, WebSite, areaServed) (§6).
- [x] CWV targets set (LCP/CLS/INP); `next/image` on all significant imagery (§6, §9).
- [x] All in-app routes SSG; ISR/CMS documented as future only (§3, §15).
- [x] Backend untouched; forms submit to the same external API via same-origin proxy (§8).
- [x] `/blog/*` handled as live external WordPress (URLs + meta preserved); dead React blog removed (§7, §9).
- [x] Plan is phased, each phase shippable and reversible via Vercel previews (§13–14).
- [x] Assumptions and open questions explicit; claims cite files (§15, throughout).
