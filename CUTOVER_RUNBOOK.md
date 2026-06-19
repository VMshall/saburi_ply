# Cutover Runbook — Saburi Ply → Next.js on Vercel

Final handoff for the migration (source of truth: `NEXTJS_MIGRATION_PLAN.md`). This is the
**operator checklist** for taking the verified Next.js build live. The hard gates run on a **Vercel
preview** (with `WP_ORIGIN_HOST` set) and at the **DNS** layer — those are OPS steps **you** run.
Do **not** cut DNS until every Go/No-Go gate below is green.

Stack is fixed: **Next.js 14.2 / React 18.3, pure SSG**. Backend (`apiv2.saburiply.com`) and the
WordPress blog are **out of scope / untouched**.

---

## 0. Validation harness (run these first)

Two dependency-free Node scripts (Node 18+) drive the automated checks. They take **any base URL**,
so the same commands run against local, a preview, or production.

```bash
# Local (build once, serve, validate):
npm run build && npx next start -p 3100 &      # serve the production build
node scripts/redirect-check.mjs http://localhost:3100      # §5 redirects + §0.1 slash matrix
node scripts/seo-check.mjs      http://localhost:3100      # canonical + JSON-LD + 404

# Vercel preview (adds the blog gate — needs WP_ORIGIN_HOST on the deployment):
node scripts/redirect-check.mjs https://<preview>.vercel.app --include-blog
node scripts/seo-check.mjs      https://<preview>.vercel.app --dump   # --dump writes JSON-LD to /tmp for Rich Results
```

Both exit non-zero on any failure (CI-friendly). `redirect-check` **imports the live
`next.config.mjs` rules**, so it can never drift from the actual redirect config.

### Verified locally (already green on the production build)
- ✅ `redirect-check`: **56/56** — all 22 product slugs, 17 `.php`/legacy, the `.php` wildcard,
  `/blogs[/*]`, `/blog/1..5`, admin subdomain, **plus the §0.1 app-route slash matrix** (single 308
  strip → 200, **no loops**). Blog *destinations* (`/blog/*`) assert the 301+Location+no-loop
  locally; their final 200 needs WP (preview).
- ✅ `seo-check`: **30/30** — every template's canonical is absolute on `https://www.saburiply.com`
  (never leaks `localhost`/`*.vercel.app`, courtesy of `metadataBase`), `og:url ≡ canonical`,
  required JSON-LD `@type`s present, `/thank-you` is `noindex`, and unknown paths return **hard
  HTTP 404** (no soft-200).
- ✅ Build + `tsc --noEmit` clean; all routes prerendered static.

