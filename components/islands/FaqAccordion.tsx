"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Faq } from "@/data/types";

/**
 * FAQ accordion (client). Ports the product-page accordion. All questions AND answers are
 * rendered into the HTML (answers sit in a collapsed max-h-0 container), so the full FAQ text is
 * crawlable and powers the FAQPage JSON-LD; only the open/close is client-side.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            aria-expanded={open === i}
          >
            <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
            <div className="flex-shrink-0">
              {open === i ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? "max-h-96" : "max-h-0"}`}
          >
            <div className="px-6 pb-4">
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
