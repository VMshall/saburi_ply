import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideTemplate } from "@/components/templates/GuideTemplate";
import { getGuidePage } from "@/lib/faqs";
import { buildPageMetadata } from "@/lib/seo";

// Thin SSG route over GuideTemplate — the fire-safety cluster under /plywood-guide.
export const dynamic = "force-static";

const page = getGuidePage("fire-safety");
export const metadata: Metadata = page ? buildPageMetadata(page.seo) : {};

export default function Page() {
  if (!page) notFound();
  return <GuideTemplate page={page} />;
}
