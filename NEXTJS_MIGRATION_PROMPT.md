# Next.js Migration — Implementation-Plan Prompt

**What this is:** a self-contained prompt that instructs an AI architect to produce a full
implementation plan for migrating this repo (Saburi Ply marketing site) from Vite + React
Router 6 (SPA + react-snap) to **Next.js (App Router) on Vercel with hybrid SSG/ISR + SSR**.

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
Next.js {{NEXT_VERSION = latest stable, App Router}}, deployed on Vercel using a hybrid
SSG/ISR + SSR rendering model. The deliverable is a PLAN, not implementation code. Short
illustrative config/pseudocode snippets are welcome where they clarify a step; do not write
the full migration.

# LOCKED DECISIONS (do not re-litigate these — design within them)
- Framework: Next.js {{NEXT_VERSION}}, App Router.
- Host: Vercel (Node runtime; per-PR preview deployments; instant rollback via deployments).
- Rendering: hybrid SSG/ISR for content + SSR where genuinely dynamic. Static export
  (`output: 'export'`) is REJECTED. Therefore `next.config` redirects()/rewrites,
  middleware, ISR (time-based + on-demand revalidation), and `next/image` optimization are
  all AVAILABLE — use them deliberately.
- Backend stays external and untouched (see current state).

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
2. Rendering strategy PER ROUTE GROUP — classify every route as SSG / ISR / SSR / client.
   (Marketing + product + state/city landing pages → SSG or ISR; blog index & posts →
   ISR; form pages → static shell + client islands.) Output as a table. Default to SSG;
   choose ISR only where content can change.
3. ISR & runtime details — for every ISR route, specify a revalidation window AND whether
   on-demand revalidation (revalidatePath/Tag) is warranted; choose node vs edge runtime per
   dynamic segment; and decide where the legacy `.php` 301s live (next.config `redirects()`
   — now available — vs a thin proxy). Justify revalidation windows against how often that
   content actually changes (raise as an OPEN QUESTION if unknown).
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

# HIGHEST-RISK AREAS (address each explicitly in the plan)
- Redirect/SEO parity (the `.php` 301 map + in-app Navigate redirects) — the single biggest risk.
- Per-page meta correctness across ~43 pages (helmet → Metadata API).
- ISR correctness — stale content / wrong revalidation window; on-demand revalidation gaps.
- Form submissions to the external API + CORS/origin under Vercel (allowlist vs proxy).
- `next/image` vs existing markup → layout shift / CLS regressions.
- Domain & redirect CUTOVER to Vercel (DNS, www canonicalization, no redirect loops).

# WORKING METHOD
- First, verify the ground truth against the actual repo. Read at least: `client/App.jsx`,
  `client/config/api.js`, `client/config/metaConfig.js`, `client/components/PageMeta.jsx`,
  `vite.config.ts`, `package.json` (`reactSnap.include`), the root `saburiply.com` nginx file,
  one product page, one form component, `Blog.jsx` + `BlogDetails.jsx`, and
  `public/{sitemap.xml,robots.txt}`. Note any drift from the facts above.
- Determine whether blog/product content is hardcoded in components or fetched — this decides
  SSG vs ISR and whether a CMS is a real future need. Raise as an OPEN QUESTION if unclear.
- Build a COMPLETE route + redirect inventory from App.jsx and the nginx file before planning.
- State assumptions explicitly; cite evidence as `file:path` (with line numbers where useful).
- Where a decision needs business/ops input (ISR revalidation windows, whether the blog needs
  a CMS, Vercel plan/limits), raise it as an OPEN QUESTION rather than guessing.
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
- [ ] Rendering mode per route is justified; ISR windows tied to real content-change frequency.
- [ ] Backend untouched; forms still submit to the same external API (direct or proxied).
- [ ] Plan is phased, each phase shippable and reversible via Vercel previews.
- [ ] Assumptions and open questions are explicit; claims cite files.

# PARAMETERS (set these before running; defaults in brackets)
- {{NEXT_VERSION}}     = [latest stable Next.js, App Router]
- {{DEPLOY_TARGET}}    = Vercel — hybrid SSG/ISR + SSR (LOCKED; not static export)
- {{TS_STRICTNESS}}    = [migrate to TypeScript strict incrementally]
- {{TIMELINE_OR_TEAM}} = [unspecified — give a generic effort estimate]
