/**
 * JSON-LD schema builders (§6). Ported from client/components/PageMeta.jsx and STRENGTHENED:
 *  - Organization: sitewide (was home-only).
 *  - WebSite: added sitewide (entity understanding; a SearchAction is omitted until a real
 *    on-site search endpoint exists — adding a non-functional one would be invalid).
 *  - BreadcrumbList: same path-derived algorithm as PageMeta (exact parity).
 *  - Product: preserved + enriched with the real product image, certification, and warranty.
 *  - FAQPage: now built from the page's REAL Q&As (PageMeta emitted a generic hardcoded pair).
 *  - LocalBusiness: richer (index.html geo/aggregateRating/openingHours) + `areaServed`.
 *
 * @id anchors link the entities (Organization ⇄ WebSite). All URLs are absolute to the www host.
 */
import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  LOGO,
  LOGO_WEBP,
  CONTACT,
  ADDRESS,
  GEO,
  ORGANIZATION,
  ORG_SAME_AS,
  LOCAL_BUSINESS,
  LOCALBUSINESS_SAME_AS,
} from "@/data/site";
import type { Faq, Product, ProductCategory } from "@/data/types";

type Schema = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const absUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);
/** Absolute image URL with the path component encoded (asset filenames may contain spaces). */
const absImg = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${encodeURI(path)}`);

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: ADDRESS.streetAddress,
  addressLocality: ADDRESS.addressLocality,
  addressRegion: ADDRESS.addressRegion,
  postalCode: ADDRESS.postalCode,
  addressCountry: ADDRESS.addressCountry,
};

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: LEGAL_NAME,
    alternateName: ORGANIZATION.alternateName,
    url: SITE_URL,
    logo: LOGO,
    foundingDate: ORGANIZATION.foundingDate,
    founder: { "@type": "Person", name: ORGANIZATION.founder },
    description: ORGANIZATION.description,
    address: postalAddress,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: CONTACT.phone,
      email: CONTACT.email,
      availableLanguage: ORGANIZATION.availableLanguage,
      url: `${SITE_URL}/contact`,
    },
    sameAs: ORG_SAME_AS,
  };
}

export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
  };
}

/** Path-derived breadcrumb, byte-for-byte matching PageMeta.jsx:8-36. */
export function breadcrumbSchema(pathname: string): Schema {
  const parts = pathname.split("/").filter(Boolean);
  const itemListElement: Schema[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  ];
  let currentUrl = SITE_URL;
  parts.forEach((part, index) => {
    currentUrl += `/${part}`;
    const name = part
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: currentUrl,
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/** schema.org category + material per product category. Previously hardcoded "Plywood" for ALL
 * 22 products, which mislabels blockboards, WPC, chipboard, etc. Derived from product.category. */
const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, { category: string; material: string }> = {
  plywood: { category: "Plywood", material: "Plywood" },
  blockboard: { category: "Block Board", material: "Block Board" },
  flushdoor: { category: "Flush Door", material: "Wood" },
  "wpc-pvc": { category: "WPC / PVC Board", material: "WPC / PVC" },
  chipboard: { category: "Chipboard", material: "Particle Board" },
  laminate: { category: "Laminate", material: "Laminate" },
};

export function productSchema(product: Product): Schema {
  const labels = PRODUCT_CATEGORY_LABELS[product.category] ?? PRODUCT_CATEGORY_LABELS.plywood;
  const additionalProperty: Schema[] = [
    { "@type": "PropertyValue", name: "Grade", value: "Premium" },
    {
      "@type": "PropertyValue",
      name: "Certification",
      value: product.certification ?? "ISI Certified",
    },
  ];
  if (product.warrantyYears) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Warranty",
      value: `${product.warrantyYears} years`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0] ? absImg(product.images[0].src) : LOGO,
    description: product.seo.description,
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@type": "Organization", name: LEGAL_NAME, url: SITE_URL },
    material: labels.material,
    additionalProperty,
    category: labels.category,
    url: absUrl(`/products/${product.slug}`),
  };
}

/** CollectionPage for a category hub (e.g. /plywood). Entity-links the sitewide WebSite +
 * Organization so the hub is understood as part of the brand's graph. */
export function collectionPageSchema(opts: {
  pathname: string;
  name: string;
  description: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${opts.pathname}#webpage`,
    url: absUrl(opts.pathname),
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

/** ItemList of the products shown on a category hub — ordered links to each product page, so
 * retrieval/AI systems and Google can read the full set from the hub's JSON-LD. */
export function itemListSchema(products: Product[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/products/${p.slug}`),
      name: p.name,
    })),
  };
}

/** FAQPage from the page's real Q&As (§6 strengthen). Returns null when there are none. */
export function faqSchema(faqs: Faq[]): Schema | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answerHtml },
    })),
  };
}

export function localBusinessSchema(opts?: {
  pathname?: string;
  name?: string;
  areaServed?: string[];
}): Schema {
  const { pathname, name, areaServed } = opts ?? {};
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}${pathname ?? "/"}#localbusiness`,
    name: name ?? SITE_NAME,
    image: LOGO_WEBP,
    url: SITE_URL,
    description: LOCAL_BUSINESS.description,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    address: postalAddress,
    geo: { "@type": "GeoCoordinates", latitude: GEO.latitude, longitude: GEO.longitude },
    sameAs: LOCALBUSINESS_SAME_AS,
    priceRange: LOCAL_BUSINESS.priceRange,
    openingHours: LOCAL_BUSINESS.openingHours,
    // NOTE: NO aggregateRating. A hardcoded rating without real on-site Review markup violates
    // Google's structured-data policy (manual-action risk). The legacy PageMeta LocalBusiness
    // had none; the index.html one did — that hardcoded rating is intentionally dropped.
  };
  if (areaServed?.length) {
    schema.areaServed = areaServed.map((a) => ({ "@type": "Place", name: a }));
  }
  return schema;
}

/** BlogPosting for an in-app blog post (§7/P8). Mirrors the Article graph WordPress/Yoast emitted
 * (headline, dates, image, Organization author/publisher). Publisher links the sitewide Organization. */
export function articleSchema(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  modified?: string;
  author?: string;
  image?: string;
}): Schema {
  const url = absUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image ? absImg(post.image) : LOGO,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: { "@type": "Organization", name: post.author || SITE_NAME, url: SITE_URL },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

/** Blog-post breadcrumb (Home › Blog › <title>) — cleaner than the slug-humanized path-derived one. */
export function blogBreadcrumbSchema(title: string, slug: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };
}
