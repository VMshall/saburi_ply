import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/**
 * Generated robots (§6) — replaces the static public/robots.txt (deleted). Mirrors the legacy
 * allow-all + admin/system disallows, with absolute www host + sitemap.
 *
 * P8: the blog is now in-app and its URLs are in app/sitemap.ts, so the single /sitemap.xml below
 * covers everything. (The former external-WordPress-sitemap follow-up is gone — WP is retired.)
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
