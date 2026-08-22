"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * On-page table of contents for the guide article (client). The full list renders on the server —
 * these are plain `<a href="#id">` anchors, so the rail is crawlable and works with JS off; the
 * island only adds the active-section highlight and the smooth scroll-to.
 *
 * Scroll-spy uses a scroll listener rather than IntersectionObserver: sections here vary from one
 * short paragraph to several screens, and "the last heading I scrolled past" is the behaviour a
 * reader expects, which a ratio-based observer doesn't give on a long section.
 *
 * `offset` must clear the sticky Navbar (162px desktop / 130px mobile) plus a little breathing room.
 */

const OFFSET = 178;

export function GuideToc({ items }: { items: Array<{ id: string; label: string }> }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      // The last heading to cross the upper third of the viewport wins — a heading sitting just
      // under the sticky header is the one being read, even though its body hasn't scrolled up
      // yet. Before the first one crosses, nothing is active (the reader is still in the intro).
      const line = Math.max(OFFSET + 8, window.innerHeight / 3);
      let current: string | null = null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Scroll ourselves so the target clears the sticky Navbar — `scroll-mt` alone can't be applied
  // to the hash target without also shifting the layout, and this keeps the URL hash shareable.
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - OFFSET,
        behavior: reduce ? "auto" : "smooth",
      });
      history.replaceState(null, "", `#${id}`);
    },
    [reduce],
  );

  return (
    <nav aria-label="On this page" className="text-[13.5px] leading-snug">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
        On this page
      </p>
      <ul className="max-h-[calc(100vh-14rem)] space-y-0.5 overflow-y-auto pr-1">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => onClick(e, id)}
                aria-current={isActive ? "true" : undefined}
                title={label}
                className={`flex gap-3 py-2 transition-colors ${
                  isActive ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                <span
                  aria-hidden
                  className={`w-[2px] flex-shrink-0 rounded-full transition-colors ${
                    isActive ? "bg-primary" : "bg-gray-200"
                  }`}
                />
                {/* Questions run long; two lines keeps a 12-entry rail scannable (full text in the title) */}
                <span className="line-clamp-2">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
