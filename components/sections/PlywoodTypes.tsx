"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Box,
  DoorOpen,
  Frame,
  LayoutGrid,
  Droplets,
  CheckCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/**
 * Home "Our Plywood Range" — an editorial product grid (redesign). A featured flagship band
 * (Plywood) leads, followed by five equal product cards. Red is used as an accent only (pills,
 * icons, one featured CTA); the scroll-in reveal reuses the CSS-only `.animate-fade-up` utility
 * so content is never hidden from crawlers / no-JS users (see globals.css §utilities).
 *
 * Interaction: the whole card is a stretched Link to its product page (SEO internal linking),
 * with a per-product "Get quote" button layered above it (opens the page-level QuoteModal via
 * onOpenQuoteModal). Chipboard has no product page yet, so it is intentionally quote-only.
 */

type ProductCard = {
  name: string;
  /** Product/category page; omitted → quote-only card (no deep link). */
  href?: string;
  image: string;
  icon: LucideIcon;
  description: string;
  highlight: string;
  thickness: string;
  sizes: string;
  /** Shown only on the featured band. */
  features?: string[];
  brochure?: string;
};

const PRODUCTS: ProductCard[] = [
  {
    name: "Plywood",
    href: "/plywood",
    image: "/images/plywoodRange/Plywood.webp",
    icon: Layers,
    description:
      "Durable, termite-proof and fire-resistant plywood engineered through our QuadPro process for lasting strength and a smooth, workable finish.",
    highlight: "Most Popular",
    thickness: "4–25 mm",
    sizes: "10×4, 8×4, 7×4 ft.",
    features: ["Durable", "Eco-Safe", "Fire-Resistant", "Termite-Proof"],
    brochure: "/brochure/plywood.pdf",
  },
  {
    name: "Blockboard",
    href: "/products/block-board-india",
    image: "/images/plywoodRange/Blockboard.webp",
    icon: Box,
    description:
      "High-density blockboard for wardrobes and cabinets — dimensionally stable with high screw-holding strength and anti-warp treatment.",
    highlight: "Best Value",
    thickness: "19–25 mm",
    sizes: "10×4 ft. +",
    brochure: "/brochure/blockboard.pdf",
  },
  {
    name: "Flush Door",
    href: "/products/flush-door-india",
    image: "/images/plywoodRange/Flush-Door.webp",
    icon: DoorOpen,
    description:
      "BWP-grade flush doors with superior strength, a smooth finish and termite resistance for main doors, bedrooms and offices.",
    highlight: "Smooth Finish",
    thickness: "25–40 mm",
    sizes: "Up to 10 ft.",
    brochure: "/brochure/flushdoor.pdf",
  },
  {
    name: "Shuttering Ply",
    href: "/products/shuttering-plywood-india",
    image: "/images/plywoodRange/Shuttering-Ply.webp",
    icon: Frame,
    description:
      "High-density shuttering plywood with a mirror-finish surface, built for repeated concrete formwork and heavy-duty site use.",
    highlight: "Weather-Resistant",
    thickness: "9–25 mm",
    sizes: "8×4 ft.",
    brochure: "/brochure/shuttering.pdf",
  },
  {
    // Quote-only: no product page exists yet (see plan). Card omits href → not navigable.
    name: "Chipboard",
    image: "/images/plywoodRange/Chipboard.webp",
    icon: LayoutGrid,
    description:
      "High-density chipboard with a smooth surface, uniform core and excellent machinability for cabinets, tables and shelves.",
    highlight: "Versatile",
    thickness: "9–25 mm",
    sizes: "8×6, 9×6 ft.",
    brochure: "/brochure/chipboard.pdf",
  },
  {
    name: "WPC / PVC Boards",
    href: "/products/saburi-smart-panel-wpc-board",
    image: "/images/plywoodRange/WPC-doors.webp",
    icon: Droplets,
    description:
      "100% waterproof, termite-proof and eco-friendly WPC/PVC panels — ideal for kitchens, bathrooms and ceilings.",
    highlight: "Lifetime Warranty",
    thickness: "6–18 mm",
    sizes: "8×4 ft.",
    brochure: "/brochure/wpc-pvc.pdf",
  },
];

export function PlywoodTypes({
  onOpenQuoteModal,
}: {
  onOpenQuoteModal: (productName: string, brochureUrl?: string) => void;
}) {
  const [featured, ...rest] = PRODUCTS;
  const FeaturedIcon = featured.icon;

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left lg:text-center mb-8 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 lg:mb-4">
            Our <span className="text-primary">Plywood Range</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto ps-0 lg:px-4">
            Explore our diverse product range crafted for strength, style, and sustainability to suit every space and purpose.
          </p>
          <div className="mt-4 lg:mt-6">
            <Link
              href="/plywood"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary transition-all hover:gap-3"
            >
              View the full plywood range
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Featured flagship band */}
        <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-xl animate-fade-up mb-6 lg:mb-8">
          <div className="grid lg:grid-cols-2">
            {/* image */}
            <div className="relative overflow-hidden bg-gray-100 aspect-[16/10] lg:aspect-auto lg:min-h-[400px]">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
              />
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {featured.highlight}
              </span>
            </div>
            {/* content */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FeaturedIcon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Flagship range</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-black mb-3">
                <Link href={featured.href!} className="link-underline">
                  {featured.name}
                </Link>
              </h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed mb-5">{featured.description}</p>
              {/* feature ticks */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                {featured.features?.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5 text-xs lg:text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </span>
                ))}
              </div>
              {/* specs */}
              <div className="flex flex-wrap gap-x-10 gap-y-3 mb-6 pt-5 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Available thickness</div>
                  <div className="text-sm font-semibold text-black">{featured.thickness}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Standard sizes</div>
                  <div className="text-sm font-semibold text-black">{featured.sizes}</div>
                </div>
              </div>
              {/* CTAs */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <Link
                  href={featured.href!}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                  Explore the full range
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(featured.name, featured.brochure)}
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-primary text-black hover:text-primary text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                  Get quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid — flex-wrap so the final (partial) row stretches to fill: 5 cards render as
            3 equal + 2 wider with no vacant cell, at every breakpoint (a 3-col grid would leave a gap). */}
        <div className="flex flex-wrap gap-6">
          {rest.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.name}
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
                className="group relative grow basis-full min-w-0 sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 motion-reduce:hover:translate-y-0 animate-fade-up flex flex-col"
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-[16/10]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {p.highlight}
                  </span>
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {p.href ? (
                      <Link
                        href={p.href}
                        className="link-underline inline-flex items-center gap-1.5 rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                      >
                        {p.name}
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    ) : (
                      <span>{p.name}</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                      {p.thickness}
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                      {p.sizes}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => onOpenQuoteModal(p.name, p.brochure)}
                      className="relative z-10 w-full inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Get quote
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
