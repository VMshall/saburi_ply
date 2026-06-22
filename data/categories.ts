import type { Category, Product } from "./types";
import { products } from "./products";

/**
 * Category / hub landing pages (e.g. /plywood): the page whose entire job is to rank for the
 * category head term and act as the internal-link hub for its products. Content is authored here
 * so the route stays a thin, data-driven template (mirrors data/products.ts + data/locations.ts).
 * Product membership is derived at render time by filtering `products` on `productCategory`, so
 * the range grid + ItemList JSON-LD can never drift from the catalogue.
 *
 * Intent guard: the homepage owns "best plywood manufacturer and supplier in India". This hub is
 * deliberately pitched at a DIFFERENT intent (types / grades / price / full range) so the two
 * pages don't cannibalise each other.
 */
export const categories: Category[] = [
  {
    slug: "plywood",
    name: "Plywood",
    pageHeaderTitle: "Plywood",
    bannerImage: {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread1.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread1.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread1.webp",
    },
    h1: "Plywood, Engineered for Every Project",
    heroEyebrow: "Saburi Plywood",
    heroSubhead:
      "Compare every grade, from boiling-waterproof marine ply to fire-retardant and structural boards. IS-certified, made in Kolkata, trusted across India.",
    heroStats: [
      { value: "9", label: "plywood grades" },
      { value: "5", label: "IS standards" },
      { value: "Lifetime", label: "warranty" },
      { value: "72-hr", label: "boiling waterproof" },
    ],
    introHtml:
      "<p>Plywood is an engineered wood panel made by gluing thin layers (plies) of veneer together, with each layer's grain rotated for strength and dimensional stability. The grade you need depends on where it goes: a kitchen or bathroom calls for a <strong>boiling-waterproof (BWP) marine grade</strong>, everyday furniture is well served by a <strong>moisture-resistant (MR/BWR) grade</strong>, and concrete formwork needs dense <strong>shuttering plywood</strong>.</p>" +
      "<p>Saburi Ply manufactures its plywood in Kolkata through the <strong>QuadPro process</strong>, using select hardwood veneers that are pressure-impregnated with preservatives, <strong>E0 emission-grade</strong>, termite and borer proof, and antifungal treated. The range is certified to the relevant Indian Standards (IS 710 marine, IS 303 commercial, IS 10701 structural, IS 5509 fire-retardant and IS 4990 shuttering), and select grades carry warranties from 30 years up to a lifetime money-back guarantee.</p>" +
      "<p>Use the grade comparison, buying guide and price guide below to find the right Saburi plywood for your project, whether that is a modular kitchen, a wardrobe, a fire-safe commercial fit-out or heavy structural work.</p>",
    productCategory: "plywood",
    rangeHeading: "Saburi Plywood Range",
    rangeSubtitle:
      "Nine plywood grades engineered for every application. Tap any product for full specifications, features and FAQs.",
    grades: [
      {
        grade: "Marine / BWP",
        isCode: "IS 710",
        waterResistance: "Boiling waterproof (72 hrs)",
        bestFor: "Kitchens, bathrooms, outdoors, boats",
        products: [{ name: "Saburi Gold", slug: "marine-plywood-india" }],
      },
      {
        grade: "Structural BWP",
        isCode: "IS 10701",
        waterResistance: "Boiling waterproof",
        bestFor: "Load-bearing structures, premium furniture",
        products: [
          { name: "Saburi Perennial", slug: "saburi-perennial" },
          { name: "Titanium Plus", slug: "saburi-titanium-plus" },
          { name: "Club H+", slug: "saburi-club-h-plus" },
        ],
      },
      {
        grade: "Commercial MR / BWR",
        isCode: "IS 303",
        waterResistance: "Moisture resistant",
        bestFor: "Interior furniture, wardrobes, cabinets",
        products: [{ name: "Saburi Scout", slug: "saburi-scout-plywood" }],
      },
      {
        grade: "Fire Retardant",
        isCode: "IS 5509",
        waterResistance: "Moisture resistant + FR",
        bestFor: "Commercial kitchens, theatres, public spaces",
        products: [{ name: "Saburi FR", slug: "fire-retardant-india" }],
      },
      {
        grade: "Shuttering / Formwork",
        isCode: "IS 4990",
        waterResistance: "Boiling waterproof",
        bestFor: "Concrete formwork, construction reuse",
        products: [{ name: "Saburi Shine Platinum", slug: "shuttering-plywood-india" }],
      },
      {
        grade: "Flexible",
        isCode: "Flexi",
        waterResistance: "Interior",
        bestFor: "Curved & rounded designs, arches",
        products: [{ name: "Saburi Gold Flexi", slug: "flexi-plywood-india" }],
      },
      {
        grade: "Eco Composite",
        isCode: "NRFC",
        waterResistance: "100% waterproof",
        bestFor: "Eco interiors, modular kitchens, exterior",
        products: [{ name: "Saburi Neowud", slug: "saburi-neowud" }],
      },
    ],
    useCases: [
      {
        iconKey: "droplets",
        title: "Modular Kitchen",
        description: "Steam and water spills call for a boiling-waterproof marine grade.",
        href: "/products/marine-plywood-india",
      },
      {
        iconKey: "armchair",
        title: "Wardrobes & Furniture",
        description: "Cost-effective MR/BWR plywood for dry interior furniture.",
        href: "/products/saburi-scout-plywood",
      },
      {
        iconKey: "shield",
        title: "Structural & Load-Bearing",
        description: "High-density BWP structural ply for strength and stability.",
        href: "/products/saburi-perennial",
      },
      {
        iconKey: "flame",
        title: "Fire-Safe Interiors",
        description: "IS 5509 fire-retardant ply for public and commercial spaces.",
        href: "/products/fire-retardant-india",
      },
      {
        iconKey: "grid-2x2",
        title: "Construction & Formwork",
        description: "Reusable mirror-finish shuttering ply for concrete casting.",
        href: "/products/shuttering-plywood-india",
      },
      {
        iconKey: "bend",
        title: "Curved & Custom Designs",
        description: "Flexible ply that cold-forms to tight radii without cracking.",
        href: "/products/flexi-plywood-india",
      },
    ],
    priceGuide: [
      {
        grade: "Commercial MR / BWR (IS 303)",
        range: "₹45-80 / sq ft",
        note: "Interior furniture, wardrobes",
      },
      {
        grade: "Structural BWP (IS 10701)",
        range: "₹85-150 / sq ft",
        note: "Load-bearing & premium furniture",
      },
      {
        grade: "Marine / BWP (IS 710)",
        range: "₹90-160 / sq ft",
        note: "Kitchens, bathrooms, outdoor",
      },
      {
        grade: "Fire Retardant (IS 5509)",
        range: "₹110-180 / sq ft",
        note: "Safety-critical & public spaces",
      },
      {
        grade: "Shuttering (IS 4990)",
        range: "Priced per board (30-51 kg)",
        note: "By thickness & weight",
      },
    ],
    priceNote:
      "Indicative market ranges for branded plywood in India (2026). Actual Saburi pricing depends on grade, thickness, sheet size and order volume, so treat these as a guide, not a quote.",
    usps: [
      {
        iconKey: "gr-multiple",
        title: "QuadPro Process",
        description:
          "A four-stage manufacturing process for uniform density, strength and a smooth, laminate-ready finish.",
      },
      {
        iconKey: "droplets",
        title: "Boiling Waterproof",
        description:
          "BWP-grade phenolic bonding withstands 72 hours in boiling water without delamination.",
      },
      {
        iconKey: "leaf",
        title: "E0 Emission-Grade",
        description: "Low-formaldehyde panels engineered for healthier indoor air.",
      },
      {
        iconKey: "bug",
        title: "Termite & Borer Proof",
        description:
          "Vacuum pressure-impregnated preservatives plus antifungal treatment on every panel.",
      },
      {
        iconKey: "flame",
        title: "Fire-Retardant Options",
        description: "IS 5509 FR grade with slow burning, longer flame-penetration time and low smoke.",
      },
      {
        iconKey: "award",
        title: "IS-Certified Range",
        description: "Certified to IS 710, 303, 10701, 5509 and 4990 across the plywood range.",
      },
      {
        iconKey: "lifebar",
        title: "Up to Lifetime Warranty",
        description:
          "From a 30-year warranty on Saburi Gold to lifetime money-back guarantees on structural grades.",
      },
      {
        iconKey: "pine-tree",
        title: "Made in Bengal",
        description: "Manufactured in Kolkata and trusted by builders and fabricators across India.",
      },
    ],
    faqs: [
      {
        question: "What are the different types of plywood?",
        answerHtml:
          "The main types are marine/BWP plywood (IS 710) for wet areas, commercial MR/BWR plywood (IS 303) for dry interior furniture, structural BWP plywood (IS 10701) for load-bearing use, fire-retardant plywood (IS 5509), and shuttering plywood (IS 4990) for concrete formwork, plus specialist grades such as flexible plywood and eco composites. Saburi manufactures all of these; see the grade comparison above.",
      },
      {
        question: "Which plywood is best for a modular kitchen?",
        answerHtml:
          "For kitchens, choose a boiling-waterproof marine grade such as <strong>Saburi Gold (IS 710)</strong> or the waterproof eco-composite <strong>Saburi Neowud</strong>. Both resist steam, water spills and swelling far better than ordinary MR plywood.",
      },
      {
        question: "What is the difference between MR, BWR and BWP plywood?",
        answerHtml:
          "MR (Moisture Resistant) plywood suits dry interiors; BWR (Boiling Water Resistant) handles occasional dampness; BWP (Boiling Water Proof / marine, IS 710) survives prolonged water exposure and boiling-water tests. The wetter the application, the higher the grade you need.",
      },
      {
        question: "Is Saburi plywood waterproof?",
        answerHtml:
          "Saburi's BWP grades, such as Saburi Gold (IS 710) and the structural IS 10701 range, are boiling waterproof and withstand 72 hours in boiling water without delamination. MR/BWR grades such as Saburi Scout are moisture-resistant rather than fully waterproof.",
      },
      {
        question: "Is Saburi plywood termite-proof?",
        answerHtml:
          "Yes. Every Saburi plywood panel is pressure-impregnated with preservatives and antifungal treated, making it resistant to termites and borers.",
      },
      {
        question: "What plywood thickness should I use?",
        answerHtml:
          "Saburi plywood is available from 4mm to 25mm. As a guide: 4-6mm for backing and panelling, 12mm for shelves and partitions, 16-19mm for wardrobes and cabinets, and 19-25mm for doors, load-bearing furniture and heavy-duty use.",
      },
      {
        question: "What is the price of plywood in India?",
        answerHtml:
          "Branded plywood typically ranges from about ₹45/sq ft for commercial MR grade to ₹150+/sq ft for premium BWP marine grade, depending on grade, thickness and brand. See the price guide above, and request a quote for exact Saburi pricing.",
      },
      {
        question: "Which plywood is best for furniture?",
        answerHtml:
          "For everyday interior furniture, <strong>Saburi Scout (IS 303)</strong> offers excellent value; for premium or load-bearing furniture, choose a structural BWP grade such as <strong>Saburi Perennial</strong> or <strong>Titanium Plus</strong>.",
      },
      {
        question: "Does Saburi plywood come with a warranty?",
        answerHtml:
          "Yes. Warranties range from a 30-year warranty on Saburi Gold to lifetime money-back guarantees on the structural BWP grades.",
      },
      {
        question: "Where can I buy Saburi plywood?",
        answerHtml:
          "Saburi Ply is headquartered in Kolkata and supplies across India, including Andhra Pradesh, Kerala, Tamil Nadu, Telangana and Bangalore. See the 'Where to buy' section above or contact us for your nearest dealer.",
      },
    ],
    seo: {
      title: "Plywood: Types, Grades & Price in India | Saburi Ply",
      description:
        "Compare plywood types and grades (marine/BWP, MR, BWR, structural, fire-retardant and shuttering) with Saburi's full IS-certified range, plus a buying guide and indicative plywood prices in India.",
      keywords:
        "plywood, types of plywood, plywood grades, plywood price in india, bwp plywood, marine plywood, mr grade plywood, best plywood, plywood manufacturer india",
      canonical: "/plywood",
      ogImage: "/images/plywoodRange/Plywood.webp",
    },
  },
];

const bySlug = new Map<string, Category>(categories.map((c) => [c.slug, c]));

/** Accessor (single CMS-swap point). Returns undefined for an unknown slug. */
export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

/** Products that belong to a category, derived from the catalogue (never drifts). */
export function getCategoryProducts(category: Category): Product[] {
  return products.filter((p) => p.category === category.productCategory);
}

/** Ordered category slugs (drives the sitemap/nav in later phases). */
export const categorySlugs: string[] = categories.map((c) => c.slug);
