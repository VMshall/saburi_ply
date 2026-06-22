import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { productSlugs } from "@/data/products";
import { locationSlugs } from "@/data/locations";
import { getAllPosts } from "@/lib/blog";

/**
 * Generated sitemap (§6) — single source of truth from the data modules + blog content. Replaces
 * the static public/sitemap.xml (deleted, since it would shadow this route). 71 in-app URLs:
 * home + the /plywood category hub + 7 static pages + 22 products + 6 locations + the blog
 * index + 33 posts.
 *
 * P8: the blog is now in-app (WordPress retired), so WE own the slash-less /blog/<slug> URLs —
 * they were dropped in P5 when WP owned them. Still excluded: the stale /best-plywood-bangalore
 * (301 → /plywood-dealers-bangalore) and /thank-you (noindex).
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
    entry("/plywood", 0.9, "weekly"),
    ...STATIC_PATHS.map((p) => entry(p, 0.7, "monthly")),
    ...productSlugs.map((s) => entry(`/products/${s}`, 0.8, "weekly")),
    ...locationSlugs.map((s) => entry(`/${s}`, 0.8, "weekly")),
    entry("/blog", 0.7, "weekly"),
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.modified || post.date || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
