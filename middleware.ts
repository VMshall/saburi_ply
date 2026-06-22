import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * App-route trailing-slash policy — NEXTJS_MIGRATION_PLAN.md §0.1.
 *
 * `skipTrailingSlashRedirect: true` (next.config.mjs) turns OFF Next's automatic slash redirect;
 * this middleware owns the policy for ALL app routes (slash-less: /about, /products/x, /blog,
 * /blog/<slug> — matching the sitemap). P8 update: the blog is now in-app, so the matcher no
 * longer excludes /blog — the aged /blog/<slug>/ URLs now 308 → /blog/<slug> (single hop) like
 * every other route. (The §0.1 WordPress redirect-loop risk is moot now that WP is retired.)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname !== "/" && pathname.endsWith("/")) {
    // Build the destination from req.url with a standard URL. (Mutating a cloned
    // NextURL's pathname does not reliably re-serialize into the Location header in
    // Next 14.2 — it emits the original slash-ful path and self-loops.)
    const url = new URL(req.url);
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Excludes /api, /_next, and any file with an extension. (/blog is no longer excluded — P8.)
  matcher: ["/((?!api|_next/|.*\\..*).*)"],
};
