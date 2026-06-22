import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTemplate } from "@/components/templates/CategoryTemplate";
import { getCategory, getCategoryProducts } from "@/data/categories";
import { buildPageMetadata } from "@/lib/seo";

// Thin SSG route over the shared CategoryTemplate — the /plywood category hub.
export const dynamic = "force-static";

const category = getCategory("plywood");
export const metadata: Metadata = category ? buildPageMetadata(category.seo) : {};

export default function Page() {
  if (!category) notFound();
  return <CategoryTemplate category={category} products={getCategoryProducts(category)} />;
}
