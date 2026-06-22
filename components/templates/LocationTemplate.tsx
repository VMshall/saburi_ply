import type { Faq, Location, Product } from "@/data/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import { FaqAccordion } from "@/components/islands/FaqAccordion";
import { products } from "@/data/products";
import { breadcrumbSchema, localBusinessSchema, faqSchema } from "@/lib/jsonld";

/**
 * Shared state/city location page (§3). Server-rendered: intro prose + a featured-plywood rail
 * (outbound internal links to product pages + the /plywood hub, so location pages are no longer
 * link dead-ends) + a location-aware FAQ (the only client island) + a CTA. Emits BreadcrumbList +
 * LocalBusiness-with-areaServed + FAQPage JSON-LD — the key signals for "best plywood in <place>".
 */

// Most-requested plywood grades, surfaced on every location page for relevance + internal links.
const FEATURED_SLUGS = [
  "marine-plywood-india",
  "saburi-perennial",
  "saburi-scout-plywood",
  "fire-retardant-india",
  "shuttering-plywood-india",
  "saburi-club-h-plus",
];
const featuredProducts: Product[] = FEATURED_SLUGS.map((s) =>
  products.find((p) => p.slug === s),
).filter((p): p is Product => Boolean(p));

const linkClass =
  'text-primary font-medium underline underline-offset-2 hover:no-underline';

export function LocationTemplate({ location }: { location: Location }) {
  const { name, heading, introHtml, images, state } = location;
  const pathname = `/${location.slug}`;
  const place = location.city ?? location.state;

  // Location-aware FAQ (place name makes each page's Q&As unique) → FAQPage schema + visible accordion.
  const faqs: Faq[] = [
    {
      question: `Where can I buy Saburi plywood in ${place}?`,
      answerHtml: `Saburi Ply supplies its full plywood range across ${state}${location.city ? `, including ${location.city}` : ""}. <a href="/contact" class="${linkClass}">Contact our team</a> for your nearest dealer or to place an order.`,
    },
    {
      question: `Which plywood grades are available in ${state}?`,
      answerHtml: `Our complete IS-certified range is available, including marine/BWP (IS 710), commercial MR (IS 303), structural BWP (IS 10701), fire-retardant (IS 5509) and shuttering (IS 4990) plywood. Browse the <a href="/plywood" class="${linkClass}">full plywood range</a> for details.`,
    },
    {
      question: `Does Saburi deliver plywood across ${state}?`,
      answerHtml: `Yes. As a leading plywood manufacturer and supplier in ${state}, Saburi Ply arranges prompt delivery for contractors, designers and homeowners. <a href="/contact" class="${linkClass}">Request a quote</a> to get started.`,
    },
  ];

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(pathname),
    localBusinessSchema({
      pathname,
      name: `Saburi Ply, ${location.state}`,
      areaServed: location.areaServed,
    }),
  ];
  const faq = faqSchema(faqs);
  if (faq) schemas.push(faq);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={location.bannerImage} />

      {/* Intro */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
              {heading}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: image */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 p-4 sticky top-24 self-start max-w-2xl mx-auto lg:mx-0">
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg flex items-center justify-center">
                  {images[0] && (
                    <SmartImage
                      src={images[0].src}
                      alt={images[0].alt}
                      fill
                      objectFit="contain"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-full w-full bg-gray-50"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right: info card with intro prose */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-auto ring-1 ring-gray-100 p-6 relative">
              <div className="mb-2">
                <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {name}
                </h2>
              </div>
              <div
                className="mt-2 text-gray-700 leading-relaxed [&>p]:mb-2 [&_strong]:text-primary [&_strong]:font-semibold [&_ul]:mt-2 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: introHtml }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Plywood available here — outbound links to products + the hub */}
      <section className="bg-[#faf8f3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
              Plywood Available in {state}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-600">
              Our most-requested grades, supplied across {place}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex items-center gap-4 rounded-xl bg-white p-4 ring-1 ring-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.05)] transition-all hover:ring-primary/30 hover:shadow-[0_16px_40px_rgba(2,6,23,0.1)]"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-stone-100 to-stone-50">
                  {p.images[0] && (
                    <SmartImage
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      objectFit="contain"
                      sizes="64px"
                      className="p-1.5"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-gray-900">{p.name}</h3>
                  {p.certification && (
                    <span className="text-xs font-medium text-primary">{p.certification}</span>
                  )}
                  <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary">
                    View details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/plywood"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              View the full plywood range <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-gray-600">Buying Saburi plywood in {place}.</p>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl bg-neutral-900 px-6 py-10 text-center lg:px-12">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Need plywood in {place}?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-white/70">
              Tell us your project and we&apos;ll recommend the right grade and share a competitive
              quote.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Get a quote
              </Link>
              <Link
                href="/plywood"
                className="rounded-lg px-7 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
              >
                Browse plywood
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={schemas} />
    </div>
  );
}
