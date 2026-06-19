# Next.js Migration — Implementation-Plan Prompt

**What this is:** a self-contained prompt that instructs an AI architect to produce a full
implementation plan for migrating this repo (Saburi Ply marketing site) from Vite + React
Router 6 (SPA + react-snap) to **Next.js (App Router) on Vercel — pure SSG (static) for in-app pages; the blog stays on external WordPress**.

**How to run it (recommended multi-session flow):**
1. Open a **fresh** Claude Code session in this repo.
2. Switch to **plan mode** (Shift+Tab) and keep the model on **Opus**.
3. Paste everything below the `--- PROMPT ---` line, or reference this file: `@NEXTJS_MIGRATION_PROMPT.md`.
4. Tell it to **write the output to `NEXTJS_MIGRATION_PLAN.md`** so the plan is durable.

The prompt is self-contained — it embeds the verified current state and tells the model to
verify against the repo, so it needs no prior conversation. This repo's architecture + known
gotchas are also stored in Claude Code **memory** (`project-architecture`), which auto-loads
into every session in this folder.

--- PROMPT ---

# ROLE
You are a principal frontend architect who specializes in migrating SEO-critical React
SPAs to Next.js on Vercel. You have led 20+ Vite/CRA + React Router → Next.js App Router
migrations. You reason rigorously, justify every architectural decision with explicit
trade-offs, ground every claim in the actual codebase, and clearly separate verified facts
from assumptions. You do not invent APIs or hand-wave the hard parts.

# OBJECTIVE
Produce a complete, staged IMPLEMENTATION PLAN to migrate the "Saburi Ply" marketing
website from its current Vite + React Router 6 SPA (with react-snap pre-rendering) to
Next.js {{NEXT_VERSION = latest stable, App Router}}, deployed on Vercel using a static-first
(pure SSG) rendering model for all in-app pages (the blog remains on external WordPress; ISR/CMS deferred). The deliverable is a PLAN, not implementation code. Short
illustrative config/pseudocode snippets are welcome where they clarify a step; do not write
the full migration.

# LOCKED DECISIONS (do not re-litigate these — design within them)
- Framework: Next.js {{NEXT_VERSION}}, App Router.
- Host: Vercel (Node runtime; per-PR preview deployments; instant rollback via deployments).
- Rendering: PURE SSG (static) for all in-app pages, built from local typed data modules — no
  ISR/CMS machinery now (ISR documented only as a future option; no SSR needed — there are no
  dynamic in-app routes). Static export (`output: 'export'`) is still REJECTED (we keep Vercel's
  Node runtime), so `next.config` redirects()/rewrites, middleware, and `next/image` optimization
  remain AVAILABLE — use them. The blog is NOT in-app: it stays on external WordPress (see
  Pre-Resolved Decisions).
- Backend stays external and untouched (see current state).

# PRE-RESOLVED DECISIONS (answered with the stakeholder during scoping — treat as SETTLED; do NOT re-ask. These SUPERSEDE any conflicting framing elsewhere in this prompt.)

**Q1 — Which is the real blog?** The repo shows three conflicting pictures: (a) 5 posts hardcoded in `Blog.jsx`/`BlogDetails.jsx`, (b) ~35 blog URLs in `public/sitemap.xml`, (c) an nginx proxy `/blogs/` → a Node service on `127.0.0.1:9000`.
→ DECISION: The real blog is a live **external WordPress** site serving ALL of `/blog/*` (the index + the ~35 real posts in sitemap.xml) — verified in production (HTML carries `generator: WordPress`; slugs absent from the React code return real WP articles). The `:9000` service IS that WordPress backend; `/blogs/` (plural) is a legacy alias that 301s into `/blog/`. The 5 hardcoded React posts (+ the in-app `/blog` routes + `/blog/1..5` redirects) are DEAD CODE, never served in production. → Keep the blog on WordPress, preserve all ~35 `/blog/<slug>/` URLs + meta, and DELETE the React blog. (Routing mechanism in Q3.)

