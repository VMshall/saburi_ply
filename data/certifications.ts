import { Award, CheckCircle2, FileCheck, Shield, type LucideIcon } from "lucide-react";

/**
 * Certificates shown on /about/accreditation.
 *
 * Extracted out of the AccreditationGrid island so the About Us certification chips can deep-link
 * to a specific certificate (`/about/accreditation#iso-9001-2015`) without re-typing the list —
 * this module is the single source of truth for the anchor ids.
 *
 * `id` is the anchor slug. `issuer` is the existing card sub-line (unchanged copy), shown under the
 * title on the card rather than only inside the hover preview.
 */
export type Certification = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  pdfUrl: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: "carb",
    icon: Award,
    title: "Certificate of Conformance (CARB)",
    description: "Forest Wood Industries, Inc.",
    pdfUrl: "/certificates/certificate_of_conformance.webp",
  },
  {
    id: "fsc",
    icon: Shield,
    title: "FSC Certificate",
    description: "Bureau Veritas Certification",
    pdfUrl: "/certificates/bureau_veritas_certificate.webp",
  },
  {
    id: "iso-9001-2015",
    icon: FileCheck,
    title: "ISO 9001:2015",
    description: "Quality Management System 2015",
    pdfUrl: "/certificates/iso_9001_2015.webp",
  },
  {
    id: "iso-14001-2015",
    icon: FileCheck,
    title: "ISO 14001:2015",
    description: "Environment Management System 2015",
    pdfUrl: "/certificates/iso_14001_2015.webp",
  },
  {
    id: "iso-45001-2018",
    icon: FileCheck,
    title: "ISO 45001:2018",
    description: "Health and Safety Management System",
    pdfUrl: "/certificates/iso_45001_2018.webp",
  },
  {
    id: "igbc",
    icon: CheckCircle2,
    title: "IGBC",
    description: "Indian Green Building Council",
    pdfUrl: "/certificates/igbc.webp",
  },
  {
    id: "astm-d7032-17",
    icon: CheckCircle2,
    title: "ASTM D7032 - 17",
    description: "Manufacturer of Super Quality Plywood Panel Boards, WPC & PVC - 2017",
    pdfUrl: "/certificates/astm_d7032_17.webp",
  },
  {
    id: "iso-20819-1-2020",
    icon: CheckCircle2,
    title: "ISO 20819-1:2020",
    description: "Manufacturer of Super Quality Plywood Panel Boards, WPC & PVC - 2020",
    pdfUrl: "/certificates/iso_20819-1_2020.webp",
  },
  {
    id: "ce",
    icon: CheckCircle2,
    title: "Certificate of Conformity (CE)",
    description: "Certificate of Conformity",
    pdfUrl: "/certificates/certificate_of_conformity.webp",
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
