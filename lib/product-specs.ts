import type { Product } from "@/data/types";

export const SPEC_GRADE_LABEL = "Grade / Standard";

export interface SpecRow {
  label: string;
  value: string;
}

/**
 * Product spec rows — the single source for BOTH the visible SpecTable and the Product JSON-LD
 * (`additionalProperty`), so the two can never drift. Returns only the rows that have data.
 */
export function productSpecs(product: Product): SpecRow[] {
  const grade = product.certification ?? product.gradePills[0]?.label;
  const thickness =
    product.thicknesses.length > 1
      ? `${product.thicknesses[0]}–${product.thicknesses[product.thicknesses.length - 1]}`
      : product.thicknesses[0];
  const sizes = product.sizes.length ? product.sizes.join(", ") : undefined;
  const warranty =
    product.warranty ?? (product.warrantyYears ? `${product.warrantyYears}-year` : undefined);

  const raw: Array<[string, string | undefined]> = [
    [SPEC_GRADE_LABEL, grade],
    ["Thickness", thickness],
    ["Standard sizes", sizes],
    ["Warranty", warranty],
    ["Emission", product.emission],
  ];
  return raw
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(([label, value]) => ({ label, value }));
}
