import { Award, CheckCircle2, FileCheck, Shield, type LucideIcon } from "lucide-react";

/**
 * Certificates shown on /about/accreditation.
 *
 * Extracted out of the AccreditationGrid island so the About Us certification chips can deep-link
 * to a specific certificate (`/about/accreditation#iso-9001-2015`) without re-typing the list —
 * this module is the single source of truth for the anchor ids.
 *
 * `image` is the scan shown on the card and in the lightbox (previously — and misleadingly —
 * called `pdfUrl`; it has always been a .webp). `pdf` is the actual signed certificate where one
 * exists in public/certificates: higher resolution than the scan and what a procurement buyer
 * actually wants. Size is declared so the download link can warn before a 28 MB tap on mobile data.
 */
export type Certification = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  pdf?: { href: string; sizeMb: number };
};

/**
 * The three ISO certificates ship as one 3-page PDF (verified: p1 ISO 9001:2015 / p2 ISO
 * 14001:2015 / p3 ISO 45001:2018, certificate numbers matching the scans). `#page=N` lands the
 * viewer on the right page.
 */
const ISO_PDF = "/certificates/NEW ISO CERTIFICATE 2023-2026.pdf";
const ISO_PDF_MB = 28.5;

export const CERTIFICATIONS: Certification[] = [
  {
    id: "carb",
    icon: Award,
    title: "Certificate of Conformance (CARB)",
    description: "Forest Wood Industries, Inc.",
    image: "/certificates/certificate_of_conformance.webp",
    pdf: { href: "/certificates/CARB CERTIFICATE NEW 01.pdf", sizeMb: 4 },
  },
  {
    id: "fsc",
    icon: Shield,
    title: "FSC Certificate",
    description: "Bureau Veritas Certification",
    image: "/certificates/bureau_veritas_certificate.webp",
    pdf: { href: "/certificates/FSC CERTIFICATE1.pdf", sizeMb: 1.3 },
  },
  {
    id: "iso-9001-2015",
    icon: FileCheck,
    title: "ISO 9001:2015",
    description: "Quality Management System 2015",
    image: "/certificates/iso_9001_2015.webp",
    pdf: { href: `${ISO_PDF}#page=1`, sizeMb: ISO_PDF_MB },
  },
  {
    id: "iso-14001-2015",
    icon: FileCheck,
    title: "ISO 14001:2015",
    description: "Environment Management System 2015",
    image: "/certificates/iso_14001_2015.webp",
    pdf: { href: `${ISO_PDF}#page=2`, sizeMb: ISO_PDF_MB },
  },
  {
    id: "iso-45001-2018",
    icon: FileCheck,
    title: "ISO 45001:2018",
    description: "Health and Safety Management System",
    image: "/certificates/iso_45001_2018.webp",
    pdf: { href: `${ISO_PDF}#page=3`, sizeMb: ISO_PDF_MB },
  },
  {
    id: "igbc",
    icon: CheckCircle2,
    title: "IGBC",
    description: "Indian Green Building Council",
    image: "/certificates/igbc.webp",
  },
  {
    id: "astm-d7032-17",
    icon: CheckCircle2,
    title: "ASTM D7032 - 17",
    description: "Manufacturer of Super Quality Plywood Panel Boards, WPC & PVC - 2017",
    image: "/certificates/astm_d7032_17.webp",
    pdf: { href: "/certificates/Saburi - ASTM New.pdf", sizeMb: 1.3 },
  },
  {
    id: "iso-20819-1-2020",
    icon: CheckCircle2,
    title: "ISO 20819-1:2020",
    description: "Manufacturer of Super Quality Plywood Panel Boards, WPC & PVC - 2020",
    image: "/certificates/iso_20819-1_2020.webp",
    pdf: { href: "/certificates/Saburi - ISO 20819 -1-2020 new.pdf", sizeMb: 1.2 },
  },
  {
    id: "ce",
    icon: CheckCircle2,
    title: "Certificate of Conformity (CE)",
    description: "Certificate of Conformity",
    image: "/certificates/certificate_of_conformity.webp",
  },
];

/**
 * Standards / issuing bodies behind the certificates above — rendered as the typographic authority
 * rail over the grid. B2B buyers scan for these marks before they read any prose.
 *
 * Text only, deliberately: no third-party logo assets ship with the repo, and reproducing issuer
 * marks (ISO, FSC®, CE) carries its own usage terms. Swap to logos here once licensed art exists.
 */
export const CERT_ISSUERS = [
  "ISO",
  "FSC",
  "Bureau Veritas",
  "CARB",
  "IGBC",
  "ASTM",
  "CE",
] as const;

/**
 * Certification chip label (as written in the About Us copy) → certificate anchor on
 * /about/accreditation. Chips with no matching certificate (the IS: product standards) fall back to
 * the page itself, so every chip stays a live link.
 */
export const CERT_CHIP_ANCHORS: Record<string, string> = {
  "ISO 9001:2015": "iso-9001-2015",
  "ISO 14001:2015": "iso-14001-2015",
  "ISO 45001:2018": "iso-45001-2018",
  FSC: "fsc",
  CARB: "carb",
  IGBC: "igbc",
  CE: "ce",
};

export function certChipHref(chip: string): string {
  const anchor = CERT_CHIP_ANCHORS[chip];
  return anchor ? `/about/accreditation#${anchor}` : "/about/accreditation";
}
