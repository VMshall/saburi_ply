"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GOOGLE } from "@/data/site";

/**
 * "Rate us on Google" — the collect half of the Google-reviews feature (Feature 1).
 *
 * ONE public write-review link for EVERYONE — no review gating (happy→Google / unhappy→form is
 * illegal under the FTC Consumer Review Rule and banned by Google; see CLAUDE.md). Opens Google's
 * review dialog in a new tab so the visitor never loses the site. Rating + URL are read from the
 * single source in data/site.ts, so there is no number to drift.
 *
 * No third-party script (the Google "G" is an inline SVG) → zero extra JS, no layout shift.
 */

/** Official Google "G" mark (inline SVG). */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

/** Accurate partial-fill star row for a 0–5 rating (4.7 → 94% width of yellow). */
function Stars({ rating, starClassName = "h-4 w-4" }: { rating: number; starClassName?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex text-gray-300">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={cn("fill-current", starClassName)} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex overflow-hidden text-yellow-400"
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={cn("shrink-0 fill-current", starClassName)} />
        ))}
      </span>
    </span>
  );
}

/** Fire a GTM/GA4 event so we can measure which surface drives review clicks. */
function track(placement: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer?.push({ event: "review_cta_click", placement });
  w.gtag?.("event", "review_cta_click", { placement });
}

type RateOnGoogleProps = {
  /** Visual treatment per surface: `card` (thank-you), `footer` (dark), `button` (light sections). */
  variant?: "card" | "footer" | "button";
  /** Analytics label for where the click happened (e.g. "thank_you_page", "footer"). */
  placement: string;
  className?: string;
};

export function RateOnGoogle({ variant = "button", placement, className }: RateOnGoogleProps) {
  const link = {
    href: GOOGLE.writeReviewUrl,
    target: "_blank" as const,
    rel: "noopener noreferrer",
    onClick: () => track(placement),
    "aria-label": "Review Saburi Ply on Google — opens in a new tab",
  };

  // Dark-footer badge: doubles as a passive trust signal (shows the real 4.7★).
  if (variant === "footer") {
    return (
      <a
        {...link}
        className={cn(
          "group inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
          className,
        )}
      >
        <GoogleG className="h-6 w-6 shrink-0" />
        <span>
          <span className="flex items-center gap-1.5">
            <Stars rating={GOOGLE.rating} starClassName="h-3.5 w-3.5" />
            <span className="text-xs font-semibold text-white">{GOOGLE.rating.toFixed(1)}</span>
          </span>
          <span className="text-xs text-gray-300 transition-colors group-hover:text-primary">
            Review us on Google →
          </span>
        </span>
      </a>
    );
  }

  // Post-conversion card (thank-you surfaces). Copy self-selects real customers so we never
  // solicit a review from someone who hasn't bought yet.
  if (variant === "card") {
    return (
      <div
        className={cn(
          "mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md",
          className,
        )}
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <GoogleG className="h-5 w-5" />
          <Stars rating={GOOGLE.rating} />
          <span className="text-sm font-semibold text-gray-700">{GOOGLE.rating.toFixed(1)}</span>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          Already a Saburi Ply customer? A 30-second Google review helps other builders &amp;
          dealers choose with confidence.
        </p>
        <a
          {...link}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          <GoogleG className="h-4 w-4" /> Review us on Google
        </a>
      </div>
    );
  }

  // Secondary CTA for light sections (e.g. next to a primary "Get a Quote" button).
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "border-primary/30 text-primary hover:bg-primary/5 hover:text-primary",
        className,
      )}
    >
      <a {...link}>
        <GoogleG /> Review us on Google
      </a>
    </Button>
  );
}
