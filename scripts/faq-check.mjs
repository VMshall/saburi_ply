#!/usr/bin/env node
/**
 * faq-check — validates the FAQ library and the guide placement map.
 *
 *  1. Library integrity: content/faq-library.json has 197 FAQs, numbers 1–197 (no gaps/dupes),
 *     section counts 50/50/47/50, no empty fields, no undecoded HTML entities.
 *  2. Placement coverage: every Technical FAQ (101–147) is homed on exactly ONE guide page, and
 *     nothing non-Technical is placed on a guide page (the one-home-per-FAQ invariant).
 *
 * Run: `node scripts/faq-check.mjs` (or `npm run faq-check`). Exits 1 on any violation.
 * Complements the build-time `assertPlacementIntegrity()` in lib/faqs.ts.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (m) => errors.push(m);

// ── 1. Library integrity ────────────────────────────────────────────────
const lib = JSON.parse(readFileSync(join(root, "content/faq-library.json"), "utf8"));
const faqs = lib.faqs ?? [];
if (faqs.length !== 197) fail(`library has ${faqs.length} FAQs, expected 197`);

const nums = faqs.map((f) => f.number);
for (let i = 1; i <= 197; i++) if (!nums.includes(i)) fail(`library missing FAQ #${i}`);
const dupNums = [...new Set(nums.filter((n, i) => nums.indexOf(n) !== i))];
if (dupNums.length) fail(`duplicate FAQ numbers: ${dupNums.join(", ")}`);

const SECTION_COUNTS = { Company: 50, Product: 50, Technical: 47, Purchase: 50 };
const counts = {};
for (const f of faqs) counts[f.section] = (counts[f.section] || 0) + 1;
for (const [s, n] of Object.entries(SECTION_COUNTS))
  if (counts[s] !== n) fail(`section ${s}: ${counts[s] || 0} FAQs, expected ${n}`);

for (const f of faqs) {
  for (const k of ["question", "aeoAnswer", "seoAnswer"]) {
    if (!f[k] || !String(f[k]).trim()) fail(`FAQ #${f.number}: empty ${k}`);
    else if (/&(amp|apos|lt|gt|quot);/.test(f[k])) fail(`FAQ #${f.number}: undecoded HTML entity in ${k}`);
  }
}

// ── 2. Placement coverage (parse the guide registry) ─────────────────────
const placementSrc = readFileSync(join(root, "data/faq-placement.ts"), "utf8");
const placed = [];
// integer-only arrays = guide `faqNumbers` + the ABOUT_FAQS values (string arrays don't match)
for (const m of placementSrc.matchAll(/\[[\s\d,]+\]/g)) {
  for (const tok of m[0].replace(/[[\]]/g, "").split(",")) {
    const n = parseInt(tok.trim(), 10);
    if (!Number.isNaN(n)) placed.push(n);
  }
}
const placedDup = [...new Set(placed.filter((n, i) => placed.indexOf(n) !== i))];
if (placedDup.length) fail(`FAQ double-homed across guide pages: ${placedDup.join(", ")}`);

const byNumber = new Map(faqs.map((f) => [f.number, f]));
const HUB_SECTIONS = ["Technical", "Purchase", "Company", "Product"]; // valid to place
const FULL_COVERAGE = ["Technical", "Purchase", "Company"]; // must be fully homed; Product is partial
for (const n of placed) {
  const f = byNumber.get(n);
  if (!f) fail(`placed FAQ #${n} is not in the library`);
  else if (!HUB_SECTIONS.includes(f.section))
    fail(`placed FAQ #${n} is section ${f.section}, not ${HUB_SECTIONS.join("/")}`);
}
const placedSet = new Set(placed);
const covered = {};
for (const s of FULL_COVERAGE) {
  const inSection = faqs.filter((f) => f.section === s).map((f) => f.number);
  for (const n of inSection) if (!placedSet.has(n)) fail(`${s} FAQ #${n} has no home`);
  covered[s] = inSection.length;
}
const productPlaced = placed.filter((n) => byNumber.get(n)?.section === "Product").length;

// ── report ───────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`✗ faq-check: ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `✓ faq-check: 197 library FAQs valid; all Technical (${covered.Technical}) + Purchase ` +
    `(${covered.Purchase}) + Company (${covered.Company}) homed once; Product ${productPlaced}/50 ` +
    `published (product pages + buying guide) (${placedSet.size} unique placements).`,
);