### Preview-only (cannot be verified locally — need the gates below)
- ⛔ Blog rewrite + **blog canonical host** (needs `WP_ORIGIN_HOST` → real WordPress origin).
- ⛔ Lighthouse on a **real edge CDN** (local slow-4G can't confirm the LCP < 2.5s target).
- ⛔ Form E2E against a **staging apiv2**.
- ⛔ www/apex + http→https canonicalization (Vercel Domains layer, not in the build).

---

## 1. Go / No-Go gates (run on a Vercel preview, `WP_ORIGIN_HOST` set)

Ship only when **all four** are green:

| # | Gate | How | Pass criteria |
|---|------|-----|---------------|
| G1 | **§0.1 blog/trailing-slash matrix** | §2 curl matrix below | No loop on any row; blog canonical = `…/blog/<slug>/` |
| G2 | **Redirects + crawl parity** | `redirect-check … --include-blog` + a full-site crawl (Screaming Frog) preview-vs-prod | Script GREEN; every old URL resolves or 301s **exactly once**; **zero unexpected 404s** |
| G3 | **Lighthouse on the preview** | Lighthouse mobile against the `*.vercel.app` URL | CWV ≥ the repo baselines; confirm **LCP < 2.5s** (the local slow-4G run couldn't) |
| G4 | **Form E2E** | Submit each of the 6 forms against **staging** apiv2 (§4) | Upstream payload shape unchanged; success → `/thank-you`/toast/brochure |

Supporting (also from §11): G2 includes the `seo-check` SEO/JSON-LD/404 parity; validate JSON-LD in
**Google Rich Results Test** (§3); visual-diff key templates desktop+mobile vs prod.

---

## 2. G1 — the §0.1 trailing-slash gate (exact matrix)

App routes are **slash-less**; the WordPress blog is **slash-ful**. `skipTrailingSlashRedirect:true`
+ `middleware.ts` (excludes `/blog`) keep both correct and **prevent the redirect loop on ~35
ranking blog URLs**. Run against the preview:

```bash
P=https://<preview>.vercel.app

# App route — single 308 strip, then 200 (NOT a loop):
curl -sI "$P/about/"   | grep -iE 'HTTP|location'     # → 308 ; location: /about
curl -sI "$P/about"    | grep -iE 'HTTP'              # → 200

# Blog — WP keeps its trailing slash; must be 200 and must NOT loop:
curl -sIL "$P/blog/"                  | grep -iE 'HTTP'   # → 200 (WP), no 308 strip
curl -sIL "$P/blog/<known-slug>/"     | grep -iE 'HTTP'   # → 200 (WP)
curl -sIL "$P/blog/<known-slug>"      | grep -iE 'HTTP'   # → 200/301 to slash; NO 3xx↔3xx loop

# Blog canonical points at the PUBLIC host (not the WP origin) — the highest blog risk:
curl -s "$P/blog/<known-slug>/" | grep -i 'rel="canonical"'   # → https://www.saburiply.com/blog/<known-slug>/
```

**Fail (canonical shows the WP origin host)** → fix WP `WP_HOME`/`WP_SITEURL` (or inject
`X-Forwarded-Host: www.saburiply.com` on `/blog/*`) and re-check. Do not cut DNS with a wrong blog
canonical (duplicate-content risk).

---

## 3. G2/SEO — per-template canonical + JSON-LD checklist (Rich Results Test)

`seo-check` automates the canonical/`@type`/404 assertions. Additionally, paste each template's
JSON-LD into **https://search.google.com/test/rich-results** (use `seo-check … --dump`, which writes
`/tmp/jsonld-*.json`) and confirm **0 errors**:

| Template | Sample URL | Canonical (absolute www, no trailing slash) | Required JSON-LD `@type` |
|---|---|---|---|
| Home | `/` | `https://www.saburiply.com` | Organization, WebSite, LocalBusiness |
| Product | `/products/marine-plywood-india` | `…/products/<slug>` | Organization, WebSite, BreadcrumbList, Product, **FAQPage** |
| Product (no FAQ) | `/products/saburi-flushdoor-scout` | `…/products/<slug>` | Organization, WebSite, BreadcrumbList, Product |
| Location | `/best-plywood-andhra-pradesh` | `…/<slug>` | Organization, WebSite, BreadcrumbList, LocalBusiness (+ `areaServed`) |
| Contact | `/contact` | `…/contact` | Organization, WebSite, LocalBusiness |
| About / Gallery | `/about`, `/gallery` | `…/<path>` | Organization, WebSite |
| Thank-you | `/thank-you` | `…/thank-you` | Organization, WebSite — **and `noindex`** |

**Note (data follow-up, not a blocker):** 2 of 22 products — `saburi-flushdoor-scout`,
`saburi-smart-panel-pvc-board` (the two §6 "restored from commented-out" entries) — have empty
`faqs:[]`, so they (correctly) emit no FAQPage. Authoring their 5 Q&As would restore full FAQ-rich
parity. Also confirm `Organization`/`WebSite` (sitewide) carry **no** `aggregateRating` (removed in
P4 — hardcoded ratings without real review markup violate Google policy).

---

## 4. G4 — form E2E (against staging apiv2)

6 allow-listed endpoints proxy same-origin via `app/api/forms/[endpoint]/route.ts` (Node runtime,
forwards the raw body, returns upstream status+body verbatim):
`contact-us`, `quote`, `enquiry`, `become-partner`, `save-data` → web API; `subscribers` → admin API.

```bash
# Point the proxy at staging for the test (Vercel env on the preview):
API_BASE_URL=https://<staging-apiv2>/api/web/v1
API_ADMIN_BASE_URL=https://<staging-apiv2>/api/admin
# (Both have prod fallbacks baked in, so leaving them unset hits production apiv2 — use staging for E2E.)
```

Submit each form in the UI (contact page, quote modal, enquiry modal, become-partner, footer
dealership/architect/designer dialogs, footer subscribe). Assert: request body shape unchanged from
the legacy app; success path → `/thank-you` / toast / brochure download. Verify the legacy
**Footer sitemap UI** still renders (it fetches `/sitemap.xml` at runtime — now served by
`app/sitemap.ts`).

---

## 5. Pre-cutover dependencies (provision BEFORE promoting to production)

1. **WordPress origin (blog).** Give WP a stable origin host reachable from Vercel (e.g.
   `wp.saburiply.com` on the VPS). Set WP **`WP_HOME` / `WP_SITEURL` = `https://www.saburiply.com`**
   so it emits public-host canonicals behind the rewrite (and/or honor `X-Forwarded-Host`).
2. **Admin subdomain.** Provision **`admin.saburiply.com`** (the out-of-scope admin SPA) and add it
   to the **apiv2 CORS allow-list**. The `/saburi-panel-admin/*` → `admin.saburiply.com` 301s
   depend on it.
3. **Vercel env vars** (Production + Preview):
   - `WP_ORIGIN_HOST` = `https://wp.saburiply.com` — **required**; without it `/blog*` isn't served
     (the `rewrites()` are guarded and return `[]`).
   - `API_BASE_URL`, `API_ADMIN_BASE_URL` — optional; default to production apiv2. Set to staging
     for G4, set explicitly for production if the apiv2 base ever moves.
4. **Vercel Domains.** Add `saburiply.com` + `www.saburiply.com`, set **www as primary** (issues the
   apex→www permanent redirect; replaces nginx `server_name` 301). http→https is automatic.

---

## 6. Cutover (single DNS switch)

1. Run **§0 harness + §1 gates G1–G4** against the preview until all green.
2. Confirm §5 pre-cutover dependencies are all provisioned.
3. **Promote** the verified preview deployment to **Production** in Vercel.
4. **DNS:** point `www.saburiply.com` (+ apex) at Vercel per Vercel's domain instructions
   (A/ALIAS/CNAME as shown). Lower TTL beforehand for a fast rollback window.
5. **Immediately re-run against the live domain:**
   ```bash
   node scripts/redirect-check.mjs https://www.saburiply.com --include-blog
   node scripts/seo-check.mjs      https://www.saburiply.com
   # + the §2 blog/slash matrix + spot-check the blog canonical on the live host.
   ```
6. **Search Console:** submit `https://www.saburiply.com/sitemap.xml`; monitor Coverage, the
   redirect report, and CWV for regressions over the following days.

---

## 7. Rollback (instant)

| Symptom | Action |
|---|---|
| Anything broadly wrong post-cutover | **Vercel → Instant Rollback** to the prior deployment, and/or revert DNS to the old origin (low TTL makes this fast). |
| Only `/blog/*` misbehaves (loop / wrong canonical / 5xx) | Switch the **nginx edge** to serve `/blog/*` (+ `/saburi-panel-admin/*`) directly from WP and proxy everything else to Vercel — keeps the app live while blog is fixed. |
| A single redirect missing/wrong | Re-add the rule in `next.config.mjs` → redeploy (no DNS change). |
| Form payload contract breaks | Temporarily point the client back at `apiv2` directly (or fix the proxy) → redeploy. |

Code-level rollback is a plain `git revert` + redeploy — the build is deterministic SSG. The
optimized banner assets (P6) are in git history if a higher-quality re-export is preferred later.

---

## 8. Reference — what this build canonicalizes

- **Host:** www-only, https-only (Vercel Domains). **Trailing slash:** app routes slash-less
  (`middleware.ts` 308-strips); blog keeps WP's trailing slash (`skipTrailingSlashRedirect:true`).
- **Redirects:** all emit **301** (explicit `statusCode:301`, not Next's default 308) to byte-match
  the historical 301s. Full inventory: `NEXTJS_MIGRATION_PLAN.md` §5 / `next.config.mjs`.
- **Sitemap/robots:** generated (`app/sitemap.ts`, 35 URLs; `app/robots.ts`); static
  `public/sitemap.xml`/`robots.txt` deleted so they don't shadow the routes. Blog URLs are owned by
  WP's own sitemap.
- **Known cosmetic note:** the sitemap lists the home as `…/` while its canonical/og use the bare
  origin `https://www.saburiply.com` — identical root URLs per RFC 3986 (empty path ≡ `/`); no
  action required, align only if you want byte-identical strings.
