import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/**
 * Generated robots (§6) — replaces the static public/robots.txt (deleted). Mirrors the legacy
 * allow-all + admin/system disallows, with absolute www host + sitemap.
 *
 * OPS FOLLOW-UP: the WordPress blog has its own sitemap served under /blog (e.g.
 * https://www.saburiply.com/blog/wp-sitemap.xml for WP core, or /blog/sitemap_index.xml for
 * Yoast). Add the confirmed URL to the `sitemap` array below so crawlers discover the blog
 * URLs too — left out here to avoid advertising an unverified path.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/dashboard/",
        "/login",
        "/private/",
        "/temp/",
        "/tmp/",
        "/.git/",
        "/node_modules/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
