"use client";

import { useState, useEffect } from "react";

// Hero slides with responsive images for different screen sizes. These banners are art-directed
// marketing assets that already carry their own headline baked into the image, so the slider
// renders image-only. Slide navigation mirrors rockwool.com/group: a row of text tabs at the
// bottom of the hero over a soft gradient, each tab carrying a grey track and the active tab a red
// progress bar that fills over the slide's display duration, then auto-advances.
// Format: { desktop: "url", tablet: "url", mobile: "url" }
const SLIDE_MS = 5000;

const slides = [
  {
    title: "Saburi fire retardant plywood",
    tab: "Fire Retardant",
    images: {
      desktop: "/images/heroBanners/fire-retardant-desk.webp",
      tablet: "/images/heroBanners/fire-retardant-tab.webp",
      mobile: "/images/heroBanners/fire-retardant-mob.webp",
    },
  },
  {
    title: "Saburi calibrated plywood — precision-sized panels",
    tab: "Calibrated",
    images: {
      desktop: "/images/heroBanners/calibrated-desk.webp",
      tablet: "/images/heroBanners/calibrated-tab.webp",
      mobile: "/images/heroBanners/calibrated-mob.webp",
    },
  },
  {
    title: "Saburi marine grade waterproof plywood",
    tab: "Marine Grade",
    images: {
      desktop: "/images/heroBanners/marine-grade-desk.webp",
      tablet: "/images/heroBanners/marine-grade-tab.webp",
      mobile: "/images/heroBanners/marine-grade-mob.webp",
    },
  },
  {
    title: "Saburi zero-emission E0 plywood",
    tab: "E-Zero Emission",
    images: {
      desktop: "/images/heroBanners/zero-emission-desk.webp",
      tablet: "/images/heroBanners/zero-emission-tab.webp",
      mobile: "/images/heroBanners/zero-emission-mob.webp",
    },
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset the auto-advance timer on every slide change (auto OR manual tab click) so the red
  // progress bar — which restarts via its `key` below — always tracks the real time-to-advance.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full aspect-[824/620] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[500px] bg-black">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <picture>
              {/* Desktop image - visible on large screens (>= 1024px) */}
              <source media="(min-width: 1024px)" srcSet={slide.images.desktop} />
              {/* Tablet image - visible on medium screens (768px - 1023px) */}
              <source media="(min-width: 768px)" srcSet={slide.images.tablet} />
              {/* Mobile image with srcSet for 1x/2x support */}
              <img
                src={slide.images.mobile}
                srcSet={`${slide.images.mobile.replace(".webp", "-1x.webp")} 412w, ${slide.images.mobile} 824w`}
                sizes="(max-width: 768px) 100vw, 412px"
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </div>
        ))}

        {/* Rockwool-style bottom tab navigation — labels over a soft gradient, each with a grey
            track; the active tab's red bar fills over the slide's display time, then auto-advances. */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white/95 via-white/88 to-transparent pt-5 pb-2">
          <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-stretch justify-between">
              {slides.map((slide, index) => {
                const activeTab = index === currentSlide;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`relative flex-1 px-2 pb-4 pt-3 text-center text-xs transition-colors sm:text-sm ${activeTab ? "font-semibold text-neutral-900" : "font-medium text-neutral-600 hover:text-neutral-900"
                      }`}
                    aria-current={activeTab ? "true" : "false"}
                  >
                    <span className="line-clamp-1">{slide.tab}</span>
                    {/* Grey track (every tab). */}
                    <span
                      className="pointer-events-none absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-neutral-400/80"
                      aria-hidden="true"
                    />
                    {/* Red progress fill on the active tab; `key` restarts the animation each slide. */}
                    {activeTab && (
                      <span
                        key={currentSlide}
                        className="animate-hero-tab-progress pointer-events-none absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-[#D20014]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
