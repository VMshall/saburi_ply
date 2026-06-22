/**
 * Next.js configuration — Saburi Ply migration (Phase 1)
 * Source of truth: NEXTJS_MIGRATION_PLAN.md
 *
 * - redirects(): full legacy 301 map — in-app <Navigate> (App.jsx) + nginx .php/slug
 *   (root `saburiply.com`). §5. All emit statusCode 301 to byte-match the historical
 *   301s for crawlers/SEO tools (Next's `permanent:true` would emit 308).
 * - NO rewrites(): the blog is now in-app (P8 — WordPress retired); /blog and /blog/<slug>
 *   are SSG App Router routes, not a passthrough.
 * - skipTrailingSlashRedirect: Next's automatic slash redirect stays DISABLED; middleware.ts
 *   owns the slash policy for ALL app routes (now including /blog — its matcher no longer
 *   excludes it), strip-redirecting any trailing slash to the canonical slash-less form. The
 *   aged /blog/<slug>/ URLs thus 308 → /blog/<slug> (§0.1 loop risk is gone with WP).
 *
 * NOTE: ESLint adoption (eslint-config-next) is a later tooling step; ESLint is ignored during
 * builds for now so type/build gating stays clean.
 */

// 22 product flat-slug → /products/<slug> (identity slug). App.jsx:151-172
const PRODUCT_SLUGS = [
  "saburi-perennial",
  "saburi-club-h-plus",
  "saburi-titanium-plus",
  "fire-retardant-india",
  "marine-plywood-india",
  "saburi-perennial-blockboard",
  "saburi-fr-blockboard",
  "block-board-india",
  "saburi-gold-blockboard",
  "flush-door-india",
  "saburi-flushdoor-scout",
  "flexi-plywood-india",
  "saburi-scout-plywood",
  "shuttering-plywood-india",
  "saburi-modwud-pre-lam",
  "saburi-modwud-plain",
  "saburi-smart-panel-pvc-board",
  "saburi-smart-panel-wpc-board",
  "saburi-smart-wpc-door-frame",
  "saburi-hydramax-board",
  "saburi-neowud",
  "saburi-lam",
];

// nginx .php / legacy-slug → new URL (NON-identity). saburiply.com:58-124
const PHP_REDIRECTS = [
  ["/marine-plywood-india.php", "/products/marine-plywood-india"],
  ["/block-board-india.php", "/products/block-board-india"],
  ["/flush-door-india.php", "/products/flush-door-india"],
  ["/flexi-plywood-india.php", "/products/flexi-plywood-india"],
  ["/shuttering-plywood-india.php", "/products/shuttering-plywood-india"],
  ["/fire-retardant-india.php", "/products/fire-retardant-india"],
  ["/saburi-board.php", "/products/saburi-gold-blockboard"],
  ["/saburi-perennial.php", "/products/saburi-perennial"],
  ["/saburi-club.php", "/products/saburi-club-h-plus"],
  // §0.2: nginx target is the PLURAL /products/saburi-smart-wpc-door-frames — a current
  // prod bug (no such page). Redirect to the real SINGULAR product route.
  ["/saburi-door-frame.php", "/products/saburi-smart-wpc-door-frame"],
  ["/saburi-h-plus.php", "/products/saburi-club-h-plus"],
  ["/saburi-scout-plywood.php", "/products/saburi-scout-plywood"],
  ["/modwud-particle-board.php", "/products/saburi-modwud-plain"],
  ["/brw_plywood.php", "/products/marine-plywood-india"],
  ["/block_board_gurjan.php", "/products/block-board-india"],
  ["/block-board.php", "/products/block-board-india"],
  ["/saburi-board", "/products/saburi-gold-blockboard"],
];

// /blog/N → post slug. Slash-LESS targets: the blog is now an in-app SSG route (P8 — WordPress
// retired), and all app routes are slash-less, so this points straight at the canonical in-app URL
// (no 301→308 double-hop through the slash-strip). App.jsx:175-179
const BLOG_NUM_REDIRECTS = [
  ["/blog/1", "/blog/top-7-stylish-panel-door-for-your-home-interiors"],
  ["/blog/2", "/blog/top-5-isi-certified-termite-proof-plywood-brands-in-india"],
  ["/blog/3", "/blog/advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india"],
  ["/blog/4", "/blog/top-7-trends-of-plywood-brand-in-india"],
  ["/blog/5", "/blog/top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation"],
];

