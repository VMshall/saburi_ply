"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Hero slides with responsive images for different screen sizes
// Format: { desktop: "url", tablet: "url", mobile: "url" }
const slides = [
  {
    title: "bannerOne",
    images: {
      desktop: "/images/heroBanners/fire-retardant-desk.webp",
      tablet: "/images/heroBanners/fire-retardant-tab.webp",
      mobile: "/images/heroBanners/fire-retardant-mob.webp",
    },
  },
  {
    title: "bannerTwo",
    images: {
      desktop: "/images/heroBanners/calibrated-desk.webp",
      tablet: "/images/heroBanners/calibrated-tab.webp",
      mobile: "/images/heroBanners/calibrated-mob.webp",
    },
  },
  {
    title: "bannerThree",
    images: {
      desktop: "/images/heroBanners/marine-grade-desk.webp",
      tablet: "/images/heroBanners/marine-grade-tab.webp",
      mobile: "/images/heroBanners/marine-grade-mob.webp",
    },
  },
  {
    title: "bannerFour",
    images: {
      desktop: "/images/heroBanners/zero-emission-desk.webp",
      tablet: "/images/heroBanners/zero-emission-tab.webp",
      mobile: "/images/heroBanners/zero-emission-mob.webp",
    },
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[824/620] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[8/3] bg-black">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <picture>
              {/* Desktop image - visible on large screens (>= 1024px) */}
              <source
                media="(min-width: 1024px)"
                srcSet={slide.images.desktop}
              />
              {/* Tablet image - visible on medium screens (768px - 1023px) */}
              <source
                media="(min-width: 768px)"
                srcSet={slide.images.tablet}
              />
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
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-4 sm:h-4 rounded-full transition-all ${index === currentSlide ? "bg-primary scale-110" : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}
