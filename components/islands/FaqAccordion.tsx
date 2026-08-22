"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useInView, useReducedMotion } from "framer-motion";
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
 *
 * Motion (reuses the redesign's shared vocabulary; all crawler/SSG-safe):
 *  - plus→minus chip that fills red on open (mirrors the WhyChooseUs icon chip);
 *  - open-state red rail + ring/shadow lift for a clear "which one is open" affordance;
 *  - answer content eases in via opacity/transform (NOT display) so it stays in the DOM;
 *  - cursor-tracked spotlight glow (.spotlight-card + handleSpotlight), same as the other cards;
 *  - PER-ROW scroll reveal: each card observes its own visibility, so it animates in as IT enters
 *    the viewport. (A single observer on the whole list mis-fires on long FAQ pages — 15% of a
 *    multi-screen container only intersects far down, leaving every row hidden until a big scroll.)
 */

function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
  onSpotlight,
  reduce,
  mounted,
}: {
  faq: Faq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onSpotlight: (e: ReactPointerEvent<HTMLElement>) => void;
  reduce: boolean;
  mounted: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // once:true → each row animates in a single time and never re-hides while scrolling back up.
  const inView = useInView(ref, { once: true, amount: 0.2 });

  // Rows render fully visible on the server / without JS (crawler-safe); the hidden→visible
  // transition only kicks in after mount, once THIS row is in view.
  const revealClass = !mounted || reduce ? "" : inView ? "faq-reveal faq-reveal-in" : "faq-reveal";
  // Cascade only the first screenful; rows below the fold reveal cleanly on scroll without a lag.
  const revealStyle =
    !mounted || reduce ? undefined : { transitionDelay: `${Math.min(index, 6) * 70}ms` };

  return (
    // Reveal wrapper is separate from the card so `why-reveal`'s transition never clashes with the
    // card's own box-shadow transition (same nesting as WhyChooseUs).
    <div ref={ref} className={revealClass} style={revealStyle}>
      <div
        onPointerMove={onSpotlight}
        className={`spotlight-card group relative overflow-hidden rounded-xl bg-white ring-1 transition-[box-shadow] duration-300 ${
          isOpen
            ? "ring-primary/15 shadow-[0_20px_50px_rgba(2,6,23,0.10)]"
            : "ring-gray-100 shadow-[0_10px_30px_rgba(2,6,23,0.06)]"
        }`}
      >
        {/* open-state red rail — restraint: 3px, scales in from the top */}
        <span
          aria-hidden
          className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-primary transition-transform duration-300 ${
            isOpen ? "scale-y-100" : "scale-y-0"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
        >
          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>

          {/* plus→minus chip: fills red on open; the vertical bar rotates flat into a minus */}
          <span
            aria-hidden
            className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              isOpen
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary/15"
            }`}
          >
            <span className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-transform duration-300 ${
                isOpen ? "rotate-0" : "rotate-90"
              }`}
            />
          </span>
        </button>

        {/* grid-rows 0fr→1fr animates to the answer's natural height — no max-height clip */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            {/* content eases in (opacity/transform, never display) so it stays crawlable */}
            <div
              className={`px-6 pb-5 leading-relaxed text-gray-700 transition-all duration-300 [&>p]:mb-3 [&>p:last-child]:mb-0 ${
                isOpen ? "translate-y-0 opacity-100 delay-100" : "translate-y-1 opacity-0"
              }`}
              dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({
  faqs,
  allowMultiple = true,
}: {
  faqs: Faq[];
  allowMultiple?: boolean;
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  // Shared reduced-motion gate + post-mount flag (rows are SSG-visible until JS mounts).
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cursor-tracked spotlight — write CSS vars directly so pointer moves never re-render React;
  // skip non-mouse pointers (touch/pen get no glow). Consumed by .spotlight-card::before.
  const handleSpotlight = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }, []);

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
      {faqs.map((faq, i) => (
        <FaqItem
          key={i}
          faq={faq}
          index={i}
          isOpen={openSet.has(i)}
          onToggle={() => toggle(i)}
          onSpotlight={handleSpotlight}
          reduce={reduce ?? false}
          mounted={mounted}
        />
      ))}
    </div>
  );
}
