import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductTemplate } from "@/components/templates/ProductTemplate";
import { getProduct } from "@/data/products";
import { buildProductMetadata } from "@/lib/seo";

// Pure SSG (§3). Thin route file: pull the entry from data, build metadata, render the shared
// template. P4 flips this pattern to the remaining 21 product slugs.
export const dynamic = "force-static";

const SLUG = "marine-plywood-india";
const product = getProduct(SLUG);

export const metadata: Metadata = product ? buildProductMetadata(product) : {};

export default function Page() {
  if (!product) notFound();
  return <ProductTemplate product={product} />;
}
