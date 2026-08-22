"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";
import type { BlogCardPost } from "@/lib/blog";

/**
 * /blog listing (client island). Filtering is the only client-side behaviour — every post is
 * rendered in the default state, so the statically generated HTML still contains all 33 cards and
 * their links for crawlers; the filter merely narrows an already-present list. Posts arrive as
 * BlogCardPost (no article `html`) to keep the RSC payload small.
 *
 * Two layouts: an editorial one (featured hero → two-up → grid) when nothing is filtered, and a
 * uniform grid once a category or query is active — a "featured" post inside a filtered result set
 * reads as an accident rather than an edit.
 */
type Category = { slug: string; label: string; count: number };

const ALL = "all";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// The focus ring lives on the <article>, not the inner link: CARD_BASE is `overflow-hidden`, so a
// ring on the stretched link would be clipped at the card edge.
const CARD_BASE =
  "group relative flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-gray-100 shadow-[0_6px_24px_rgba(2,6,23,0.05)] transition-shadow motion-reduce:transition-none hover:shadow-[0_12px_32px_rgba(2,6,23,0.10)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50 has-[:focus-visible]:ring-offset-2";

function CategoryChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        // self-start: inside the flex-col card body a chip would otherwise stretch edge to edge.
        "inline-flex self-start items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary",
        className,
      )}
    >
      {label}
    </span>
  );
}

function PostMeta({ post, className }: { post: BlogCardPost; className?: string }) {
  const date = formatDate(post.date);
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500", className)}>
      {date && <time dateTime={post.date}>{date}</time>}
      {date && <span aria-hidden="true">·</span>}
      <span>{post.readingTime} min read</span>
    </div>
  );
}

/**
 * Featured post — copy beside the image from `md` up, stacked below that.
 *
 * The image ratio has to be responsive: stacked full-bleed at a fixed 16/10, it grew with the
 * viewport (533px tall at 900px wide), so the card got worse as the screen got bigger. It flattens
 * to 2/1 at `sm` and goes side-by-side at `md`. SmartImage applies `aspectRatio` as an inline
 * style, which no breakpoint class can override — hence `fill` plus `aspect-*` classes here.
 */
