# FAQ Implementation Plan

> How we turn the 197-FAQ content asset into distributed, schema-backed pages that win AEO + organic.
> Status: **Phase 0 complete** (content extracted). Phases 1–4 pending. Owner: eng + content review (Vasudha/founder).
> Related: `SEO_OPTIMISATION_PLAN.md`, `PLYWOOD_RANKING_PLAN.md`, `AI_CRAWLABILITY_PLAN.md`.

---

## 1. TL;DR
We have 197 fact-checked FAQs (`content/faq-library.json`), each with a short **AEO** answer and a long **SEO**
answer, tagged into 4 sections (Company 50 · Product 50 · Technical 47 · Purchase 50). The site already has the
rendering + schema infra (`FaqAccordion` + `faqSchema` + `<JsonLd>`, wired into `Category/Product/Location`
templates). The plan: **distribute FAQs by search intent onto the right pages** (one canonical home each), build
**one net-new knowledge hub** (`/plywood-guide` pillar + clusters) for the Technical set, a **buying guide** for
Purchase, fold Company into the existing `/about/*` pages, and reconcile Product with what's already live. The win
is **AI citation (AEO) + organic + People-Also-Ask** — not FAQ rich snippets (deprecated Aug 2023).

## 2. Goals / Non-goals
**Goals**
- Every FAQ published as crawlable HTML + valid FAQPage schema, on a page whose intent matches the question.
- Build durable topical authority (pillar/cluster) around plywood technical knowledge — the biggest AEO lever.
- Single source of truth for content; placement decoupled from content; no duplicate Q across pages.