**Q2 — Content-management direction: pure SSG vs ISR + CMS?** All in-app page content (the ~22 product pages + 5 location/landing pages) is currently hardcoded in components.
→ DECISION: **Pure SSG, no ISR/CMS in this migration.** Pre-render the product + location pages statically from local **typed TS data modules** (move content out of inline JSX into typed data). No ISR, no revalidation machinery, no CMS — document ISR/CMS only as a *future* option, and structure the data layer so a CMS could slot in later without re-architecting. Rationale: SSG and ISR are identical to Googlebot, this content rarely changes, and the content-velocity surface (the blog) is already WordPress — so ISR/CMS would add complexity and delay launch with zero SEO gain. (Applies to in-app pages only; the blog is WordPress, not local SSG data.)

**Q3 — DNS cutover: two paths live only on the VPS nginx and would break when DNS points at Vercel** — `/blogs/*` (the `:9000` WordPress service) and `/saburi-panel-admin/*` (a separate admin React app).
→ DECISION: Split by path — do NOT subdomain the blog.
  • `/blog/*` (+ legacy `/blogs/*` → 301 to `/blog/*`): KEEP on the apex as a subdirectory, served via a **Vercel rewrite to the WordPress origin** (give WP a stable origin host on the VPS; Vercel rewrites `/blog/:path*` → that origin). Preserves all ~35 ranking URLs unchanged — subdirectory beats subdomain, and avoids re-301'ing aged pages. WP must emit canonicals as `https://www.saburiply.com/blog/...` when reached via the origin host (set WP_HOME/WP_SITEURL; honor X-Forwarded-Host).
  • `/saburi-panel-admin/*` (internal admin React app — noindex, zero SEO value): move to subdomain **`admin.saburiply.com`** + 301 the old path; add that origin to the `apiv2` CORS allowlist.
  • Fallback if the Vercel→WP rewrite proves impractical: keep nginx as the edge for `/blog/*` and `/saburi-panel-admin/*` only and proxy everything else to Vercel (preserves URLs but keeps a two-system edge — acceptable stopgap, not the target).

# PRIMARY SUCCESS CRITERION (read first — this is the top constraint)
This is an SEO- and performance-driven marketing site. The business goal is to RANK #1 in the
Indian plywood ("ply") category and for local "best plywood in <state/city>" searches. So the
migration must do two things, in priority order:
  (1) PRESERVE 100% of existing SEO equity — zero regression:
      - every existing URL resolves identically or 301-redirects exactly as today;
      - no page loses its meta / canonical / Open Graph / structured data;
      - Core Web Vitals / Lighthouse do not regress.
  (2) THEN actively IMPROVE technical SEO wherever the migration makes it cheap — richer
      structured data, better Core Web Vitals (LCP/CLS/INP via RSC + next/image + edge caching),
      cleaner crawlability — to compete for top rankings.
Scope note: TECHNICAL SEO is in scope; content/keyword/backlink strategy is NOT. Treat SEO as
paramount — when a trade-off arises, choose the option that ranks better, not the one that is
merely easiest to build.

# VERIFIED CURRENT STATE (ground truth — trust this, but verify against the repo and flag drift)
- App: React 18 SPA, Vite 6, React Router 6 (BrowserRouter) in `client/App.jsx`. A TS
  config exists, but app/page code is mostly `.jsx`; the shadcn/Radix UI library in
  `client/components/ui` is `.tsx`. Aliases: `@` → ./client, `@shared` → ./shared.
- Routing: ~43 page components in `client/pages/`, lazy-loaded via React.lazy + Suspense
  with a custom `PageLoader` and `useTransition`. Route groups:
  home `/`; `/about` + `/about/{accreditation,national-presence,environment-stewardship,privacy-policy}`;
  `/gallery`; `/contact`; `/thank-you`; ~22 `/products/*` pages; 4 state landing pages
  (`/best-plywood-{andhra-pradesh,kerala,tamilnadu,telangana}`); 1 city page
  (`/plywood-dealers-bangalore`); `/blog` and `/blog/:slug`.
