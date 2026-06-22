# Cutover Runbook — Saburi Ply → Next.js on Vercel

Final handoff for the migration (source of truth: `NEXTJS_MIGRATION_PLAN.md`). This is the
**operator checklist** for taking the verified Next.js build live. The remaining hard gates run on a
**Vercel preview** and at the **DNS** layer — those are OPS steps **you** run. Do **not** cut DNS
until every Go/No-Go gate below is green.

Stack is fixed: **Next.js 14.2 / React 18.3, pure SSG**. Backend (`apiv2.saburiply.com`) is out of
scope / untouched.

> **P8 update — the blog is now IN-APP.** WordPress is being **retired**: all 38 `/blog/<slug>`
> posts + the index are static (scraped to `content/blog/*.mdx`, images in `public/images/blog/`),
> with zero runtime dependency on WordPress. Consequences for this runbook:
> - **`WP_ORIGIN_HOST` is gone** (no `/blog` rewrite). Do not set it.
> - **Former gate G1 (§0.1 blog/trailing-slash matrix) and the Stage-0.1 WP-origin setup are MOOT**
>   — there is no WP origin to canonicalize and no redirect-loop risk. The blog's slash policy is
>   now the ordinary app-route 308-strip, fully verified locally.
> - WordPress **decommission** happens *post-cutover* (§7), after the in-app blog is confirmed live.

---

## 0. Validation harness (run these first)

Three dependency-free Node scripts (Node 18+) drive the automated checks. They take **any base URL**,
so the same commands run against local, a preview, or production.

```bash
# Local (build once, serve, validate):
npm run build && npx next start -p 3100 &
node scripts/redirect-check.mjs http://localhost:3100   # §5 redirects + §0.1 slash matrix + in-app blog
node scripts/seo-check.mjs      http://localhost:3100   # canonical + JSON-LD (incl. BlogPosting) + 404
node scripts/blog-check.mjs                             # blog integrity + live-parity vs WordPress
node scripts/blog-check.mjs --no-live                   # blog integrity only (offline)
```

All exit non-zero on any failure (CI-friendly). `redirect-check` **imports the live `next.config.mjs`
rules**, so it can never drift from the actual config.

### Verified locally (green on the production build)
- ✅ `redirect-check`: **60/60** — all 22 product slugs, 17 `.php`/legacy, the `.php` wildcard,
  `/blogs[/*]` (→ in-app `/blog`), `/blog/1..5` (→ slash-less post slugs), admin subdomain, the
  trailing-slash matrix (single **308**→200, **no loops**, incl. `/blog/<slug>/` → `/blog/<slug>`),
  and the in-app blog routes returning live 200s.
- ✅ `seo-check`: **36/36** — every template's canonical is absolute on `https://www.saburiply.com`
  (never leaks `localhost`/`*.vercel.app`), `og:url ≡ canonical`, required JSON-LD `@type`s present
  (incl. **BlogPosting** on posts), `/thank-you` is `noindex`, unknown paths return **hard 404**.
- ✅ `blog-check`: **228/228** — 152 integrity (frontmatter, featured image on disk, **no
  WP/staging/apiv2 hosts** in any post body) + 76 live parity (scraped `<title>` & description ≈ the
  live WordPress page, all 38 posts).
- ✅ Sitemap: **74 URLs** (home + 7 static + 22 products + 5 locations + blog index + 38 posts).
- ✅ Build + `tsc --noEmit` clean; **80 routes prerendered static**.