**Non-goals**
- FAQ rich-result stars (Google restricts these to gov/health — we don't optimize for them).
- A single `/faq` mega-page (dilutes ranking, poor UX).
- Re-litigating content facts — the library is already corrected/founder-verified (see `Saburi_200_FAQs_CORRECTIONS.md`).

## 3. Principles
1. **Intent-based placement.** A FAQ lives where its query is served (product Q → product page; "what is IS:710" → guide).
2. **One canonical home per FAQ.** Reference elsewhere via internal links, never duplicate the Q&A.
3. **Topic clustering.** Pillar page + focused cluster pages compound authority better than one big page.
4. **Content + schema, always in parity.** Schema `acceptedAnswer` text == visible text. No schema-only content.
5. **AEO-first.** Optimize for AI Overviews / ChatGPT / Perplexity ingestion + PAA + organic, not SERP stars.

## 4. Current-state architecture (verified)
| Piece | Location | Notes |
|---|---|---|
| FAQ type | `data/types.ts` → `Faq { question, answerHtml }` | `answerHtml` is raw HTML |
| Render | `components/islands/FaqAccordion.tsx` | client island; renders `answerHtml` via `dangerouslySetInnerHTML`; **all Q&A ships in DOM** (crawlable) |
| Schema | `lib/jsonld.ts` → `faqSchema(faqs)` | returns FAQPage or null; page pushes it into a `schemas[]` array |
| Emit | `components/JsonLd.tsx` → `<JsonLd data={schemas} />` | one `<script type="application/ld+json">` per schema |
| Templates | `Category/Product/Location Template.tsx` | build `schemas[]`, push `faqSchema(...)`, render `<FaqAccordion>` in `<section id="faqs">` |
| Live content | `data/products.ts` (103 Q), `data/categories.ts` (10 Q) | overlaps the doc's **Product** section → reconcile, don't re-add |
| Existing `/about/*` | `accreditation`, `national-presence`, `environment-stewardship`, `privacy-policy` | perfect homes for Company sub-topics |
| Routes registered | `app/sitemap.ts` | new pages must be added here |

## 5. Target architecture — placement map
| Section | Canonical home(s) | Mechanism | New routes? |
|---|---|---|---|
| **Product (50)** | `/products/*`, `/plywood` hub | merge into existing `faqs[]`, dedupe vs the 103 live | none |
| **Technical (47)** | **`/plywood-guide`** pillar + ~5 clusters | new `GuideTemplate`, reuse `FaqAccordion`+`faqSchema`+Article schema | yes (6) |
| **Purchase (50)** | **`/plywood-buying-guide`** + estimator page; location Qs → location pages; price Qs → product pages | buying-guide pillar; **HowTo** schema on estimators | yes (2) |
| **Company (50)** | `/about` + `/about/accreditation`, `/about/national-presence`, `/about/environment-stewardship` | add `faqs[]` to existing pages | none |

### Technical hub (pillar + cluster) — the core build
`/plywood-guide` (pillar, links to clusters) →
- `/plywood-guide/is-standards` — IS:710·303·5509·10701·2202·1659·4990·12823·3087
- `/plywood-guide/emissions-safety` — E0·E1·E2, CARB, formaldehyde
- `/plywood-guide/fire-safety` — IS:5509, 40/60/120-min, NBC 2016
- `/plywood-guide/waterproof-grades` — BWP·BWR·MR, boiling-water test
- `/plywood-guide/materials-manufacturing` — Gurjan, QuadPro, calibration, density

Each cluster **interlinks to the matching product** (IS:710 → Gold 710, IS:5509 → FR Ply, chipboard → Modwud). That
pillar↔product mesh is the topical-authority engine. (Slugs tunable to match the flat, keyword-rich house style —
see Open Decisions.)

## 6. Data model & content pipeline
**Flow:** `content/faq-library.json` (source) → `data/faq-placement.ts` (map) → build-time transform → per-page `Faq[]`.

- **Source of truth:** `content/faq-library.json` — never hand-edit page files; regenerate from the `.docx` if content changes.
- **Placement map (`data/faq-placement.ts`):** `{ [faqNumber]: { page: PageKey, relatedProducts?: slug[], order?: number } }`.
  Enforces **one home per FAQ**; lets us re-map without touching content.
- **Transform (`lib/faqs.ts`):** `getFaqsForPage(pageKey): Faq[]` — joins library + placement, builds `answerHtml`.
- **Answer rendering strategy (DECIDED):** every FAQ accordion shows the **AEO answer as a bold "quick answer" lead,
  then the SEO answer as the detail paragraph** — uniform on all page types
  (`answerHtml = <p><strong>{AEO}</strong></p><p>{SEO}</p>`). TL;DR→detail pattern: AI/PAA lift the concise AEO line,
  readers + Google get the SEO depth, both answers get used. Hub pages additionally carry a short editorial intro (not
  just stacked FAQs) to avoid a thin-content signal. Schema `acceptedAnswer` mirrors the combined visible text.
- **Enriched record (future):** add `tags[]`, `relatedProducts[]`, `relatedFaqs[]` to power auto internal-linking.

## 7. Schema strategy (per page type)
| Page | Schemas emitted |
|---|---|
| Guide pillar / clusters | `FAQPage` (its Qs) + `Article`/`TechArticle` + `BreadcrumbList` |
| Buying-guide estimators | `HowTo` (per estimator) + `FAQPage` |
| Product / category | existing Product/Category schema + `FAQPage` (unchanged) |
| `/about/*` | existing `Organization` + `FAQPage` |

## 8. Work breakdown

### Phase 0 — Extract content ✅ DONE
- `content/faq-library.json` (197, `{number, section, question, aeoAnswer, seoAnswer}`) + `content/faq-library.md` (review copy).
- Validated: 197 total, 50/50/47/50 split, entities decoded, corrections carried through.

### Phase 1 — Technical knowledge hub (highest ROI)
> **Steps 1 & 2 detailed build spec: `FAQ_PHASE1_SPIKE_SPEC.md`** (foundation + `is-standards` cluster, end-to-end).
- **New:** `lib/faqs.ts` (transform), `data/faq-placement.ts` (Technical entries), `components/templates/GuideTemplate.tsx`,
  `lib/jsonld.ts` +`articleSchema`/`breadcrumbSchema`, routes `app/plywood-guide/page.tsx` + 5 cluster `page.tsx`.
- Assign the 47 Technical FAQs to the 5 clusters; write pillar intro + per-cluster body prose (from SEO answers).
- Interlink clusters ↔ products ↔ pillar. Add routes to `app/sitemap.ts`.
- **Acceptance:** 6 pages build (SSG), each emits FAQPage+Article+Breadcrumb, all 47 Qs have exactly one home,
  Rich Results Test passes, internal links resolve, Lighthouse SEO ≥ 95.
- **Approach:** spike `/plywood-guide/is-standards` end-to-end first as the pattern, then fan out.

### Phase 2 — Purchase buying guide
- **New:** `app/plywood-buying-guide/page.tsx` + estimator sub-page; `howToSchema` in `lib/jsonld.ts`.
- Route the 50 Purchase FAQs: how-to-buy/verify/spot-fake → buying guide; sheet estimators → estimator page (HowTo);
  "where to buy in X" → location pages `faqs[]`; product-price Qs → product pages `faqs[]`.
- **Acceptance:** estimators emit valid HowTo; location/product Qs appear on the right existing pages; no dup Qs.

### Phase 3 — Company onto /about
- Add `faqs[]` to `/about` (general), `/about/accreditation` (certs), `/about/national-presence` (plants/coverage),
  `/about/environment-stewardship` (sustainability). Push `faqSchema` into each page's `schemas[]`.
- **Acceptance:** 4 pages carry their FAQ subset + FAQPage schema; reinforces existing Organization schema.

### Phase 4 — Product reconciliation
- Diff the doc's 50 Product FAQs against the 103 live in `data/products.ts`/`categories.ts`.
- Merge net-new, upgrade weaker existing answers, delete exact dupes. Keep one home per product Q.
- **Acceptance:** no duplicate questions within a product; product pages unchanged structurally.

## 9. Cross-cutting concerns
- **Internal linking:** every guide FAQ links to related product(s); products link back to the relevant guide cluster.
- **Sitemap + breadcrumbs:** register all new routes in `app/sitemap.ts`; `BreadcrumbList` on clusters.
- **Dedup/canonical:** placement map is the single enforcement point — a lint step fails the build on any FAQ with 0 or >1 homes.
- **Validation:** `scripts/faq-check.mjs` (mirrors `scripts/seo-check.mjs`): every library FAQ placed exactly once, no
  duplicate questions across pages, schema/visible parity, no orphan placements, answer HTML well-formed.
- **A11y:** accordion already uses `aria-expanded`; ensure headings are real `<h2>/<h3>` and answers reachable.
- **Perf:** all SSG (no runtime cost); FaqAccordion is the only island and already ships full text.
- **Analytics:** tag guide/buying-guide pages in GSC; track impressions/clicks per hub + PAA appearances.

## 10. Content governance
- **Source flow:** `.docx` (master, human-edited) → `content/faq-library.json` (regenerated) → site. Never edit page files by hand.
- **Pre-publish review:** Vasudha/founder sign-off per section before it goes live.
- **Known content flags (from corrections log, not blockers but revisit before publishing):**
  competitor superlatives ("only Indian manufacturer…", "highest in top 10") — **softening ON HOLD (2026-07-26): ship as-is, revisit later**;
  optionally add founder-confirmed facts the doc omits (1 Lakh+ clients, 4.7★, 1000+ team, toll-free).
- **Still ⏳ in BRAND_FACTS:** FR burning-rate/smoke numbers, cert validity/FSC number, E0 scope — keep answers consistent as these resolve.

## 11. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Duplicate content across pages | placement map enforces one home; `faq-check.mjs` fails build on dupes |
| Thin/templated "scaled content" signal | real editorial body prose per hub page (SEO answers), not just stacked accordions |
| Over-claiming / competitor comparison legal risk | governance step to soften superlatives before publish |
| Schema/visible mismatch → manual action | parity enforced in transform + validated by check script |
| Content drift docx↔site | single source (`faq-library.json`), regenerated, never hand-edited |
| Maintenance burden | content decoupled from placement; adding/moving a FAQ = one map edit |

## 12. Success metrics (measure per hub, 60–90 days post-launch)
- AI citations (ChatGPT/Perplexity/AI Overviews surfacing Saburi answers for target Qs).
- GSC: impressions/clicks on guide + buying-guide URLs; PAA appearances; featured snippets won.
- Indexed pages count (new hubs indexed); rankings for "IS 710 plywood", "BWP vs BWR", "fire retardant plywood", etc.
- Assisted conversions from guide → product → enquiry.

## 13. Decisions (resolved 2026-07-26)
1. **URL slugs** — nested `/plywood-guide/*`. ✅
2. **AEO vs SEO render** — combined: bold AEO "quick answer" lead + SEO detail in every accordion; hub pages also get a short intro. ✅ (see §6)
3. **Estimators** — static HowTo v1; interactive calculator later. ✅
4. **Cluster count** — 5 themed clusters (~9–10 FAQs each); adjustable. ✅
5. **Competitor superlatives** — ⏸️ **ON HOLD** (per user, 2026-07-26): publish answers as-is for now; revisit in a later editorial sweep — **not** part of Phase 1.

## 14. Sequencing & rough size
Phase 1 (Technical hub) ~ largest (new template + 6 routes + content) → Phase 2 (buying guide + HowTo) → Phase 3
(Company, small, existing pages) → Phase 4 (Product reconcile, content diff). Phases 3–4 can run in parallel with 1–2
since they touch different files. **Recommended first step: spike `/plywood-guide/is-standards` end-to-end.**
