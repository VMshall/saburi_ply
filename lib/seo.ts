import type { Metadata } from "next";
import type { Location, Product, Seo } from "@/data/types";
import { SITE_NAME } from "@/data/site";

/**
 * Per-page Metadata API builders (§6). Reproduce the PageMeta.jsx output for a route:
 * title / description / keywords / canonical / Open Graph / Twitter. Shared sitewide tags
 * (author, publisher, geo/industry `other`, robots, icons, verification, metadataBase) are
 * inherited from app/layout.tsx — Next only overrides the keys a page sets, EXCEPT openGraph
 * and twitter which it replaces wholesale, so those are built in full here.
 *
 * `canonical`/`url` are relative; metadataBase (layout) resolves them to absolute www URLs.
 */
/**
 * Sitewide share card. A real 1200x630 banner — the previous default was a 233x234 logo declared
 * as 1200x630, which is below the ~300x200 floor scrapers need, so WhatsApp and friends fell back
 * to the small square thumbnail layout.
 */
const DEFAULT_OG_IMAGE = "/images/og/saburiply-og.jpg";
const OG_IMAGE_ALT = "Saburi Ply - Leading Plywood Manufacturer";

function buildMetadata(seo: Seo): Metadata {
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;
  // Only declare dimensions for the banner, whose size we actually know. A page-supplied image is
  // some product photo of unknown shape; asserting 1200x630 for it would be a guess, and scrapers
  // that trust the declared size render the result badly. Omitted, they measure it themselves.
  const isDefault = ogImage === DEFAULT_OG_IMAGE;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      images: [
        isDefault
          ? { url: ogImage, width: 1200, height: 630, alt: OG_IMAGE_ALT }
          : { url: ogImage, alt: OG_IMAGE_ALT },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@saburiply",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}

export function buildProductMetadata(product: Product): Metadata {
  // Default OG/Twitter image to the product's own hero image (encoded — asset filenames contain
  // spaces) instead of the generic sitewide logo, for better social/SERP share CTR.
  const hero = product.seo.ogImage ?? product.images[0]?.src;
  return buildMetadata({ ...product.seo, ogImage: hero ? encodeURI(hero) : undefined });
}

export function buildLocationMetadata(location: Location): Metadata {
  const hero = location.seo.ogImage ?? location.images[0]?.src;
  return buildMetadata({ ...location.seo, ogImage: hero ? encodeURI(hero) : undefined });
}

/** For the static content pages (about/gallery/contact/thank-you). `noindex` → robots
 * `noindex, follow` (used by /thank-you). */
export function buildPageMetadata(seo: Seo, opts?: { noindex?: boolean }): Metadata {
  const meta = buildMetadata(seo);
  if (opts?.noindex) {
    meta.robots = { index: false, follow: true };
  }
  return meta;
}
