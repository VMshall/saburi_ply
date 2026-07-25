"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey = "features" | "applications";

/**
 * Spec tabs (Unique Features / Application). Thickness & sizes now live in the SpecTable (B2). Ports the
 * tabbed lists from the product pages. Improvement over the legacy page: ALL non-empty lists are
 * server-rendered into the HTML and toggled via CSS (the original only prerendered the active
 * tab), so every spec is crawlable. Only tabs with data are shown.
 */
export function SpecsTabs({
  features,
  applications,
}: {
  features: string[];
  applications: string[];
}) {
  const tabs = (
    [
      { key: "features", label: "Unique Features", items: features },
      { key: "applications", label: "Application", items: applications },
    ] as { key: TabKey; label: string; items: string[] }[]
  ).filter((t) => t.items.length > 0);

  const [active, setActive] = useState<TabKey>(tabs[0]?.key ?? "features");
  if (!tabs.length) return null;

  return (
    <div className="flex flex-col">
      <div role="tablist" aria-label="Product details" className="inline-flex flex-wrap rounded-lg border p-1 bg-gray-50 gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              active === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 pr-1">
        {tabs.map((t) => (
          <ul key={t.key} className={cn("space-y-2", active === t.key ? "" : "hidden")}>
            {t.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                  <ArrowRight className="h-3 w-3" />
                </span>
                <span className="text-gray-800 text-sm">{item}</span>
              </li>
            ))}
            {t.key === "applications" && (
              <li className="text-xs text-gray-500 italic mt-3">*T&amp;C apply</li>
            )}
          </ul>
        ))}
      </div>
    </div>
  );
}
