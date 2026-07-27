import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideTemplate } from "@/components/templates/GuideTemplate";
import { getGuidePage } from "@/lib/faqs";
import { buildPageMetadata } from "@/lib/seo";

// Thin SSG route over GuideTemplate — the which-plywood-project cluster under /plywood-buying-guide.
export const dynamic = "force-static";

const page = getGuidePage("which-plywood-project");
export const metadata: Metadata = page ? buildPageMetadata(page.seo) : {};

export default function Page() {
  if (!page) notFound();
  return <GuideTemplate page={page} />;
}
