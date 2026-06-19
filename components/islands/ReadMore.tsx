"use client";

import { useState } from "react";

/**
 * Intro "Read more / Read less" (client). Ports the ReadMoreBlock from the product pages:
 * collapsed shows the first `limit` characters of the HTML; expanded shows it all. Inline HTML
 * (e.g. <strong>) is preserved. (P6 SEO note: the collapsed state only ships ~`limit` chars to
 * crawlers, same as the legacy react-snap output — rendering the full intro is a cheap win.)
 */
export function ReadMore({ html, limit = 280 }: { html: string; limit?: number }) {
  const [expanded, setExpanded] = useState(false);
  const short = html.length > limit ? html.slice(0, limit) + "..." : html;
  return (
    <div className={`space-y-3 ${!expanded ? "md:min-h-[96px]" : ""}`}>
      <p
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: expanded ? html : short }}
      />
      {html.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
