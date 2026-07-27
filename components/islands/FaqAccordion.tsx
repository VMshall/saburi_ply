"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Faq } from "@/data/types";

/**
 * FAQ accordion (client). All questions AND answers render into the HTML (answers sit in a
 * collapsed `grid-rows-[0fr]` container), so the full FAQ text is crawlable and powers the FAQPage
 * JSON-LD; only the open/close is client-side.
 *
 * `allowMultiple` defaults to true — several answers can stay open at once for easy comparison,
 * consistently across every FAQ surface. Pass `allowMultiple={false}` for classic single-open.
 *
 * Height animates via a `grid-template-rows` 0fr→1fr transition (no `max-height` cap), so long
 * answers are never clipped. The answer wrapper is a `<div>` (not `<p>`) so block-level answer
 * HTML — e.g. an AEO lead paragraph + SEO detail paragraph — nests validly.
 */
export function FaqAccordion({
  faqs,
  allowMultiple = true,
}: {
  faqs: Faq[];
  allowMultiple?: boolean;
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpenSet((prev) => {
      // single-open starts from empty (collapses the rest); multi-open starts from the current set
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openSet.has(i);
        return (
          <div
            key={i}
            className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
              <div className="flex-shrink-0">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>

            {/* grid-rows 0fr→1fr animates to the answer's natural height — no max-height clip */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className="px-6 pb-4 text-gray-700 leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
