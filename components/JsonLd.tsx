/**
 * Server component that emits structured data — one <script type="application/ld+json"> per
 * schema object (§6). Pass a single schema or an array. Rendered server-side, so the JSON-LD
 * is in the initial HTML for crawlers.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
