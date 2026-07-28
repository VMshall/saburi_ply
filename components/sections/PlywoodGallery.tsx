"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

// Each tile is a proof-of-attribute shot, so the gallery doubles as a "why our plywood" showcase.
const GALLERY = [
  {
    id: 1,
    src: "/images/plywoodGallery/Core Strength.webp",
    title: "Core Strength",
    description:
      "Engineered for uncompromising durability and lasting performance.",
  },
  {
    id: 2,
    src: "/images/plywoodGallery/Boiling Water Proof.webp",
    title: "Boiling Water Proof",
    description:
      "Designed to withstand moisture, heat, and time—without compromise.",
  },
  {
    id: 3,
    src: "/images/plywoodGallery/Fire Resistant Proof.webp",
    title: "Fire Resistant",
    description: "Strength that stands firm—even in high-heat conditions.",
  },
  {
    id: 4,
    src: "/images/plywoodGallery/Eco Friendly Core.webp",
    title: "Eco Friendly Core",
    description: "Eco-friendly at the core, superior in performance.",
  },
  {
    id: 5,
    src: "/images/plywoodGallery/Flawless Surface Finish.webp",
    title: "Flawless Surface Finish",
    description: "Smooth, uniform finish for premium aesthetics.",
  },
  {
    id: 6,
    src: "/images/plywoodGallery/Door of Strength.webp",
    title: "Door of Strength",
    description: "Engineered to stand strong, season after season.",
  },
];

const STATS = [
  { value: "50+", label: "Product Variants" },
  { value: "100%", label: "Quality Tested" },
  { value: "15+", label: "Thickness Options" },
  { value: "24/7", label: "Customer Support" },
];

const SLIDE_MS = 5000;

// Split "50+" / "100%" into an animatable number + static prefix/suffix so the "+"/"%" survive.
function parseValue(raw: string): { prefix: string; target: number | null; suffix: string } {
  const match = raw.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return { prefix: "", target: null, suffix: raw };
  return {
    prefix: match[1],
    target: parseInt(match[2].replace(/,/g, ""), 10),
    suffix: match[3],
  };
}

