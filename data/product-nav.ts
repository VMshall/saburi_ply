import { products } from "./products";

/**
 * Information architecture for the Products navigation panel (the click-to-open category panel that
 * replaced the hover mega-menu).
 *
 * Why this is an explicit curated list rather than a `products.filter(p => p.category === …)` derive:
 * the menu's labels, ordering and membership are all deliberately DIFFERENT from the catalogue data.
 *   - Labels are shortened for the nav ("Saburi Gold", not "Saburi Gold (IS: 710)"; "Saburi Smart
 *     Panel WPC Board", not "Saburi Smart Panels – WPC Boards (Endura Ace / Club / Pro)").
 *   - "Liner" and "New Launch" are presentation groupings, not `ProductCategory` values — Neowud is
 *     data-category `plywood` and Hydramax is `chipboard`, but both belong under New Launch here.
 *   - Ordering is merchandising order, not data order.
 * Deriving from `category` would silently rewrite all three. The dev-only drift check at the bottom
 * of this file gives us the protection a derive would have provided, without the loss of curation.
 */

export interface ProductNavItem {
  /** Short nav label — intentionally not `Product.name`. */
  label: string;
  href: string;
  /** Derived from the catalogue — never hand-written. See `resolve()` below. */
  image?: string;
  certification?: string;
}

export interface ProductNavCategory {
  id: string;
  label: string;
  /** Category hub page. Only Plywood has one today; the rest drill down in-panel only. */
  href?: string;
  blurb: string;
  /** Renders as the full-width feature tile on the last grid row instead of a 1-col tile. */
  featured?: boolean;
  items: ProductNavItem[];
}

/**
 * Hand-authored IA: labels, ordering and membership only. Presentation data that already lives in
 * the catalogue (image, IS code) is attached by `resolve()` below rather than duplicated here, so
 * the panel's preview image and spec chip can never disagree with the product page.
 */
const NAV_SOURCE: ProductNavCategory[] = [
  {
    id: "plywood",
    label: "Plywood",
    href: "/plywood",
    blurb: "Marine, structural, fire-retardant and shuttering grades.",
    items: [
      { label: "Saburi Titanium Plus", href: "/products/saburi-titanium-plus" },
      { label: "Saburi Perennial", href: "/products/saburi-perennial" },
      { label: "Saburi Club H+", href: "/products/saburi-club-h-plus" },
      { label: "Saburi Gold", href: "/products/marine-plywood-india" },
      { label: "Saburi FR", href: "/products/fire-retardant-india" },
      { label: "Saburi Scout", href: "/products/saburi-scout-plywood" },
      { label: "Saburi Gold Flexi", href: "/products/flexi-plywood-india" },
      { label: "Saburi Shine Platinum", href: "/products/shuttering-plywood-india" },
    ],
  },
  {
    id: "block-board",
    label: "Block Board",
    blurb: "Softwood-core boards for wardrobes, shutters and long spans.",
    items: [
      { label: "Saburi Perennial Block Board", href: "/products/saburi-perennial-blockboard" },
      { label: "Saburi FR Block Board", href: "/products/saburi-fr-blockboard" },
      { label: "Saburi Club H+ Block Board", href: "/products/block-board-india" },
      { label: "Saburi Gold Block Board", href: "/products/saburi-gold-blockboard" },
    ],
  },
  {
    id: "flush-door",
    label: "Flush Door",
    blurb: "IS 2202 solid-core doors built to stay flat.",
    items: [{ label: "Saburi Flush Door Gold", href: "/products/flush-door-india" }],
  },
  {
    id: "wpc",
    label: "WPC",
    blurb: "Waterproof, termite-proof wood-polymer panels and frames.",
    items: [
      { label: "Saburi Smart Panel WPC Board", href: "/products/saburi-smart-panel-wpc-board" },
      { label: "Saburi Smart WPC Door Frame", href: "/products/saburi-smart-wpc-door-frame" },
    ],
  },
  {
    id: "chipboard",
    label: "Chipboard",
    blurb: "Modwud particle boards, plain and pre-laminated.",
    items: [
      { label: "Saburi Modwud Pre-Lam", href: "/products/saburi-modwud-pre-lam" },
      { label: "Saburi Modwud Plain", href: "/products/saburi-modwud-plain" },
    ],
  },
  {
    id: "liner",
    label: "Liner",
    blurb: "Designer laminate surfaces for every finish.",
    items: [{ label: "Saburi Lam", href: "/products/saburi-lam" }],
  },
  {
    id: "new-launch",
    label: "New Launch",
    blurb: "The newest additions to the Saburi range.",
    featured: true,
    items: [
      { label: "Saburi Modwud Hydramax", href: "/products/saburi-hydramax-board" },
      { label: "Saburi Neowud", href: "/products/saburi-neowud" },
    ],
  },
];

const productBySlug = new Map(products.map((p) => [p.slug, p]));

/**
 * Attaches catalogue-derived presentation data to each nav item. `certification` is genuinely absent
 * for some products (WPC, Liner, the new launches) — the chip is simply omitted there rather than
 * faked. Every product has an image, so the preview never falls back to a placeholder.
 */
export const PRODUCT_NAV: ProductNavCategory[] = NAV_SOURCE.map((cat) => ({
  ...cat,
  items: cat.items.map((item) => {
    const product = productBySlug.get(item.href.replace("/products/", ""));
    return {
      ...item,
      image: product?.images?.[0]?.src,
      certification: product?.certification,
    };
  }),
}));

/** Every product link in the panel, in panel order. Used for flat renderings and link audits. */
export const PRODUCT_NAV_ITEMS: ProductNavItem[] = PRODUCT_NAV.flatMap((c) => c.items);

/**
 * Drift guard: fails loudly in dev if a nav href points at a slug that no longer exists in
 * `data/products.ts` (i.e. a product was renamed or removed without updating the menu).
 * No-ops in production so a data typo can never take the site down.
 */
if (process.env.NODE_ENV !== "production") {
  const slugs = new Set(products.map((p) => p.slug));
  const missing = PRODUCT_NAV_ITEMS.filter((i) => !slugs.has(i.href.replace("/products/", "")));
  if (missing.length) {
    console.error(
      `[product-nav] ${missing.length} nav link(s) point at unknown product slugs: ` +
        missing.map((i) => i.href).join(", ")
    );
  }
}
