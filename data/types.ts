/**
 * Typed content model for the SSG product + location pages (§3, §8).
 * Content lives here (out of JSX) so pages become thin, data-driven templates and a CMS
 * could slot in later behind the getProduct/getLocation accessors with no template change.
 *
 * Canonical source shapes: client/pages/SaburiGold.jsx (product),
 * client/pages/SaburiBestPlywoodAP.jsx (location).
 */

export type ProductCategory =
  | "plywood"
  | "blockboard"
  | "flushdoor"
  | "wpc-pvc"
  | "chipboard"
  | "laminate";

/**
 * Serializable icon identifier (kebab-case). Resolved to a real icon component in a client
 * island (P3) via a Record<IconKey, IconComponent> map, so server data stays serializable.
 * Known keys are collected from the source pages; see KNOWN_ICON_KEYS. Kept as a widened
 * string so a new badge icon never breaks the typed data — the P3 map falls back gracefully.
 */
export type IconKey = string;

/** Per-page SEO. `canonical`/`ogImage` are relative; metadataBase makes them absolute www. */
export interface Seo {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

/** A Q&A entry. `answerHtml` may contain inline HTML (e.g. <strong>) — render with care. */
export interface Faq {
  question: string;
  answerHtml: string;
}

/** A feature badge in the product rail (icon + title + sub-label). */
export interface FeatureBadge {
  id: string;
  iconKey: IconKey;
  title: string;
  sub: string;
}

/** A grade/standard pill shown under the product H1 (e.g. "IS: 710", "Marine GRADE"). */
export interface GradePill {
  label: string;
  iconKey?: IconKey;
}

export interface ProductImage {
  src: string;
  alt: string;
}

/** Responsive background image for the PageHeader banner (desktop/tablet/mobile sources). */
export interface ResponsiveImage {
  desktop: string;
  tablet: string;
  mobile: string;
}

export interface Product {
  slug: string;
  /** H2 brand block, e.g. "Saburi Gold (IS: 710)". */
  name: string;
  /** H1 heading, e.g. "Best Marine Plywood Manufacturer and Supplier in India". */
  heading: string;
  category: ProductCategory;
  seo: Seo;
  /** PageHeader banner background (from the legacy title→image map). Optional: P3 populates
   * the demo entries; P4 backfills the rest. Absent → PageHeader falls back to a gradient. */
  bannerImage?: ResponsiveImage;
  /** Grade pills under the H1 (omit/empty when the source page has none). */
  gradePills: GradePill[];
  /** Intro prose (the "ReadMore"/premium block); may contain inline HTML (<strong>). */
  introHtml: string;
  features: string[];
  applications: string[];
  thicknesses: string[];
  sizes: string[];
  featureBadges: FeatureBadge[];
  faqs: Faq[];
  images: ProductImage[];
  brochureUrl?: string;
  certification?: string;
  warrantyYears?: number;
}

export interface Location {
  slug: string;
  /** H2 brand block, e.g. "Discover the Best Plywood Manufacturer and Supplier in AP". */
  name: string;
  /** H1 heading, e.g. "Plywood Manufacturer & Supplier Andhra Pradesh". */
  heading: string;
  /** PageHeader (breadcrumb-style) title, e.g. "Best Plywood Andhra Pradesh". */
  pageHeaderTitle: string;
  state: string;
  city?: string;
  /** Cities/regions served — drives `areaServed` on the LocalBusiness JSON-LD (§6). */
  areaServed: string[];
  /** PageHeader banner background (P3 populates the demo entry; P4 backfills the rest). */
  bannerImage?: ResponsiveImage;
  seo: Seo;
  /** Rendered intro prose block (HTML: paragraphs, partner heading, bullet list). */
  introHtml: string;
  images: ProductImage[];
}

/**
 * Icon keys referenced by product data, mapped to components in the P3 client island.
 * Add a new key here (and to the P3 map) when a source page introduces a new badge icon.
 */
// Full set actually referenced by data/products.ts (collected during P2 extraction).
// NOTE for P3: a few keys are near-duplicates from different source icon libraries and can
// map to the same component — pine-tree/tree-pine, leaf/leaf-outline. Unmapped keys should
// fall back to a sensible default icon in the island.
export const KNOWN_ICON_KEYS = [
  "armchair",
  "award",
  "bacteria",
  "baseline-density-small",
  "bend",
  "biceps-flexed",
  "bug",
  "chemical-drop",
  "clock-5",
  "club",
  "color-palette-outline",
  "cracked-disc",
  "droplets",
  "dumbbell",
  "duration",
  "flame",
  "gem",
  "gr-multiple",
  "grid-2x2",
  "laser-sparks",
  "leaf",
  "leaf-outline",
  "lifebar",
  "paint-bucket",
  "pi-potted-plant",
  "pine-tree",
  "recycle",
  "rupee",
  "scale",
  "screw",
  "shield",
  "shield-plus",
  "sprout",
  "texture",
  "tree-pine",
  "triple-scratches",
  "unbalanced",
] as const;
