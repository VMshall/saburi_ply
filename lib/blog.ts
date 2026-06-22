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
};

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
  return {
    slug,
    title: data.title ?? slug,
    metaTitle: data.metaTitle ?? data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    modified: data.modified ?? data.date ?? "",
    author: data.author ?? "Saburi Ply",
    image: data.image ?? "",
    imageWidth: Number(data.imageWidth) || 0,
    imageHeight: Number(data.imageHeight) || 0,
    html: content.trim(),
  };
}

/** All posts, newest first (by publish date). */
export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map(getPost)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Blog index page meta (scraped from the live /blog/ listing). */
export function getBlogIndexMeta(): { title: string; description: string } {
  const file = path.join(BLOG_DIR, "_index.json");
  if (!fs.existsSync(file)) return { title: "Blog | Saburi Ply", description: "" };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
