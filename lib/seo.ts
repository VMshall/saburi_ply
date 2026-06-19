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
const DEFAULT_OG_IMAGE = "/images/saburi.jpg";
const OG_IMAGE_ALT = "Saburi Ply - Leading Plywood Manufacturer";

function buildMetadata(seo: Seo): Metadata {
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
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
  return buildMetadata(product.seo);
}

export function buildLocationMetadata(location: Location): Metadata {
  return buildMetadata(location.seo);
}
