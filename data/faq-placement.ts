/**
 * Guide-page registry: where each knowledge-hub page lives and which library FAQs it homes.
 *
 * This is the placement layer that decouples CONTENT (content/faq-library.json) from PLACEMENT.
 * Moving a FAQ to a different page = editing `faqNumbers` here; answers are never touched.
 * Invariant (enforced by `assertPlacementIntegrity` in lib/faqs.ts): every listed FAQ number
 * exists in the library and appears on exactly ONE page — no duplicate content across pages.
 *
 * Phase 1 = the pillar + 6 Technical clusters (is-standards, waterproof-grades, fire-safety,
 * emissions-safety, manufacturing-process, material-properties). Purchase / Company / Product later.
 *
 * NOTE: intro / H1 / SEO copy below is DRAFT — pending Vasudha/founder sign-off before publish.
 *
 * The presentation fields (`atAGlance`, `compareTable`, `takeaways`) drive the cluster article
 * layout — hero fact card, comparison module and closing summary. Every value is condensed from
 * the placed FAQ answers themselves (no new claims), so it is DRAFT on the same terms.
 * `updatedOn` / `reviewedBy` are deliberately unset: both are assertions only sign-off can make.
 */
import type { GuidePage } from "@/data/types";

export const GUIDE_PAGES: GuidePage[] = [
  // ── Pillar ──────────────────────────────────────────────────────────────
  {
    slug: "",
    path: "/plywood-guide",
    kind: "pillar",
    eyebrow: "Knowledge Hub",
    h1: "The Saburi Plywood Guide",
    heroSubhead:
      "Everything you need to understand plywood — IS standards, grades, emissions, fire safety and how it's made — explained by India's engineered-panel specialists.",
    introHtml:
      "<p>Choosing plywood shouldn't require a materials-science degree. This guide breaks down the Indian Standards (IS codes), water-resistance grades, emission classes, fire ratings and manufacturing that decide how a panel actually performs — in plain language, with the Saburi product that fits each need.</p>",
    faqNumbers: [],
    relatedProducts: [],
    clusters: [
      "is-standards",
      "waterproof-grades",
      "fire-safety",
      "emissions-safety",
      "manufacturing-process",
      "material-properties",
    ],
    seo: {
      title: "Plywood Guide — IS Standards, Grades, Fire & Emissions Explained | Saburi Ply",
      description:
        "A plain-language guide to plywood in India: IS:710/303/5509 standards, BWP vs BWR vs MR grades, E0/E1 emissions, fire ratings and how quality plywood is manufactured.",
      canonical: "/plywood-guide",
    },
  },

  // ── Cluster: IS standards ───────────────────────────────────────────────
  {
    slug: "is-standards",
    path: "/plywood-guide/is-standards",
    kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "Indian Plywood IS Standards Explained (IS:710, 303, 5509 & More)",
    heroSubhead:
      "What the BIS 'IS' codes on a plywood sheet actually mean — and how to verify them yourself.",
    introHtml:
      "<p>Every genuine plywood or panel sold in India is certified against a Bureau of Indian Standards (BIS) specification — an <strong>IS code</strong> that defines its grade, bonding and performance. Below, each standard Saburi manufactures to is explained in plain terms, with the product it applies to and how to verify a CM/L licence number yourself.</p>",
    atAGlance: [
      { label: "Marine / BWP", value: "IS:710" },
      { label: "General-purpose", value: "IS:303" },
      { label: "Fire-retardant", value: "IS:5509" },
      { label: "Verify a claim", value: "CM/L no. at bis.gov.in" },
    ],
    compareTable: {
      heading: "Which IS code covers what",
      columns: ["Standard", "Covers", "Saburi product"],
      rows: [
        ["IS:710", "Marine / BWP plywood", "Saburi Gold 710"],
        ["IS:303", "General-purpose plywood (MR, BWR, BWP)", "Saburi Scout"],
        ["IS:5509", "Fire-retardant treated plywood", "Saburi FR Ply"],
        ["IS:1659", "Block board", "Saburi block board"],
        ["IS:2202", "Wooden flush doors", "Saburi Flush Doors"],
        ["IS:3087", "Particle board (chipboard)", "Saburi Modwud plain"],
        ["IS:4990", "Shuttering plywood", "Saburi Shine Platinum"],
        ["IS:10701", "Calibrated plywood", "Titanium Plus, Perennial, Club H+"],
        ["IS:12823", "Pre-laminated chipboard", "Saburi Modwud Pre-Lam"],
      ],
    },
    takeaways: [
      "The IS code tells you what the panel is: IS:710 is marine BWP, IS:303 is general-purpose, IS:5509 is fire-retardant.",
      "A certification claim is only worth what the licence says — check the CM/L number printed on the panel at bis.gov.in.",
      "One brand carries many standards: each product line is certified against the code for its own panel type.",
    ],
    // Q101 IS:710 · Q102 IS:303 · Q107 IS:5509 · Q112 IS:1659 · Q113 IS:2202 ·
    // Q114 IS:3087 · Q115 IS:4990 · Q118 verify-BIS · Q139 IS:10701 · Q140 IS:12823
    faqNumbers: [101, 102, 107, 112, 113, 114, 115, 118, 139, 140],
    relatedProducts: [
      "marine-plywood-india", // IS:710 (Gold)
      "saburi-scout-plywood", // IS:303 (Scout)
      "fire-retardant-india", // IS:5509 (FR)
      "block-board-india", // IS:1659 (block board)
      "flush-door-india", // IS:2202 (flush door)
      "saburi-modwud-plain", // IS:3087 (chipboard)
      "shuttering-plywood-india", // IS:4990 (shuttering)
      "saburi-titanium-plus", // IS:10701 (structural)
      "saburi-modwud-pre-lam", // IS:12823 (pre-lam chipboard)
    ],
    seo: {
      title: "Plywood IS Standards Explained: IS 710, 303, 5509, 10701 | Saburi Ply",
      description:
        "What IS:710, IS:303, IS:5509, IS:10701 and other BIS plywood standards mean, how they differ, and how to verify a plywood CM/L certification number.",
      canonical: "/plywood-guide/is-standards",
    },
  },

  // ── Cluster: Water-resistance grades ────────────────────────────────────
  {
    slug: "waterproof-grades",
    path: "/plywood-guide/waterproof-grades",
    kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "Plywood Water-Resistance Grades: BWP vs BWR vs MR Explained",
    heroSubhead:
      "Which plywood actually survives water — and the resin chemistry and tests behind each grade.",
    introHtml:
      "<p>Not all plywood handles water the same way. The difference comes down to the <strong>adhesive resin</strong> and how the panel is treated — which is what separates marine BWP from boiling-water-resistant BWR and moisture-resistant MR grades. Here's what each grade means, how it's tested, and why bonding chemistry decides whether a panel delaminates or lasts.</p>",
    atAGlance: [
      { label: "Highest grade", value: "BWP — IS:710" },
      { label: "Bonding resin", value: "Phenol-formaldehyde" },
      { label: "Defining test", value: "72-hour boiling water" },
      { label: "Specify it for", value: "Kitchens, baths, coastal" },
    ],
    compareTable: {
      heading: "BWP vs BWR vs MR",
      columns: ["Grade", "Bonding resin", "Water performance", "Use it for"],
      rowNotes: { 0: "IS:710 marine", 1: "IS:303", 2: "IS:303" },
      highlightRow: 0,
      rows: [
        ["BWP", "Phenol-formaldehyde (PF)", "72 hours in boiling water, no delamination", "Kitchens, bathrooms, coastal"],
        ["BWR", "Melamine-fortified UF", "Resists boiling water for a limited period", "Intermittent moisture"],
        ["MR", "Urea-formaldehyde (UF)", "Hydrolyses under sustained moisture", "Dry indoor areas only"],
      ],
    },
    takeaways: [
      "The grade is decided by the adhesive resin, not by how the sheet looks.",
      "Anything that meets water — kitchen, bathroom, coastal — should be BWP to IS:710.",
      "MR plywood used in a kitchen typically delaminates and swells within 2–3 years.",
    ],
    // Q103 BWP · Q104 PF vs UF resin · Q105 vacuum impregnation · Q116 moisture/calibration ·
    // Q123 phenolic vs melamine · Q127 boiling-water test · Q128 delamination
    faqNumbers: [103, 104, 105, 116, 123, 127, 128],
    relatedProducts: [
      "marine-plywood-india", // Gold 710 (BWP/IS:710)
      "saburi-perennial", // marine, vacuum-impregnated
      "saburi-titanium-plus", // premium BWP
      "saburi-scout-plywood", // BWR/MR
      "saburi-hydramax-board", // moisture-resistant chipboard
    ],
    seo: {
      title: "BWP vs BWR vs MR Plywood: Water-Resistance Grades Explained | Saburi Ply",
      description:
        "The difference between BWP, BWR and MR plywood grades, phenolic vs melamine resin, the 72-hour boiling-water test, and what causes delamination.",
      canonical: "/plywood-guide/waterproof-grades",
    },
  },

  // ── Cluster: Fire safety ────────────────────────────────────────────────
  {
    slug: "fire-safety",
    path: "/plywood-guide/fire-safety",
    kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "Fire-Retardant Plywood: Ratings, Testing & How It Works",
    heroSubhead: "How fire-retardant plywood is made, rated and tested for safer interiors.",
    introHtml:
      "<p>Fire-retardant plywood buys critical minutes during a fire — but 'fire-retardant' only means something when it's backed by testing: flame penetration, rate of burning, and recognised ratings like UL94 V0 and IS:5509. Here's how FR treatment actually works, how fire performance is measured in India, and what Saburi's Firewall protection adds.</p>",
    atAGlance: [
      { label: "Indian standard", value: "IS:5509" },
      { label: "FR Ply ratings", value: "40 / 60 / 120 min" },
      { label: "NRFC rating", value: "UL94 V0" },
      { label: "Treatment", value: "Impregnated, not coated" },
    ],
    compareTable: {
      heading: "How fire performance is rated",
      columns: ["Rating", "What it measures", "Applies to"],
      rows: [
        ["IS:5509", "Minutes a panel resists flame penetration", "Saburi FR Ply — 40, 60, 120 min"],
        ["UL94 V0", "Seconds to self-extinguish once the flame is removed", "Saburi Neowud NRFC"],
      ],
    },
    takeaways: [
      "Fire-retardant only counts when the chemicals are impregnated through the veneers during manufacture — a surface coating is not the same thing.",
      "Two different scales apply: minutes of flame resistance under IS:5509, seconds to self-extinction under UL94 V0.",
      "Titanium Plus carries Firewall treatment on top of its BWP marine properties, so fire resistance is built in rather than added.",
    ],
    // Q106 UL94 V0 · Q122 FR treatment · Q129 fire measurement · Q131 Firewall
    faqNumbers: [106, 122, 129, 131],
    relatedProducts: [
      "fire-retardant-india", // FR Ply (IS:5509)
      "saburi-titanium-plus", // Firewall protection
      "saburi-neowud", // UL94 V0
    ],
    seo: {
      title: "Fire-Retardant Plywood: UL94 V0, IS 5509 Ratings & Testing | Saburi Ply",
      description:
        "How fire-retardant plywood works, the UL94 V0 rating, how fire resistance is measured under Indian standards, and Saburi's Firewall protection.",
      canonical: "/plywood-guide/fire-safety",
    },
  },

  // ── Cluster: Emissions, health & green ──────────────────────────────────
  {
    slug: "emissions-safety",
    path: "/plywood-guide/emissions-safety",
    kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "Plywood Emissions & Green Credentials: CARB, FSC & Formaldehyde-Free Panels",
    heroSubhead:
      "What CARB, FSC and formaldehyde emissions mean for a healthier, more sustainable home.",
    introHtml:
      "<p>The plywood in your home affects the air you breathe. Formaldehyde emissions, responsible timber sourcing and formaldehyde-free composites are what separate a healthy, green specification from a cheap one. Here's what CARB and FSC certification mean, and how eco panels like Neowud and WPC remove formaldehyde altogether.</p>",
    atAGlance: [
      { label: "Emission standard", value: "CARB Phase 2" },
      { label: "CARB limit", value: "0.05 ppm formaldehyde" },
      { label: "Responsible sourcing", value: "FSC Chain of Custody" },
      { label: "No formaldehyde", value: "Neowud NRFC, WPC" },
    ],
    compareTable: {
      heading: "Formaldehyde by panel type",
      columns: ["Panel", "Formaldehyde", "Made from"],
      rows: [
        ["Plywood (CARB Phase 2)", "Up to 0.05 ppm", "Timber veneer + PF adhesive"],
        ["Neowud NRFC", "No formaldehyde resin", "Rice husk + polymer binder"],
        ["WPC board", "No formaldehyde adhesive", "Wood fibre + polymer"],
      ],
    },
    takeaways: [
      "CARB Phase 2 caps formaldehyde at 0.05 ppm — significantly stricter than India's E1 standard.",
      "FSC Chain of Custody is what lets an architect put documented responsible sourcing into a LEED submission.",
      "To remove formaldehyde altogether the panel has to leave timber veneer behind: Neowud NRFC or WPC.",
    ],
    // Q108 CARB · Q136 FSC · Q143 WPC vs plywood · Q144 Neowud NRFC
    faqNumbers: [108, 136, 143, 144],
    relatedProducts: [
      "saburi-neowud", // NRFC, zero formaldehyde
      "saburi-smart-panel-wpc-board", // WPC, formaldehyde-free
      "marine-plywood-india", // CARB-certified
      "saburi-titanium-plus", // E0 emission
    ],
    seo: {
      title: "Plywood Emissions & Green Certifications: CARB, FSC, Formaldehyde | Saburi Ply",
      description:
        "What CARB Phase 2 and FSC certification mean for plywood, how formaldehyde emissions are graded, and formaldehyde-free panels like Neowud NRFC and WPC.",
      canonical: "/plywood-guide/emissions-safety",
    },
  },

  // ── Cluster: How it's made (manufacturing process) ──────────────────────
  {
    slug: "manufacturing-process",
    path: "/plywood-guide/manufacturing-process",
    kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "How Plywood Is Made: QuadPro, Bonding, Drying & Quality Testing",
    heroSubhead: "The manufacturing steps and treatments behind a Saburi panel.",
    introHtml:
      "<p>What happens between a log and a finished sheet is what separates a panel that lasts from one that fails. This covers Saburi's process — QuadPro bonding, GLP, calibration, drying and pressing — plus the termite/antifungal treatments and eight-point testing that back the warranty.</p>",
    atAGlance: [
      { label: "Process", value: "12 steps" },
      { label: "Veneer moisture", value: "Below 8% before pressing" },
      { label: "Hot press", value: "130°C" },
      { label: "Quality testing", value: "8-point, every batch" },
    ],
    takeaways: [
      "Uniform adhesive distribution is what prevents dry spots — the nucleation points most delamination starts from.",
      "Veneers are dried below 8% moisture before pressing, because trapped moisture turns to steam under a hot press.",
      "Every production batch is put through eight-point testing before it leaves the plant.",
    ],
    // Q109 calibrated · Q110 GLP · Q111 QuadPro · Q132 drying · Q137 pre-lam vs site-lam ·
    // Q138 Neowud heat-forming · Q142 pressing · Q145 8-point testing · Q146 termite · Q147 antifungal
    faqNumbers: [109, 110, 111, 132, 137, 138, 142, 145, 146, 147],
    relatedProducts: [
      "saburi-titanium-plus",
      "saburi-perennial",
      "saburi-neowud",
      "saburi-hydramax-board",
    ],
    seo: {
      title: "How Plywood Is Made: QuadPro, Bonding, Drying & Testing | Saburi Ply",
      description:
        "Inside Saburi plywood manufacturing — QuadPro bonding, GLP, calibration, drying, pressing, termite/antifungal treatment and eight-point quality testing.",
      canonical: "/plywood-guide/manufacturing-process",
    },
  },

  // ── Cluster: Material properties ────────────────────────────────────────
  {
    slug: "material-properties",
    path: "/plywood-guide/material-properties",
    kind: "cluster",
    eyebrow: "Plywood Guide",
    h1: "What Determines Plywood Quality: Timber, Density, Strength & Thickness",
    heroSubhead: "The material factors that decide how plywood performs and lasts.",
    introHtml:
      "<p>Two sheets can look identical and perform nothing alike — the difference is in the material. This covers what actually determines plywood quality: core timber and density, screw-holding and load-bearing, thickness and warp resistance, and how the board types (plywood, chipboard, MDF, flush doors) really compare.</p>",
    atAGlance: [
      { label: "Gurjan core density", value: "825 kg/m³" },
      { label: "Standard sheet", value: "8ft × 4ft" },
      { label: "Large format", value: "10ft × 4ft" },
      { label: "Most-used thickness", value: "18mm" },
    ],
    compareTable: {
      heading: "Thickness by application",
      columns: ["Thickness", "Typical use"],
      rows: [
        ["4–6mm", "Backing panels"],
        ["9mm", "Drawer sides"],
        ["12mm", "Shelving and cabinet backs"],
        ["18mm", "Furniture shutters and carcases"],
        ["19mm", "Block board applications"],
        ["25mm", "Heavy-load structural work"],
      ],
      highlightRow: 3,
    },
    takeaways: [
      "Core timber species sets the ceiling: Gurjan at 825 kg/m³ gives the density that strength and biological resistance follow from.",
      "Warping is a construction problem, not a weather problem — balanced veneers and dual-face calibration are what prevent it.",
      "Choose thickness by the load it carries, not by the budget: 18mm is the working default for shutters and carcases.",
    ],
    // Q117 density · Q119 sheet size · Q120 Modwud vs MDF · Q121 warping · Q124 timber species ·
    // Q125 chip-weave · Q126 screw-holding · Q130 structural vs decorative · Q133 load-bearing ·
    // Q134 solid vs hollow core · Q135 thickness · Q141 density & durability
    faqNumbers: [117, 119, 120, 121, 124, 125, 126, 130, 133, 134, 135, 141],
    relatedProducts: [
      "saburi-titanium-plus",
      "saburi-perennial",
      "saburi-club-h-plus",
      "saburi-modwud-plain",
      "saburi-hydramax-board",
      "flush-door-india",
    ],
    seo: {
      title: "What Determines Plywood Quality: Timber, Density, Strength | Saburi Ply",
      description:
        "What makes plywood good — core timber and density, screw-holding, load-bearing, thickness, warp resistance, and plywood vs chipboard vs MDF.",
      canonical: "/plywood-guide/material-properties",
    },
  },

  // ═══ BUYING GUIDE (Purchase section, Q148–197) ═══════════════════════════
  // ── Pillar ──────────────────────────────────────────────────────────────
  {
    slug: "buying-guide",
    path: "/plywood-buying-guide",
    kind: "pillar",
    eyebrow: "Buying Guide",
    h1: "The Saburi Plywood Buying Guide",
    heroSubhead:
      "How to buy plywood with confidence — what to use in every room, how much you need, what it costs, and how to spot the real thing.",
    introHtml:
      "<p>Buying plywood is easy to get wrong — the wrong grade in a wet area, a fake passed off as branded, or paying for more than you need. This guide covers it all: which Saburi product fits each room and project, how much plywood a job takes, what it should cost, and how to verify you're getting genuine, certified material.</p>",
    faqNumbers: [],
    relatedProducts: [],
    clusters: [
      "how-to-buy",
      "pricing-and-warranty",
      "how-much-plywood",
      "which-plywood-home",
      "which-plywood-project",
    ],
    seo: {
      title: "Plywood Buying Guide: What to Buy, How Much & What It Costs | Saburi Ply",
      description:
        "How to buy the right plywood — the best Saburi product for each room and project, how much you need, price guides, warranty, and how to spot genuine plywood.",
      canonical: "/plywood-buying-guide",
    },
  },

  // ── Cluster: How to buy ─────────────────────────────────────────────────
  {
    slug: "how-to-buy",
    path: "/plywood-buying-guide/how-to-buy",
    kind: "cluster",
    eyebrow: "Buying Guide",
    h1: "How to Buy Plywood: Spot Genuine, Verify & Compare",
    heroSubhead: "Where to buy, how to check it's genuine, and what to ask your dealer.",
    introHtml:
      "<p>The difference between a good plywood purchase and an expensive mistake is knowing what to check. Here's how to buy Saburi plywood the right way — where to get it, how to confirm it's genuine and BIS-certified, what documents to ask for, and how to compare honestly against other brands.</p>",
    atAGlance: [
      { label: "Buy through", value: "Authorised dealers" },
      { label: "Verify at", value: "bis.gov.in (CM/L no.)" },
      { label: "BWP glue line", value: "Dark brown" },
      { label: "Always keep", value: "Invoice + warranty card" },
    ],
    takeaways: [
      "Check the ISI mark and CM/L number on the panel itself, then verify it on bis.gov.in from your phone at the counter.",
      "Look at the cut edge: dark brown glue lines confirm the PF resin that makes a panel BWP.",
      "A warranty claim needs paperwork — ask for the invoice, the CM/L number and the warranty card before you leave.",
    ],
    faqNumbers: [148, 153, 158, 159, 160, 161, 174, 177, 190, 197],
    relatedProducts: ["marine-plywood-india", "saburi-scout-plywood", "saburi-titanium-plus"],
    seo: {
      title: "How to Buy Genuine Plywood: Verify BIS, Compare & What to Ask | Saburi Ply",
      description:
        "Where to buy Saburi plywood, how to tell if it's genuine, what documents and CM/L number to request, and how to compare plywood brands at the dealer.",
      canonical: "/plywood-buying-guide/how-to-buy",
    },
  },

  // ── Cluster: Pricing & warranty ─────────────────────────────────────────
  {
    slug: "pricing-and-warranty",
    path: "/plywood-buying-guide/pricing-and-warranty",
    kind: "cluster",
    eyebrow: "Buying Guide",
    h1: "Plywood Price & Warranty: What Saburi Costs and Covers",
    heroSubhead: "Indicative pricing by grade and how Saburi's warranties work.",
    introHtml:
      "<p>What should plywood cost, and what does the warranty actually protect? Here's an honest look at Saburi pricing — premium vs standard, plywood vs WPC, and versus other brands — plus how warranty claims work across products from Gold 710 to Modwud and the WPC doors.</p>",
    atAGlance: [
      { label: "Gold 710, 18mm 8×4", value: "₹1,600–1,900 / sheet" },
      { label: "Premium vs Scout", value: "+40–60%" },
      { label: "WPC vs plywood", value: "+10–20%" },
      { label: "Claims through", value: "Your authorised dealer" },
    ],
    compareTable: {
      heading: "Warranty by product",
      columns: ["Product", "Manufacturer warranty"],
      rows: [
        ["Saburi Smart WPC Doors", "Lifetime"],
        ["Saburi Gold 710", "30 years"],
        ["Saburi Flush Doors", "21 years"],
        ["Saburi Modwud Hydramax", "15 years"],
      ],
    },
    takeaways: [
      "Prices move with timber and resin costs and vary by region — treat any figure here as indicative and confirm with your dealer.",
      "The premium between grades is real but modest: Gold 710 sits roughly 20–25% above Scout BWP.",
      "Warranty is processed through the authorised dealer, and every claim starts with the original invoice and photographs of the defect.",
    ],
    faqNumbers: [149, 150, 156, 157, 162, 165, 195, 196],
    relatedProducts: [
      "marine-plywood-india",
      "saburi-scout-plywood",
      "saburi-hydramax-board",
      "saburi-smart-wpc-door-frame",
    ],
    seo: {
      title: "Plywood Price & Warranty in India: Saburi Ply Cost & Coverage | Saburi Ply",
      description:
        "Indicative Saburi plywood prices by grade, premium vs standard and vs competitors, and how warranty claims work on Gold 710, Modwud Hydramax, flush doors and WPC doors.",
      canonical: "/plywood-buying-guide/pricing-and-warranty",
    },
  },

  // ── Cluster: How much plywood (estimators) ──────────────────────────────
  {
    slug: "how-much-plywood",
    path: "/plywood-buying-guide/how-much-plywood",
    kind: "cluster",
    eyebrow: "Buying Guide",
    h1: "How Much Plywood Do You Need? Kitchen, Wardrobe & 3BHK Estimates",
    heroSubhead: "Ballpark sheet counts for common projects — and how to spec thickness.",
    introHtml:
      "<p>Buying too little means a second trip; too much wastes money. These are realistic sheet-count estimates for the most common jobs — a modular kitchen, a wardrobe, a whole 3BHK — plus how to pick the right thickness for each application. Treat them as planning guides; your carpenter's cutting list is the final word.</p>",
    atAGlance: [
      { label: "Modular kitchen", value: "30–45 sheets, 18mm" },
      { label: "Wardrobe, 8ft × 8ft", value: "20–30 sheets, 18mm" },
      { label: "Full 3BHK", value: "200–300 sheets" },
      { label: "Add for wastage", value: "10–15%" },
    ],
    compareTable: {
      heading: "Sheet estimates by project",
      columns: ["Project", "18mm plywood", "Chipboard carcase"],
      rowNotes: { 3: "whole-home total, all panel types" },
      rows: [
        ["Modular kitchen", "30–45 sheets", "20–30 sheets"],
        ["Wardrobe, 8ft × 8ft", "20–30 sheets", "10–15 sheets"],
        ["Wardrobe, 6ft", "15–20 sheets", "8–12 sheets"],
        ["3BHK, 1,200–1,500 sq ft", "200–300 sheets", "included"],
      ],
    },
    takeaways: [
      "Add 10–15% for wastage on every estimate — cutting losses are real and a second trip costs more than the extra sheet.",
      "Shutters and carcases are counted separately: 18mm plywood for shutters, chipboard for the boxes behind them.",
      "These are planning figures. Your carpenter's cutting list, measured on site, is the final word.",
    ],
    faqNumbers: [155, 163, 169, 183],
    relatedProducts: ["marine-plywood-india", "saburi-scout-plywood", "saburi-hydramax-board"],
    seo: {
      title: "How Much Plywood Do I Need? Kitchen, Wardrobe & 3BHK Estimates | Saburi Ply",
      description:
        "Realistic plywood sheet estimates for a modular kitchen, a wardrobe and a full 3BHK, plus how to choose the right plywood thickness by application.",
      canonical: "/plywood-buying-guide/how-much-plywood",
    },
  },

  // ── Cluster: Which plywood for your home ────────────────────────────────
  {
    slug: "which-plywood-home",
    path: "/plywood-buying-guide/which-plywood-home",
    kind: "cluster",
    eyebrow: "Buying Guide",
    h1: "Which Plywood for Which Room: Kitchen, Wardrobe, Bathroom & More",
    heroSubhead: "The right Saburi product for every part of your home.",
    introHtml:
      "<p>Different rooms demand different plywood — a kitchen carcase faces steam, a bathroom vanity faces water, a bookshelf faces load. Here's the recommended Saburi specification for the most common home applications, from kitchens and wardrobes to TV units, staircases, pooja rooms, balconies and coastal homes.</p>",
    atAGlance: [
      { label: "Kitchen shutters", value: "Club H+ or Gold 710" },
      { label: "Kitchen carcase", value: "Modwud Hydramax" },
      { label: "Bathroom doors", value: "Smart WPC Doors" },
      { label: "Coastal homes", value: "Perennial" },
    ],
    compareTable: {
      heading: "Room by room",
      columns: ["Where", "What to specify"],
      rows: [
        ["Kitchen shutters", "Club H+ (premium) or Gold 710"],
        ["Kitchen carcase", "Modwud Hydramax"],
        ["Wardrobe shutters", "Club H+ or Scout BWP"],
        ["Bathroom & wet-area doors", "Smart WPC Doors"],
        ["Bathroom vanity carcase", "Endura WPC Ace/Pro, or Modwud Hydramax"],
        ["TV unit & living room", "Club H+ or Scout BWP"],
        ["Balcony or terrace", "Endura WPC Pro"],
        ["Coastal homes", "Perennial, or Gold 710 for standard furniture"],
      ],
    },
    takeaways: [
      "Shutters and carcases take different panels — plywood on the outside, chipboard behind it.",
      "Anything in a direct water-splash zone should stop being timber: WPC is the specification for wet areas.",
      "Coastal air is a materials problem as much as water is — vacuum-impregnated Perennial is the answer there.",
    ],
    // + recovered Product use-cases with no buying-guide twin: Q84 outdoor furniture, Q89 living room
    faqNumbers: [
      151, 152, 164, 168, 170, 171, 172, 173, 175, 176, 178, 179, 182, 184, 185, 186, 192, 193, 194,
      84, 89,
    ],
    relatedProducts: [
      "marine-plywood-india",
      "saburi-club-h-plus",
      "saburi-scout-plywood",
      "saburi-hydramax-board",
      "saburi-smart-wpc-door-frame",
      "fire-retardant-india",
      "saburi-perennial",
    ],
    seo: {
      title: "Which Plywood for Which Room: Kitchen, Wardrobe, Bathroom | Saburi Ply",
      description:
        "The best Saburi plywood for each home application — kitchens, wardrobes, bathrooms, TV units, staircases, pooja rooms, bookshelves, balconies and coastal homes.",
      canonical: "/plywood-buying-guide/which-plywood-home",
    },
  },

  // ── Cluster: Which plywood for projects ─────────────────────────────────
  {
    slug: "which-plywood-project",
    path: "/plywood-buying-guide/which-plywood-project",
    kind: "cluster",
    eyebrow: "Buying Guide",
    h1: "Plywood for Commercial & Institutional Projects: Specs That Protect You",
    heroSubhead: "What to specify for offices, hospitals, schools, hotels and government work.",
    introHtml:
      "<p>Project specification is about accountability — the right grade, the right certification, and warranty that protects contractor and client. Here's what Saburi recommends for commercial and institutional projects: offices, hospitals, schools, luxury villas, showrooms, and government/GeM procurement, plus how contractors specify to avoid callbacks.</p>",
    atAGlance: [
      { label: "Hospitals & schools", value: "FR Ply — IS:5509" },
      { label: "Government / GeM", value: "BIS-certified lines" },
      { label: "Offices & showrooms", value: "Club H+ (E0)" },
      { label: "Green building", value: "Neowud NRFC, Club H+" },
    ],
    compareTable: {
      heading: "Specification by project type",
      columns: ["Project", "Lead specification"],
      rows: [
        ["Hospital", "FR Ply (IS:5509, 120-min) for ceilings and partitions"],
        ["School or college", "FR Ply — 120-min assembly halls, 60-min classrooms (NBC 2016)"],
        ["Commercial office", "Club H+ for client-facing work, Scout BWP for standard furniture"],
        ["Hotel or resort", "Titanium Plus, Perennial on the coast, FR Ply 60-min minimum"],
        ["Luxury villa", "Titanium Plus or Perennial, Smart WPC Doors, Gold Flexi for curves"],
        ["Government / GeM", "IS:710, IS:5509, IS:2202, IS:4990 certified lines"],
        ["Green building / LEED", "Neowud NRFC, Club H+ (E0, FSC timber)"],
      ],
    },
    takeaways: [
      "In regulated buildings the fire rating leads the specification — everything else is chosen around it.",
      "For public procurement, the BIS certificate is the specification: IS:710, IS:5509, IS:2202 and IS:4990 are the codes that clear GeM.",
      "Contractors avoid callbacks by over-specifying the wet areas: IS:710 shutters, Hydramax carcases, WPC doors.",
    ],
    // + recovered Product use-cases: Q70 hotel/resort, Q71 green building, Q81 partitions, Q99 lobby
    faqNumbers: [154, 166, 167, 180, 181, 187, 188, 189, 191, 70, 71, 81, 99],
    relatedProducts: [
      "saburi-titanium-plus",
      "saburi-perennial",
      "fire-retardant-india",
      "marine-plywood-india",
      "saburi-club-h-plus",
    ],
    seo: {
      title: "Plywood for Commercial & Institutional Projects: Specs & Compliance | Saburi Ply",
      description:
        "Saburi plywood specifications for offices, hospitals, schools, hotels, villas and government/GeM projects, and how contractors specify to avoid callbacks.",
      canonical: "/plywood-buying-guide/which-plywood-project",
    },
  },
];

