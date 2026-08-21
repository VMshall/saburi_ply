import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * In-app blog content layer (P8). Reads the scraped `content/blog/<slug>.mdx` files (gray-matter
 * frontmatter + cleaned article HTML) at build time — every blog route is `force-static`, so this
 * only ever runs during `next build` (gray-matter never reaches the client). WordPress is retired;
 * this is the single source of truth for `/blog`.
 */
const BLOG_DIR = path.join(process.cwd(), "content/blog");

/**
 * Editorial taxonomy for /blog. The scraped frontmatter carries no categories (WordPress served
 * the listing flat), and `scripts/scrape-blog.mjs` rewrites the .mdx files wholesale — so hand-added
 * frontmatter would be lost on the next scrape. The mapping therefore lives here: an explicit
 * slug → category table for the 33 migrated posts, plus a keyword fallback so a newly scraped post
 * always lands somewhere sensible instead of throwing.
 */
export type BlogCategory = { slug: string; label: string };

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "buying-guides", label: "Buying Guides" },
  { slug: "grades-performance", label: "Grades & Performance" },
  { slug: "certifications", label: "Certifications & Guarantees" },
  { slug: "doors-frames", label: "Doors & Frames" },
  { slug: "interiors-design", label: "Interiors & Design" },
  { slug: "industry-trends", label: "Industry & Trends" },
];

const CATEGORY_BY_SLUG: Record<string, string> = {
  // Buying Guides — "how do I pick / who do I buy from".
  "advice-for-selecting-the-best-plywood-choices-for-your-house": "buying-guides",
  "best-plywood-shop-near-me-what-every-homeowner-must-know-before-buying": "buying-guides",
  "choosing-the-correct-plywood-for-your-project": "buying-guides",
  "factors-to-consider-when-choosing-plywood-for-modular-kitchens": "buying-guides",
  "how-to-choose-the-best-plywood-blockboard-company-in-india": "buying-guides",

  // Grades & Performance — how a given grade or material behaves.
  "advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india": "grades-performance",
  "best-termite-proof-plywood-in-india-a-smart-investment": "grades-performance",
  "blockboard-the-unsung-hero-of-woodworking": "grades-performance",
  "how-to-avoid-swelling-in-wooden-furniture-during-monsoon": "grades-performance",
  "is-particle-board-durable-enough-for-modern-interiors": "grades-performance",
  "marine-plywood-5-things-you-ought-to-be-aware-of-marine-plywood": "grades-performance",
  "what-makes-fire-retardant-plywood-different-from-standard-ply": "grades-performance",
  "which-grade-is-best-for-waterproof-plywood-in-india": "grades-performance",

  // Certifications & Guarantees — standards, marks, warranty.
  "bis-certified-plywood-supplier-in-india": "certifications",
  "how-lifetime-guaranteed-plywood-saves-long-term-interior-costs": "certifications",
  "what-does-a-lifetime-guarantee-on-plywood-actually-mean": "certifications",
  "why-choosing-fsc-certified-plywood-is-a-smart-decision": "certifications",
  "why-e0-compliant-plywood-is-essential-for-fire-safe-interiors": "certifications",

  // Doors & Frames.
  "choosing-the-best-meghalayan-pine-flush-door-manufacturer-in-india": "doors-frames",
  "keep-your-doors-looking-and-working-their-best": "doors-frames",
  "top-7-stylish-panel-door-for-your-home-interiors": "doors-frames",
  "which-is-the-best-door-frame-manufacturer-in-india": "doors-frames",
  "which-material-is-used-in-flush-doors": "doors-frames",

  // Interiors & Design.
  "carrying-warmth-and-complexity-to-your-home-with-saburi-ply": "interiors-design",
  "how-to-make-kitchen-a-stunning-place-with-the-use-of-plywood": "interiors-design",
  "how-to-use-flexi-plywood-for-curved-furniture-design": "interiors-design",
  "top-furniture-pieces-to-help-you-unwind-after-a-stressful-day": "interiors-design",

  // Industry & Trends — brands, market, events.
  "top-10-plywood-brands-in-india-of-2025-excellence-innovation": "industry-trends",
  "top-25-upcoming-housing-projects-in-kolkata-you-shouldnt-be-ignoring": "industry-trends",
  "top-5-global-exhibitions-every-interior-designer-should-be-attending-in-2019": "industry-trends",
  "top-5-plywood-brands-in-india-for-durable-modular-furniture": "industry-trends",
  "top-7-trends-of-plywood-brand-in-india": "industry-trends",
  "why-branded-plywood-is-better-than-non-branded-plywood": "industry-trends",
};