// Legacy top-level PHP pages from the old PHP site (audit gap). On the old site these now soft-404
// (SPA fallback serves the homepage); on Vercel they 403 (.php is forbidden at the edge). 301 the
// ones with a real equivalent so any inbound link equity transfers at cutover. Long-tail .php with
// NO equivalent (e.g. career.php, sitemap.php) are deliberately left to 404/403 — redirecting them
// to "/" would itself be a soft-404 pattern. Scope the complete equity-bearing set from GSC
// Pages + Links before cutover; this is the high-confidence + sensible-intent subset.
const LEGACY_PAGE_REDIRECTS = [
  ["/index.php", "/"],
  ["/home.php", "/"],
  ["/about.php", "/about"],
  ["/about-us.php", "/about"],
  ["/contact.php", "/contact"],
  ["/contact-us.php", "/contact"],
  ["/gallery.php", "/gallery"],
  // Dealer / partner intent → contact page (hosts the become-a-dealer form).
  ["/dealership.php", "/contact"],
  ["/dealer.php", "/contact"],
  ["/become-dealer.php", "/contact"],
  // No /products hub yet (future §3.3) → flagship product for now; re-point to /products when it ships.
  ["/products.php", "/products/saburi-perennial"],
  ["/product.php", "/products/saburi-perennial"],
];

const r301 = (source, destination) => ({ source, destination, statusCode: 301 });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // §0.1 — own the slash policy in middleware.ts; never let Next strip the blog slash.
  skipTrailingSlashRedirect: true,

  // ESLint adoption (eslint-config-next) is a later tooling step; don't gate builds on it.
  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      // A. In-app <Navigate> — 22 product flat-slugs (identity → /products/<slug>)
      ...PRODUCT_SLUGS.map((s) => r301(`/${s}`, `/products/${s}`)),
      // A. In-app <Navigate> — location typo fix + legacy city slug
      r301("/best-plywood-kerela", "/best-plywood-kerala"),
      r301("/best-plywood-bangalore", "/plywood-dealers-bangalore"),
      // A. In-app <Navigate> — /blog/N → WP slug (trailing slash, §0.2)
      ...BLOG_NUM_REDIRECTS.map(([s, d]) => r301(s, d)),

      // B. nginx .php / legacy slug → new URL
      ...PHP_REDIRECTS.map(([s, d]) => r301(s, d)),
      // B. legacy top-level PHP pages (audit gap — were 403'ing at cutover)
      ...LEGACY_PAGE_REDIRECTS.map(([s, d]) => r301(s, d)),
      // B. location .php — SPECIFIC rule BEFORE the wildcard (first match wins): the crude
      //    wildcard sent bangalore to /products/marine; send it to its real city page instead.
      r301("/best-plywood-bangalore.php", "/plywood-dealers-bangalore"),
      // B. nginx wildcard — any OTHER /best-plywood-*.php → marine (catch-all)
      r301("/:slug(best-plywood-.*\\.php)", "/products/marine-plywood-india"),

      // C. Legacy /blogs alias → singular /blog (folds into the WP path)
      r301("/blogs", "/blog"),
      r301("/blogs/:path*", "/blog/:path*"),

      // C. Admin SPA → subdomain (prompt Q3). OPS DEPENDENCY (§13): admin.saburiply.com
      // must be provisioned + added to the apiv2 CORS allowlist before DNS cutover.
      r301("/saburi-panel-admin", "https://admin.saburiply.com"),
      r301("/saburi-panel-admin/:path*", "https://admin.saburiply.com/:path*"),
    ];
  },

  // No rewrites(): /blog and /blog/* are now in-app SSG routes (P8 — WordPress retired). The former
  // WP passthrough (and WP_ORIGIN_HOST) is gone.
};

export default nextConfig;
