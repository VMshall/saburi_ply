"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

/**
 * Gallery grid + lightbox (client island). The grid is a CSS-columns masonry so the varied
 * event-photo aspect ratios (3:2, 4:3, 16:9, ultra-wide) keep their natural shape instead of
 * being cropped into uniform boxes; each tile carries its intrinsic width/height so next/image
 * reserves space with zero CLS. Category filters re-flow the grid with a staggered crossfade,
 * and the active filter is marked by a shared red pill that slides between tabs (framer-motion
 * layoutId). Hover reveals the event caption + an expand affordance, mirroring the home
 * PlywoodGallery language. Opening a tile runs a shared-element morph (framer layoutId) from the
 * thumbnail into a full-screen lightbox that supports swipe/drag navigation, drag-down dismiss,
 * click-to-zoom (toward the click point), and neighbour preloading so prev/next never spins. All
 * motion is gated on prefers-reduced-motion. The lightbox holds open/index state, keyboard nav,
 * and toggles document.body.style.overflow, so it stays here while app/gallery/page.tsx remains a
 * server component that exports metadata.
 */

type GalleryItem = {
  id: number;
  title: string;
  name?: string;
  src: string;
  categories: string[];
  width: number;
  height: number;
};

function Lightbox({
  images,
  index,
  openIndex,
  onClose,
  onNav,
}: {
  images: GalleryItem[];
  index: number;
  /** The index the lightbox was opened at — only that image morphs to/from its thumbnail. */
  openIndex: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const reduce = useReducedMotion();
  const current = images[index];
  // Zoom toward the click point (transform-origin) rather than dead-centre; no pan needed.
  const [zoom, setZoom] = useState({ on: false, ox: 50, oy: 50 });

  // Preload the neighbours so prev/next never shows a spinner.
  useEffect(() => {
    if (typeof window === "undefined" || images.length < 2) return;
    [index - 1, index + 1].forEach((n) => {
      const it = images[(n + images.length) % images.length];
      if (it) {
        const img = new window.Image();
        img.src = it.src;
      }
    });
  }, [index, images]);

  // Reset zoom whenever the image changes.
  useEffect(() => setZoom({ on: false, ox: 50, oy: 50 }), [index]);

  if (!current) return null;

  // The morph only runs for the image the user actually opened from the grid, so open/close fly
  // to/from the right thumbnail while prev/next stays a clean crossfade (no random-direction
  // morphs from off-screen thumbnails).
  const isOpenImage = index === openIndex;
  const morphId = reduce || !isOpenImage ? undefined : `gallery-tile-${current.id}`;

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (zoom.on) return; // when zoomed, a drag is a no-op (swipe nav is disabled)
    const { offset, velocity } = info;
    if (offset.y > 140 || velocity.y > 800) return onClose();
    if (images.length > 1 && (offset.x < -90 || velocity.x < -500)) return onNav(1);
    if (images.length > 1 && (offset.x > 90 || velocity.x > 500)) return onNav(-1);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${current.title} — image ${index + 1} of ${images.length}`}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            className="absolute left-2 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-4 sm:p-3"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            className="absolute right-2 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-4 sm:p-3"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </>
      )}

      {/* Morphing frame — shares layoutId with the grid tile so it flies from the thumbnail. */}
      <motion.div
        layoutId={morphId}
        className="relative flex max-h-[86vh] max-w-[92vw] items-center justify-center overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={current.id}
            src={current.src}
            alt={current.name || current.title || "Gallery image"}
            draggable={false}
            className="max-h-[86vh] max-w-[92vw] select-none object-contain shadow-2xl"
            style={{
              transformOrigin: `${zoom.ox}% ${zoom.oy}%`,
              cursor: zoom.on ? "zoom-out" : "zoom-in",
              touchAction: "none",
            }}
            initial={reduce || isOpenImage ? false : { opacity: 0 }}
            animate={{ opacity: 1, scale: zoom.on ? 2.2 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
            drag={!reduce && !zoom.on}
            dragElastic={0.5}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => {
              e.stopPropagation();
              const r = e.currentTarget.getBoundingClientRect();
              const ox = ((e.clientX - r.left) / r.width) * 100;
              const oy = ((e.clientY - r.top) / r.height) * 100;
              setZoom((z) => (z.on ? { on: false, ox: 50, oy: 50 } : { on: true, ox, oy }));
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://picsum.photos/seed/${current.id}/800/600`;
            }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Caption + counter */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2 text-center text-white">
        <p className="mb-1 text-sm font-medium sm:text-base">
          {current.title}
          {current.name && ` — ${current.name}`}
        </p>
        <p className="text-xs text-white/70 sm:text-sm">
          {index + 1} / {images.length}
        </p>
      </div>
    </motion.div>
  );
}

