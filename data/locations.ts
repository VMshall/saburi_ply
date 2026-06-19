import type { Location } from "./types";

/**
 * The 5 state/city location landing pages (§8). Body content (name/heading/pageHeaderTitle/
 * intro prose/images/areaServed) extracted verbatim from the legacy
 * client/pages/SaburiBestPlywood*.jsx pages — note these pages render ONLY the intro prose
 * block (their tabs/badges/FAQ are commented out).
 *
 * SEO is AUTHORED here (§0.2/§6): metaConfig.js has NO entries for these routes, so the live
 * pages currently inherit the homepage meta — a pre-existing bug. These entries fix it with
 * first-class "best plywood in <place>" titles/descriptions/keywords. `areaServed` feeds the
 * `areaServed` property of the LocalBusiness JSON-LD on these pages (P3).
 *
 * Faithfully preserved source quirks: the Kerala page's PageHeader title is the misspelled
 * "Best Plywood Kerela"; the Tamil Nadu page's image is "Bangalore 1.webp".
 */
export const locations: Location[] = [
  {
    slug: "best-plywood-andhra-pradesh",
    name: "Discover the Best Plywood Manufacturer and Supplier in AP",
    heading: "Plywood Manufacturer & Supplier Andhra Pradesh",
    pageHeaderTitle: "Best Plywood Andhra Pradesh",
    state: "Andhra Pradesh",
    areaServed: ["Andhra Pradesh", "Visakhapatnam"],
    seo: {
      title: "Best Plywood Manufacturer and Supplier in Andhra Pradesh | Saburi Ply",
      description:
        "Saburi Ply is a leading plywood manufacturer and supplier in Andhra Pradesh, delivering durable, eco-friendly, premium-grade plywood for construction, furniture, and interiors across Visakhapatnam and beyond.",
      keywords: "best plywood in andhra pradesh, plywood manufacturer andhra pradesh, plywood suppliers visakhapatnam, plywood brands andhra pradesh, plywood price andhra pradesh",
      canonical: "/best-plywood-andhra-pradesh",
    },
    introHtml:
      "<p>Do you need luxury plywood solutions? Saburi Ply is the best plywood manufacturer and supplier in AP of high-end plywood. Entering the market with a specialization in high-quality plywood, we have quality products to meet the vast complexities of various construction, furniture, and interior designing industries.</p><p>We are one of the best plywood brands in Andhra Pradesh and assure to provide long- lasting, eco-friendly, and cost-effective plywood. We exhibit a diligent approach to our products to ensure they are designed in line with the high standards of the industry. Thus we distinguish ourselves as one of the unique plywood suppliers in Andhra Pradesh, as we provide tailored solutions for contractors, architects, and individual home owners alike.</p><p>You might have been lucky if you're looking for plywood in Visakhapatnam. We are one of the main plywood manufacturers in Visakhapatnam offering excellent plywood solutions in the region. Our credentials are based on the quality and customer satisfaction quotient that makes us one among the best plywood brands in Visakhapatnam.</p><p>Get Saburi Ply for a cost- effective plywood price in Andhra Pradesh and find one of the best plywood companies in Andhra Pradesh. Call us today for all your plywood needs!</p><p><strong>Best Plywood Brands in Andhra Pradesh – Your Trusted Partner</strong></p><ul><li>● Reputable plywood manufacturers in Andhra Pradesh provide high-quality plywood ideal for construction, furniture, and interior applications.</li><li>● Known for leading plywood suppliers in Visakhapatnam, we ensure all our products are sustainable and long-lasting.</li><li>● With attractive pricing and consistent on-time delivery, we have established ourselves as the go-to plywood suppliers in Andhra Pradesh.</li></ul>",
    images: [{ src: "/images/south-region-plywoods/Andhra Pradesh.webp", alt: "Saburi Best Plywood AP board full view" }],
  },
  {
    slug: "best-plywood-kerala",
    name: "The Best Plywood Manufacturer and Supplier in Kerala",
    heading: "Plywood Manufacturer & Supplier Kerala",
    pageHeaderTitle: "Best Plywood Kerela",
    state: "Kerala",
    areaServed: ["Kerala", "Kochi"],
    seo: {
      title: "Best Plywood Manufacturer and Supplier in Kerala | Saburi Ply",
      description:
        "Saburi Ply is among the best plywood brands in Kerala, offering durable premium-grade and marine-grade plywood for construction, furniture, and interiors across Kochi and the state.",
      keywords: "best plywood in kerala, plywood manufacturer kerala, plywood suppliers kerala, plywood brands kochi, plywood price kerala",
      canonical: "/best-plywood-kerala",
    },
    introHtml:
      "<p>As the best plywood manufacturer and supplier in Kerala, Saburi Ply provides durable premium-grade plywood for all construction requirements. We are one of the best plywood brands in Kerala, we have an extensive product range meeting diverse specifications, ranging from interior plywood to marine-grade plywood.</p><p>Being one of the well-reckoned plywood suppliers in Kerala, we ensure that our products adhere to the top industry standards, offering unmatched strength and durability. Our commitment towards quality has made us one of the most sought-after plywood manufacturers in Kerala and one of the best plywood companies in Kerala.</p><p>We are one of the top Kerala plywood manufacturers and plywood suppliers in Kochi. We provide plywood at best plywood prices in Kerala without compromising quality, thus becoming one of the choices among the best plywood brands in Kochi.</p><p>Choose us for quality, reliability, and expert craftsmanship. We are the top choice in plywood solutions in Kerala today!</p><p>Known for eco-friendly plywood solutions, Saburi Ply is one of the best plywood manufacturer and supplier in Kerala. As one of the best plywood brands Kerala, we offer high-quality products for construction, furniture, and interiors at competitive prices. Trusted as reliable plywood suppliers in Kerala, we deliver exceptional service across the state, making us the first choice among the best plywood companies in Kerala.</p>",
    images: [{ src: "/images/south-region-plywoods/Kerala.webp", alt: "Saburi Best Plywood Kerela board full view" }],
  },
  {
    slug: "best-plywood-tamilnadu",
    name: "Top Quality Plywood in Tamil Nadu - Your Trusted Manufacturer and Supplier",
    heading: "Plywood Manufacturer & Supplier Tamil Nadu",
    pageHeaderTitle: "Best Plywood Tamil Nadu",
    state: "Tamil Nadu",
    areaServed: ["Tamil Nadu", "Chennai", "Coimbatore"],
    seo: {
      title: "Best Plywood Manufacturer and Supplier in Tamil Nadu | Saburi Ply",
      description:
        "Saburi Ply is a trusted plywood manufacturer and supplier in Tamil Nadu, providing durable, eco-friendly plywood for furniture, interiors, and construction across Chennai, Coimbatore, and beyond.",
      keywords: "best plywood in tamil nadu, plywood manufacturer chennai, plywood suppliers coimbatore, plywood brands tamil nadu, plywood price tamilnadu",
      canonical: "/best-plywood-tamilnadu",
    },
    introHtml:
      "<p>Seeking the best plywood manufacturer and supplier in Tamil Nadu? Saburi Ply proudly brings high-quality plywood to the market, with products catering to diverse needs across the region. Being one of the leading plywood brands in Chennai, we cater to a wide range of clients with products which assure durability, aesthetics, and eco-friendliness.</p><p>We are one of the leading plywood manufacturers in Chennai and one of the top-grade plywood manufacturers in TamilNadu. We provide various kinds and grades of plywood with competitive prices. We are focused on delivering perfect products for furniture, interiors, and construction projects to customers.</p><p>We ensure our products meet international standards, making us the choice of preference. Be it attaining one of the best plywood brands in Chennai to Coimbatore or lowest plywood price in TamilNadu, we deliver excellence right at your doorstep.</p><p>Find plywood products of different varieties available from renowned plywood manufacturers in TamilNadu, in the key cities of Chennai and Coimbatore. It's time to rely on us: Low price, Quality, and On-Time delivery. We are your prime choice for all your plywood requirements in Tamil Nadu, and you will see the difference in every - board.</p><p><strong>Best Plywood Brands in Chennai – Your Reliable Partner</strong></p><ul><li>● Esteemed plywood manufacturers in Chennai, Tamil Nadu supply superior plywood designed to meet the needs of construction, interior spaces, and furniture projects.</li><li>● Acknowledged as a top plywood supplier in Coimbatore, we guarantee that each product is both environmentally friendly and durable.</li><li>● With our attractive pricing and dependable on-time delivery, we have become the leading plywood supplier in Tamil Nadu.</li></ul>",
    images: [{ src: "/images/south-region-plywoods/Bangalore 1.webp", alt: "Saburi Best Plywood TamilNadu board full view" }],
  },
  {
    slug: "best-plywood-telangana",
    name: "The Best Plywood Manufacturer and Supplier in Telangana",
    heading: "Plywood Manufacturer & Supplier Telangana",
    pageHeaderTitle: "Best Plywood Telangana",
    state: "Telangana",
    areaServed: ["Telangana", "Hyderabad"],
    seo: {
      title: "Best Plywood Manufacturer and Supplier in Telangana | Saburi Ply",
      description:
        "Saburi Ply is among the best plywood manufacturers and suppliers in Telangana, delivering high-grade, durable plywood for construction and interiors across Hyderabad and the state.",
      keywords: "best plywood in telangana, plywood manufacturer hyderabad, plywood suppliers telangana, plywood brands telangana, plywood price telangana",
      canonical: "/best-plywood-telangana",
    },
    introHtml:
      "<p>Have you been seeking high-quality plywood in Telangana? Look no further! Saburi Ply is the best plywood manufacturer and supplier in Telangana and offers the finest plywood products to cater to your every construction and furnishing need. As one of the best plywood brands in Telangana, precision, durability, and quality drive our craft in order to ensure our plywood meets the highest standards in the industry.</p><p>We are one of the best plywood companies in Telangana and offer high-grade materials at very competitive prices. For Hyderabad, we stand tall as one of the best plywood manufacturers in Hyderabad and plywood suppliers in Telangana, committed to providing the best customer service as well as supply chains.</p><p>Whether it is a contractor, an interior designer, or a home owner, our affordable plywood price in Telangana ensures that you get unmatched value. Choose the best quality, trust of the brand and the best plywood suppliers in Hyderabad. Contact us now to find the perfect plywood solution for your projects!</p><p>Saburi Ply stands out as the best plywood manufacturer and supplier in Telangana, delivering premium products for all construction and interior requirements. Being the best plywood brands in Telangana, we promise high-quality solutions, reliable delivery, and affordable pricing.</p>",
    images: [{ src: "/images/south-region-plywoods/Telengana.webp", alt: "Saburi Best Plywood Telangana board full view" }],
  },
  {
    slug: "plywood-dealers-bangalore",
    name: "Discover the Best Plywood Manufacturer and Supplier in Bangalore",
    heading: "Plywood Manufacturer & Supplier Bangalore",
    pageHeaderTitle: "Best Plywood Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    areaServed: ["Bangalore"],
    seo: {
      title: "Best Plywood Dealers, Manufacturer and Supplier in Bangalore | Saburi Ply",
      description:
        "Saburi Ply is a trusted plywood manufacturer, supplier, and dealer in Bangalore, offering strong, premium-grade, eco-friendly plywood for interior and construction needs at competitive prices.",
      keywords: "plywood dealers bangalore, best plywood in bangalore, plywood manufacturer bangalore, plywood suppliers bangalore, plywood price bangalore",
      canonical: "/plywood-dealers-bangalore",
    },
    introHtml:
      "<p>Are you looking for plywood of good quality? Well, your search stops here. We are a trusted, best plywood manufacturer and supplier in Bangalore. We provide strong, premium-grade plywood delivered all over the city. We are available for all types of interior and construction needs and are ranked among the best plywood brands in Bangalore.</p><p>At our facility, strength, durability, and 100% calibration are provided with every sheet of plywood made. We are one of the leading plywood manufacturers in Bangalore and possess a state-of-the-art manufacturing process that guarantees quality is met according to requirements. We also possess a tremendous variety of products, which makes us one of the best plywood companies in Bangalore.</p><p>Whether it is a contractor, designer, or homeowner, our team provides to you competitive plywood prices in Bangalore suited for all your budgets, so that you achieve the best possible value. Quality, affordability, and excellent service have been some of the commitments that have earned the trust of several clients and made us one of the most preferred plywood suppliers in Bangalore.</p><p>We can be known for the best plywood and are ready to assist you today! Do not hesitate to contact us so you can learn more about our offer and its rates.</p><p>Recognized as one of the best plywood companies in Bangalore, Saburi Ply offers a range of top-quality plywood products at unbeatable prices. As the best plywood manufacturer and supplier in Bangalore, we specialize in providing eco-friendly, durable solutions for both residential and commercial projects. Count on us for amazing products at the best plywood prices in Bangalore, with timely delivery every single time! Being one of the premier plywood brands in Bangalore, we stand by our commitment to quality and reliability with each other.</p>",
    images: [{ src: "/images/south-region-plywoods/Bangalore 2.webp", alt: "Saburi Best Plywood Bangalore board full view" }],
  },
];

const bySlug = new Map<string, Location>(locations.map((l) => [l.slug, l]));

/** Accessor — single CMS-swap point (§8). Returns undefined for an unknown slug. */
export function getLocation(slug: string): Location | undefined {
  return bySlug.get(slug);
}

/** Ordered location slugs (drives generateStaticParams/sitemap in later phases). */
export const locationSlugs: string[] = locations.map((l) => l.slug);
