#!/usr/bin/env node
/**
 * Redirect + trailing-slash validator — NEXTJS_MIGRATION_PLAN.md §5, §0.1, §11.1.
 *
 * Table-driven over the ACTUAL next.config.mjs redirect rules (imported, so the test can never
 * drift from config) plus explicit samples for the parameterized rules, plus the §0.1 app-route
 * slash matrix. For every case it asserts: correct status, correct Location, and — by following
 * the whole chain — that it TERMINATES at a 200 with NO loop.
 *
 * Runnable against any base URL (local `next start`, a Vercel preview, or production):
 *   node scripts/redirect-check.mjs http://localhost:3100
 *   node scripts/redirect-check.mjs https://<preview>.vercel.app --include-blog
 *   BASE_URL=https://www.saburiply.com node scripts/redirect-check.mjs
 *
 * Blog rewrite/canonical checks need a WordPress origin (WP_ORIGIN_HOST) and so only run with
 * --include-blog (or when WP_ORIGIN_HOST is set) — i.e. on a real preview, not a bare local build.
 * No external deps (Node 18+ global fetch). Exit 0 = all green, 1 = any failure.
 */

import nextConfig from "../next.config.mjs";

const BASE = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.env.BASE_URL || "http://localhost:3100").replace(/\/+$/, "");
const INCLUDE_BLOG = process.argv.includes("--include-blog") || !!process.env.WP_ORIGIN_HOST;
const MAX_HOPS = 10;
const UA = "saburi-redirect-check/1.0";

// ── Build the case table from the live config ───────────────────────────────────────────────
// Concrete substitutions for the parameterized rules (can't be auto-derived from a regex source).
const PARAM_SAMPLES = [
  { match: "best-plywood-", from: "/best-plywood-chennai.php", to: "/products/marine-plywood-india", note: "wildcard .php" },
  { match: "/blogs/:path*", from: "/blogs/some-old-post", to: "/blog/some-old-post", note: ":path* alias" },
  { match: "/saburi-panel-admin/:path*", from: "/saburi-panel-admin/dashboard", to: "https://admin.saburiply.com/dashboard", external: true, note: "admin :path*" },
];

const rules = await nextConfig.redirects();
const cases = [];
let literalCount = 0;
for (const rule of rules) {
  const isParam = rule.source.includes(":") || rule.source.includes("(");
  if (!isParam) {
    cases.push({
      from: rule.source,
      to: rule.destination,
      status: rule.statusCode || (rule.permanent ? 308 : 307),
      external: /^https?:\/\//.test(rule.destination),
      blogDest: rule.destination.startsWith("/blog"),
    });
    literalCount++;
  } else {
    const s = PARAM_SAMPLES.find((p) => rule.source.includes(p.match));
    if (s) cases.push({ from: s.from, to: s.to, status: rule.statusCode || 301, external: !!s.external, blogDest: s.to.startsWith("/blog"), note: s.note });
    else console.warn(`⚠️  no PARAM_SAMPLE for parameterized rule: ${rule.source}`);
  }
}

// §0.1 — app routes are slash-less; middleware 308-strips a trailing slash in a single hop.
const slashMatrix = [
  { from: "/about/", to: "/about", status: 308, group: "§0.1 slash" },
  { from: "/products/marine-plywood-india/", to: "/products/marine-plywood-india", status: 308, group: "§0.1 slash" },
  { from: "/best-plywood-andhra-pradesh/", to: "/best-plywood-andhra-pradesh", status: 308, group: "§0.1 slash" },
  { from: "/contact/", to: "/contact", status: 308, group: "§0.1 slash" },
  { from: "/gallery/", to: "/gallery", status: 308, group: "§0.1 slash" },
];

// §0.1 / §7 — blog keeps WP's trailing slash and must NOT be slash-stripped or looped.
// Needs WP_ORIGIN_HOST (preview). 200 from WP, no redirect.
const blogMatrix = [
  { from: "/blog/", expectFinal: 200, noRedirect: true, group: "blog" },
  { from: "/blog/top-7-trends-of-plywood-brand-in-india/", expectFinal: 200, noRedirect: true, group: "blog" },
  // slash-less blog slug: WP will 301 to its canonical slash form — that's WP's job, just assert no loop.
  { from: "/blog/top-7-trends-of-plywood-brand-in-india", expectFinalOk: true, group: "blog" },
];

// ── HTTP helpers ────────────────────────────────────────────────────────────────────────────
function normLoc(loc, fromUrl) {
  // Resolve relative Location against the request URL, then collapse same-base to a path.
  const abs = new URL(loc, fromUrl).toString();
  return abs.startsWith(BASE) ? abs.slice(BASE.length) || "/" : abs;
}

async function hop(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA } });
  return res;
}

async function followChain(startPath) {
  const visited = new Set();
  let url = BASE + startPath;
  const chain = [];
  for (let i = 0; i < MAX_HOPS; i++) {
    if (visited.has(url)) return { loop: true, chain };
    visited.add(url);
    let res;
    try {
      res = await hop(url);
    } catch (e) {
      return { error: e.message, chain };
    }
    chain.push({ url, status: res.status });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { error: "3xx without Location", chain };
      const next = new URL(loc, url).toString();
      if (!next.startsWith(BASE)) {
        chain.push({ url: next, status: "external (not followed)" });
        return { external: true, finalLocation: next, chain };
      }
      url = next;
      continue;
    }
    return { finalStatus: res.status, chain };
  }
  return { tooManyHops: true, chain };
}

