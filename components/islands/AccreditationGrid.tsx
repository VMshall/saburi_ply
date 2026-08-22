"use client";

import { useEffect, useRef, useState, useCallback, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { CERTIFICATIONS } from "@/data/certifications";

/**
 * Certifications grid with hover image-preview tooltip (client). Ported from
 * client/pages/Accreditation.jsx — needs `useState` + onMouseEnter/onMouseLeave, so it
 * lives as an island while the route's app/about/accreditation/page.tsx stays a server component.
 *
 * Each certificate reads as a sheet of paper on a warm mat rather than a cropped thumbnail, and
 * reuses the site-wide card primitives: `.spotlight-card` (cursor-tracked red glow, fine-pointer
 * only) and `.why-reveal` (staggered scroll reveal). Both are progressive enhancement — cards are
 * fully visible server-rendered and stay visible if JS never runs — and every motion is disabled
 * under prefers-reduced-motion.
 */
export function AccreditationGrid() {
  const [hoveredCert, setHoveredCert] = useState<number | null>(null);

  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cursor-tracked spotlight. CSS vars are written straight to the node so pointer moves never
  // trigger a React re-render; non-mouse pointers (touch/pen) get no glow.
  const handleSpotlight = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {CERTIFICATIONS.map((cert, index) => {
        const Icon = cert.icon;
        return (
          <Reveal
            key={cert.id}
            id={cert.id}
            index={index}
            enhanced={mounted && !reduce}
            onMouseEnter={() => setHoveredCert(index)}
            onMouseLeave={() => setHoveredCert(null)}
          >
            {/* Certificate card — the card lifts, the scan never scales. */}
            <motion.div
              onPointerMove={handleSpotlight}
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.6 }}
              className="spotlight-card relative h-full cursor-pointer rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Issuer seal — stamps down on reveal, and carries the certificate's mark. The
                  press animation is driven by the wrapper's `.why-reveal-in` class (see
                  globals.css), so it only ever runs on a card that actually revealed. */}
              <span
                className="cert-seal absolute -left-3 -top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-white"
                style={mounted && !reduce ? { animationDelay: `${(index % 3) * 90 + 260}ms` } : undefined}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>

              {/* Paper sheet on a warm mat — object-contain keeps the whole certificate visible. */}
              <div className="cert-sheet relative overflow-hidden rounded-xl bg-[#faf8f3] p-3">
                {/* Fixed height rather than an aspect ratio: the scans vary between portrait and
                    landscape, and object-contain inside a shared box keeps every card the same
                    height whatever the source proportions. */}
                <SmartImage
                  src={cert.pdfUrl}
                  alt={`${cert.title} — ${cert.description}`}
                  objectFit="contain"
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 30vw, 380px"
                  className="h-[420px] rounded-md bg-white md:h-[480px]"
                />

                {/* Enlarge affordance — visible at rest (a hover-only hint tells you to hover
                    after you already have), strengthening on hover. */}
                <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-stone-900/60 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 md:opacity-70 md:group-hover:opacity-100">
                  <Maximize2 className="h-3 w-3" strokeWidth={2.5} />
                  Enlarge
                </span>
              </div>

              {/* Title + issuer */}
              <div className="px-1.5 pb-1 pt-4">
                <h3 className="font-display text-sm font-bold leading-snug text-stone-900 transition-colors duration-200 group-hover:text-primary">
                  {cert.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                  {cert.description}
                </p>
                {/* Red hairline wiping in left→right on hover. */}
                <span aria-hidden="true" className="mt-3 block h-px w-full bg-stone-200">
                  <span className="block h-px w-0 bg-primary transition-[width] duration-500 ease-out group-hover:w-full motion-reduce:transition-none" />
                </span>
              </div>
            </motion.div>

            {/* Image preview on hover */}
            {hoveredCert === index && (
              <div className="animate-in fade-in zoom-in-95 pointer-events-auto fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 duration-200">
                <div className="relative w-[80vw] overflow-hidden rounded-2xl border-4 border-primary/20 bg-white shadow-2xl sm:w-[75vw] md:w-[300px] lg:w-[350px]">
                  {/* Tooltip Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 px-3 py-3 md:px-6 md:py-4">
                    <h3 className="text-center text-base font-bold text-white drop-shadow-lg md:text-xl">
                      {cert.title}
                    </h3>
                  </div>
                  {/* Image Preview */}
                  <div className="relative bg-gray-50 p-3 md:p-6">
                    <div className="rounded-lg bg-white p-1 shadow-inner md:p-2">
                      <img
                        src={cert.pdfUrl}
                        alt={cert.title}
                        className="h-auto max-h-[700px] w-full rounded object-contain"
                      />
                    </div>
                    {/* View PDF/Certificate Button */}
                    <div className="mt-4 flex justify-center">
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded border border-primary bg-primary px-3 py-2 font-semibold text-white shadow transition-colors duration-200 hover:bg-primary/90 md:px-5 md:py-2"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                  {/* Tooltip Footer */}
                  <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 px-3 py-3 text-center md:px-6 md:py-4">
                    <p className="text-sm font-medium text-gray-700">{cert.description}</p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/10"></div>
                  <div className="absolute bottom-0 left-0 h-24 w-24 rounded-tr-full bg-primary/5"></div>
                </div>
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

/**
 * Per-card scroll reveal. One observer per card rather than one for the whole grid: the grid is
 * nine cards tall, so a single grid-level threshold either fires long before the lower cards are
 * anywhere near the viewport (desktop) or never reliably fires at all (mobile, where the grid is
 * several screens deep). `once: true` also means a revealed card never hides again on scroll-back.
 *
 * Progressive enhancement: with no `enhanced` class the card renders fully visible, so crawlers
 * and no-JS users always see it.
 */
function Reveal({
  id,
  index,
  enhanced,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  id: string;
  index: number;
  enhanced: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });
  const revealClass = !enhanced ? "" : inView ? "why-reveal why-reveal-in" : "why-reveal";
  // Stagger across the 3-up row so each row cascades left→right instead of the whole grid
  // counting up to a half-second delay.
  const delay = (index % 3) * 90;

  // scroll-mt clears the sticky header when a card is reached via its #anchor from the About Us
  // certification chips.
  return (
    <div
      ref={ref}
      id={id}
      className={`group relative scroll-mt-36 ${revealClass}`}
      style={enhanced ? { transitionDelay: `${delay}ms` } : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