function FeaturedCard({ post }: { post: BlogCardPost }) {
  return (
    <article className={cn(CARD_BASE, "md:grid md:grid-cols-2 md:items-stretch")}>
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="relative block md:h-full">
        {post.image ? (
          <SmartImage
            src={post.image}
            alt={post.title}
            fill
            objectFit="cover"
            // md+ the image is a half-width column of a 1280-capped container → 608px at the cap.
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 608px"
            className="w-full aspect-[16/10] sm:aspect-[2/1] md:absolute md:inset-0 md:h-full md:aspect-auto"
            priority
          />
        ) : (
          <div className="w-full aspect-[16/10] bg-gray-100 sm:aspect-[2/1] md:absolute md:inset-0 md:h-full md:aspect-auto" />
        )}
      </Link>

      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-6 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
            Featured
          </span>
          <CategoryChip label={post.categoryLabel} />
        </div>

        {/* Non-monotonic by design: the copy column is full-width at sm, then halves at md. */}
        <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-xl lg:text-3xl">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {/* Stretched link — the whole card is the hit target, meta text stays selectable. */}
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-3 text-base text-gray-600">{post.description}</p>
        <PostMeta post={post} className="mt-5" />
        <span className="mt-5 inline-flex self-start items-center gap-1 text-sm font-medium text-primary">
          Read more <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}

function PostCard({ post, size = "default" }: { post: BlogCardPost; size?: "default" | "wide" }) {
  return (
    <article className={CARD_BASE}>
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block">
        {post.image ? (
          <SmartImage
            src={post.image}
            alt={post.title}
            fill
            objectFit="cover"
            // Widths resolve against a 1280-capped container less px-4/6/8 padding and the grid
            // gaps, so both strings end in a fixed px value rather than an unbounded vw.
            sizes={
              size === "wide"
                ? "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 592px"
                : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 384px"
            }
            className="w-full aspect-[16/9]"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-gray-100" />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <CategoryChip label={post.categoryLabel} />
        <h2
          className={cn(
            "mt-3 font-semibold leading-snug text-gray-900",
            size === "wide" ? "text-lg sm:text-xl lg:text-2xl" : "text-lg",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h2>
        <p className={cn("mt-2 line-clamp-3 text-gray-600", size === "wide" ? "text-base" : "text-sm")}>
          {post.description}
        </p>
        <PostMeta post={post} className="mt-4" />
        <span className="mt-4 inline-flex self-start items-center gap-1 text-sm font-medium text-primary">
          Read more <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}

export function BlogIndex({ posts, categories }: { posts: BlogCardPost[]; categories: Category[] }) {
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  // Deep links (/blog?category=doors-frames) are applied after mount so the server-rendered markup
  // and the first client render match — the "all posts" state is what gets statically generated.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("category");
    if (initial && categories.some((c) => c.slug === initial)) setCategory(initial);
  }, [categories]);

  // Keep the URL shareable without a router navigation (which would re-run the route and scroll).
  useEffect(() => {
    const url = new URL(window.location.href);
    if (category === ALL) url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [posts, category, query]);

  // Drives the scroller's fade: only mark the cut-off while there is actually more to scroll to,
  // so the fade doesn't keep implying content once the row is at its end. Starts false, which is
  // what the server renders — the effect turns it on after mount.
  const pillScrollerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  useEffect(() => {
    const el = pillScrollerRef.current;
    if (!el) return;
    const update = () => setHasOverflow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const isDefaultView = category === ALL && query.trim() === "";
  const [featured, ...rest] = filtered;
  const twoUp = isDefaultView ? rest.slice(0, 2) : [];
  const grid = isDefaultView ? rest.slice(2) : filtered;

  const pillClass = (active: boolean) =>
    cn(
      "tap-target inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
      active
        ? "bg-primary text-primary-foreground"
        : "bg-white text-gray-600 ring-1 ring-border hover:bg-secondary hover:text-gray-900",
    );

  return (
    <div>
      {/* Toolbar — category pills + title search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Below md the pills scroll horizontally, with a mask fade marking the cut-off; from md
            they wrap instead, so nothing is hidden off-edge. The fade is a mask on the scroller
            rather than an absolutely-positioned overlay: an absolute child of a scroll container
            is placed against the scrollable area, so it would scroll away — and an overlay would
            sit on top of the last pill's focus ring. */}
        <div
          ref={pillScrollerRef}
          data-fade={hasOverflow ? "right" : undefined}
          className="pill-scroller -mx-4 overflow-x-auto px-4 scrollbar-hide sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0"
        >
          <div
            className="flex min-w-max items-center gap-2 md:min-w-0 md:flex-wrap"
            role="group"
            aria-label="Filter posts by category"
          >
            <button type="button" onClick={() => setCategory(ALL)} aria-pressed={category === ALL} className={pillClass(category === ALL)}>
              All
              <span className={cn("text-xs", category === ALL ? "text-primary-foreground/70" : "text-gray-400")}>
                {posts.length}
              </span>
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                aria-pressed={category === c.slug}
                className={pillClass(category === c.slug)}
              >
                {c.label}
                <span className={cn("text-xs", category === c.slug ? "text-primary-foreground/70" : "text-gray-400")}>
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full lg:w-72 lg:shrink-0">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            // type="search" keeps the mobile keyboard's Search key, but WebKit then paints its own
            // clear button next to ours — suppress it so there's a single ✕.
            // text-base below sm: WebKit zooms the page on focus for any input under 16px, which
            // then leaves the viewport panned sideways.
            className="tap-target w-full rounded-full border border-input bg-white py-2 pl-9 pr-11 text-base text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-secondary hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* aria-atomic so the whole sentence is announced, not just the changed count digit. */}
      <p className="mt-4 text-sm text-gray-500" role="status" aria-live="polite" aria-atomic="true">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {!isDefaultView && " matching your filters"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-secondary/40 px-6 py-16 text-center">
          <p className="text-base font-medium text-gray-900">No articles found</p>
          <p className="mt-1 text-sm text-gray-600">Try a different category or search term.</p>
          <button
            type="button"
            onClick={() => {
              setCategory(ALL);
              setQuery("");
            }}
            className="tap-target mt-5 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            Show all articles
          </button>
        </div>
      ) : (
        // space-y (not gap) — this is a plain block container, so gap-* would do nothing here.
        <div className="mt-8 space-y-6 sm:space-y-8">
          {isDefaultView && featured && <FeaturedCard post={featured} />}

          {twoUp.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              {twoUp.map((post) => (
                <PostCard key={post.slug} post={post} size="wide" />
              ))}
            </div>
          )}

          {grid.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {grid.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
