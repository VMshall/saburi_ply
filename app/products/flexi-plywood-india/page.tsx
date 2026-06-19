import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductTemplate } from "@/components/templates/ProductTemplate";
import { getProduct } from "@/data/products";
import { buildProductMetadata } from "@/lib/seo";

// Thin SSG route over the shared ProductTemplate (§3/§4).
export const dynamic = "force-static";

const product = getProduct("flexi-plywood-india");
export const metadata: Metadata = product ? buildProductMetadata(product) : {};

export default function Page() {
  if (!product) notFound();
  return <ProductTemplate product={product} />;
}
