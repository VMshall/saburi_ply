"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Factory, Users, Globe, UserCheck, type LucideIcon } from "lucide-react";

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

const STATS: Stat[] = [
  { icon: Factory, value: "3", label: "Manufacturing Units" },
  { icon: Users, value: "1000+", label: "Team Members" },
  { icon: Globe, value: "427+", label: "Districts Served" },
  { icon: UserCheck, value: "1 Lakh+", label: "Client Served" },
];

// Only numbers this large count up. Smaller ones (3, and the "1" in "1 Lakh+") just
// fade in — counting 0->3 or 0->1 reads as a flicker rather than a satisfying effect.
const COUNT_THRESHOLD = 100;

// Split the display string into an animatable number + its static prefix/suffix, so
// "1000+" counts 0 -> 1000 keeping the "+", and "1 Lakh+" keeps " Lakh+".
function parseValue(raw: string): { prefix: string; target: number | null; suffix: string } {
  const match = raw.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return { prefix: "", target: null, suffix: raw };
  return {
    prefix: match[1],
    target: parseInt(match[2].replace(/,/g, ""), 10),
    suffix: match[3],
  };
}

function StatValue({ raw, play }: { raw: string; play: boolean }) {
  const { prefix, target, suffix } = parseValue(raw);
  const reduced = useReducedMotion();
  const numRef = useRef<HTMLSpanElement>(null);
  const shouldCount = target !== null && target >= COUNT_THRESHOLD;

  useEffect(() => {
    const el = numRef.current;
    if (!el || !shouldCount || target === null || reduced || !play) return;
    el.textContent = "0";
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [play, target, reduced, shouldCount]);

  // Non-numeric fallback.
  if (target === null) return <>{raw}</>;

  // Big numbers: count up. SSR renders the final value so crawlers never see "0".
  if (shouldCount) {
    return (
      <>
        {prefix}
        <span ref={numRef}>{target}</span>
        {suffix}
      </>
    );
  }

  // Small numbers: fade + rise in.
  return (
    <motion.span
      className="inline-block"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={reduced || play ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {raw}
    </motion.span>
  );
}

export function ProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div
      ref={ref}
      className="mt-14 overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 shadow-sm lg:mt-20"
    >
      <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 bg-white p-6 text-center sm:p-8"
          >
            <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
            <div className="font-display text-3xl font-bold tracking-tight text-stone-900 tabular-nums sm:text-4xl">
              <StatValue raw={value} play={inView} />
            </div>
            <div className="text-xs uppercase tracking-wider text-stone-500 sm:text-sm">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