// ═══ COMPANY FAQs (Q1–50) → existing /about pages ════════════════════════════
/**
 * Company FAQs injected into the bespoke /about pages via <FaqSection> (not the GuideTemplate
 * hub pattern). One home per FAQ, enforced by assertPlacementIntegrity. Product-overview Company
 * FAQs (Shine, Neowud, Modwud, Gurjan, etc.) sit on the main /about page. Keyed by route path.
 * DRAFT grouping — pending Vasudha/founder sign-off.
 */
export const ABOUT_FAQS: Record<string, number[]> = {
  "/about": [
    1, 2, 15, 16, 17, 18, 21, 22, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42,
    43, 44, 45, 46, 48, 50,
  ],
  "/about/accreditation": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 47],
  "/about/national-presence": [3, 4, 35, 36, 49],
  "/about/environment-stewardship": [19, 20, 28],
};

// ═══ PRODUCT FAQs (Q51–100) → existing product pages ═════════════════════════
/**
 * Reconciled Product FAQs (Bucket A: the "What is [Product]?" intros + product-specific
 * comparison/warranty/thickness Qs), merged into each product's `faqs[]` by ProductTemplate.
 * PARTIAL coverage by design — the use-case Qs (Q68–100) were skipped as duplicates of the
 * /plywood-buying-guide clusters, and Q57/64/66 as duplicates of live FAQs. Dropped 2026-07-27 (no
 * natural home, low value): Q58 (Definite), Q67 (10ft×4ft), Q92 (customised size). Keyed by product slug.
 */
