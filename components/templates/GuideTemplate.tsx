import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GuidePage, Product } from "@/data/types";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { FaqAccordion } from "@/components/islands/FaqAccordion";
import { getProduct } from "@/data/products";
import { getFaqsForPage, getGuidePage } from "@/lib/faqs";
import { breadcrumbSchema, guideArticleSchema, faqSchema } from "@/lib/jsonld";
import { GUIDE_LABELS } from "@/data/faq-placement";

/**
 * Shared knowledge-hub template — powers the `/plywood-guide` pillar and its topic clusters
 * (e.g. /plywood-guide/is-standards). Fully server-rendered; the only client island is
 * FaqAccordion, which ships its full Q&A text, so the page is pure-SSG and completely crawlable.
 * Emits BreadcrumbList + Article + FAQPage JSON-LD (schema text == visible text). Aesthetic mirrors
 * CategoryTemplate (PageHeader banner, alternating white / #faf8f3 sections, display headings).
 */

// Breadcrumb label casing lives in data/faq-placement.ts (GUIDE_LABELS) — shared with the Navbar.

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="h-px w-7 bg-primary" />
      {children}
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 lg:mb-14 text-center">
      <div className="flex justify-center">
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="font-display mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function GuideTemplate({ page }: { page: GuidePage }) {
  const faqs = getFaqsForPage(page);

  const relatedProducts = page.relatedProducts
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== undefined);
  const missing = page.relatedProducts.filter((slug) => !getProduct(slug));
  if (missing.length) {
    // Non-fatal: keep the build green, but flag placement-map slug drift in the build log.
    console.warn(`[GuideTemplate] ${page.path}: unknown related product slug(s): ${missing.join(", ")}`);
  }

  const clusters = (page.clusters ?? [])
    .map((slug) => getGuidePage(slug))
    .filter((c): c is GuidePage => c !== undefined);

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(page.path, GUIDE_LABELS),
    guideArticleSchema({ path: page.path, headline: page.h1, description: page.seo.description }),
  ];
  const fq = faqSchema(faqs);
  if (fq) schemas.push(fq);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* ===== HERO ===== */}
      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {page.eyebrow && (
            <div className="flex justify-center">
              <Eyebrow>{page.eyebrow}</Eyebrow>
            </div>
          )}
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {page.h1}
          </h1>
          {page.heroSubhead && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {page.heroSubhead}
            </p>
          )}
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="bg-[#faf8f3] py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className="text-[15px] leading-relaxed text-gray-700 sm:text-base [&>p]:mb-4 [&_strong]:font-semibold [&_strong]:text-gray-900"
            dangerouslySetInnerHTML={{ __html: page.introHtml }}
          />
        </div>
      </section>

      {/* ===== PILLAR: cluster cards ===== */}
      {page.kind === "pillar" && clusters.length > 0 && (
        <section className="bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Topics"
              title={
                <>
                  Explore the <span className="text-primary">Guide</span>
                </>
              }
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clusters.map((c) => (
                <Link
                  key={c.slug}
                  href={c.path}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(2,6,23,0.08)]"
                >
                  <h3 className="font-display text-lg font-bold text-gray-900">{c.h1}</h3>
                  {c.heroSubhead && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.heroSubhead}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CLUSTER: FAQ accordion ===== */}
      {faqs.length > 0 && (
        <section id="faqs" className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Explained"
              title={
                <>
                  In <span className="text-primary">Detail</span>
                </>
              }
              subtitle="Tap any topic below for a plain-language explanation."
            />
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ===== RELATED PRODUCTS ===== */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#faf8f3] py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Products"
              title={
                <>
                  Certified <span className="text-primary">Saburi Products</span>
                </>
              }
              subtitle="The Saburi products built to the standards on this page."
            />
            <div className="flex flex-wrap justify-center gap-3">
              {relatedProducts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
                >
                  {p.name}
                  <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#b81d1d] px-6 py-12 text-center lg:px-16 lg:py-16">
            <div className="doodle-grid absolute inset-0 opacity-20" />
            <div className="relative">
              <h2 className="font-display text-2xl font-bold text-white lg:text-4xl">
                Not sure which grade you need?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 lg:text-base">
                Tell us your application and we&apos;ll recommend the right Saburi product and IS grade.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
                >
                  Get a recommendation
                </Link>
                <Link
                  href="/plywood"
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                >
                  Browse the range
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={schemas} />
    </div>
  );
}
