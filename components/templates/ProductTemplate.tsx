import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/types";
import { products } from "@/data/products";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import { ReadMore } from "@/components/islands/ReadMore";
import { SpecsTabs } from "@/components/islands/SpecsTabs";
import { FeatureBadgesRail } from "@/components/islands/FeatureBadgesRail";
import { FaqAccordion } from "@/components/islands/FaqAccordion";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/jsonld";

/**
 * Shared product page (§3). Server shell — H1/grade pills, banner, image, brand, action bar,
 * FAQ heading, and all JSON-LD are server-rendered; interactivity is delegated to small client
 * islands (ReadMore, SpecsTabs, FeatureBadgesRail, FaqAccordion). Badge icons are SSR'd here
 * and handed to the rail as props so react-icons never enters a client bundle.
 *
 * Deviation from the legacy page (flagged): the desktop "sync the info card's height to the
 * image card + inner-scroll" effect is dropped — the info card now sizes to its content (the
 * image stays sticky). This trades a non-essential desktop visual tweak for an all-server,
 * island-light layout per §9.
 */
export function ProductTemplate({ product }: { product: Product }) {
  const { name, heading, gradePills, introHtml, images, featureBadges, faqs } = product;
  const pathname = `/products/${product.slug}`;

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(pathname),
    productSchema(product),
  ];
  const faq = faqSchema(faqs);
  if (faq) schemas.push(faq);

  // SSR the badge icons (keeps react-icons out of the FeatureBadgesRail client bundle).
  const badgeItems = featureBadges.map((b) => ({
    icon: <Icon iconKey={b.iconKey} className="h-6 w-6" />,
    title: b.title,
    sub: b.sub,
  }));

  // Related products (internal linking): explicit `related` slugs, else same-category siblings.
  const curated = (product.related ?? [])
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
  const relatedProducts = curated.length
    ? curated
    : products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const relatedHeading = product.category === "plywood" ? "Related Plywood" : "Related Products";

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={product.bannerImage} />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide uppercase">
              {heading}
            </h1>
            {gradePills.length > 0 && (
              <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold text-gray-700 tracking-wider">
                {gradePills.map((pill, i) => (
                  <Fragment key={i}>
                    {i > 0 && <span className="w-px h-4 bg-gray-300" />}
                    <span className="flex items-center gap-2">
                      <Icon iconKey={pill.iconKey} className="w-4 h-4 text-primary" />
                      {pill.label}
                    </span>
                  </Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: product image */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 p-4 sticky top-24 self-start max-w-2xl mx-auto lg:mx-0">
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg">
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

            {/* Right: info card */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 p-6 relative">
              <div className="mb-2">
                <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {name}
                </h2>
              </div>

              <div className="mt-2">
                <ReadMore html={introHtml} />
              </div>

              <hr className="my-5 border-gray-200" />

              <SpecsTabs
                features={product.features}
                applications={product.applications}
                thicknesses={product.thicknesses}
                sizes={product.sizes}
              />
            </div>
          </div>

          {/* Feature badges rail + action bar */}
          {featureBadges.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 overflow-hidden">
              <FeatureBadgesRail items={badgeItems} />
              <div className="px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  Explore specifications and ask our team for details.
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={faqs.length ? "#faqs" : "#top"}
                    className="inline-flex items-center justify-center h-10 rounded-full px-5 border bg-white hover:bg-gray-50 text-gray-800"
                  >
                    Know More
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-10 rounded-full px-5 bg-primary text-white hover:bg-primary/90"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section id="faqs" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about {name}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <FaqAccordion faqs={faqs} />
            </div>
            <div className="mt-12 text-center">
              <div className="text-sm text-gray-600 mb-6">
                Still have questions? Our team is here to help you.
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 rounded-full px-8 bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related products — internal links to siblings (+ the hub for plywood) */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#faf8f3] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
                {relatedHeading}
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/products/${rp.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.05)] transition-all hover:ring-primary/30 hover:shadow-[0_16px_40px_rgba(2,6,23,0.1)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50">
                    {rp.images[0] && (
                      <SmartImage
                        src={rp.images[0].src}
                        alt={rp.images[0].alt}
                        fill
                        objectFit="contain"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="h-full w-full p-3 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {rp.certification && (
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/10 backdrop-blur">
                        {rp.certification}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold text-gray-900">{rp.name}</h3>
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-primary">
                      View details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {product.category === "plywood" && (
              <div className="mt-8 text-center">
                <Link
                  href="/plywood"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  View the full plywood range <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <JsonLd data={schemas} />
    </div>
  );
}
