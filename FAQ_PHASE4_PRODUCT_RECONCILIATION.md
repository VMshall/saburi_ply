# FAQ Phase 4 — Product reconciliation (review before merge)

> The library's **Product** section (Q51–100, 50 FAQs) vs the **103 curated FAQs already live** on the
> 22 product pages (`data/products.ts`). Analysis auto-generated; **no product file was modified.**

## Summary
- **50** library Product FAQs · **103** live product FAQs.
- **~47 net-new** (no close match live) · **~3 overlap** (≥0.6 token match — dedupe/skip these).
- Library FAQs are "What is [Product]?" intros; live FAQs are application Q&As — so they're mostly complementary.

## Recommendation
These would attach to each product page's `faqs[]` (rendered by ProductTemplate + FAQPage schema, same as today).
Before merging, confirm per row: (a) it doesn't just restate the product's existing intro/description, (b) the
target product is right (⚠️ rows need a call — **Definite** has no standalone page; **Endura/PVC variants** map to the
combined WPC/PVC board product), and (c) drop the ~3 overlaps. On your OK I'll inject the approved rows.

## Mapping (Q# → target product · flag · closest-live-similarity · question)

| Q# | Target product | Flag | Sim | Question |
|----|----------------|------|-----|----------|
| 51 | `saburi-titanium-plus` | net-new | 0.38 | What is Saburi Titanium Plus and what warranty does it carry? |
| 52 | `saburi-perennial` | net-new | 0.43 | What is Saburi Perennial plywood? |
| 53 | `saburi-club-h-plus` | net-new | 0.33 | What is Saburi Club H+ plywood? |
| 54 | `fire-retardant-india` | net-new | 0.38 | What is Saburi FR Ply? |
| 55 | `marine-plywood-india` | net-new | 0.44 | What is Saburi Gold 710? |
| 56 | `saburi-scout-plywood` | net-new | 0.38 | What is Saburi Scout plywood? |
| 57 | `flexi-plywood-india` | **OVERLAP** | 0.6 | What is Saburi Gold Flexi Plywood? |
| 58 | `saburi-scout-plywood` ⚠️ | net-new | 0.38 | What is Saburi Definite plywood? |
| 59 | `flush-door-india` | net-new | 0.44 | What are Saburi Flush Doors made from? |
| 60 | `saburi-smart-wpc-door-frame` | net-new | 0.43 | What are Saburi Smart WPC Doors and Frames? |
| 61 | `saburi-smart-panel-wpc-board` ⚠️ | net-new | 0.27 | What are Saburi Endura WPC boards? |
| 62 | `saburi-smart-panel-pvc-board` ⚠️ | net-new | 0.27 | What are Saburi Smart PVC panels? |
| 63 | `saburi-neowud` | net-new | 0.42 | What is Saburi Neowud NRFC and why is it unique? |
| 64 | `saburi-modwud-plain` | **OVERLAP** | 1.0 | What is Saburi Modwud plain chipboard? |
| 65 | `saburi-hydramax-board` | net-new | 0.38 | What is Saburi Modwud Hydramax and what problems does it solve? |
| 66 | `shuttering-plywood-india` | **OVERLAP** | 0.6 | What is Saburi Shine Platinum shuttering plywood? |
| 67 | `?` ⚠️ | net-new | 0.27 | What is Saburi 10ft x 4ft large-format plywood? |
| 68 | `?` ⚠️ | net-new | 0.25 | Which Saburi product is best for luxury residential interiors? |
| 69 | `?` ⚠️ | net-new | 0.25 | Which Saburi product is best for hospital interior specification? |
| 70 | `?` ⚠️ | net-new | 0.24 | Which Saburi product is best for hotel or resort projects? |
| 71 | `?` ⚠️ | net-new | 0.17 | Which Saburi product should architects specify for green building projects? |
| 72 | `?` ⚠️ | net-new | 0.27 | Which Saburi plywood is best for a wardrobe? |
| 73 | `?` ⚠️ | net-new | 0.35 | What is the best Saburi product for a child's bedroom? |
| 74 | `?` ⚠️ | net-new | 0.25 | What Saburi products are right for bathroom vanity cabinets? |
| 75 | `saburi-perennial` | net-new | 0.29 | What is the difference between Saburi Perennial and Club H+? |
| 76 | `marine-plywood-india` | net-new | 0.31 | What is the difference between Saburi Gold 710 and Scout BWP? |
| 77 | `?` ⚠️ | net-new | 0.29 | What Saburi product should I use for office furniture? |
| 78 | `?` ⚠️ | net-new | 0.29 | What Saburi product is best for retail shop fit-outs? |
| 79 | `?` ⚠️ | net-new | 0.33 | What Saburi product is recommended for educational institutions? |
| 80 | `?` ⚠️ | net-new | 0.25 | What Saburi product is best for a hotel or resort near the sea? |
| 81 | `?` ⚠️ | net-new | 0.27 | Which Saburi product is best for partition walls? |
| 82 | `?` ⚠️ | net-new | 0.27 | Which Saburi product is best for staircase applications? |
| 83 | `?` ⚠️ | net-new | 0.24 | What Saburi product should I use for false ceilings? |
| 84 | `?` ⚠️ | net-new | 0.45 | What Saburi product is best for outdoor furniture? |
| 85 | `?` ⚠️ | net-new | 0.31 | What is the best Saburi product for kitchen cabinet shutters? |
| 86 | `saburi-neowud` | net-new | 0.4 | What is the warranty on Saburi Neowud NRFC? |
| 87 | `saburi-smart-panel-wpc-board` ⚠️ | net-new | 0.27 | What is the warranty on Saburi Endura WPC Pro? |
| 88 | `saburi-hydramax-board` | net-new | 0.31 | What thicknesses does Saburi Modwud Hydramax come in? |
| 89 | `?` ⚠️ | net-new | 0.22 | Which Saburi product is best for a drawing room or living room? |
| 90 | `flexi-plywood-india` | net-new | 0.43 | How does Saburi Gold Flexi compare to bending conventional plywood? |
| 91 | `saburi-smart-panel-wpc-board` ⚠️ | net-new | 0.32 | What is the difference between Saburi Smart PVC and Saburi Endura WPC? |
| 92 | `?` ⚠️ | net-new | 0.25 | Does Saburi Ply offer customised size plywood? |
| 93 | `?` ⚠️ | net-new | 0.22 | What is the correct Saburi product for a coastal home in Kerala or Goa? |
| 94 | `?` ⚠️ | net-new | 0.26 | What is the best Saburi product for a home theatre or media room? |
| 95 | `?` ⚠️ | net-new | 0.26 | What is the best Saburi product for a home theatre or media room? |
| 96 | `?` ⚠️ | net-new | 0.29 | What Saburi product is best for a kitchen countertop substrate? |
| 97 | `?` ⚠️ | net-new | 0.29 | What Saburi product is recommended for a pooja room interior? |
| 98 | `marine-plywood-india` | net-new | 0.33 | What is Saburi Gold 710 best suited for compared to unbranded BWP? |
| 99 | `?` ⚠️ | net-new | 0.26 | What Saburi product should I use for an apartment building lobby interior? |
| 100 | `?` ⚠️ | net-new | 0.31 | What are Saburi Ply's product categories in brief? |
