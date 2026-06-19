import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { productSlugs } from "@/data/products";
import { locationSlugs } from "@/data/locations";

/**
 * Generated sitemap (§6) — single source of truth from the data modules. Replaces the static
 * public/sitemap.xml (deleted, since it would shadow this route). 35 in-app URLs:
 * home + 7 indexable static pages + 22 products + 5 locations.
 *
 * Deliberately DROPPED vs the old file: the ~35 /blog/<slug>/ URLs (WordPress owns its own
 * sitemap) and the stale /best-plywood-bangalore (now a 301 → /plywood-dealers-bangalore).
 * /thank-you is excluded (noindex).
 */
export const dynamic = "force-static";

const STATIC_PATHS = [
  "/about",
  "/about/accreditation",
  "/about/national-presence",
  "/about/environment-stewardship",
  "/about/privacy-policy",
  "/gallery",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1.0, "daily"),
    ...STATIC_PATHS.map((p) => entry(p, 0.7, "monthly")),
    ...productSlugs.map((s) => entry(`/products/${s}`, 0.8, "weekly")),
    ...locationSlugs.map((s) => entry(`/${s}`, 0.8, "weekly")),
  ];
}
