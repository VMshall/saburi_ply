"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Top-bar route-change indicator (§9) — re-implements the legacy PageLoader bar. The App Router
 * has no router.events, so this is driven by usePathname() transitions (a brief CSS-animated bar
 * each time the path changes). Pure CSS transitions — no framer-motion in the client bundle.
 */
export function TopProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // don't flash on the initial page load
      return;
    }
    setVisible(true);
    setWidth(20);
    const t1 = setTimeout(() => setWidth(80), 50);
    const t2 = setTimeout(() => setWidth(100), 300);
    const t3 = setTimeout(() => setVisible(false), 600);
    const t4 = setTimeout(() => setWidth(0), 700);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [pathname]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[10000] h-0.5 pointer-events-none transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
