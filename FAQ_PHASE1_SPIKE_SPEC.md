# FAQ Phase 1 — Steps 1 & 2 build spec (Foundation + `is-standards` spike)

> Detailed implementation spec for the reusable FAQ-guide foundation and the first cluster, wired
> end-to-end. Parent: `FAQ_IMPLEMENTATION_PLAN.md`. Scope is deliberately narrow — prove the shape,
> then fan out. Nothing here publishes without content sign-off.

## 0. Scope
**In:** the foundation every cluster reuses (types, content loader, placement map, transform, schema
builder, `GuideTemplate`) + one live cluster `/plywood-guide/is-standards` + a minimal real pillar
`/plywood-guide`, statically generated with valid JSON-LD.
**Out (later steps):** the other 4 Technical clusters, Purchase/Company/Product phases, the full
`scripts/faq-check.mjs` guard (Step 4), competitor-superlative edits (ON HOLD).

## 1. File manifest
| Path | New/Mod | Purpose |
|---|---|---|
| `data/faq-content.ts` | new | Typed loader over `content/faq-library.json` (`getFaqByNumber`, `technicalFaqs`) |
| `data/types.ts` | mod | Add `FaqLibraryEntry`, `GuidePage` interfaces |
| `data/faq-placement.ts` | new | The guide-page registry: each page's `faqNumbers` + `relatedProducts` + SEO + intro (one home per FAQ) |
| `lib/faqs.ts` | new | Transform: `getFaqsForPage`, `buildAnswerHtml`, `getGuidePage`, `assertPlacementIntegrity` |
| `lib/jsonld.ts` | mod | Add `guideArticleSchema()`; add optional label overrides to `breadcrumbSchema()` |
| `components/templates/GuideTemplate.tsx` | new | Shared pillar+cluster template (mirrors `CategoryTemplate` schema assembly) |
| `app/plywood-guide/page.tsx` | new | Pillar route (thin SSG) |
| `app/plywood-guide/is-standards/page.tsx` | new | Cluster route (thin SSG) |
| `app/sitemap.ts` | mod | Register the two new routes |

## 2. Types (`data/types.ts`)
```ts
export interface FaqLibraryEntry {
  number: number;
  section: "Company" | "Product" | "Technical" | "Purchase";
  question: string;
  aeoAnswer: string;   // short, AI-extractable
  seoAnswer: string;   // long, keyword-rich
}

export interface GuidePage {
  slug: string;                 // "" for pillar, "is-standards" for cluster
  path: string;                 // "/plywood-guide" | "/plywood-guide/is-standards"
  kind: "pillar" | "cluster";
  seo: Seo;                     // reuse existing Seo (title/description/canonical/ogImage)
  eyebrow?: string;
  h1: string;
  introHtml: string;            // editorial intro → avoids thin-content signal
  faqNumbers: number[];         // FAQs homed on this page (cluster only)
  relatedProducts: string[];    // product slugs → /products/{slug}
  clusters?: string[];          // pillar only: child cluster slugs (for nav cards)
}
```

## 3. Content loader (`data/faq-content.ts`)
`resolveJsonModule` is on and `content/**` is in the tsconfig include, so import directly:
```ts
import raw from "@/content/faq-library.json";
import type { FaqLibraryEntry } from "@/data/types";
const faqs = (raw.faqs as FaqLibraryEntry[]);
const byNumber = new Map(faqs.map((f) => [f.number, f]));
export function getFaqByNumber(n: number): FaqLibraryEntry {
  const f = byNumber.get(n);
  if (!f) throw new Error(`FAQ ${n} missing from library`);
  return f;
}
export const technicalFaqs = faqs.filter((f) => f.section === "Technical");
```

