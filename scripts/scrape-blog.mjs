#!/usr/bin/env node
/**
 * One-off scraper — pulls the live WordPress blog (https://www.saburiply.com/blog/*) into in-app
 * static content so WordPress can be retired (Phase 8). For each post it writes
 * `content/blog/<slug>.mdx` (gray-matter frontmatter + cleaned article HTML) and downloads every
 * referenced image to `public/images/blog/<slug>/`, rewriting `src`/`href` to local in-app paths so
 * there is ZERO runtime dependency on WordPress.
 *
 * Metadata comes from Yoast's JSON-LD @graph (title/dates/image) + the head meta tags — the
 * reliable source. Body = the `.entry-content` container (classic-editor content; WP/Elementor
 * theme chrome lives outside it), conservatively de-junked. Thin extractions are flagged.
 *
 *   node scripts/scrape-blog.mjs            # all posts from the live post-sitemap
 *   node scripts/scrape-blog.mjs <slug>     # a single post (for iterating)
 *
 * dev-only (cheerio). Re-runnable / idempotent (skips already-downloaded images).
 */
import * as cheerio from "cheerio";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const SITE = "https://www.saburiply.com";
const UA = "Mozilla/5.0 (saburi-blog-migration)";
const CONTENT_DIR = "content/blog";
const IMG_ROOT = "public/images/blog";
const CONCURRENCY = 4;
const onlySlug = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;

fs.mkdirSync(CONTENT_DIR, { recursive: true });
fs.mkdirSync(IMG_ROOT, { recursive: true });

async function fetchText(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
    }
  }
}
async function fetchBuf(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
    }
  }
}

function jsonLdNodes($) {
  const out = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      const arr = data["@graph"] ? data["@graph"] : [data];
      for (const n of arr) out.push(n);
    } catch {
      /* ignore malformed */
    }
  });
  return out;
}
const hasType = (n, t) => n && [].concat(n["@type"] || []).some((x) => String(x).toLowerCase().includes(t.toLowerCase()));

async function dlImage(rawUrl, slug, destDir, pageUrl) {
  try {
    const abs = new URL(rawUrl, pageUrl).toString();
    if (abs.startsWith("data:")) return null;
    let name = decodeURIComponent(path.basename(new URL(abs).pathname)).replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!name || !/\.[a-z0-9]{2,5}$/i.test(name)) name = (name || "img") + ".jpg";
    const dest = path.join(destDir, name);
    if (!fs.existsSync(dest)) fs.writeFileSync(dest, await fetchBuf(abs));
    return `/images/blog/${slug}/${name}`;
  } catch (e) {
    console.warn(`    ⚠️ image failed: ${rawUrl} (${e.message})`);
    return null;
  }
}

function rewriteHref(href) {
  if (!href) return href;
  return href
    .replace(/^https?:\/\/(www\.)?saburiply\.com\/blog\/([a-z0-9-]+)\/?$/i, "/blog/$2")
    .replace(/^https?:\/\/(www\.)?saburiply\.com(\/products\/[a-z0-9-]+)\/?$/i, "$1")
    .replace(/^https?:\/\/(www\.)?saburiply\.com\/(best-plywood-[a-z-]+|plywood-dealers-bangalore|about|gallery|contact)\/?$/i, "/$2")
    .replace(/^https?:\/\/(www\.)?saburiply\.com\/?$/i, "/");
}

