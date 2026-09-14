# Navbar — Products: hover mega-menu → click-to-open category panel

**Branch:** `redesign` · **File:** `components/Navbar.tsx` · **Status:** plan, not implemented

---

## 1. Problem with the current behaviour

The Products hover menu (screenshot 1) fails on four counts:

1. **Accidental triggering.** A 600px-tall full-bleed curtain fires on mouse-over while the user is
   travelling from `Home` to `Guides`. Nothing the user did says "show me products."
2. **No dismissal control.** Hover-open surfaces can only be closed by moving away. The 150ms
   close-delay hack (`productsTimeoutRef`) exists to paper over this and still flickers.
3. **Too much at once.** 20 links, 7 columns, 3 of which hold a single item — the layout reads as
   sparse and unbalanced, and the eye has no entry point.
4. **Touch has no hover.** The desktop pattern simply doesn't exist on mobile, so we already maintain
   a second, differently-structured menu (a flat list of all 20 products, no grouping).

Click-to-open fixes all four: intent is explicit, the panel is dismissible, and the same interaction
model works on desktop and touch.

---

## 2. The change, in one line

`Products` becomes a **disclosure button**. Clicking it opens a full-bleed panel below the header
containing **7 category tiles**. Clicking a tile drills into that category's products **inside the
same panel**.

---

## 3. Interaction spec

### Trigger
- `<button aria-expanded aria-controls="products-panel">` with a chevron that rotates 180° when open.
- The white underline (existing active treatment) stays lit while the panel is open.
- All `onMouseEnter` / `onMouseLeave` / timeout-ref logic for Products is **deleted**.

### Open / close
| Action | Result |
|---|---|
| Click trigger | Toggles panel |
| `Esc` | Closes, focus returns to trigger |
| Click on scrim / outside panel | Closes |
| Route change (`usePathname` effect) | Closes |
| Opening Guides or About | Closes Products (one panel at a time) |

While open: a scrim (`bg-black/40`) covers page content and `<body>` scroll is locked.

### Two levels inside the panel

**Level 1 — category grid** (matches your sketch)

```
┌──────────────────────────────────────────────────────────┐
│  Our Products                          View all products →│
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ Plywood  │  │  Block   │  │  Flush   │                │
│  │ 9 products│  │  Board   │  │  Door    │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │   WPC    │  │Chipboard │  │  Liner   │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│  ┌───────────────────────────────────────┐               │
│  │  NEW LAUNCH  ·  Hydramax · Neowud     │  ← wide tile  │
│  └───────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────┘
```

Design note: 7 tiles in a 3-column grid leaves an orphan on row 3. Rather than let it sit lonely
(as in the sketch), **New Launch becomes a full-width feature tile** with a product image and the two
launch names inline. This balances the grid and gives the newest products the emphasis they deserve.

**Tile anatomy:** category name (semibold, ~18px) · product count (`9 products`, muted) · small
category thumbnail · chevron. Hover/focus: red left-border grows in + subtle lift. Not a card
graveyard — one strong hover state, no shadow soup.

**Level 2 — category detail** (replaces grid in place, 200ms cross-fade + 8px slide)

```
┌──────────────────────────────────────────────────────────┐
│  ← All categories   │  PLYWOOD              View range → │
│                                                           │
│   Saburi Titanium Plus      Saburi Scout                 │
│   Saburi Perennial          Saburi Gold Flexi            │
│   Saburi Club H+            Saburi Shine Platinum        │
│   Saburi Gold               ...                          │
└──────────────────────────────────────────────────────────┘
```
- Products in a 2–3 column list, same link styling as today.
- `View range →` appears **only** for categories that have a hub page (currently: Plywood → `/plywood`).
- Back arrow (or `Esc` once) returns to the grid; `Esc` twice closes the panel.

### Motion
200ms `ease-out` on panel height + opacity; 150ms on the level cross-fade. Fully disabled under
`prefers-reduced-motion: reduce`.

---

## 4. Accessibility

