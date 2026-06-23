/**
 * Sitewide brand / organization constants (§8). Single source for the Metadata API defaults
 * and the JSON-LD that the P3 <JsonLd> component emits (Organization + WebSite sitewide,
 * LocalBusiness on /contact + location pages).
 *
 * Ported verbatim from client/components/PageMeta.jsx (Organization, contactPoint, address)
 * and index.html (LocalBusiness: geo, openingHours, social profiles).
 */

export const SITE_URL = "https://www.saburiply.com";
export const SITE_NAME = "Saburi Ply";
export const LEGAL_NAME = "Saburi Plywood Pvt Ltd";

export const CONTACT = {
  /** Toll-free, digits-only (as emitted in the current Organization JSON-LD). */
  phone: "1800313666000",
  /** Display / LocalBusiness form. */
  phoneDisplay: "+91-1800-313-666000",
  email: "info@saburiply.com",
  whatsapp: "919062066655",
} as const;

export const ADDRESS = {
  streetAddress: "New Town Square, Unit 3A, Atghora Rajarhat, Chinar Park Crossing",
  addressLocality: "Kolkata",
  addressRegion: "West Bengal",
  postalCode: "700136",
  addressCountry: "IN",
} as const;

export const GEO = {
  latitude: 22.623955681376508,
  longitude: 88.44261142024031,
} as const;

/** Brand image used as logo / OG fallback. */
export const LOGO = `${SITE_URL}/images/saburi.jpg`;
export const LOGO_WEBP = `${SITE_URL}/images/saburiLogo-200.webp`;

/** Public social/profile URLs (index.html LocalBusiness `sameAs`). */
export const SOCIAL = {
  facebook: "https://www.facebook.com/saburiply",
  instagram: "https://www.instagram.com/saburiply/",
  youtube: "https://www.youtube.com/@saburiplywood",
  linkedin: "https://www.linkedin.com/in/saburi-ply-347865308/",
  maps: "https://maps.app.goo.gl/mAXnSeaHcvxy8Enr6",
} as const;

/** Organization-level `sameAs` from PageMeta.jsx (distinct from the LocalBusiness set). */
export const ORG_SAME_AS = [
  "https://www.linkedin.com/company/saburi-ply",
  "https://www.indiamart.com/saburi-ply",
  "https://www.crunchbase.com/organization/saburi-ply",
];

export const LOCALBUSINESS_SAME_AS = [
  SOCIAL.maps,
  SOCIAL.facebook,
  SOCIAL.instagram,
  SOCIAL.youtube,
  SOCIAL.linkedin,
];

export const ORGANIZATION = {
  legalName: LEGAL_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: LOGO,
  foundingDate: "1990",
  founder: "Gajanand Munka",
  description:
    "Leading plywood manufacturer in India offering premium quality plywood, block boards and decorative panels",
  availableLanguage: ["English", "Hindi", "Bengali"],
} as const;

export const LOCAL_BUSINESS = {
  name: SITE_NAME,
  image: LOGO_WEBP,
  description:
    "Saburi Ply is a trusted name and best plywood manufacturer and supplier in India, known for superior quality, innovation, and sustainable craftsmanship.",
  priceRange: "₹₹",
  openingHours: "Mo-Sa 10:00-18:00",
} as const;
