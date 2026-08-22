"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Download, Minus, Plus, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CERTIFICATIONS } from "@/data/certifications";

const MIN_SCALE = 1;
// The scans are only ~550×790px, so past ~2x there is no detail left to reveal — this ceiling is
// for phones, where the image is displayed well below its native size and zooming genuinely helps.
// Anyone who needs to read a certificate number properly gets it from the PDF.
const MAX_SCALE = 3;

type Point = { x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Certificate viewer. Replaces the old hover "tooltip", which was a centred modal in everything but
 * name — opened by onMouseEnter on a non-focusable div (so unreachable by touch and keyboard), and
 * showing the certificate at 350px, i.e. smaller than the card it covered.
 *
 * A real dialog instead: backdrop, Escape, focus trap and focus-return come from Radix; ← / → step
 * through all nine certificates without closing; pinch or wheel zooms; and the signed PDF — which
 * was sitting unlinked in public/certificates — is the primary action.
 */
export function CertificateLightbox({
  index,
  onIndexChange,
  onClose,
}: {
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const cert = index === null ? null : CERTIFICATIONS[index];

  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  // Active pointers, so one finger pans and two pinch.
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);

  const reset = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Every certificate opens at 1x — carrying a previous zoom across would land the next one
  // scrolled to a random corner.
  useEffect(reset, [index, reset]);

  // Pan is clamped so the image can never be dragged clear of the frame.
  const clampPan = useCallback((p: Point, s: number): Point => {
    const el = viewportRef.current;
    if (!el || s <= 1) return { x: 0, y: 0 };
    const maxX = (el.clientWidth * (s - 1)) / 2;
    const maxY = (el.clientHeight * (s - 1)) / 2;
    return { x: clamp(p.x, -maxX, maxX), y: clamp(p.y, -maxY, maxY) };
  }, []);

  // Zoom about a focal point (cursor or pinch midpoint) rather than the centre, so the detail
  // under your finger stays under your finger.
  const zoomAt = useCallback(
    (nextScale: number, focal?: Point) => {
      const el = viewportRef.current;
      const s2 = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      setScale((s1) => {
        if (!el || !focal || s2 === s1) {
          setPan((p) => clampPan(p, s2));
          return s2;
        }
        const r = el.getBoundingClientRect();
        const c = { x: focal.x - r.left - r.width / 2, y: focal.y - r.top - r.height / 2 };
        setPan((p) => clampPan({ x: c.x - (c.x - p.x) * (s2 / s1), y: c.y - (c.y - p.y) * (s2 / s1) }, s2));
        return s2;
      });
    },
    [clampPan],
  );

  // Wheel zoom needs a non-passive native listener — React's synthetic wheel handler is passive,
  // so preventDefault() there is ignored and the page scrolls behind the dialog.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !cert) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), { x: e.clientX, y: e.clientY });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [cert, scale, zoomAt]);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + CERTIFICATIONS.length) % CERTIFICATIONS.length);
    },
    [index, onIndexChange],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);

    if (pointers.current.size >= 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((dist / pinchStart.current.dist) * pinchStart.current.scale, {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      });
      return;
    }
    if (scale > 1) {
      setPan((p) => clampPan({ x: p.x + (next.x - prev.x), y: p.y + (next.y - prev.y) }, scale));
    }
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };

  if (!cert || index === null) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          }
        }}
        className="flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl border-stone-200 p-0"
      >
        {/* Header — the built-in close button sits here, on white, where it stays visible. */}
        <div className="shrink-0 border-b border-stone-200 bg-white px-5 py-4 pr-14">
          <DialogTitle className="font-display text-base font-bold text-stone-900 sm:text-lg">
            {cert.title}
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-sm text-stone-500">
            {cert.description}
          </DialogDescription>
        </div>

        {/* Scan */}
        <div className="relative min-h-0 flex-1 bg-[#faf8f3]">
          <div
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onDoubleClick={(e) => zoomAt(scale > 1 ? 1 : 2, { x: e.clientX, y: e.clientY })}
            className="h-full min-h-[45vh] touch-none select-none overflow-hidden p-4 sm:p-6"
            style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
          >
            {/* Plain <img>, not next/image: the lightbox wants the original file at full
                resolution, which is exactly what next/image would resize away. The scans are
                32–64KB, so there is nothing to optimise. */}
            <img
              key={cert.id}
              src={cert.image}
              alt={`${cert.title} — ${cert.description}`}
              draggable={false}
              className="mx-auto h-full max-h-[62vh] w-auto max-w-full rounded-lg bg-white object-contain shadow-md"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transition: pointers.current.size ? "none" : "transform 0.15s ease-out",
              }}
            />
          </div>

          {/* Prev / next. Also on ← / → — these are the pointer affordance. */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous certificate"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md ring-1 ring-stone-200 transition hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:left-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next certificate"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md ring-1 ring-stone-200 transition hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-3"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>

        {/* Footer — zoom lives here rather than floating over the scan: this is a page for reading
            certificates, and a control bar parked across the bottom of every one of them covers
            exactly the fine print people open the dialog to read. The signed PDF is the point of
            the page, so it is the primary action. */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-stone-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5">
          <span className="hidden text-xs font-semibold tabular-nums text-stone-400 sm:block">
            {index + 1} / {CERTIFICATIONS.length}
          </span>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => zoomAt(scale / 1.4)}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-11 text-center text-xs font-semibold tabular-nums text-stone-500">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoomAt(scale * 1.4)}
              disabled={scale >= MAX_SCALE}
              aria-label="Zoom in"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={scale === MIN_SCALE && pan.x === 0 && pan.y === 0}
              aria-label="Reset zoom"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {cert.pdf ? (
            <a
              href={cert.pdf.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" strokeWidth={2.25} />
              Download PDF
              <span className="font-normal opacity-75">{cert.pdf.sizeMb} MB</span>
            </a>
          ) : (
            <a
              href={cert.image}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Open full image
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