- Disclosure pattern, not a modal — `aria-expanded` + `aria-controls`, no `role="dialog"`.
- On open, focus moves to the first tile. On close, focus returns to the trigger.
- Tiles are `<button>` (they expand content, they don't navigate). Product links stay `<a>`.
- Soft focus containment: Tab from the last panel element returns to the trigger.
- `Esc` handling as above. Scrim is `aria-hidden`, pointer-only.

---

## 5. SEO — this is an upgrade, not a regression

Worth stating explicitly because the instinct is that fewer visible links = worse SEO.

Today the mega-menu is **conditionally mounted** (`{showProductsMega && …}`), so on a statically
generated page **none of those 20 product links exist in the served HTML**. They only appear after a
mouse-over. Crawlers get nothing from the nav today.

**In the new panel, render the full markup (all 7 categories + all 20 product links) always, and
toggle visibility with CSS instead of conditional mounting.** Both panel levels ship in the HTML.

**Measured** (`grep` over `.next/server/app/index.html`, prerendered homepage, before vs after):

| | distinct `/products/*` links |
|---|---|
| Baseline (hover mega-menu) | **11** — footer + homepage sections only |
| With the click panel | **21** |

**+10 added, 0 lost.** Newly crawlable from the homepage: Titanium Plus, Saburi Gold
(`marine-plywood-india`), Saburi FR, Gold Flexi, Scout, Perennial Block Board, Modwud Plain,
Hydramax, Neowud, Smart WPC Door Frame. And this now applies to *every* page, since the nav is
sitewide.

---

## 6. Mobile

The current mobile menu is a flat, ungrouped list of all 20 products. Restructure it to mirror the
new IA: `Products` accordion → 7 category rows → each expands to its products. Same mental model as
desktop, no separate concept to maintain.

---

## 7. Scope & phasing

| Phase | Work | Notes |
|---|---|---|
| **P1** | Products click panel: trigger, scrim, grid, drill-down, a11y, motion | The ask. Desktop + the `top-[124px]` fix. |
| **P2** | Mobile Products accordion regrouped by category | Keeps IA consistent. |
| **P3** | Convert **Guides** and **About Us** to the same click pattern | Mixing hover + click in one nav is the actual inconsistency to avoid. Do not ship P1 and leave the other two on hover long-term. |
| **P4** *(optional, separate project)* | Build the 6 missing category hub pages (`/block-board`, `/flush-door`, `/wpc`, `/chipboard`, `/laminate`, `/new-launch`) | Turns every tile into a real destination + 6 new ranking pages. Big SEO win, but a content project, not a nav change. |

### Also fixed in P1
`top-[124px]` is a magic number that breaks the moment the utility strip's height changes. Replace
with a measured header ref or `position: sticky` on the nav wrapper so the panel always anchors
correctly.

---

## 8. Trade-off you should be aware of

Depth to a product page goes from **hover + 1 click** to **2 clicks**. That is the price of a clean
navbar, and it's the right trade for a catalogue this size — but it is a real cost.

If you'd rather not pay it, the alternative is a **two-pane panel**: categories in a left rail,
the selected category's products always visible in the right pane (Plywood pre-selected on open).
Depth stays at 1 click and nothing is hidden, but it looks less like your sketch.

**Recommendation: the drill-down grid (your sketch).** For a plywood catalogue, most visitors arrive
knowing their category, not their SKU — the category-first grid matches how they actually think, and
the extra click buys a nav that never opens by accident.

---

## 9. Data source

Build the panel from `data/products.ts` (`category` field) rather than the 20 hardcoded `<Link>`s
currently in `Navbar.tsx`, so the menu can never drift from the catalogue.

Mapping — display label → data category:

| Panel tile | `ProductCategory` | Hub page |
|---|---|---|
| Plywood | `plywood` | `/plywood` ✅ |
| Block Board | `blockboard` | — |
| Flush Door | `flushdoor` | — |
| WPC | `wpc-pvc` | — |
| Chipboard | `chipboard` | — |
| Liner | `laminate` | — |
| New Launch | *curated list* — Hydramax (`chipboard`), Neowud (`plywood`) | — |

⚠️ **New Launch and Liner are presentation labels, not data categories.** New Launch must be an
explicit curated slug list (its two products also appear under their real categories, which is fine
and intentional). Keep that list in `data/` next to the catalogue, not inline in the component.