// ── Runner ──────────────────────────────────────────────────────────────────────────────────
const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const tag = ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  console.log(`  ${tag}  ${name}${detail ? "  — " + detail : ""}`);
}

async function checkRedirect(c) {
  const name = `${c.from} → ${c.to} (${c.status})`;
  let res;
  try {
    res = await hop(BASE + c.from);
  } catch (e) {
    return record(name, false, `request error: ${e.message}`);
  }
  if (res.status !== c.status) return record(name, false, `status ${res.status} ≠ ${c.status}`);
  const loc = res.headers.get("location");
  if (!loc) return record(name, false, "no Location header");
  const got = normLoc(loc, BASE + c.from);
  // For external bare-host destinations Next normalizes "https://host" → "https://host/"; compare
  // via URL() so that trailing-slash normalization doesn't read as a mismatch.
  let match;
  if (c.external) {
    try {
      match = new URL(got).href === new URL(c.to).href;
    } catch {
      match = got === c.to;
    }
  } else {
    match = got === c.to;
  }
  if (!match) return record(name, false, `Location ${got} ≠ ${c.to}`);
  // Chain: must terminate without a loop. External targets aren't followed off-host.
  const chain = await followChain(c.from);
  if (chain.loop) return record(name, false, `LOOP: ${chain.chain.map((h) => h.url + " " + h.status).join(" → ")}`);
  if (chain.tooManyHops) return record(name, false, `>${MAX_HOPS} hops (suspected loop)`);
  if (chain.error) return record(name, false, `chain error: ${chain.error}`);
  if (c.external) return record(name, true, `301 → external (not followed)`);
  // /blog* destinations resolve to WordPress; their final 200 only exists with WP_ORIGIN_HOST.
  // The 301 + Location + no-loop are fully verified above either way.
  if (c.blogDest && !INCLUDE_BLOG) return record(name, true, `301 ok; final ${chain.finalStatus} (→ blog: 200 needs WP/preview)`);
  if (chain.finalStatus !== 200) return record(name, false, `chain ends ${chain.finalStatus ?? "external"} ≠ 200`);
  record(name, true, `${chain.chain.length} hop(s)`);
}

async function checkSlash(c) {
  const name = `${c.from} → ${c.to} (${c.status}, single hop)`;
  let res;
  try {
    res = await hop(BASE + c.from);
  } catch (e) {
    return record(name, false, `request error: ${e.message}`);
  }
  if (res.status !== c.status) return record(name, false, `status ${res.status} ≠ ${c.status}`);
  const got = normLoc(res.headers.get("location") || "", BASE + c.from);
  if (got !== c.to) return record(name, false, `Location ${got} ≠ ${c.to}`);
  const chain = await followChain(c.from);
  if (chain.loop) return record(name, false, "LOOP");
  if (chain.finalStatus !== 200) return record(name, false, `chain ends ${chain.finalStatus} ≠ 200`);
  record(name, true, `${chain.chain.length} hop(s)`);
}

async function checkBlog(c) {
  const name = `${c.from} (blog pass-through, no loop)`;
  const chain = await followChain(c.from);
  if (chain.loop) return record(name, false, `LOOP: ${chain.chain.map((h) => h.url).join(" → ")}`);
  if (chain.tooManyHops) return record(name, false, `>${MAX_HOPS} hops`);
  if (chain.error) return record(name, false, chain.error);
  if (c.noRedirect && chain.chain.length > 1) return record(name, false, `expected no redirect, got ${chain.chain.length} hops`);
  if (c.expectFinal && chain.finalStatus !== c.expectFinal) return record(name, false, `final ${chain.finalStatus} ≠ ${c.expectFinal}`);
  if (c.expectFinalOk && !(chain.finalStatus >= 200 && chain.finalStatus < 400)) return record(name, false, `final ${chain.finalStatus}`);
  record(name, true, `final ${chain.finalStatus}`);
}

// ── Go ──────────────────────────────────────────────────────────────────────────────────────
console.log(`\nRedirect + trailing-slash check  ·  BASE = ${BASE}\n`);

console.log(`§5 Redirects (${cases.length} cases: ${literalCount} literal from next.config + ${cases.length - literalCount} parameterized samples)`);
for (const c of cases) await checkRedirect(c);

console.log(`\n§0.1 App-route trailing-slash matrix`);
for (const c of slashMatrix) await checkSlash(c);

console.log(`\n§0.1/§7 Blog trailing-slash pass-through ${INCLUDE_BLOG ? "" : "(SKIPPED — needs WP_ORIGIN_HOST / a preview; run with --include-blog)"}`);
if (INCLUDE_BLOG) for (const c of blogMatrix) await checkBlog(c);
else for (const c of blogMatrix) console.log(`  \x1b[33mSKIP\x1b[0m  ${c.from}`);

const failed = results.filter((r) => !r.ok);
console.log(`\n${"─".repeat(60)}`);
console.log(`${results.length - failed.length}/${results.length} passed${failed.length ? `, \x1b[31m${failed.length} FAILED\x1b[0m` : " ✓"}`);
if (failed.length) {
  console.log("\nFailures:");
  for (const f of failed) console.log(`  ✗ ${f.name} — ${f.detail}`);
}
process.exit(failed.length ? 1 : 0);
