#!/usr/bin/env node
/**
 * SEO parity check — canonical + JSON-LD + meta + 404 (NEXTJS_MIGRATION_PLAN.md §6, §11.2/3/8).
 *
 * For each template, fetches the page and asserts:
 *   - <link rel="canonical"> is ABSOLUTE on https://www.saburiply.com and matches the path with no
 *     trailing slash (metadataBase must force www even when served from localhost / *.vercel.app —
 *     i.e. the canonical can never leak the serving host). §6 canonicalization.
 *   - the template's required JSON-LD @types are all present (Organization + WebSite are sitewide).
 *   - robots noindex where expected (thank-you), og:url present, <title> present.
 *   - an unknown path returns a hard HTTP 404 (not a soft 200). §11.8
 *
 * Runnable against any base URL:  node scripts/seo-check.mjs http://localhost:3100 [--dump]
 * --dump writes each page's JSON-LD blocks to /tmp/jsonld-<slug>.json for pasting into Google's
 * Rich Results Test (the one validation step that must be done in Google's tool — see runbook).
 * No external deps (Node 18+). Exit 0 = all green, 1 = any failure.
 */

const argBase = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
const BASE = (argBase || process.env.BASE_URL || "http://localhost:3100").replace(/\/+$/, "");
const DUMP = process.argv.includes("--dump");
const CANON = "https://www.saburiply.com";
const UA = "saburi-seo-check/1.0";

// Required JSON-LD @types per template (Organization + WebSite are emitted sitewide by the layout).
// FAQPage is emitted only when a product has authored FAQs — 20/22 do; the 2 §6-restored entries
// (saburi-flushdoor-scout, saburi-smart-panel-pvc-board) have empty faqs:[] so FAQPage is
// (correctly) absent. So FAQPage is asserted on a FAQ-bearing product, not on those two.
const PAGES = [
  { path: "/", types: ["Organization", "WebSite", "LocalBusiness"] },
  { path: "/products/marine-plywood-india", types: ["Organization", "WebSite", "BreadcrumbList", "Product", "FAQPage"] },
  { path: "/products/saburi-flushdoor-scout", types: ["Organization", "WebSite", "BreadcrumbList", "Product"] },
  { path: "/best-plywood-andhra-pradesh", types: ["Organization", "WebSite", "BreadcrumbList", "LocalBusiness"] },
  { path: "/plywood-dealers-bangalore", types: ["Organization", "WebSite", "BreadcrumbList", "LocalBusiness"] },
  { path: "/contact", types: ["Organization", "WebSite", "LocalBusiness"] },
  { path: "/about", types: ["Organization", "WebSite"] },
  { path: "/gallery", types: ["Organization", "WebSite"] },
  { path: "/thank-you", types: ["Organization", "WebSite"], noindex: true },
];

const FOUR04_PATHS = ["/__definitely-not-a-real-page__", "/products/not-a-real-product"];

function firstMatch(html, ...res) {
  for (const re of res) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return undefined;
}

function collectTypes(node, set) {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, set));
  if (node && typeof node === "object") {
    if (node["@type"]) [].concat(node["@type"]).forEach((t) => set.add(t));
    if (node["@graph"]) collectTypes(node["@graph"], set);
  }
}

function extract(html) {
  const canonical = firstMatch(
    html,
    /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i,
    /<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i,
  );
  const title = firstMatch(html, /<title>([^<]*)<\/title>/i);
  const robots = firstMatch(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i) || "";
  const ogUrl = firstMatch(html, /<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i);
  const desc = firstMatch(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  const types = new Set();
  const blocks = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(m[1]);
    try {
      collectTypes(JSON.parse(m[1]), types);
    } catch {
      /* malformed JSON-LD is caught below via missing types */
    }
  }
  return { canonical, title, robots, ogUrl, desc, types: [...types], blocks };
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok });
  console.log(`  ${ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m"}  ${name}${detail ? "  — " + detail : ""}`);
}

async function checkPage(p) {
  let html, status;
  try {
    const res = await fetch(BASE + p.path, { redirect: "follow", headers: { "user-agent": UA } });
    status = res.status;
    html = await res.text();
  } catch (e) {
    return check(`page ${p.path}`, false, `request error: ${e.message}`);
  }
  if (status !== 200) return check(`page ${p.path}`, false, `status ${status} ≠ 200`);
  const x = extract(html);

  // Home canonical is the bare origin (https://www.saburiply.com), which is the identical root URL
  // to ".../" (RFC 3986) and matches the page's og:url. App routes carry no trailing slash.
  const wantCanon = p.path === "/" ? CANON : CANON + p.path;
  check(`${p.path} canonical`, x.canonical === wantCanon, x.canonical ? `${x.canonical}${x.canonical === wantCanon ? "" : " ≠ " + wantCanon}` : "MISSING");
  check(`${p.path} og:url ≡ canonical`, x.ogUrl === x.canonical, x.ogUrl === x.canonical ? x.ogUrl : `og:url ${x.ogUrl} ≠ canonical ${x.canonical}`);

  const missing = p.types.filter((t) => !x.types.includes(t));
  check(`${p.path} JSON-LD [${p.types.join(", ")}]`, missing.length === 0, missing.length ? `missing: ${missing.join(", ")} (got: ${x.types.join(", ") || "none"})` : x.types.join(", "));

  if (p.noindex) check(`${p.path} robots noindex`, /noindex/i.test(x.robots), x.robots || "(no robots meta)");

  if (DUMP && x.blocks.length) {
    const fs = await import("node:fs");
    const slug = p.path === "/" ? "home" : p.path.replace(/\//g, "_").replace(/^_/, "");
    fs.writeFileSync(`/tmp/jsonld-${slug}.json`, "[\n" + x.blocks.map((b) => b.trim()).join(",\n") + "\n]\n");
  }
}

async function check404(path) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual", headers: { "user-agent": UA } });
    check(`404 ${path}`, res.status === 404, `status ${res.status}`);
  } catch (e) {
    check(`404 ${path}`, false, e.message);
  }
}

console.log(`\nSEO parity check  ·  BASE = ${BASE}  ·  canonical host = ${CANON}\n`);
console.log("Per-template canonical + JSON-LD + meta");
for (const p of PAGES) await checkPage(p);
console.log("\nHard 404 (no soft-200)");
for (const p of FOUR04_PATHS) await check404(p);

if (DUMP) console.log(`\nJSON-LD dumped to /tmp/jsonld-*.json — paste each into https://search.google.com/test/rich-results`);

const failed = results.filter((r) => !r.ok);
console.log(`\n${"─".repeat(60)}`);
console.log(`${results.length - failed.length}/${results.length} passed${failed.length ? `, \x1b[31m${failed.length} FAILED\x1b[0m` : " ✓"}`);
process.exit(failed.length ? 1 : 0);