- Redirects (SEO-critical, TWO layers):
  (a) In-app `<Navigate replace>` in App.jsx: legacy flat slugs → `/products/*`,
      `/best-plywood-bangalore` → `/plywood-dealers-bangalore`, typo
      `/best-plywood-kerela` → `/best-plywood-kerala`, and `/blog/{1..5}` → slug URLs.
  (b) An nginx config file named `saburiply.com` at repo root: dozens of legacy `.php` →
      new-URL 301s, plus http→https and non-www→www canonicalization.
- SEO infra: react-helmet-async (`HelmetProvider`) + `client/components/PageMeta.jsx` +
  `client/config/metaConfig.js` drive per-route meta. `react-snap` pre-renders the ~40
  routes listed in `package.json` → `reactSnap.include`; App.jsx uses `hydrateRoot` when
  pre-rendered HTML exists, else `createRoot`. `public/` holds `sitemap.xml`, `robots.txt`,
  `llms.txt`, favicon, `placeholder.svg`, and image/brochure/certificate assets. Three
  `lighthouse-report*.json` files sit at repo root (perf baselines).
- UI/libs: TailwindCSS 3 (`tailwind.config.ts`, `postcss.config.js`, shadcn `components.json`),
  Radix/shadcn, framer-motion, embla-carousel, lottie-react, recharts, react-select,
  react-hook-form + yup + zod, sonner/toaster. Custom `client/components/LazyImage.jsx`
  for image lazy-loading. TanStack Query (`QueryClientProvider`) is wired but data is
  primarily client-fetched.
- Backend: its code IS in this repo under `server/` (a standalone Express 5 + Sequelize + MySQL
  app), BUT it is deployed independently at `apiv2.saburiply.com` and is explicitly OUT OF SCOPE
  — do NOT migrate, modify, or fold it into Next.js. It is never crawled (it only handles form
  submissions + an admin CRM behind auth) and therefore carries ZERO SEO value; migrating it
  would add risk/cost with no ranking benefit. The frontend talks to it only over HTTP, via
  `client/config/api.js` (hardcoded `BASE_URL = https://apiv2.saburiply.com/api/web/v1`,
  `ADMIN_BASE_URL = .../api/admin`) for contact / quote / enquiry / partner / newsletter /
  save-data submissions. The API's CORS already allows saburiply.com, www, dev, and
  localhost:8080/3000/5173 — handle the new Vercel preview/prod origins via a Next Route Handler
  proxy (preferred) rather than widening that allowlist.
- BLOG (VERIFIED LIVE IN PRODUCTION 2026-06-19 — the repo is misleading here): the real blog is
  a SEPARATE WordPress site serving ALL of `/blog/*` — the `/blog/` index AND the ~35 real posts
  listed in `public/sitemap.xml` (production HTML carries `generator: WordPress`). Production
  nginx routes `/blog/*` (plus the legacy `/blogs/` alias → `127.0.0.1:9000`) to WordPress
  BEFORE the SPA is reached. The 5 posts hardcoded in `client/pages/Blog.jsx` + `BlogDetails.jsx`
  (and the `/blog` + `/blog/:slug` routes in App.jsx, and the `/blog/1..5` redirects) are DEAD
  CODE — never served in prod; they only render on the local dev server. Do NOT treat the React
  blog as the blog. The ~35 `/blog/<slug>/` URLs + their content/meta are real, ranking SEO
  assets that MUST be preserved. (The repo's root `saburiply.com` nginx file is STALE and does
  not show the `/blog/`→WordPress routing.)
