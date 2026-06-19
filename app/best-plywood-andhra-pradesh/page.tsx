import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationTemplate } from "@/components/templates/LocationTemplate";
import { getLocation } from "@/data/locations";
import { buildLocationMetadata } from "@/lib/seo";

// Pure SSG (§3). P4 flips this pattern to the remaining 4 location slugs.
export const dynamic = "force-static";

const SLUG = "best-plywood-andhra-pradesh";
const location = getLocation(SLUG);

export const metadata: Metadata = location ? buildLocationMetadata(location) : {};

export default function Page() {
  if (!location) notFound();
  return <LocationTemplate location={location} />;
}