## 4. Transform (`lib/faqs.ts`)
```ts
import type { Faq, GuidePage } from "@/data/types";
import { getFaqByNumber } from "@/data/faq-content";
import { GUIDE_PAGES } from "@/data/faq-placement";

const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/** Decision §6 of parent plan: bold AEO "quick answer" lead + SEO detail paragraph. */
export function buildAnswerHtml(e: { aeoAnswer: string; seoAnswer: string }): string {
  return `<p><strong>${esc(e.aeoAnswer)}</strong></p><p>${esc(e.seoAnswer)}</p>`;
}
export function getFaqsForPage(page: GuidePage): Faq[] {
  return page.faqNumbers.map((n) => {
    const e = getFaqByNumber(n);
    return { question: e.question, answerHtml: buildAnswerHtml(e) };
  });
}
export function getGuidePage(slug: string): GuidePage | undefined {
  return GUIDE_PAGES.find((p) => p.slug === slug);
}
/** Build-time invariant (lightweight precursor to scripts/faq-check.mjs): every Technical FAQ
 *  has exactly one home across clusters; no number appears twice; all numbers exist. */
export function assertPlacementIntegrity(): void { /* throws on violation */ }
```
`buildAnswerHtml` output is fed to `FaqAccordion` (renders via `dangerouslySetInnerHTML`) → escaping is mandatory.

## 5. Placement registry (`data/faq-placement.ts`) — the `is-standards` cluster
```ts
export const GUIDE_PAGES: GuidePage[] = [
  { slug: "", path: "/plywood-guide", kind: "pillar",
    h1: "The Saburi Plywood Guide", eyebrow: "Knowledge Hub",
    introHtml: "…", faqNumbers: [], relatedProducts: [],
    clusters: ["is-standards" /* +4 later */],
    seo: { title: "Plywood Guide — IS Standards, Grades, Fire & Emissions | Saburi Ply",
           description: "…", canonical: "/plywood-guide" } },

  { slug: "is-standards", path: "/plywood-guide/is-standards", kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "Indian Plywood IS Standards Explained (IS:710, 303, 5509 & more)",
    introHtml: "<p>India's plywood quality is governed by BIS 'IS' standards …</p>",
    faqNumbers: [101, 102, 107, 112, 113, 114, 115, 118, 139, 140],   // 10 FAQs
    relatedProducts: ["marine-plywood-india", "saburi-scout-plywood", "fire-retardant-india",
      "saburi-perennial-blockboard", "saburi-flushdoor-scout", "shuttering-plywood-india",
      "saburi-titanium-plus", "saburi-hydramax-board"],
    seo: { title: "Plywood IS Standards Explained: IS 710, 303, 5509, 10701 | Saburi Ply",
           description: "What IS:710, IS:303, IS:5509, IS:10701 and other BIS plywood standards mean, and how to verify a CM/L number.",
           canonical: "/plywood-guide/is-standards" } },
];
```
**`is-standards` members (10):** Q101 IS:710 · Q102 IS:303 · Q107 IS:5509 · Q112 IS:1659 · Q113 IS:2202 ·
Q114 IS:3087 · Q115 IS:4990 · Q118 verify-BIS · Q139 IS:10701 · Q140 IS:12823.
**Explicitly homed elsewhere** (documented now to preserve the one-home rule when clusters are built):
Q103 BWP → `waterproof-grades`; Q106/122/129/131 fire → `fire-safety`; Q108 CARB → `emissions-safety`.

## 6. Schema (`lib/jsonld.ts` additions)
- **`guideArticleSchema({ path, headline, description })`** → `Article` (`@id` = `${SITE_URL}${path}#article`,
  `mainEntityOfPage`, `isPartOf`/publisher = Organization `@id`, `inLanguage: "en-IN"`, `about: "Plywood"`).
  (Use plain `Article`, not `TechArticle` — broader support, same benefit.)
- **`breadcrumbSchema(pathname, overrides?)`** → add optional `overrides?: Record<string,string>` so
  `{"is-standards":"IS Standards","plywood-guide":"Plywood Guide"}` fixes the auto-title-case ("Is Standards").
  Backward-compatible; existing callers unaffected.
- Page emits **BreadcrumbList + Article + FAQPage** (via the existing `faqSchema`).

