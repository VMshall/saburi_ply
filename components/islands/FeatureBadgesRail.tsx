"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Horizontally-scrollable feature-badge rail (client). Only the scroll behavior is client-side;
 * the badge icons are SSR'd in the server template and passed in as `icon` ReactNodes, which
 * keeps the heavy react-icons modules out of this client bundle.
 */
export function FeatureBadgesRail({
  items,
}: {
  items: { icon: ReactNode; title: string; sub: string }[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    railRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  return (
    <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
      <button
        type="button"
        aria-label="Previous badge"
        onClick={() => scroll(-1)}
        className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-full border bg-white hover:bg-gray-50 text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div ref={railRef} className="flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex items-stretch gap-6 sm:gap-8 min-w-max px-2 py-1">
          {items.map((it, i) => (
            <div key={i} className="shrink-0 text-center snap-start min-w-[80px]">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-500 ring-1 ring-red-100 flex items-center justify-center">
                {it.icon}
              </div>
              <div className="mt-2 text-sm font-medium">{it.title}</div>
              <div className="text-xs text-gray-500">{it.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Next badge"
        onClick={() => scroll(1)}
        className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-full border bg-white hover:bg-gray-50 text-gray-700"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
