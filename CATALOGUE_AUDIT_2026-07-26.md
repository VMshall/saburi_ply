# Catalogue → Website Fact Audit (2026-07-26)

**Source of truth:** `Saburi_Main_Catalogue 2026_revised.pdf` (17 pp).
**Scope:** every fact in the catalogue **except the factory-test tables on pages 7, 9, 11** (excluded per instruction — "can be corrected later"). The FR/Gold/Scout test tables on pp. 13/15/17 **were** audited.
**Nature:** originally a read-only audit; line references are `file:line`.

> **Update (2026-07-26):** the six 🔴 high-severity items were subsequently **fixed** in `data/products.ts` and `components/sections/AboutUs.tsx` — 18→19 mm on all catalogue plywood; Titanium Plus thickness/sizes populated; Scout 21-yr warranty added; FR "309 %"/"30 %" smoke → qualitative "reduced smoke"; homepage cert line expanded to the catalogue's full set (ISO 9001:2015 / 14001:2015 / 45001:2018, FSC, CARB, IGBC, CE) **+ BIS retained** per founder confirmation (product-level ISI licence). `typecheck` + `vitest` pass. Following founder confirmation (2026-07-26), most 🟡/🟢 items are now fixed too (emission E0/E1, FR pill & 49-min, Club H+ applications, 12-step process, GLP featured, QuadPro wording, ® footer line, plant count → 3). **Still parked (by choice):** the privacy-policy legal name and the excluded-table face-veneer value — see §7.

**Legend —** Match: ✅ ok · ⚠️ partial/attention · ❌ mismatch · 🔵 catalogue-vs-brand-facts conflict (needs founder call).
Severity: 🔴 high · 🟡 medium · 🟢 low · ⚪ out-of-catalogue-scope (bonus).

---

## 0. Headline