### Preview-only (cannot be verified locally — need the gates below)
- ⛔ Lighthouse on a **real edge CDN** (local slow-4G can't confirm the LCP < 2.5s target).
- ⛔ Form E2E against a **staging apiv2**.
- ⛔ www/apex + http→https canonicalization (Vercel Domains layer, not in the build).

---

## 1. Go / No-Go gates (run on a Vercel preview)

Ship only when **all three** are green (no `WP_ORIGIN_HOST` needed — the blog is in-app):

| # | Gate | How | Pass criteria |
|---|------|-----|---------------|
| G1 | **Redirects + crawl parity** | `redirect-check`/`seo-check`/`blog-check` against the preview + a full-site crawl (Screaming Frog) preview-vs-prod | Scripts GREEN; every old URL (incl. all `/blog/<slug>/`) resolves or 301/308s **exactly once**; **zero unexpected 404s** |
| G2 | **Lighthouse on the preview** | Lighthouse mobile against the `*.vercel.app` URL | CWV ≥ the repo baselines; confirm **LCP < 2.5s** on the real edge CDN |
| G3 | **Form E2E** | Submit each of the 6 forms against **staging** apiv2 (§4) | Upstream payload shape unchanged; success → `/thank-you`/toast/brochure |

Supporting: validate a sample of Product / LocalBusiness / FAQ / **BlogPosting** / Breadcrumb /
Organization / WebSite JSON-LD in **Google Rich Results Test** (`seo-check … --dump` writes the
blocks to `/tmp`); visual-diff key templates (home, a product, a location, **a blog post**, contact)
desktop+mobile vs prod.

---

## 2. Blog migration — what to confirm (replaces the old WP-origin gate)

The blog moved in-app, so the checks are content fidelity, not WP plumbing:

```bash
node scripts/blog-check.mjs                 # 38/38 posts: integrity + live parity (title/description)
# Spot-check a few posts visually on the preview; confirm:
#   - canonical = https://www.saburiply.com/blog/<slug>  (slash-LESS; the aged /…/ 308-strips to it)
#   - the featured image + any in-body images load from /images/blog/** (NOT wp-content / wigtest.site)
#   - BlogPosting + BreadcrumbList JSON-LD present (Rich Results Test → 0 errors)
```

**Known content gap (flagged, pre-existing):** `top-25-upcoming-housing-projects-in-kolkata-you-shouldnt-be-ignoring`
referenced 25 in-body images on an **unreachable staging host** (`saburiblog.wigtest.site`) — they
are broken on the live WordPress page too, so they were dropped (text preserved). Re-upload those
project images to the prod media library and add them to the post if desired.

---

## 3. G3 — form E2E (against staging apiv2)

6 allow-listed endpoints proxy same-origin via `app/api/forms/[endpoint]/route.ts` (Node runtime,
forwards the raw body, returns upstream status+body verbatim):
`contact-us`, `quote`, `enquiry`, `become-partner`, `save-data` → web API; `subscribers` → admin API.

```bash
# Point the proxy at staging (Vercel env on the preview):
API_BASE_URL=https://<staging-apiv2>/api/web/v1
API_ADMIN_BASE_URL=https://<staging-apiv2>/api/admin
# (Both default to production apiv2 if unset — use staging for the E2E.)
```

Submit each form (contact page, quote modal, enquiry modal, become-partner, footer
dealership/architect/designer dialogs, footer subscribe). Assert the body shape is unchanged and
success routes to `/thank-you` / toast / brochure. Verify the Footer sitemap UI still renders (it
fetches `/sitemap.xml`, now served by `app/sitemap.ts`).

---

## 4. Pre-cutover dependencies (provision BEFORE promoting to production)

1. **Admin subdomain.** Provision **`admin.saburiply.com`** (the out-of-scope admin SPA) and add it
   to the **apiv2 CORS allow-list**. The `/saburi-panel-admin/*` → `admin.saburiply.com` 301s depend
   on it.
2. **Vercel env vars** (Production + Preview):
   - `API_BASE_URL`, `API_ADMIN_BASE_URL` — optional; default to production apiv2. Set to staging for
     G3, set explicitly for production if the apiv2 base ever moves.
   - ~~`WP_ORIGIN_HOST`~~ — **no longer used** (blog is in-app). Remove it if it was ever set.
3. **Vercel Domains.** Add `saburiply.com` + `www.saburiply.com`, set **www as primary** (issues the
   apex→www permanent redirect; replaces nginx `server_name` 301). http→https is automatic.
4. **Keep WordPress reachable** through cutover as a transitional safety net — do **not** decommission
   it until §7.

---

## 5. Cutover (single DNS switch)

1. Run **§0 harness + §1 gates G1–G3** against the preview until all green.
2. Confirm §4 pre-cutover dependencies are provisioned.
3. **Promote** the verified preview deployment to **Production** in Vercel.
4. **DNS:** point `www.saburiply.com` (+ apex) at Vercel per Vercel's domain instructions. Lower TTL
   beforehand for a fast rollback window.
5. **Immediately re-run against the live domain:**
   ```bash
   node scripts/redirect-check.mjs https://www.saburiply.com
   node scripts/seo-check.mjs      https://www.saburiply.com
   # + spot-check several /blog/<slug> (200, slash-less canonical, local images, BlogPosting JSON-LD)
   #   and the aged /blog/<slug>/ (→ 308 → /blog/<slug>).

   # A2 — AI-bot edge access: confirm Vercel isn't 403/401-ing AI crawlers on the custom domain.
   # (Verified GREEN on the *.vercel.app dummy 2026-06-22 — GPTBot/ClaudeBot/Perplexity/OAI-SearchBot
   #  all got 200 + full content; this just re-confirms the same on www.)
   for ua in GPTBot ClaudeBot PerplexityBot OAI-SearchBot Googlebot; do
     curl -s -o /dev/null -w "$ua %{http_code}\n" -A "$ua/1.0 (+bot)" \
       https://www.saburiply.com/products/marine-plywood-india
   done   # want: all 200 (NOT 403/401). If any is blocked → Vercel → Settings → Firewall: stop
          # challenging that UA. (No Cloudflare in front, so that's the only edge to check.)
   ```
6. **Search Console:** submit `https://www.saburiply.com/sitemap.xml` (now includes the blog);
   monitor Coverage, the redirect report, and CWV. Watch the 38 `/blog/<slug>/` → `/blog/<slug>`
   moves settle.

---

## 6. Rollback (instant)

| Symptom | Action |
|---|---|
| Anything broadly wrong post-cutover | **Vercel → Instant Rollback** to the prior deployment, and/or revert DNS to the old origin (low TTL makes this fast). |
| Blog issue (post renders wrong / missing) | The blog is in-app, so it rolls back **with the deployment** (Vercel Instant Rollback). Transitional option while WP is still up (pre-§7): re-route `/blog/*` to WordPress at the nginx edge. |
| A single redirect missing/wrong | Re-add the rule in `next.config.mjs` → redeploy (no DNS change). |
| Form payload contract breaks | Temporarily point the client back at `apiv2` directly (or fix the proxy) → redeploy. |

Code-level rollback is a plain `git revert` + redeploy — the build is deterministic SSG. The scraped
blog content + optimized images are committed, so the blog is reproducible from the repo.

---

## 7. WordPress decommission (POST-cutover, after the in-app blog is confirmed live)

Only after Search Console shows the `/blog/<slug>/` → `/blog/<slug>` moves processed and no blog
regressions:
1. Remove the nginx `/blog/*` (+ `/blogs/`) → WordPress routing.
2. Archive/back up the WordPress install + DB, then take it offline.
3. Re-run `node scripts/blog-check.mjs --no-live` (integrity is independent of WP) and confirm the
   live site's `/blog` is fully served by Vercel.
4. To re-scrape in the future (before decommission), `node scripts/scrape-blog.mjs` regenerates
   `content/blog/*.mdx` + images from the live WP post-sitemap.

---

## 8. Reference — what this build canonicalizes

- **Host:** www-only, https-only (Vercel Domains). **Trailing slash:** ALL app routes slash-less,
  incl. `/blog` — `middleware.ts` 308-strips (`skipTrailingSlashRedirect:true`).
- **Redirects:** all explicit `redirects()` emit **301** (byte-matching the historical 301s);
  trailing-slash strips are **308** via middleware (permanent, equity-passing). Full inventory:
  `NEXTJS_MIGRATION_PLAN.md` §5 / `next.config.mjs`.
- **Sitemap/robots:** generated (`app/sitemap.ts`, 74 URLs incl. blog; `app/robots.ts`, single
  `/sitemap.xml`). Static `public/sitemap.xml`/`robots.txt` deleted.
- **Known cosmetic note:** the home sitemap entry is `…/` while its canonical/og use the bare origin
  `https://www.saburiply.com` — identical root URL per RFC 3986; no action required.
