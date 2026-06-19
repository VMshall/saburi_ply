import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationTemplate } from "@/components/templates/LocationTemplate";
import { getLocation } from "@/data/locations";
import { buildLocationMetadata } from "@/lib/seo";

// Thin SSG route over the shared LocationTemplate (§3/§4).
export const dynamic = "force-static";

const location = getLocation("best-plywood-kerala");
export const metadata: Metadata = location ? buildLocationMetadata(location) : {};

export default function Page() {
  if (!location) notFound();
  return <LocationTemplate location={location} />;
}
