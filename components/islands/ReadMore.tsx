"use client";

import { useState } from "react";

/**
 * Intro "Read more / Read less" (client). P6 SEO fix: the FULL intro HTML is always rendered into
 * the markup, so crawlers and the initial paint get the entire product description (the legacy
 * react-snap output, and the prior version of this island, only shipped the first ~280 chars).
 * "Read more" now toggles a CSS line-clamp on the same full text rather than swapping the content,
 * so nothing is hidden from the HTML. Inline markup (e.g. <strong>) is preserved.
 *
 * `limit` is retained for API compatibility and only decides whether the toggle is worth showing
 * (very short intros don't need it).
 */
export function ReadMore({ html, limit = 280 }: { html: string; limit?: number }) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = html.length > limit;

  return (
    <div className="space-y-3">
      <p
        className={`text-gray-700 leading-relaxed ${needsToggle && !expanded ? "line-clamp-4" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90"
          aria-expanded={expanded}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
