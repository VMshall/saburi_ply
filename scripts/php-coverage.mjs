// php-coverage.mjs — pre-cutover redirect-coverage check for legacy .php URLs.
// Usage:  node scripts/php-coverage.mjs [baseUrl] [extra.php ...]
//   - With no extra args, probes a built-in candidate set.
//   - Paste your GSC-Links backlinked .php URLs as extra args to check exactly those:
//       node scripts/php-coverage.mjs https://www.saburiply.info about.php services.php faq.php
// Each candidate is classed: COVERED (single-hop 301 → target), GAP (403 — strands equity at
// cutover), or GONE (404). Add a 301 in next.config.mjs for every backlinked GAP.

const BASE = (process.argv[2] && process.argv[2].startsWith("http"))
  ? process.argv[2]
  : "https://www.saburiply.info";
const extra = process.argv.slice(2).filter((a) => !a.startsWith("http"));

const CANDIDATES = [
  // products
  "marine-plywood-india.php", "marine_plywood.php", "block-board-india.php", "flush-door-india.php",
  "flexi-plywood-india.php", "shuttering-plywood-india.php", "fire-retardant-india.php",
  "saburi-board.php", "saburi-perennial.php", "saburi-club.php", "saburi-door-frame.php",
  "saburi-h-plus.php", "saburi-scout-plywood.php", "modwud-particle-board.php",
  "brw_plywood.php", "block_board_gurjan.php", "block-board.php",
  // locations
  "best-plywood-bangalore.php", "best-plywood-kerala.php", "best-plywood-tamilnadu.php",
  "best-plywood-telangana.php", "best-plywood-andhra-pradesh.php", "best-plywood-mumbai.php",
  "best-plywood-delhi.php", "best-plywood-gujarat.php",
  // top-level pages
  "index.php", "home.php", "about.php", "about-us.php", "contact.php", "contact-us.php",
  "gallery.php", "dealership.php", "dealer.php", "become-dealer.php", "products.php",
  "product.php", "career.php", "careers.php", "sitemap.php", "blog.php",
  // other plausible legacy pages
  "services.php", "service.php", "faq.php", "faqs.php", "testimonials.php", "certifications.php",
  "certification.php", "news.php", "media.php", "awards.php", "quality.php", "infrastructure.php",
  "manufacturing.php", "profile.php", "company.php", "enquiry.php", "quote.php", "downloads.php",
];

const list = [...new Set([...extra.map((e) => e.replace(/^\//, "")), ...CANDIDATES])];
const covered = [], gaps = [], gone = [];
for (const c of list) {
  try {
    const r = await fetch(`${BASE}/${c}`, { redirect: "manual" });
    if (r.status >= 300 && r.status < 400) {
      covered.push([c, (r.headers.get("location") || "").replace(BASE, "")]);
    } else if (r.status === 403) gaps.push([c, r.status]);
    else gone.push([c, r.status]);
  } catch (e) {
    gone.push([c, "ERR"]);
  }
}
const pad = (s, n) => String(s).padEnd(n);
console.log(`\nbase: ${BASE}\n`);
console.log(`✅ COVERED — single-hop 301 (${covered.length}):`);
covered.sort().forEach(([c, t]) => console.log(`   ${pad(c, 30)} → ${t}`));
console.log(`\n🔴 GAP — 403 (would strand equity if backlinked) (${gaps.length}):`);
gaps.sort().forEach(([c]) => console.log(`   ${c}`));
console.log(`\n⚪ GONE — 404 / not present (${gone.length}):`);
console.log("   " + gone.map(([c]) => c).sort().join(", "));
console.log(`\nNext step: pull GSC → Links → "Top linked pages", filter for ".php". Any URL there`);
console.log(`that appears in the GAP or GONE list above needs a 301 added to next.config.mjs.`);