export const PRODUCT_FAQS: Record<string, number[]> = {
  "saburi-titanium-plus": [51],
  "saburi-perennial": [52, 75],
  "saburi-club-h-plus": [53],
  "fire-retardant-india": [54],
  "marine-plywood-india": [55, 76, 98],
  "saburi-scout-plywood": [56],
  "flush-door-india": [59],
  "saburi-smart-wpc-door-frame": [60],
  "saburi-smart-panel-wpc-board": [61, 87],
  "saburi-smart-panel-pvc-board": [62, 91],
  "saburi-neowud": [63, 86],
  "saburi-hydramax-board": [65, 88],
  "flexi-plywood-india": [90],
};

/**
 * Short labels for each guide path segment — the single source used by both the breadcrumb schema
 * (GuideTemplate) and the Navbar "Guides" mega-menu. Keyed by the last path segment.
 */
export const GUIDE_LABELS: Record<string, string> = {
  "plywood-guide": "Plywood Guide",
  "is-standards": "IS Standards",
  "waterproof-grades": "Water-Resistance Grades",
  "fire-safety": "Fire Safety",
  "emissions-safety": "Emissions & Green",
  "manufacturing-process": "How It's Made",
  "material-properties": "Material Properties",
  "plywood-buying-guide": "Buying Guide",
  "how-to-buy": "How to Buy",
  "pricing-and-warranty": "Price & Warranty",
  "how-much-plywood": "How Much Plywood",
  "which-plywood-home": "For Your Home",
  "which-plywood-project": "For Projects",
};