The **product warranty multipliers, IS grades, and product names all match** the catalogue (the old FR "3×" is already corrected to "2×"). The problems are: a **systematic 18 mm vs 19 mm** thickness mismatch on every plywood product, **two flagship data gaps** (Titanium Plus has *no* thickness/size; Scout has *no* warranty — the catalogue's 21-year figure never made it in), a **nonsensical "309 % lesser smoke"** string plus an **unconfirmed "30 % smoke"** claim, **E0 over-claiming** on products the catalogue rates E1 (Gold, Scout), a **legal-name conflict** (catalogue "Panels" vs site "Panel"), and various company-copy drift (certs, "35+ Years", 12-step process).

---

## 1. Company-level facts (catalogue p. 2–3)

| Catalogue says | Website value (file:line) | Match | Sev |
|---|---|---|---|
| Founded **1990** / "Since 1990" | `foundingDate: "1990"` (`data/site.ts:69`), prose "since 1990" (`AboutUs.tsx:43,62`, `Footer.tsx:275`) | ✅ | — |
| Age (36 yrs in 2026) | "Since 1990" ✅ and **"35+ Years"** badges (`AboutUs.tsx:107`, `NewAboutUs.tsx:83`, `app/about/page.tsx:15`) are **both correct** — founder-confirmed. ✅ Fixed: `NewAboutUs.tsx:6` → "35+ years of excellence"; `:36` grammar rewritten | ✅ | — |
| Operating entity — founder-confirmed **"Saburi Panel Private Limited"** (singular *Panel*; catalogue's "Panels" was a typo) | `LEGAL_NAME` already correct (`data/site.ts:12`); JSON-LD only → **no UI change** | ✅ | — |
| — (stale root) | ✅ Blog "Saburi Plywood Pvt. Ltd." → "Saburi Panel Private Limited" (`…best-plywood-shop-near-me…:74`) | ✅ | — |
| Certs: **ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, FSC, CARB, IGBC, CE** | Homepage says only "ISO 9001:2015 **& BIS** certified" (`AboutUs.tsx:25,58`) — **BIS not in catalogue**, and 14001/45001/FSC/CARB/IGBC/CE missing there | ❌ | 🔴 |
| (same list) | Footer badges: CARB, CE, IGBC, FSC, ISO 9001:2015 (`Footer.tsx:357-371`) — **no ISO 14001/45001**; Accreditation page: 3×ISO + FSC + **ASTM D7032-17 + ISO 20819-1:2020** + 2 conformance certs (`AccreditationGrid.tsx:13-62`) — **no CARB/IGBC/CE**. Two lists, neither matches the catalogue's 7 | ⚠️ | 🟡 |
| Product lines: **Plywood, Blockboard, Chipboard, WPC, Flush Doors, NRFC Panels** | All six exist as SKUs: plywood; blockboard (`saburi-*-blockboard`); **chipboard = Modwud** line `products.ts:818,873,1077` (IS 12823/3087); WPC (`wpc-pvc`); flush doors (`flushdoor`); **NRFC = Neowud** `products.ts:469`. But About/range copy names them inconsistently and never says "Chipboard"/"NRFC Panels" (`AboutUs.tsx:56` ≠ `NewAboutUs.tsx:36` ≠ `WhyChooseUs.tsx:49`) | ⚠️ | 🟢 |
| Aligned with **Make in India · Skill India · Swachh Bharat** | **Absent** — zero matches anywhere in the repo | ❌ | 🟢 |
| Brand shows **®** | ✅ ® **is** baked into the logo image (visible in navbar + footer) — earlier "no ®" finding was wrong (logo is an image, so a code grep missed it). "Xplore…" tagline not used (skipped). | ✅ | — |
| Founder **Gajanand Munka** *(not stated on catalogue p.3, but consistent)* | `founder: "Gajanand Munka"` (`data/site.ts:70`) | ✅ | — |

---

## 2. Manufacturing process & QuadPro (catalogue p. 5–6)

| Catalogue says | Website value (file:line) | Match | Sev |
|---|---|---|---|
| **12 steps**, specific order (…05 Core Composition · 06 Adhesive & GLP … 09 Face Over Laying Press · 10 Sanding & Trimming · 11 Preservative Treatment · 12 Branding & Dispatch) | `ProcessQuality.tsx:5-19` has 12 steps but **05↔06 swapped**, **09↔10 swapped**, **step 11 "Preservative Treatment" replaced with "Quality check"** | ❌ | 🟡 |
| (clean step titles) | Titles are **leaked image-brief captions**: "…scene" `:9`, "…edge view" `:16`, "…close-up" `:17`, "…with tools" `:18`, "…stacked" `:19` (same defect class CLAUDE.md flags for `PlywoodTypes.tsx`) | ❌ | 🟡 |
| **QuadPro** = a **four-stage** process | Defined as "four-stage" once (`data/categories.ts:170`) ✅; spelling consistently "QuadPro" in the live app ✅. Minor term drift "QuadPro **Process**" vs "QuadPro **Technology**" (`products.ts:41,169` vs `:103,225`) | ⚠️ | 🟢 |
| Step 06 mentions **GLP** (glue-line); products mention GLP tech | **"GLP" appears nowhere** in the codebase | ❌ | 🟢 |

---

## 3. Per-product audit

Warranty multipliers, IS grades, and E0 on the structural trio all match. Issues are flagged per row.

### 3.1 Saburi Titanium Plus — IS 10701 (catalogue p. 6)
| Catalogue | Website (`products.ts:195-255`) | Match |
|---|---|---|
| Lifetime + **10×** money-back | `warranty: "Lifetime + 10× money-back"` (:196) | ✅ |
| **E0** | `emission: "E0"` (:197) | ✅ |
| Plywood **4·6·9·12·16·19·25 mm**; Block Board 19&25 | **`thicknesses: []` and `sizes: []` (:233-234) — EMPTY.** Thickness & size are silently dropped from the spec table *and* Product JSON-LD | ❌ 🔴 |
| Face veneer 0.60 mm (per p.9 sibling report) | Feature "Double-face **6mm**" (:217) — likely dropped-decimal typo (Perennial says 0.60 mm) | ⚠️ 🟢 |
| Applications: hotel suites, auditoriums, wardrobes, ship-building, structural… | Prose match (:229-232) | ✅ |

### 3.2 Saburi Perennial — IS 10701 (catalogue p. 8)
| Catalogue | Website (`products.ts:73-135`) | Match |
|---|---|---|
| Lifetime + **7×**; **E0**; IS 10701; Gurjan core; QuadPro; cooked veneers | `warranty` :74, `emission` :75, features :92-105 | ✅ |
| Plywood **…19 mm…** | `thicknesses` include **"18mm"** (:113) | ❌ 🟡 |

### 3.3 Saburi Club H+ — IS 10701 (catalogue p. 10)
| Catalogue | Website (`products.ts:137-192`) | Match |
|---|---|---|
| Lifetime + **5×**; **E0**; IS 10701; antibacterial | `warranty` :138, `emission` :139, intro :155 | ✅ |
| **Applications**: luxury interiors, hotels, hospitals, auditoriums, modular kitchens… | `applications` field holds **process points**, not applications: "Manufactured through QuadPro Process / Mechanically pressure treated / Withstands all climatic conditions" (:168-172) | ❌ 🟡 |
| Plywood **…19 mm…**; face veneer 1.20 mm | "18mm" (:173); "Double face **6mm**" (:162) | ⚠️ 🟢 |

### 3.4 Saburi Fire Retardant — IS 5509-2021 (catalogue p. 12–13)
| Catalogue | Website (`products.ts:257-306`) | Match |
|---|---|---|
| Lifetime + **2×** money-back | `warranty: "Lifetime + 2× money-back"` (:258) — **old "3×" already fixed** | ✅ |
| **E0** (box) | `emission: "E0"` (:259) | ✅ |
| Rate of burning **> 20 min** (obs 24:45, p.13) | Intro "rate of burning … more than 20 minutes" (:275) — **now catalogue-backed** (was ⏳ in BRAND_FACTS) | ✅ |
| Flame penetration obs **51 min** (> 30) | Intro "flames to penetrate … more than 30 minutes" (:275) — consistent | ✅ |
| **No smoke % stated** (only "reduced/ultra-low smoke") | Intro "**30 %** lesser smoke" (:275) **and** `AboutUs.tsx:17` — unconfirmed by catalogue (⏳ in BRAND_FACTS) | ❌ 🔴 |
| (as above) | Applications "**309 %** lesser smoke generation" (:288) — **impossible/typo**, contradicts the 30 % line | ❌ 🔴 |
| Protection **40, 60 & 120-min** options (p.12) | Feature "Protection Time: As per IS : 5509 - **49 Mins**" (:285) — matches none of 40/60/120 | ❌ 🟡 |
| Grade = **FR / BWR** | gradePill "**STRUCTURAL GRADE**" (:272) — wrong (structural = IS 10701; copy-pasted from the structural trio) | ❌ 🟡 |
| Plywood **…19 mm…** | "18mm" (:291) | ❌ 🟡 |

### 3.5 Saburi Gold — IS 710-2024, Marine (catalogue p. 14–15)
| Catalogue | Website (`products.ts:20-71`) | Match |
|---|---|---|
| **30-year** warranty; Marine IS 710; BWP 72-hr; QuadPro | `warranty: "30-year"` :21, FAQ 72-hr :62, features :38-46 | ✅ |
| Formaldehyde class **E1** (test report p.15) | Feature "**Emission Free Product**" (:39) + badge "Emission Free" (:57) — over-claim vs E1 | ❌ 🟡 |
| Plywood **…19 mm…** | "18mm" (:52) | ❌ 🟡 |
| Applications: kitchen cabinets, marine, docks, patio… | Prose match (:48-50) | ✅ |

### 3.6 Saburi Scout — IS 303 (catalogue p. 16–17)
| Catalogue | Website (`products.ts:356-405`) | Match |
|---|---|---|
| **21-year** warranty (box) | **No `warranty`/`warrantyYears` field** — warranty silently absent from spec table & schema | ❌ 🔴 |
| IS 303; BWP/BWR/MR grades; pressed 130 °C; melamine resin | cert :404, intro 130 °C/melamine :371-372 (QuadPro not mentioned for Scout) | ✅/⚠️ |
| Emission **E1** (box) | No `emission` field (doesn't claim E0 — ok) | ✅ |
| Plywood 4–25 mm | "18mm" in list (:385); image alt mislabel "Scout **710** BWP" (:400 — 710 is Gold/marine) | ⚠️ 🟢 |

---

## 4. Cross-cutting / systematic issues

1. **18 mm vs 19 mm (🔴 systematic).** Catalogue lists **19 mm** for every plywood product and the test reports certify "19 mm (13 ply)". The site uses **"18mm"** everywhere: `products.ts:52` (Gold), `:113` (Perennial), `:173` (Club H+), `:291` (FR), `:385` (Scout). Confirm which is real; if 19 mm, this is wrong on every product.

2. **E0 over-claiming (🟡).** Catalogue rates the structural trio **E0** but **Gold = E1** and **Scout = E1**. Yet `data/categories.ts:37` and the USP `:179-182` claim the **whole plywood range** is "E0 emission-grade", and Gold is marketed "Emission Free". E0 is safe to claim only on Titanium Plus / Perennial / Club H+.

3. **Silent spec omission (🔴 for 2 products).** `lib/product-specs.ts` drops any empty row with no placeholder, so Titanium Plus shows **no thickness/size** and Scout shows **no warranty** — on the spec table *and* in `additionalProperty` of the Product JSON-LD. These are data gaps (populate `thicknesses`/`sizes` for Titanium; add Scout's 21-yr warranty), not a template bug.

4. **FR smoke claims (🔴).** "309 % lesser smoke" (`:288`) is nonsensical; "30 % lesser smoke" (`:275`, `AboutUs.tsx:17`) is not supported by any number in the catalogue (BRAND_FACTS marks it ⏳). The catalogue only says "reduced / ultra-low smoke".

5. **Block Board coverage (🟢, structural note).** The catalogue offers each product as "Block Board: 19 mm & 25 mm"; the site models blockboards as **separate IS 1659 SKUs** rather than thickness options — not an error, just a different information architecture.

---

## 5. Catalogue-vs-brand-facts conflicts (need a founder call) 🔵

- **Legal entity name.** Catalogue p.3 = **"Saburi Panels Pvt. Ltd."** (plural *Panels*, "Pvt. Ltd."). `BRAND_FACTS.md` (founder-confirmed) & all live code = **"Saburi Panel Private Limited"** (singular *Panel*). A blog line uses the stale **"Saburi Plywood Pvt. Ltd."** Only one can be the ROC-registered name — confirm the exact spelling, then it's a single-constant fix (`data/site.ts:12`).
- **FR burning-rate / smoke.** The catalogue now *does* substantiate ">20 min burning rate" (resolves one BRAND_FACTS ⏳), but still gives **no smoke %** — decide whether "30 % less smoke" can be asserted.

---

## 6. Out-of-catalogue-scope bonus flags ⚪

- **Fabricated rating in dead file.** `index.html:86-90` (orphaned React-SPA entry, not in the Next.js build) hardcodes `aggregateRating 4.8 / reviewCount 152` — contradicts the real 4.7★, and is exactly the manual-action risk CLAUDE.md warns about. The **live** JSON-LD is clean (`lib/jsonld.ts:214-216` deliberately omits it). Recommend deleting `index.html` so it can't be resurrected.
- Not in the catalogue and therefore *not* audited here: the client-count / districts / states / 4.7★ stats (governed by `BRAND_FACTS.md`, several already on the CLAUDE.md pending-fix list).

---

## 7. Discrepancy scoreboard  *(updated 2026-07-26 after founder confirmation)*

**🔴 High**
1. ✅ 18 mm → 19 mm on all catalogue plywood.
2. ✅ Titanium Plus thickness/sizes populated.
3. ✅ Scout 21-year warranty added.
4. ✅ FR "309 %"/"30 %" smoke → "significantly reduced smoke" (founder: no %).
5. ✅ Homepage certs = catalogue set **+ BIS** (founder: all held).
6. ✅ Legal name = **"Saburi Panel Private Limited"** (singular *Panel*) — founder-confirmed 2026-07-26; catalogue's "Panels" was a typo. `data/site.ts:12` already correct → JSON-LD only, **no UI change**.

**🟡 Medium**
7. ✅ FR protection — founder confirmed **49 min @ 19 mm** is correct; clarified on-page (catalogue's 40/60/120 = other thicknesses).
8. ✅ FR grade pill "STRUCTURAL GRADE" → "FIRE RETARDANT".
9. ✅ Emission — Gold & Scout → **E1**, structural + FR = **E0**; Gold "Emission Free" → "Low Emission (E1)"; blanket range "E0" → "E0 / E1 by grade".
10. ✅ Club H+ `applications` → real applications (luxury interiors, hotels, hospitals…).
11. ✅ 12-step process — reordered to the catalogue's 12, "Preservative treatment" restored, leaked captions removed, GLP named in step 6.
12. ✅ NewAboutUs "Two decades" → "35+ years of excellence" + `:36` grammar. ("35+ Years"/"Since 1990" both correct — kept.)
13. ✅ Footer + Accreditation now show the full set — footer adds ISO 14001/45001 (links) + ISI (BIS) text; accreditation adds CARB/IGBC/CE tiles (their PDFs converted to webp). No founder files needed (all sourced in-repo).
14. ✅ Blog "Saburi Plywood Pvt. Ltd." → "Saburi Panel Private Limited".

**🟢 Low**
15. ✅ National initiatives — added to the Mission section (`/about`): "Proudly aligned with Make in India, Skill India and Swachh Bharat…".
16. ✅ GLP (Glue Line Protection) — featured in the process step + a `/plywood` USP.
17. ⬜ "Double face 6mm" (Club H+, Titanium) — **deferred**: correct face-veneer value is in the excluded p7/9/11 tables.
18. ✅ QuadPro wording standardized to "QuadPro Process".
19. ✅ Chipboard (Modwud) & NRFC (Neowud) now named in the range copy (AboutUs, NewAboutUs, WhyChooseUs).
20. ✅ Scout image alt · ✅ ® already baked into the logo image (navbar + footer) — no code change needed (earlier "no ®" finding was wrong; briefly added an HTML ®, then reverted as redundant) · "Xplore…" tagline **skipped**.

**⚪ Cleanup:** ✅ Deleted orphaned `index.html` (fake 4.8★/152 rating) — verified not served by Next.js (no SEO/AEO/UI impact; git-tracked, recoverable).

**Still open:** none. **Parked by choice:** #1 (privacy-policy legal name), #17 (face-veneer — excluded tables). Everything else from the catalogue is done.
