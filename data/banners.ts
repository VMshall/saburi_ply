import type { ResponsiveImage } from "./types";

/**
 * PageHeader banner backgrounds per slug (§3 — P4 backfill). Reconstructed from the legacy
 * client/components/PageHeader.jsx `defaultImageMap`, which was keyed by the page's PageHeader
 * `title` prop (NOT always the H1 — e.g. saburi-hydramax-board's banner key was "Marine Plywood
 * Manufacturer in India", saburi-titanium-plus's was "Saburi Titanium"). Centralised here and
 * merged in via getProduct/getLocation so the 27 product/location entries stay banner-free.
 */
const ply = (n: number): ResponsiveImage => ({
  desktop: `/images/plywood-breadcrumb/desk-ply-bread${n}.webp`,
  tablet: `/images/plywood-breadcrumb/tab-ply-bread${n}.webp`,
  mobile: `/images/plywood-breadcrumb/mob-ply-bread${n}.webp`,
});
const bb = (n: number): ResponsiveImage => ({
  desktop: `/images/blockboard-breadcrumb/deskt-bread${n}.webp`,
  tablet: `/images/blockboard-breadcrumb/tab-bread${n}.webp`,
  mobile: `/images/blockboard-breadcrumb/mobile-bread${n}.webp`,
});
const flush = (n: number): ResponsiveImage => ({
  desktop: `/images/flushdoor-breadcrumb/desk-flush-bread${n}.webp`,
  tablet: `/images/flushdoor-breadcrumb/tab-flush-bread${n}.webp`,
  mobile: `/images/flushdoor-breadcrumb/mob-flush-bread${n}.webp`,
});
const wpc = (x: string): ResponsiveImage => ({
  desktop: `/images/wpcpvc-breadcrumb/desk-${x}.webp`,
  tablet: `/images/wpcpvc-breadcrumb/tab-${x}.webp`,
  mobile: `/images/wpcpvc-breadcrumb/mob-${x}.webp`,
});
/** Same image for all breakpoints (the legacy map used one source for these). */
const one = (path: string): ResponsiveImage => ({ desktop: path, tablet: path, mobile: path });

const chipboard: ResponsiveImage = {
  desktop: "/images/chipboard-breadcrumb/desk-chipboard.webp",
  tablet: "/images/chipboard-breadcrumb/tab-chipboard.webp",
  mobile: "/images/chipboard-breadcrumb/mob-chipboard.webp",
};
const kerela: ResponsiveImage = {
  desktop: "/images/kerela-product-breadcrumb/desk-kerela-bread.webp",
  tablet: "/images/kerela-product-breadcrumb/tab-kerela-bread.webp",
  mobile: "/images/kerela-product-breadcrumb/mob-kerela-bread.webp",
};

export const PRODUCT_BANNERS: Record<string, ResponsiveImage> = {
  "saburi-perennial": ply(1),
  "fire-retardant-india": ply(1),
  "saburi-titanium-plus": ply(2),
  "saburi-scout-plywood": ply(2),
  "saburi-club-h-plus": ply(3),
  "marine-plywood-india": ply(4),
  "saburi-perennial-blockboard": bb(1),
  "saburi-gold-blockboard": bb(2),
  "saburi-fr-blockboard": bb(3),
  "block-board-india": bb(4),
  "flush-door-india": flush(1),
  "saburi-flushdoor-scout": flush(2),
  "saburi-smart-panel-pvc-board": wpc("pvc"),
  "saburi-smart-panel-wpc-board": wpc("wpc"),
  "saburi-smart-wpc-door-frame": wpc("door"),
  "saburi-lam": {
    desktop: "/images/lamination-breadcrumb/desk-lam.webp",
    tablet: "/images/lamination-breadcrumb/tab-lam.webp",
    mobile: "/images/lamination-breadcrumb/mob-lam.webp",
  },
  "flexi-plywood-india": one("/images/flexiblePly-breadcrumb/desk-flexi-Plywood.webp"),
  "shuttering-plywood-india": one("/images/shuttering-breadcrumb/desk-shuttering-Ply.webp"),
  "saburi-modwud-pre-lam": chipboard,
  "saburi-modwud-plain": chipboard,
  "saburi-hydramax-board": one("/images/new-launch-breadcrumb/breadcrumb-hdyramax.webp"),
  "saburi-neowud": one("/images/new-launch-breadcrumb/Saburi Neowud Breadcrump 2.webp"),
};

/** All 5 location pages used the same kerela-product-breadcrumb banner in the legacy map. */
export const LOCATION_BANNERS: Record<string, ResponsiveImage> = {
  "best-plywood-kolkata": kerela,
  "best-plywood-andhra-pradesh": kerela,
  "best-plywood-kerala": kerela,
  "best-plywood-tamilnadu": kerela,
  "best-plywood-telangana": kerela,
  "plywood-dealers-bangalore": kerela,
};

/** Static content-page banners (keyed by route), from the legacy PageHeader defaultImageMap. */
export const STATIC_BANNERS: Record<string, ResponsiveImage> = {
  "/about": one("/images/breadcrumbs/Products.webp"),
  "/about/accreditation": one("/images/breadcrumbs/Accreditation.webp"),
  "/about/national-presence": {
    desktop: "/images/breadcrumbs/desk-national-presence.webp",
    tablet: "/images/breadcrumbs/tab-national-presence.webp",
    mobile: "/images/breadcrumbs/mob-national-presence.webp",
  },
  "/about/environment-stewardship": one("/images/breadcrumbs/Environmental-Stewardship-.webp"),
  "/about/privacy-policy": one("/images/breadcrumbs/Privacy.webp"),
  "/gallery": {
    desktop: "/images/gallery/breadcrumb/desk-breadcrumb.webp",
    tablet: "/images/gallery/breadcrumb/tab-breadcrumb.webp",
    mobile: "/images/gallery/breadcrumb/mob-breadcrumb.webp",
  },
  "/contact": one("/images/breadcrumbs/Contact.webp"),
  // No "/blog" entry — the blog index is deliberately banner-free (see app/blog/page.tsx).
};