## 7. Template (`components/templates/GuideTemplate.tsx`)
Mirror `CategoryTemplate`'s assembly exactly:
```tsx
export function GuideTemplate({ page }: { page: GuidePage }) {
  const faqs = getFaqsForPage(page);
  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(page.path, { "plywood-guide": "Plywood Guide", "is-standards": "IS Standards" }),
    guideArticleSchema({ path: page.path, headline: page.h1, description: page.seo.description }),
  ];
  const fq = faqSchema(faqs); if (fq) schemas.push(fq);
  return (<>
    <PageHeader title={page.h1} /* reuse */ />
    <section>{/* eyebrow + H1 + introHtml (dangerouslySetInnerHTML) */}</section>
    {page.kind === "cluster" && faqs.length > 0 &&
      <section id="faqs"><FaqAccordion faqs={faqs} /></section>}
    {page.kind === "pillar" && /* cluster nav cards from page.clusters */ null}
    {page.relatedProducts.length > 0 && /* Related products rail → /products/{slug} via getProduct */ null}
    <JsonLd data={schemas} />
  </>);
}
```
Reuses `PageHeader`, `FaqAccordion`, `JsonLd`, `Link`, `getProduct`. No new client islands (accordion is the only one, already shipped).

## 8. Routes (thin SSG — mirror `app/plywood/page.tsx`)
```tsx
// app/plywood-guide/is-standards/page.tsx
export const dynamic = "force-static";
const page = getGuidePage("is-standards");
export const metadata: Metadata = page ? buildPageMetadata(page.seo) : {};
export default function Page() { if (!page) notFound(); return <GuideTemplate page={page} />; }
```
Pillar route identical with `getGuidePage("")`.

## 9. Sitemap (`app/sitemap.ts`)
Add `entry("/plywood-guide", 0.7, "monthly")` and `entry("/plywood-guide/is-standards", 0.7, "monthly")`
to the static-routes list (match existing `entry()` helper signature).

## 10. Acceptance criteria (Steps 1-2 "done")
- [ ] `next build` compiles; both routes emit as **static** (`○`/SSG) — no runtime.
- [ ] Page HTML contains all 10 Q&As (AEO bold lead + SEO detail) in the DOM (crawlable).
- [ ] JSON-LD: **BreadcrumbList + Article + FAQPage** present; passes Google Rich Results Test; every
      `acceptedAnswer.text` == the visible answer text (parity).
- [ ] Breadcrumb reads Home › Plywood Guide › IS Standards (overrides applied).
- [ ] All `relatedProducts` slugs resolve to real `/products/*` pages (no dead links; unknown slug → skipped + warn, no crash).
- [ ] `assertPlacementIntegrity()` passes: 10 unique numbers, all `section==="Technical"`, none double-homed.
- [ ] Metadata: self-referential canonical `/plywood-guide/is-standards`; unique title/description.
- [ ] Lighthouse SEO ≥ 95; accordion keeps `aria-expanded`; headings are real `<h2>/<h3>`.

## 11. Execution order (and where I stop)
1. `data/types.ts` types → 2. `data/faq-content.ts` loader → 3. `data/faq-placement.ts` (pillar + is-standards)
→ 4. `lib/faqs.ts` transform + integrity assert → 5. `lib/jsonld.ts` (`guideArticleSchema` + breadcrumb overrides)
→ 6. `GuideTemplate.tsx` → 7. cluster route → 8. pillar route → 9. `sitemap.ts` → 10. `next build` + validate schema
+ local run/screenshot → **STOP → checkpoint review with you** before fanning out to the other 4 clusters.

## 12. Micro-decisions (defaults taken — flag if you disagree)
- Types live in `data/types.ts` (house convention); loader/placement in `data/*`; transform in `lib/*`.
- `Article` (not `TechArticle`); `en-IN`.
- Real minimal pillar now (not a placeholder) so the cluster has a valid parent + breadcrumb.
- Intro/H1/SEO copy: I draft it → **marked draft, needs Vasudha/founder sign-off before publish**.
- `assertPlacementIntegrity` is an inline invariant now; promoted to `scripts/faq-check.mjs` in Step 4.

## 13. Risks / edge cases
- **JSON typing:** `raw.faqs as FaqLibraryEntry[]` cast + integrity assert guards drift.
- **HTML safety:** AEO/SEO are plain prose but escaped before wrapping (defense-in-depth for `dangerouslySetInnerHTML`).
- **Slug drift:** `getProduct(slug)` miss → skip that link + `console.warn` at build, never fail the build.
- **One-home rule:** enforced across clusters; the other clusters' members are pre-assigned (§5) so no overlap later.
- **Breadcrumb parity:** overrides map is the single source for label casing.
