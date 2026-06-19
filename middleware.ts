import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * App-route trailing-slash policy — NEXTJS_MIGRATION_PLAN.md §0.1.
 *
 * `skipTrailingSlashRedirect: true` (next.config.mjs) turns OFF Next's automatic slash
 * redirect so it can never strip the WordPress blog's canonical trailing slash. This
 * middleware re-implements slash-stripping for APP routes only (they are slash-less:
 * /about, /products/x — matching the current sitemap), and the matcher EXCLUDES /blog so
 * blog slashes pass straight through to the §7 rewrite. Net effect: /about/ → 308 → /about
 * (single hop), while /blog/<slug>/ is left untouched → no redirect loop.
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
  // Excludes /blog (WP, keeps its slash), /api, /_next, and any file with an extension.
  matcher: ["/((?!blog|api|_next/|.*\\..*).*)"],
};
