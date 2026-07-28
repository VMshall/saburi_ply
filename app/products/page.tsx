import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { getProduct } from "@/data/products";
import { buildPageMetadata } from "@/lib/seo";

/**
 * /products — the destination for the "Products" nav item (the retired hover mega-menu). Shows
 * the eight headline Saburi plywood grades as cards, plus a "View all plywood" CTA into the rich
 * /plywood hub. Selection + order are curated here; each card's image and IS-grade badge are
 * pulled from data/products.ts via getProduct(), so those details never drift from the catalogue.
 *
 * SEO note: this is a lightweight plywood gateway whose content is a subset of the /plywood hub,
 * so it is `noindex`ed to avoid competing with /plywood for plywood search intent. /plywood stays
 * the single indexable, canonical plywood page.
 */
export const dynamic = "force-static";

const seo = {
  title: "Our Plywood Products | Saburi Ply",
  description:
    "Browse Saburi's headline plywood grades — Titanium Plus, Perennial, Club H+, Gold, FR, Scout, Gold Flexi and Shine Platinum — then explore the full IS-certified plywood range.",
  canonical: "/products",
};

export const metadata: Metadata = buildPageMetadata(seo, { noindex: true });

/** Curated 8 plywood products (order + display label fixed here; imagery/grade from the data). */
const PLYWOOD_PRODUCTS: { slug: string; label: string }[] = [
  { slug: "saburi-titanium-plus", label: "Saburi Titanium Plus" },
  { slug: "saburi-perennial", label: "Saburi Perennial" },
  { slug: "saburi-club-h-plus", label: "Saburi Club H+" },
  { slug: "marine-plywood-india", label: "Saburi Gold" },
  { slug: "fire-retardant-india", label: "Saburi FR" },
  { slug: "saburi-scout-plywood", label: "Saburi Scout" },
  { slug: "flexi-plywood-india", label: "Saburi Gold Flexi" },
  { slug: "shuttering-plywood-india", label: "Saburi Shine Platinum" },
];

export default function ProductsIndexPage() {
  const cards = PLYWOOD_PRODUCTS.map(({ slug, label }) => {
    const p = getProduct(slug);
    return {
      slug,
      label,
      href: `/products/${slug}`,
      image: p?.images?.[0],
      certification: p?.certification,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO ===== */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-7 bg-primary" />
            Our Products
            <span className="h-px w-7 bg-primary" />
          </span>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            The Saburi Plywood Range
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            IS-certified plywood engineered for every application — from boiling-waterproof marine
            and structural grades to fire-retardant, flexible and shuttering ply.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span>
              <span className="font-bold text-primary">Marine</span> to fire-retardant
            </span>
            <span className="hidden h-4 w-px bg-gray-300 sm:inline-block" />
            <span>
              <span className="font-bold text-primary">IS-certified</span> grades
            </span>
            <span className="hidden h-4 w-px bg-gray-300 sm:inline-block" />
            <span>
              Up to <span className="font-bold text-primary">lifetime</span> warranty
            </span>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT CARDS ===== */}
      <section className="bg-[#faf8f3] py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.05)] ring-1 ring-gray-100 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(2,6,23,0.12)] hover:ring-primary/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50">
                  {c.image && (
                    <SmartImage
                      src={c.image.src}
                      alt={c.image.alt}
                      fill
                      objectFit="contain"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full p-4 transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  )}
                  {c.certification && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/10 backdrop-blur">
                      {c.certification}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-base font-bold text-gray-900">{c.label}</h2>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View all plywood -> /plywood hub */}
          <div className="mt-10 flex justify-center lg:mt-12">
            <Link
              href="/plywood"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              View all plywood
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#b81d1d] px-6 py-12 text-center lg:px-16 lg:py-16">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Not sure which plywood fits your project?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/80">
              Tell us about your application and our team will recommend the right Saburi grade and
              share a quote.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:1800313666000"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> 1800 313 666 000
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