- Build/deploy: `vite.config.ts` → base "/", dev port 8080, build to `dist/spa` with manual
  vendor chunk splitting; `build:client` then `react-snap` as postbuild. Deployed two ways
  today: an nginx VPS serving `/var/www/saburiply_client/dist/spa` (canonical; this is where
  the `.php` 301 map lives) AND Netlify. The `netlify/functions/api.ts` is ORPHANED/broken,
  `shared/api.ts` has only leftover template types, and `AGENTS.md` is the unmodified
  "Fusion Starter" template that does NOT describe the real system — ignore it. All of this
  legacy deploy tooling is to be retired in favor of Vercel.

# CONSTRAINTS & NON-GOALS
- Do NOT migrate or modify the backend API; it stays external. Plan the frontend only.
- Preserve every public URL and redirect exactly — zero SEO regression. Deliver a complete
  redirect inventory (current → new mechanism).
- Keep TailwindCSS, the shadcn/Radix component library, and the existing visual design.
- Keep the external form-submission contract (same endpoints/payloads) unless proxying
  through a Next Route Handler/Server Action demonstrably improves reliability or hides the
  origin — if changed, justify and keep it reversible.
- Out of scope (call out as optional/future, do not plan in detail): redesign, new features,
  backend changes, adopting a CMS for the blog.

# KEY DECISIONS THE PLAN MUST RESOLVE (give options → recommendation → rationale for each)
1. App Router structure — confirm the App Router layout (route groups, shared layouts,
   loading.tsx/error.tsx) and how the current lazy + Suspense + useTransition loader UX maps
   onto it (default Next streaming + loading.tsx).
2. Rendering per route group — per Pre-Resolved Decision Q2, ALL in-app routes are PURE SSG
   (static, from typed data modules); NO ISR. Form pages = static SSG shell + client islands.
   The blog is NOT in-app (external WordPress via rewrite — see Q1/Q3). Still produce the full
   route table (every route → Next path → SSG → notes) so coverage is explicit.
3. Runtime details — ISR is DEFERRED (pure SSG now, per Q2): document where ISR / on-demand
   revalidation WOULD apply if a CMS is adopted later, but build none of it. Still decide:
   node vs edge runtime for the form Route Handler proxy, and where the legacy `.php` 301s live
   (next.config `redirects()`).
4. SEO/meta + STRUCTURED DATA migration —
   (a) Meta: react-helmet-async + PageMeta + metaConfig.js → Next Metadata API /
       `generateMetadata` for title/description/canonical/OG/Twitter per route, losing none of
       today's meta; `sitemap.xml`/`robots.txt`/`llms.txt` → keep static in /public or generate
       via `app/sitemap.ts`/`app/robots.ts`.
   (b) Structured data (JSON-LD) — treat as a PRIMARY ranking lever for the #1-in-category goal,
       not an afterthought: audit what exists today, then specify per-template schema to add or
       strengthen — `Organization` + `WebSite` site-wide; `Product` on the ~22 product pages;
       `LocalBusiness` / area-served on the state/city landing pages (key for "best plywood in
       <place>" queries); `BreadcrumbList` on nested routes; `Article`/`BlogPosting` on blog
       posts; `FAQPage` where Q&A content exists. Note required fields + how each is emitted.
5. Routing & redirect migration — map React Router routes onto file-based routing; convert
   ALL in-app `<Navigate>` AND nginx `.php` redirects into `next.config.js` `redirects()`
   (and/or middleware for patterned/host rules); reproduce non-www→www and http→https
   canonicalization (Vercel domain config + redirects); decide trailing-slash policy and
   keep it consistent with today.
6. Client/Server component boundaries — define the `"use client"` rules (forms, Radix
   dialogs/modals, carousels, framer-motion, sonner, TanStack Query, anything touching
   window/browser hooks) vs server components for static shells; restructure the global
   providers (Helmet removed; Tooltip/QueryClient → a client provider wrapper mounted in the
   root layout).
7. Data fetching — which reads (if any) move to server components with fetch + ISR caching
   vs stay in TanStack Query on the client; and how forms POST to the API — RECOMMENDED: a thin
   Next Route Handler proxy on the app's own domain (same-origin, no CORS, requires NO change to
   the out-of-scope backend), in preference to calling apiv2 directly or using Server Actions.
