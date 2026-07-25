import type { Product } from "@/data/types";

/**
 * Product spec table (B2) — an at-a-glance summary of the key buyer-decision facts, rendered
 * above the fold on the product page. Pure server component (no client JS → SSG/SEO-friendly).
 *
 * Renders only when the product has at least one *real* spec beyond its grade (thickness, sizes,
 * warranty, or emission) — a grade-only table is skipped entirely, since the grade already shows
 * in the pills under the H1. Rows with no data are dropped, so sparse products degrade gracefully
 * and empty ones show nothing (no orphaned heading). Treatments/features are deliberately NOT
 * duplicated here — the FeatureBadges rail and the "Unique Features" tab already cover them.
 */
export function SpecTable({ product }: { product: Product }) {
  const grade = product.certification ?? product.gradePills[0]?.label;
  const thickness =
    product.thicknesses.length > 1
      ? `${product.thicknesses[0]}–${product.thicknesses[product.thicknesses.length - 1]}`
      : product.thicknesses[0];
  const sizes = product.sizes.length ? product.sizes.join(", ") : undefined;
  const warranty =
    product.warranty ?? (product.warrantyYears ? `${product.warrantyYears}-year` : undefined);

  // "Real" specs — the table is only worth showing if at least one of these exists
  // (a grade-only table is skipped; the grade is already in the pills under the H1).
  const specs: Array<[string, string | undefined]> = [
    ["Thickness", thickness],
    ["Standard sizes", sizes],
    ["Warranty", warranty],
    ["Emission", product.emission],
  ];
  const shownSpecs = specs.filter((r): r is [string, string] => Boolean(r[1]));
  if (!shownSpecs.length) return null;

  const rows: Array<[string, string]> = [];
  if (grade) rows.push(["Grade / Standard", grade]);
  rows.push(...shownSpecs);

  return (
    <div className="mt-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Specifications</h3>
      <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
        <table className="w-full text-sm">
          <caption className="sr-only">Specifications for {product.name}</caption>
          <tbody>
            {rows.map(([label, value], i) => (
              <tr key={label} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                <th
                  scope="row"
                  className="w-2/5 whitespace-nowrap px-4 py-2.5 text-left align-top font-medium text-gray-500"
                >
                  {label}
                </th>
                <td className="px-4 py-2.5 font-semibold text-gray-900">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
