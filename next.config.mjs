/**
 * Next.js configuration — Saburi Ply migration (Phase 1)
 * Source of truth: NEXTJS_MIGRATION_PLAN.md
 *
 * - redirects(): full legacy 301 map — in-app <Navigate> (App.jsx) + nginx .php/slug
 *   (root `saburiply.com`). §5. All emit statusCode 301 to byte-match the historical
 *   301s for crawlers/SEO tools (Next's `permanent:true` would emit 308).
 * - rewrites(): /blog and /blog/* are an external WordPress passthrough — NOT a Next
 *   route. §7. Requires WP_ORIGIN_HOST (server-only env); guarded so local/Phase-1
 *   builds without it still succeed.
 * - skipTrailingSlashRedirect: Next's automatic slash redirect is DISABLED so it can
 *   never strip the WP blog's canonical trailing slash. App-route slash policy is owned
 *   by middleware.ts (strips slashes, excludes /blog). §0.1 — prevents the blog redirect
 *   loop on ~35 ranking URLs.
 *
 * NOTE (later phases): next/image config → P6; ESLint adoption (eslint-config-next) →
 * tooling. ESLint is ignored during builds for now so Phase-1 type/build gating is clean.
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

// /blog/N → WP slug, WITH trailing slash to match WP's canonical (avoids a 301→301
// double-hop). §0.2. App.jsx:175-179
const BLOG_NUM_REDIRECTS = [
  ["/blog/1", "/blog/top-7-stylish-panel-door-for-your-home-interiors/"],
  ["/blog/2", "/blog/top-5-isi-certified-termite-proof-plywood-brands-in-india/"],
  ["/blog/3", "/blog/advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india/"],
  ["/blog/4", "/blog/top-7-trends-of-plywood-brand-in-india/"],
  [
    "/blog/5",
    "/blog/top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation/",
  ],
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
      // B. nginx wildcard — any /best-plywood-*.php → marine
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

  async rewrites() {
    // §7 — /blog/* is external WordPress. WP_ORIGIN_HOST is server-only (e.g.
    // https://wp.saburiply.com). Guarded: without it (local / Phase 1) the build still
    // succeeds and /blog* simply isn't served here. The §0.1 validation gate runs on a
    // Vercel preview WITH WP_ORIGIN_HOST set.
    const WP = process.env.WP_ORIGIN_HOST;
    if (!WP) return [];
    return [
      { source: "/blog", destination: `${WP}/blog` },
      { source: "/blog/:path*", destination: `${WP}/blog/:path*` },
    ];
  },
};

export default nextConfig;