// Intrinsic dimensions are baked in so next/image reserves the right box (no CLS) and the
// masonry columns get their true heights.
const ALL_ITEMS: GalleryItem[] = [
  { id: 1, title: "Vroom South", src: "/images/gallery/annual-meet/vroom-south/2.webp", categories: ["Annual Meet"], width: 7008, height: 4672 },
  { id: 2, title: "Vroom South", src: "/images/gallery/annual-meet/vroom-south/1.webp", categories: ["Annual Meet"], width: 7008, height: 4672 },
  { id: 8, title: "Abid 2022, Kolkata", src: "/images/gallery/exhibitions/abid-2022-kolkata/1.webp", categories: ["Exhibitions"], width: 1280, height: 960 },
  { id: 10, title: "Abid 2022, Kolkata", src: "/images/gallery/exhibitions/abid-2022-kolkata/3.webp", categories: ["Exhibitions"], width: 1280, height: 960 },
  { id: 14, title: "IIID 2022, Hyderabad", src: "/images/gallery/exhibitions/iiid-2022-hyderabad/2.webp", categories: ["Exhibitions"], width: 1280, height: 960 },
  { id: 15, title: "IIID 2022, Hyderabad", src: "/images/gallery/exhibitions/iiid-2022-hyderabad/1.webp", categories: ["Exhibitions"], width: 1280, height: 960 },
  { id: 20, title: "IIID 2025, Odisha", src: "/images/gallery/exhibitions/iiid-2025-odisha/1.webp", categories: ["Exhibitions"], width: 1280, height: 572 },
  { id: 21, title: "IIID 2025, Odisha", src: "/images/gallery/exhibitions/iiid-2025-odisha/2.webp", categories: ["Exhibitions"], width: 1280, height: 572 },
  { id: 23, title: "Matecia 2022, Delhi", src: "/images/gallery/exhibitions/matecia-2022-delhi/3.webp", categories: ["Exhibitions"], width: 1024, height: 768 },
  { id: 24, title: "Matecia 2022, Delhi", src: "/images/gallery/exhibitions/matecia-2022-delhi/1.webp", categories: ["Exhibitions"], width: 1280, height: 960 },
  { id: 50, title: "Matecia 2025, Bangalore", src: "/images/gallery/exhibitions/matecia-2025-bangalore/1.webp", categories: ["Exhibitions"], width: 6000, height: 4000 },
  { id: 59, title: "Matecia 2025, Bangalore", src: "/images/gallery/exhibitions/matecia-2025-bangalore/10.webp", categories: ["Exhibitions"], width: 6000, height: 4000 },
  { id: 33, title: "Factory Tour", src: "/images/gallery/factory-tour/4.webp", categories: ["Factory Tour"], width: 7008, height: 4672 },
  { id: 40, title: "Factory Tour", src: "/images/gallery/factory-tour/11.webp", categories: ["Factory Tour"], width: 7008, height: 4672 },
  { id: 42, title: "Influencer Meet", src: "/images/gallery/influencer-meet/4.webp", categories: ["Influencer Meet"], width: 1280, height: 720 },
  { id: 45, title: "Influencer Meet", src: "/images/gallery/influencer-meet/1.webp", categories: ["Influencer Meet"], width: 1600, height: 900 },
];

const GALLERY_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

export function GalleryGrid() {
  const reduce = useReducedMotion();

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ALL_ITEMS.flatMap((i) => i.categories)))],
    [],
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpenIndex, setLightboxOpenIndex] = useState(0);
  // SSR/no-JS renders the final (visible) state; enter animations only arm after mount, so the
  // static HTML never ships tiles at opacity:0. Filter-change tiles still stagger in because they
  // mount fresh once `mounted` is true. Mirrors PlywoodGallery's reveal gating.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? ALL_ITEMS
        : ALL_ITEMS.filter((it) => it.categories.includes(activeCategory)),
    [activeCategory],
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpenIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const nav = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((prev) => (prev + dir + filtered.length) % filtered.length);
    },
    [filtered.length],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "ArrowRight") nav(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, nav]);

  return (
    <>
      {/* Category filters — the active tab is marked by a shared red pill that slides between
          tabs (layoutId), so switching filters reads as one continuous control. */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive ? "text-white" : "text-gray-600 hover:text-black",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="gallery-filter-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Masonry — CSS columns keep source order top-to-bottom within each column. Items carry
          break-inside-avoid so a tile never splits across a column boundary. */}
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.figure
              key={item.id}
              layout={mounted && !reduce}
              initial={mounted && !reduce ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i, 10) * 0.035,
                    }
              }
              className="group relative mb-3 sm:mb-4 block break-inside-avoid overflow-hidden rounded-xl ring-1 ring-inset ring-black/5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <button
                type="button"
                onClick={() => openLightbox(filtered.indexOf(item))}
                aria-label={`View ${item.title}`}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* layoutId marks this thumbnail as the morph origin for the lightbox. */}
                <motion.div layoutId={reduce ? undefined : `gallery-tile-${item.id}`}>
                  <SmartImage
                    src={item.src}
                    alt={item.name || item.title || "Gallery image"}
                    width={item.width}
                    height={item.height}
                    sizes={GALLERY_SIZES}
                    className={cn(
                      "w-full",
                      "transition-transform duration-[600ms] ease-out will-change-transform group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                    )}
                  />
                </motion.div>

                {/* Scrim — always faintly present on touch (no hover), reveals on hover at lg+. */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100"
                  aria-hidden="true"
                />

                {/* Expand affordance. */}
                <span
                  className="pointer-events-none absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 lg:group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <Maximize2 className="h-4 w-4" />
                </span>

                {/* Caption. */}
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white transition-all duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                  <div className="mb-1 inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                      {item.categories[0]}
                    </span>
                  </div>
                  <div className="text-sm font-semibold leading-tight">{item.title}</div>
                </figcaption>
              </button>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={filtered}
            index={lightboxIndex}
            openIndex={lightboxOpenIndex}
            onClose={closeLightbox}
            onNav={nav}
          />
        )}
      </AnimatePresence>
    </>
  );
}
