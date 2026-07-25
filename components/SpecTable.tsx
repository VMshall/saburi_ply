import type { Product } from "@/data/types";
import { productSpecs, SPEC_GRADE_LABEL } from "@/lib/product-specs";

/**
 * Product spec table (B2) — an at-a-glance summary of the key buyer-decision facts, rendered
 * above the fold on the product page. Pure server component (no client JS → SSG/SEO-friendly).
 *
 * Rows come from the shared `productSpecs()` helper (same source as the Product JSON-LD, so the
 * table and the structured data can never drift). Renders only when there's at least one real
 * spec beyond the grade — a grade-only table is skipped (the grade is already in the pills under
 * the H1), and empty products show nothing (no orphaned heading). Treatments/features are
 * deliberately NOT duplicated here — the FeatureBadges rail and the "Unique Features" tab cover them.
 */
export function SpecTable({ product }: { product: Product }) {
  const rows = productSpecs(product);
  if (!rows.some((r) => r.label !== SPEC_GRADE_LABEL)) return null;

  return (
    <div className="mt-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Specifications</h3>
      <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
        <table className="w-full text-sm">
          <caption className="sr-only">Specifications for {product.name}</caption>
          <tbody>
            {rows.map(({ label, value }, i) => (
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