8. Images & assets — `LazyImage.jsx` → `next/image` (Vercel image optimization now
   available); define sizes/priority/placeholder strategy to avoid CLS; `remotePatterns`
   for any external image hosts; `/public` asset handling; favicon/manifest/metadata icons.
9. TypeScript normalization — plan `.jsx` → `.tsx`; remove duplicate UI components (e.g.
   `button.jsx` vs `button.tsx` and other doubled ui files) and dead code
   (`FireRetardant_backup.jsx`, the orphaned netlify function, stale `shared/api.ts`, `AGENTS.md`).
10. Tooling & Vercel project — retire react-snap, the Vite config, Netlify, and the nginx
    static-serve role; preserve the perf budget natively (Next chunking, route-level code
    splitting); ESLint/Prettier; env strategy (`NEXT_PUBLIC_*` for the API base URL); Vercel
    project setup (env vars per environment, domains, preview deploys, optional
    @vercel/analytics + Speed Insights).
11. BLOG handling (RESOLVED — see Pre-Resolved Decisions Q1 & Q3) — leave WordPress in place;
    serve `/blog/*` on the apex via a Vercel rewrite to the WP origin; preserve every
    `/blog/<slug>/` URL + meta; DELETE the dead React blog (`Blog.jsx`/`BlogDetails.jsx` + the
    in-app `/blog` routes) so it can't shadow WP. Detail the rewrite, the WP canonical/origin-host
    config (WP_HOME/WP_SITEURL + X-Forwarded-Host), and the `/blogs/*`→`/blog/*` 301. (Headless-WP
    and MDX migration are explicitly deferred as future options — NOT part of this migration.)

# HIGHEST-RISK AREAS (address each explicitly in the plan)
- Redirect/SEO parity (the `.php` 301 map + in-app Navigate redirects) — the single biggest risk.
- Per-page meta correctness across ~43 pages (helmet → Metadata API).
- WordPress-origin correctness — canonicals/links must resolve to `www.saburiply.com/blog/...`
  when WP is reached via the rewrite origin host (else duplicate content / wrong canonical).
- Form submissions to the external API + CORS/origin under Vercel (allowlist vs proxy).
- `next/image` vs existing markup → layout shift / CLS regressions.
- Domain & redirect CUTOVER to Vercel (DNS, www canonicalization, no redirect loops).
- Blog (`/blog/*`) is live external WordPress with ~35 ranking posts — mishandling it (serving
  the dead React stubs, dropping URLs, or breaking the proxy/rewrite to WP) would tank a large
  block of indexed pages.

# WORKING METHOD
- First, verify the ground truth against the actual repo. Read at least: `client/App.jsx`,
  `client/config/api.js`, `client/config/metaConfig.js`, `client/components/PageMeta.jsx`,
  `vite.config.ts`, `package.json` (`reactSnap.include`), the root `saburiply.com` nginx file,
  one product page, one form component, `Blog.jsx` + `BlogDetails.jsx`, and
  `public/{sitemap.xml,robots.txt}`. Note any drift from the facts above.
- The BLOG is external WordPress (Q1) — do NOT plan it from the React stubs. Product + location
  page content is hardcoded/static → PURE SSG (Q2); no ISR. Move that content into typed TS data
  modules as part of the migration.
- Build a COMPLETE route + redirect inventory from App.jsx and the nginx file before planning.
- State assumptions explicitly; cite evidence as `file:path` (with line numbers where useful).
- Where a decision genuinely needs business/ops input (Vercel plan/limits, the WordPress origin-
  host setup), raise it as an OPEN QUESTION — but do NOT re-ask anything already settled in
  Pre-Resolved Decisions.
