#!/usr/bin/env node
/**
 * Redirect + trailing-slash validator — NEXTJS_MIGRATION_PLAN.md §5, §0.1, §11.1.
 *
 * Table-driven over the ACTUAL next.config.mjs redirect rules (imported, so the test can never
 * drift from config) plus explicit samples for the parameterized rules, plus the trailing-slash
 * matrix. For every case it asserts: correct status, correct Location, and — by following the whole
 * chain — that it TERMINATES at a 200 with NO loop.
 *
 * P8: the blog is in-app (WordPress retired), so /blog and /blog/<slug> are normal SSG routes and
 * everything is fully verifiable locally — no WP origin / preview gate needed any more.
 *
 *   node scripts/redirect-check.mjs http://localhost:3100
 *   BASE_URL=https://www.saburiply.com node scripts/redirect-check.mjs
 *
 * No external deps (Node 18+ global fetch). Exit 0 = all green, 1 = any failure.
 */

import nextConfig from "../next.config.mjs";

const BASE = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.env.BASE_URL || "http://localhost:3100").replace(/\/+$/, "");
const MAX_HOPS = 10;
const UA = "saburi-redirect-check/1.0";

// Concrete substitutions for the parameterized rules (can't be auto-derived from a regex source).
// The /blogs sample uses a REAL post slug so the alias resolves to a live in-app 200.
const PARAM_SAMPLES = [
  { match: "best-plywood-", from: "/best-plywood-chennai.php", to: "/products/marine-plywood-india", note: "wildcard .php" },
  { match: "/blogs/:path*", from: "/blogs/top-7-trends-of-plywood-brand-in-india", to: "/blog/top-7-trends-of-plywood-brand-in-india", note: ":path* alias" },
  { match: "/saburi-panel-admin/:path*", from: "/saburi-panel-admin/dashboard", to: "https://admin.saburiply.com/dashboard", external: true, note: "admin :path*" },
];

const rules = await nextConfig.redirects();
const cases = [];
let literalCount = 0;
for (const rule of rules) {
  const isParam = rule.source.includes(":") || rule.source.includes("(");
  if (!isParam) {
    cases.push({ from: rule.source, to: rule.destination, status: rule.statusCode || (rule.permanent ? 308 : 307), external: /^https?:\/\//.test(rule.destination) });
    literalCount++;
  } else {
    const s = PARAM_SAMPLES.find((p) => rule.source.includes(p.match));
    if (s) cases.push({ from: s.from, to: s.to, status: rule.statusCode || 301, external: !!s.external, note: s.note });
    else console.warn(`⚠️  no PARAM_SAMPLE for parameterized rule: ${rule.source}`);
  }
}

// Trailing-slash matrix (§0.1) — middleware 308-strips any trailing slash to the canonical
// slash-less form, in a single hop, for ALL app routes (incl. /blog now).
const slashMatrix = [
  { from: "/about/", to: "/about" },
  { from: "/products/marine-plywood-india/", to: "/products/marine-plywood-india" },
  { from: "/best-plywood-andhra-pradesh/", to: "/best-plywood-andhra-pradesh" },
  { from: "/contact/", to: "/contact" },
  { from: "/blog/", to: "/blog" },
  { from: "/blog/top-7-trends-of-plywood-brand-in-india/", to: "/blog/top-7-trends-of-plywood-brand-in-india" },
];

// In-app blog routes must be live 200s with NO redirect (WordPress retired).
const blog200 = ["/blog", "/blog/top-7-trends-of-plywood-brand-in-india", "/blog/why-choosing-fsc-certified-plywood-is-a-smart-decision"];

function normLoc(loc, fromUrl) {
  const abs = new URL(loc, fromUrl).toString();
  return abs.startsWith(BASE) ? abs.slice(BASE.length) || "/" : abs;
}
async function hop(url) {
  return fetch(url, { redirect: "manual", headers: { "user-agent": UA } });
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

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`  ${ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m"}  ${name}${detail ? "  — " + detail : ""}`);
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
  const chain = await followChain(c.from);
  if (chain.loop) return record(name, false, `LOOP: ${chain.chain.map((h) => h.url + " " + h.status).join(" → ")}`);
  if (chain.tooManyHops) return record(name, false, `>${MAX_HOPS} hops (suspected loop)`);
  if (chain.error) return record(name, false, `chain error: ${chain.error}`);
  if (c.external) return record(name, true, `301 → external (not followed)`);
  if (chain.finalStatus !== 200) return record(name, false, `chain ends ${chain.finalStatus ?? "external"} ≠ 200`);
  record(name, true, `${chain.chain.length} hop(s)`);
}

async function checkSlash(c) {
  const name = `${c.from} → ${c.to} (308, single hop)`;
  let res;
  try {
    res = await hop(BASE + c.from);
  } catch (e) {
    return record(name, false, `request error: ${e.message}`);
  }
  if (res.status !== 308) return record(name, false, `status ${res.status} ≠ 308`);
  const got = normLoc(res.headers.get("location") || "", BASE + c.from);
  if (got !== c.to) return record(name, false, `Location ${got} ≠ ${c.to}`);
  const chain = await followChain(c.from);
  if (chain.loop) return record(name, false, "LOOP");
  if (chain.finalStatus !== 200) return record(name, false, `chain ends ${chain.finalStatus} ≠ 200`);
  record(name, true, `${chain.chain.length} hop(s)`);
}

async function check200(p) {
  const chain = await followChain(p);
  if (chain.loop) return record(`${p} → 200 (no redirect)`, false, "LOOP");
  if (chain.chain.length > 1) return record(`${p} → 200 (no redirect)`, false, `unexpected redirect: ${chain.chain.length} hops`);
  record(`${p} → 200 (no redirect)`, chain.finalStatus === 200, `status ${chain.finalStatus}`);
}

console.log(`\nRedirect + trailing-slash check  ·  BASE = ${BASE}\n`);
console.log(`§5 Redirects (${cases.length} cases: ${literalCount} literal from next.config + ${cases.length - literalCount} parameterized samples)`);
for (const c of cases) await checkRedirect(c);
console.log(`\n§0.1 Trailing-slash matrix (308 strip → 200)`);
for (const c of slashMatrix) await checkSlash(c);
console.log(`\nIn-app blog routes (WordPress retired — must be live 200s)`);
for (const p of blog200) await check200(p);

const failed = results.filter((r) => !r.ok);
console.log(`\n${"─".repeat(60)}`);
console.log(`${results.length - failed.length}/${results.length} passed${failed.length ? `, \x1b[31m${failed.length} FAILED\x1b[0m` : " ✓"}`);
if (failed.length) {
  console.log("\nFailures:");
  for (const f of failed) console.log(`  ✗ ${f.name} — ${f.detail}`);
}
process.exit(failed.length ? 1 : 0);