async function scrapePost(slug) {
  const pageUrl = `${SITE}/blog/${slug}/`;
  const html = await fetchText(pageUrl);
  const $ = cheerio.load(html);
  const nodes = jsonLdNodes($);
  const article = nodes.find((n) => hasType(n, "Article"));
  const webpage = nodes.find((n) => hasType(n, "WebPage"));

  const metaTitle = ($("title").first().text() || "").replace(/\s*\|\s*$/, "").trim();
  // NOTE: each live post carries TWO <meta name="description"> (a generic site-wide one FIRST, then
  // the real post-specific Yoast one) and two og:title/og:description. Prefer the single, reliable
  // JSON-LD description; fall back to the LAST og/meta description (the post-specific copy).
  const description = (
    webpage?.description ||
    article?.description ||
    $('meta[property="og:description"]').last().attr("content") ||
    $('meta[name="description"]').last().attr("content") ||
    ""
  ).trim();
  const ogImage = $('meta[property="og:image"]').last().attr("content") || "";
  const imageWidth = parseInt($('meta[property="og:image:width"]').last().attr("content") || "", 10) || 0;
  const imageHeight = parseInt($('meta[property="og:image:height"]').last().attr("content") || "", 10) || 0;
  const headline = String(article?.headline || webpage?.name || metaTitle)
    .replace(/\s*\|\s*Saburi Ply\s*$/i, "")
    .trim();
  const date = article?.datePublished || webpage?.datePublished || "";
  const modified = article?.dateModified || webpage?.dateModified || date;

  // author: resolve a possible {@id} ref against the graph; default to the brand.
  let author = "Saburi Ply";
  let a = article?.author;
  if (a) {
    if (a["@id"]) a = nodes.find((n) => n["@id"] === a["@id"]) || a;
    if (a?.name) author = a.name;
  }

  const destDir = path.join(IMG_ROOT, slug);
  fs.mkdirSync(destDir, { recursive: true });
  const image = ogImage ? await dlImage(ogImage, slug, destDir, pageUrl) : null;

  let c = $(".entry-content").first();
  if (!c.length) c = $("article .elementor-widget-theme-post-content .elementor-widget-container").first();
  c.find(
    "script,style,ins,noscript,.sharedaddy,.jp-relatedposts,#jp-relatedposts,.addtoany_share_save_container,.code-block,.post-nav,.nav-links,.yarpp-related,.wp-block-buttons,.sd-sharing,form",
  ).remove();

  for (const el of c.find("img").toArray()) {
    const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src");
    const local = src ? await dlImage(src, slug, destDir, pageUrl) : null;
    if (local) {
      $(el).attr("src", local);
      ["srcset", "sizes", "data-src", "data-srcset", "data-lazy-src", "data-lazy-srcset", "fetchpriority"].forEach((at) => $(el).removeAttr(at));
      $(el).attr("loading", "lazy");
    } else {
      $(el).remove();
    }
  }
  c.find("a[href]").each((_, el) => $(el).attr("href", rewriteHref($(el).attr("href"))));

  let body = (c.html() || "").replace(/\n{3,}/g, "\n\n").trim();
  const words = c.text().trim().split(/\s+/).filter(Boolean).length;

  const fm = { title: headline, metaTitle, description, date, modified, author, image: image || "", imageWidth, imageHeight, slug };
  fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), matter.stringify(`\n${body}\n`, fm));
  return { slug, headline, words, imgs: c.find("img").length, descLen: description.length, thin: words < 120 || !body };
}

async function scrapeIndex() {
  const html = await fetchText(`${SITE}/blog/`);
  const $ = cheerio.load(html);
  const meta = {
    title: ($('meta[property="og:title"]').attr("content") || $("title").first().text() || "Blog")
      .replace(/\s*\|\s*$/, "")
      .trim(),
    description: ($('meta[name="description"]').attr("content") || "").trim(),
  };
  fs.writeFileSync(path.join(CONTENT_DIR, "_index.json"), JSON.stringify(meta, null, 2) + "\n");
  return meta;
}

async function pool(items, fn, n) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        try {
          out[idx] = await fn(items[idx]);
        } catch (e) {
          out[idx] = { slug: items[idx], error: e.message };
        }
      }
    }),
  );
  return out;
}

// ── main ──
let slugs;
if (onlySlug) {
  slugs = [onlySlug];
} else {
  const xml = await fetchText(`${SITE}/blog/post-sitemap.xml`);
  slugs = [...xml.matchAll(/\/blog\/([a-z0-9-]+)\/<\/loc>/gi)].map((m) => m[1]);
  slugs = [...new Set(slugs)].sort();
  console.log(`Discovered ${slugs.length} post slugs from the live post-sitemap.`);
  const idx = await scrapeIndex();
  console.log(`Blog index meta: "${idx.title}"`);
}

console.log(`Scraping ${slugs.length} post(s)…\n`);
const results = await pool(slugs, scrapePost, CONCURRENCY);

const ok = results.filter((r) => r && !r.error);
const failed = results.filter((r) => r && r.error);
const thin = ok.filter((r) => r.thin);
for (const r of ok) console.log(`  ✓ ${r.slug}  (${r.words}w, ${r.imgs} img, desc ${r.descLen})${r.thin ? "  ⚠️ THIN — CHECK" : ""}`);
for (const r of failed) console.log(`  ✗ ${r.slug} — ${r.error}`);
console.log(`\n${ok.length}/${results.length} scraped` + (failed.length ? `, ${failed.length} FAILED` : "") + (thin.length ? `, ${thin.length} thin (verify)` : ""));
if (failed.length || thin.length) process.exitCode = 1;
