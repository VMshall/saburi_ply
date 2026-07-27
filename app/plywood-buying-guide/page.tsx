import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideTemplate } from "@/components/templates/GuideTemplate";
import { getGuidePage } from "@/lib/faqs";
import { buildPageMetadata } from "@/lib/seo";

// Thin SSG route over GuideTemplate — the /plywood-buying-guide (Purchase) pillar.
export const dynamic = "force-static";

const page = getGuidePage("buying-guide");
export const metadata: Metadata = page ? buildPageMetadata(page.seo) : {};

export default function Page() {
  if (!page) notFound();
  return <GuideTemplate page={page} />;
}