// Count magnitudes (50, 100, 15) but never ratios like "24/7" — a mid-count "13/7" reads as broken.
// SSR renders the final value so crawlers/no-JS never see "0". Mirrors ProofBar's StatValue.
function StatValue({ raw, play }: { raw: string; play: boolean }) {
  const { prefix, target, suffix } = parseValue(raw);
  const reduce = useReducedMotion();
  const numRef = useRef<HTMLSpanElement>(null);
  const shouldCount = target !== null && !suffix.includes("/");

  useEffect(() => {
    const el = numRef.current;
    if (!el || !shouldCount || target === null || reduce || !play) return;
    el.textContent = "0";
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [play, target, reduce, shouldCount]);

  if (target === null) return <>{raw}</>;
  if (shouldCount) {
    return (
      <>
        {prefix}
        <span ref={numRef}>{target}</span>
        {suffix}
      </>
    );
  }
  return <>{raw}</>;
}

export function PlywoodGallery() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false); // desktop hover/focus pause
  const [tabHidden, setTabHidden] = useState(false); // background-tab pause
  const [canAutoplay, setCanAutoplay] = useState(false); // desktop + fine-pointer only
  const [barCycle, setBarCycle] = useState(0); // remounts the progress bar so it restarts in sync
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const paused = hovered || tabHidden || reduce;

  // Autoplay drives the desktop accordion only (autoplay carousels hurt mobile UX/a11y, so touch
  // gets manual snap-scroll instead). Bump barCycle exactly where the timer (re)starts — on slide
  // change or resume — so the red progress bar always tracks the real time-to-advance; when paused
  // the effect early-returns, leaving the bar frozen in place via animation-play-state.
  useEffect(() => {
    if (paused || !canAutoplay) return;
    setBarCycle((c) => c + 1);
    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % GALLERY.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, canAutoplay]);

  // Gate autoplay to pointer-capable desktops.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const update = () => setCanAutoplay(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pause when the tab is backgrounded.
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Mobile scroll-spy: reflect the centred card in the dots (drives `active` when the accordion
  // is display:none, so it never fights desktop autoplay).
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const cards = Array.from(strip.querySelectorAll<HTMLElement>("[data-idx]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActive(Number(entry.target.getAttribute("data-idx")));
          }
        }
      },
      { root: strip, threshold: [0.6] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [mounted]);

  // Cursor-tracked gloss: write CSS vars directly so pointer moves never re-render; mouse only.
  const handleSpotlight = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }, []);

  const scrollToCard = useCallback(
    (i: number) => {
      const card = stripRef.current?.querySelector<HTMLElement>(`[data-idx="${i}"]`);
      card?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [reduce],
  );

  // JS-gated reveal — visible on the server and if JS never runs (SSG/crawler-safe); the
  // hidden→visible transition only kicks in after mount, staggered per block.
  const revealClass = !mounted || reduce ? "" : inView ? "why-reveal why-reveal-in" : "why-reveal";
  const revealStyle = (i: number) =>
    !mounted || reduce ? undefined : { transitionDelay: `${i * 90}ms` };

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className={cn("text-center mb-8 lg:mb-10", revealClass)} style={revealStyle(0)}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 lg:mb-4">
            Our <span className="text-primary">Product Gallery</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4 font-medium">
            Explore our craftsmanship where design, durability, and detail come together in every panel we produce.
          </p>
        </div>

        {/* Gallery */}
        <div className={revealClass} style={revealStyle(1)}>
          {/* Desktop: expanding accordion. Hover/focus (or autoplay) grows a panel and reveals its
              caption; the rest collapse to a vertical-label sliver. */}
          <div
            className="hidden lg:flex gap-2 h-[420px] xl:h-[460px]"
            onMouseLeave={() => setHovered(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
            }}
          >
            {GALLERY.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.title}
                  aria-current={isActive}
                  onMouseEnter={() => {
                    setActive(i);
                    setHovered(true);
                  }}
                  onFocus={() => {
                    setActive(i);
                    setHovered(true);
                  }}
                  onPointerMove={handleSpotlight}
                  style={{ flexGrow: isActive ? 4 : 1 }}
                  className={cn(
                    "gallery-panel group relative basis-0 min-w-0 overflow-hidden rounded-2xl text-left",
                    "ring-1 ring-inset transition-[flex-grow] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive ? "ring-primary/50" : "ring-black/5",
                  )}
                >
                  <SmartImage
                    src={item.src}
                    alt={item.title}
                    fill
                    objectFit="cover"
                    sizes="(max-width: 1280px) 45vw, 560px"
                    className={cn(
                      "absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none",
                      isActive ? "scale-105" : "scale-100",
                    )}
                  />

                  {/* Scrim — deeper on the active panel so its caption stays legible. */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
                      isActive
                        ? "from-black/75 via-black/15 to-transparent opacity-100"
                        : "from-black/60 to-black/5 opacity-90",
                    )}
                  />

                  {/* Collapsed vertical label. */}
                  <span
                    className={cn(
                      "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-white [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300",
                      isActive ? "opacity-0" : "opacity-90",
                    )}
                  >
                    {item.title}
                  </span>

                  {/* Active caption. */}
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 z-30 p-5 text-white transition-all duration-500",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    )}
                  >
                    <div className="mb-2 inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        {String(i + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight xl:text-xl">{item.title}</h3>
                    <p className="mt-1 max-w-sm text-sm text-white/85">{item.description}</p>
                  </div>

                  {/* Red autoplay progress — restarts in sync via `barCycle`, freezes when paused. */}
                  {isActive && (
                    <span
                      key={barCycle}
                      aria-hidden="true"
                      className={cn(
                        "animate-hero-tab-progress pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[3px] origin-left rounded-full bg-primary",
                        paused && "[animation-play-state:paused]",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile/tablet: manual snap-scroll carousel with always-visible captions. */}
          <div
            ref={stripRef}
            className="flex lg:hidden gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-3 px-3 pb-1"
          >
            {GALLERY.map((item, i) => (
              <div
                key={item.id}
                data-idx={i}
                className="snap-center shrink-0 basis-[80%] sm:basis-[46%]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-inset ring-black/5">
                  <SmartImage
                    src={item.src}
                    alt={item.title}
                    fill
                    objectFit="cover"
                    sizes="(max-width: 640px) 80vw, 46vw"
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="mb-1.5 inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        {String(i + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-base font-bold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-xs text-white/85">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile dot indicators. */}
          <div className="mt-4 flex justify-center gap-2 lg:hidden">
            {GALLERY.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-label={`Show ${item.title}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-6 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400",
                )}
              />
            ))}
          </div>
        </div>

        {/* Stats — hairline-divided card, numbers count up on scroll-in. */}
        <div
          ref={statsRef}
          className={cn(
            "mt-10 lg:mt-14 overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 shadow-sm",
            revealClass,
          )}
          style={revealStyle(2)}
        >
          <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-white px-4 py-6 text-center sm:py-8"
              >
                <div className="text-2xl font-bold tracking-tight text-primary tabular-nums lg:text-4xl">
                  <StatValue raw={stat.value} play={statsInView} />
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-600 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