- Do not invent Next.js or Vercel APIs; rely on documented stable features for {{NEXT_VERSION}}.

# REQUIRED DELIVERABLE STRUCTURE
1. Executive summary — recommended target architecture (5–8 lines) + headline risks.
2. Decision log — for each key decision: options, recommendation, rationale.
3. Target architecture — `app/` router tree, layout/provider structure, rendering-mode map.
4. Route & rendering table — every current route → Next path → render mode (SSG/ISR/SSR/client)
   → ISR window if any → notes.
5. Redirect inventory & migration — every redirect (in-app + `.php` nginx) → new mechanism
   (next.config redirects / middleware), as a table.
6. SEO checklist (preserve + improve) — per route: meta, canonical, OG/Twitter, JSON-LD schema
   type(s), sitemap, robots, llms.txt, trailing-slash/www; PLUS the structured-data additions
   per template and Core Web Vitals targets (LCP/CLS/INP) treated as ranking levers.
7. Phased migration plan — ordered, independently shippable/verifiable phases (leveraging
   Vercel preview deploys); state strangler-fig vs big-bang and why; per phase: scope, steps,
   exit criteria.
8. Component & code migration — jsx→tsx, `"use client"` boundary rules, dead-code removal,
   shared utils, image migration.
9. Data & forms — fetching model + external API integration + CORS/env/proxy handling.
10. Tooling & Vercel setup — next.config (redirects + image config), removed tooling, env
    vars per environment, domains, preview/prod, optional analytics.
11. Testing & validation — how to PROVE no SEO/visual/functional regression: full-site link
    crawl, automated redirect tests, Lighthouse before/after vs the baseline reports, visual
    diff, form E2E, ISR revalidation checks.
12. Risk register — risk → likelihood/impact → mitigation → rollback.
13. Rollback & cutover — DNS cutover to Vercel, canary via preview→production promotion,
    instant revert via Vercel deployments, www/redirect verification.
14. Effort & sequencing — rough size per phase, critical path, parallelizable work.
15. Open questions / decisions needing human input.

# QUALITY BAR — self-check against this before finalizing; note any gaps
- [ ] All ~43 routes appear in the route table with a render mode (and ISR window where used).
- [ ] Every existing redirect (in-app + `.php`) is mapped to a concrete next.config/middleware rule.
- [ ] No route loses meta/canonical; sitemap/robots/llms.txt are covered.
- [ ] Structured data (JSON-LD) specified per template (Product / LocalBusiness / Article /
      BreadcrumbList / FAQ / Organization) as an active ranking lever, not merely preserved.
- [ ] Core Web Vitals targets set (LCP/CLS/INP); next/image used on all significant imagery.
- [ ] All in-app routes are SSG (per Q2); ISR/CMS not built (only documented as future).
- [ ] Backend untouched; forms still submit to the same external API (direct or proxied).
- [ ] `/blog/*` handled as live external WordPress (all ~35 URLs + meta preserved); the dead
      React blog (`Blog.jsx`/`BlogDetails.jsx` + in-app `/blog` routes) is removed, not rebuilt.
- [ ] Plan is phased, each phase shippable and reversible via Vercel previews.
- [ ] Assumptions and open questions are explicit; claims cite files.

# PARAMETERS (set these before running; defaults in brackets)
- {{NEXT_VERSION}}     = [latest stable Next.js, App Router]
- {{DEPLOY_TARGET}}    = Vercel, Node runtime — PURE SSG for in-app pages (NOT static export; ISR/CMS deferred); blog stays on external WordPress via rewrite
- {{TS_STRICTNESS}}    = [migrate to TypeScript strict incrementally]
- {{TIMELINE_OR_TEAM}} = [unspecified — give a generic effort estimate]
