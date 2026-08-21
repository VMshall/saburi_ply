# Navbar P3 — convert Guides and About Us to the new panel system

**Branch:** `redesign` · **Follows:** `8824f8e` (Products panel) + `3940286` (hover trigger)
**Status:** plan → implementing

---

## 1. Why this has to happen

After P1/P2 the navbar is in a split state:

| Menu | Trigger | Surface | Positioning |
|---|---|---|---|
| Products | hover, `openProducts()` + 150ms grace | white panel, `top-full` on the header wrapper | correct |
| Guides | hover, own `guidesTimeoutRef` | dark photo background, white text | `fixed top-[124px]` magic number |
| About Us | hover, own `aboutTimeoutRef` | dark photo background, white text | `fixed top-[124px]` magic number |

Two different visual languages and three parallel copies of the same open/close machinery in one
component. This is the cleanup, not a new feature.

---

## 2. Content inventory (measured, not assumed)

**Guides** — data-driven from `GUIDE_PAGES`, 13 links:

| Pillar | Hub page | Clusters |
|---|---|---|
| Plywood Guide | `/plywood-guide` ✅ | IS Standards · Water-Resistance Grades · Fire Safety · Emissions & Green · How It's Made · Material Properties (6) |
| Buying Guide | `/plywood-buying-guide` ✅ | How to Buy · Price & Warranty · How Much Plywood · For Your Home · For Projects (5) |

**About Us** — hardcoded, 5 links:

| Group | Links |
|---|---|
| Company | Company Overview (`/about`) · Accreditation (`/about/accreditation`) |
| Our Initiatives | Our National Presence · Environment Stewardship · Privacy Policy |

Unlike Products, **every one of these 18 links already has a real page.** No dead ends.

---

## 3. The one real design decision

Products earned its two-level drill-down because it has 20 products across 7 categories. Guides has
13 links across 2 groups; About has 5 across 2. **Forcing a tile grid + drill-down on them would add
a click to reach every page and leave a 2-tile grid looking half-empty.**

So: **share the visual system, match the structure to the content volume.**

- **Products** — two levels: category tiles → drill-down. (unchanged)
- **Guides** — one level: two cards, each a pillar heading + its clusters listed inline + `View the
  full guide →`.
- **About Us** — one level: two cards, group heading + links inline.

Same white surface, same rounded-card language, same hover trigger, same red accents. Every
destination stays one click away. If the founder wants literal tile-grid uniformity instead, that's
a one-line structural swap per panel — flagged for her, not assumed.

```
GUIDES                                   ABOUT US
┌──────────────────┬──────────────────┐  ┌──────────────────┬──────────────────┐
│ Plywood Guide    │ Buying Guide     │  │ Company          │ Our Initiatives  │
│ ───────────────  │ ───────────────  │  │ ───────────────  │ ───────────────  │
│ IS Standards     │ How to Buy       │  │ Company Overview │ National Presence│
│ Water-Resistance │ Price & Warranty │  │ Accreditation    │ Environment Stew.│
│ Fire Safety      │ How Much Plywood │  │                  │ Privacy Policy   │
│ Emissions & Green│ For Your Home    │  └──────────────────┴──────────────────┘
│ How It's Made    │ For Projects     │
│ Material Props   │                  │
│ View full guide →│ View full guide →│
└──────────────────┴──────────────────┘
```

---

## 4. Refactor — the part that keeps this from tripling

Copy-pasting the Products logic twice would mean three `open` booleans, three timeout refs, three
Escape handlers, three outside-click handlers. Instead:

**a. One state, not three.** Replace `productsOpen` / `showGuidesMega` / `showAboutMega` with:

```ts
const [openPanel, setOpenPanel] = useState<"products" | "guides" | "about" | null>(null)
```

One-panel-at-a-time now falls out of the data model for free. The current cross-closing hacks — the
`closeProducts()` calls wired into `handleGuidesMouseEnter` / `handleAboutMouseEnter` — get deleted.

**b. One set of effects**, keyed on `openPanel`: Escape, outside-click, route-change, pending-focus.
Delete `aboutTimeoutRef` and `guidesTimeoutRef`; the single `productsHoverTimeout` becomes the shared
`hoverTimeout`.

**c. One `<NavPanel>` wrapper** owning the surface: `absolute inset-x-0 top-full`, white bg, red top
border, shadow, the open/closed visibility transition, `aria-hidden`, and the pointer enter/leave
handlers. Each menu supplies only its body.

**d. One `<NavTrigger>`** owning the button: chevron rotation, `aria-expanded` / `aria-controls`, the
`pointerType === "mouse"` hover gate, and the `detail === 0` keyboard-vs-mouse click split.

**Deleted outright:** both `fixed top-[124px]` blocks, both dark photo-background treatments
(`/images/nav-product.jpeg`, `/images/about-nav.webp` for nav use), `megaTriggerClass`.

---

## 5. SEO

Same mechanism as Products: render always, toggle with `visibility` — never conditionally mount.
Guides and About are currently `{showGuidesMega && …}` / `{showAboutMega && …}`, so **their 18 links
are absent from the prerendered HTML today**, exactly as the Products links were.

**Measured** against `.next/server/app/index.html` (prerendered homepage), before vs after:

| | distinct guide + about links |
|---|---|
| Baseline (hover mega-menus) | **3** — footer only |
| With the panels | **18** |

**+15 added, 0 lost.** 13 guide links (both pillars + all 11 clusters) went from invisible to
crawlable, plus Environment Stewardship and Privacy Policy. Sitewide, since the nav is on every page.

Combined with P1's 11 → 21 on products, the nav now contributes **35 internal links** to the static
HTML that previously required a mouse-over to exist at all.

---

## 6. Mobile

Already category-grouped for Guides (pillar → clusters) and flat for About. Both are fine and match
the new desktop IA. Restyle only if the desktop work changes shared classes — no IA change planned.

---

## 7. Verification (same bar as P1)

Puppeteer assertions across **all three** panels:
- hover opens · glide into panel keeps it open · mouse away closes
- hovering a sibling trigger swaps panels (no double-open)
- Escape closes and returns focus · keyboard Enter opens and moves focus in
- route change closes · page still scrolls while open
- Products drill-down still works end to end
- prerendered link count before/after
- screenshots at 1600 / 1280 / 1024 + mobile

---

## 8. Out of scope / flagged, not silently fixed

- `routeNameByPath` contains `/about/our-journey`, which has **no route** under `app/about/`. Dead
  entry, harmless (nothing links to it). Leaving it; worth a separate tidy.
- The old About mega-menu renders `grid-cols-3` with only 2 columns populated — a permanently empty
  third column. Disappears with the rewrite.
- The two products missing from the nav (`saburi-flushdoor-scout`, `saburi-smart-panel-pvc-board`)
  remain outstanding from P1 and are still the founder's call.