/** First matching rule wins — only consulted for slugs missing from the table above. */
const CATEGORY_FALLBACK_RULES: [RegExp, string][] = [
  [/door|frame/, "doors-frames"],
  [/certif|guarantee|warranty|bis|fsc|e0|iso/, "certifications"],
  [/kitchen|furniture|interior|decor|design|home/, "interiors-design"],
  [/brand|trend|market|exhibition|project|top-\d+/, "industry-trends"],
  [/choose|choosing|select|buy|buying|guide|shop/, "buying-guides"],
];

function categoryFor(slug: string): string {
  const mapped = CATEGORY_BY_SLUG[slug];
  if (mapped) return mapped;
  for (const [pattern, category] of CATEGORY_FALLBACK_RULES) {
    if (pattern.test(slug)) return category;
  }
  return "grades-performance";
}

export function categoryLabel(categorySlug: string): string {
  return BLOG_CATEGORIES.find((c) => c.slug === categorySlug)?.label ?? "Insights";
}

/**
 * Frontmatter arrives with WordPress's HTML entities still encoded (`Plywood &amp; Blockboard`).
 * React renders those as text, so the raw string would print literally and the emitted markup would
 * be double-escaped (`&amp;amp;`). Decode once here so titles read correctly everywhere.
 */
const ENTITIES: Record<string, string> = {
  amp: "&",
  nbsp: " ",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

/** Rough reading time in minutes from the article body (220 wpm, tags stripped). */
function readingTimeOf(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z#0-9]+;/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export type BlogPost = {
  slug: string;
  /** Display H1 + card title (clean, no brand suffix). */
  title: string;
  /** Full <title> as the live page served it (kept verbatim for SEO parity). */
  metaTitle: string;
  description: string;
  /** ISO date strings from Yoast. */
  date: string;
  modified: string;
  author: string;
  /** Local featured image path (/images/blog/<slug>/...), or "" if none. */
  image: string;
  /** Featured image intrinsic size (from og:image:width/height) for CLS-safe rendering; 0 if unknown. */
  imageWidth: number;
  imageHeight: number;
  /** Cleaned article body HTML (rendered in a `prose` container). */
  html: string;
  /** Editorial category slug (see BLOG_CATEGORIES) — derived, not from frontmatter. */
  category: string;
  /** Display label for `category`. */
  categoryLabel: string;
  /** Estimated read time in minutes. */
  readingTime: number;
};

/**
 * Listing-safe projection of a post — everything the cards need, minus the article `html`. The
 * /blog index renders through a client island, and every prop crosses the RSC boundary; passing
 * full BlogPost objects would serialise ~33 articles of HTML into the page payload twice.
 */
export type BlogCardPost = Omit<BlogPost, "html" | "metaTitle" | "modified" | "imageWidth" | "imageHeight">;

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const html = content.trim();
  const category = categoryFor(slug);
  return {
    slug,
    title: decodeEntities(data.title ?? slug),
    metaTitle: decodeEntities(data.metaTitle ?? data.title ?? slug),
    description: decodeEntities(data.description ?? ""),
    date: data.date ?? "",
    modified: data.modified ?? data.date ?? "",
    author: data.author ?? "Saburi Ply",
    image: data.image ?? "",
    imageWidth: Number(data.imageWidth) || 0,
    imageHeight: Number(data.imageHeight) || 0,
    html,
    category,
    categoryLabel: categoryLabel(category),
    readingTime: readingTimeOf(html),
  };
}

/** All posts, newest first (by publish date). */
export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map(getPost)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** All posts as listing cards (newest first) — the payload the /blog island receives. */
export function getAllPostCards(): BlogCardPost[] {
  return getAllPosts().map(({ html: _html, metaTitle: _metaTitle, modified: _modified, imageWidth: _w, imageHeight: _h, ...card }) => card);
}

/** Post counts per category, in BLOG_CATEGORIES order; empty categories are dropped. */
export function getCategoryCounts(): { slug: string; label: string; count: number }[] {
  const posts = getAllPosts();
  return BLOG_CATEGORIES.map(({ slug, label }) => ({
    slug,
    label,
    count: posts.filter((p) => p.category === slug).length,
  })).filter((c) => c.count > 0);
}

/** Blog index page meta (scraped from the live /blog/ listing). */
export function getBlogIndexMeta(): { title: string; description: string } {
  const file = path.join(BLOG_DIR, "_index.json");
  if (!fs.existsSync(file)) return { title: "Blog | Saburi Ply", description: "" };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
