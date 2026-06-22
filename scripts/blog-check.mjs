#!/usr/bin/env node
/**
 * Blog migration check (P8) — proves the scraped in-app blog is complete + faithful and has no
 * leftover WordPress dependency.
 *
 *   INTEGRITY (offline): every content/blog/<slug>.mdx has the required frontmatter, its featured
 *   image file exists under public/, and the body contains NO WordPress/staging/apiv2 hosts.
 *   PARITY (live): the scraped <title> and description ≈ what the live WordPress page still serves.
 *
 *   node scripts/blog-check.mjs            # integrity + live parity
 *   node scripts/blog-check.mjs --no-live  # integrity only (offline)
 *
 * dev-only. Exit 0 = all green, 1 = any failure. (Parity needs the live WP site still up.)
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = "content/blog";
const SITE = "https://www.saburiply.com";
const UA = "saburi-blog-check/1.0";
const LIVE = !process.argv.includes("--no-live");
const norm = (s) => (s || "").replace(/&amp;/g, "&").replace(/&#0?39;|&rsquo;|’/g, "'").replace(/\s+/g, " ").trim().toLowerCase();
const stripPipe = (s) => norm(String(s).replace(/\|\s*$/, ""));

const slugs = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, "")).sort();

const results = [];
function rec(name, ok, detail) {
  results.push({ name, ok });
  if (!ok) console.log(`  \x1b[31mFAIL\x1b[0m  ${name}${detail ? "  — " + detail : ""}`);
}

console.log(`\nBlog check  ·  ${slugs.length} posts  ·  ${LIVE ? "integrity + live parity" : "integrity only"}\n`);

const posts = {};
for (const slug of slugs) {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8"));
  posts[slug] = { data, content };
  rec(`${slug}: frontmatter`, !!(data.title && data.description && data.date && data.slug === slug), `title=${!!data.title} desc=${!!data.description} date=${!!data.date}`);
  rec(`${slug}: body non-empty`, content.trim().length > 200, `${content.trim().length} chars`);
  if (data.image) rec(`${slug}: featured image on disk`, fs.existsSync(path.join("public", data.image)), data.image);
  const bad = content.match(/saburiply\.com\/blog\/wp-content|wigtest\.site|apiv2\.saburiply|\/wp-content\//i);
  rec(`${slug}: no WP/staging/apiv2 hosts in body`, !bad, bad ? bad[0] : "");
}
console.log(`  integrity: ${results.filter((r) => r.ok).length}/${results.length} checks passed`);

if (LIVE) {
  console.log(`\nLive parity (vs ${SITE}/blog/<slug>/) …`);
  let pBefore = results.length;
  for (const slug of slugs) {
    const { data } = posts[slug];
    try {
      const r = await fetch(`${SITE}/blog/${slug}/`, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
      const html = await r.text();
      const liveTitle = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
      const ogDescs = [...html.matchAll(/og:description"\s+content="([^"]*)"/gi)].map((m) => m[1]);
      const liveDesc = ogDescs[ogDescs.length - 1] || "";
      const titleOk = stripPipe(liveTitle) === norm(data.metaTitle) || norm(liveTitle).includes(norm(data.title));
      const descOk = norm(liveDesc) === norm(data.description) || (liveDesc && norm(data.description).includes(norm(liveDesc).slice(0, 40)));
      rec(`${slug}: title parity`, titleOk, titleOk ? "" : `live="${liveTitle}" vs meta="${data.metaTitle}"`);
      rec(`${slug}: description parity`, !!descOk, descOk ? "" : `live="${liveDesc.slice(0, 60)}…" vs scraped="${String(data.description).slice(0, 60)}…"`);
    } catch (e) {
      rec(`${slug}: live fetch`, false, e.message);
    }
  }
  console.log(`  parity: ${results.slice(pBefore).filter((r) => r.ok).length}/${results.length - pBefore} checks passed`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${"─".repeat(60)}`);
console.log(`${results.length - failed.length}/${results.length} passed${failed.length ? `, \x1b[31m${failed.length} FAILED\x1b[0m (see above)` : " ✓"}`);
process.exit(failed.length ? 1 : 0);
