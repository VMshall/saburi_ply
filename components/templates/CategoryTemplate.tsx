import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Category, Product } from "@/data/types";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import { FaqAccordion } from "@/components/islands/FaqAccordion";
import { locations } from "@/data/locations";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  faqSchema,
} from "@/lib/jsonld";

/**
 * Category hub page (e.g. /plywood). Fully server-rendered; every section is in the static HTML
 * (FaqAccordion is the only client island, and it ships its full Q&A text anyway), so the page is
 * pure-SSG and completely crawlable. Aesthetic: an image-led hero, a display heading font
 * (font-display), one dark contrast section, warm "paper" section backgrounds, and spec-sheet
 * tables. Emits BreadcrumbList + CollectionPage + ItemList + FAQPage JSON-LD.
 */

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
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 lg:mb-14 text-center">
      <div className="flex justify-center">
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2
        className={`font-display mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[1.1] tracking-tight ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${
            dark ? "text-white/65" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

const QUICK_PICKS = [
  { use: "Kitchen & bathroom", name: "Saburi Gold", slug: "marine-plywood-india" },
  { use: "Everyday furniture", name: "Saburi Scout", slug: "saburi-scout-plywood" },
  { use: "Heavy / structural", name: "Saburi Perennial", slug: "saburi-perennial" },
  { use: "Fire safety", name: "Saburi FR", slug: "fire-retardant-india" },
  { use: "Curved designs", name: "Saburi Gold Flexi", slug: "flexi-plywood-india" },
];

export function CategoryTemplate({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const pathname = `/${category.slug}`;

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(pathname),
    collectionPageSchema({
      pathname,
      name: category.seo.title,
      description: category.seo.description,
    }),
    itemListSchema(products),
  ];
  const faq = faqSchema(category.faqs);
  if (faq) schemas.push(faq);

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO — matches the site pattern: PageHeader banner strip + centered title ===== */}
      <PageHeader bannerImage={category.bannerImage} />
      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {category.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            {category.heroSubhead}
          </p>
          {/* trust stats as an inline pill row (mirrors the product-page grade-pill pattern) */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
            {category.heroStats.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <span className="hidden h-4 w-px bg-gray-300 sm:inline-block" />}
                <span>
                  <span className="font-bold text-primary">{s.value}</span> {s.label}
                </span>
              </Fragment>
            ))}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#range"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Explore the range <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-primary hover:text-primary"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </section>

      {/* ===== OVERVIEW ===== */}
      <section id="overview" className="bg-[#faf8f3] py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
            <div>
              <Eyebrow>Overview</Eyebrow>
              <div
                className="mt-5 text-[15px] leading-relaxed text-gray-600 sm:text-base [&>p]:mb-4 [&_strong]:font-semibold [&_strong]:text-gray-900"
                dangerouslySetInnerHTML={{ __html: category.introHtml }}
              />
            </div>
            <aside className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold text-gray-900">Quick picks</h2>
              <p className="mt-1 text-sm text-gray-500">Not sure where to start?</p>
              <ul className="mt-4 divide-y divide-gray-100">
                {QUICK_PICKS.map((q) => (
                  <li key={q.slug}>
                    <Link
                      href={`/products/${q.slug}`}
                      className="group flex items-center justify-between gap-3 py-3"
                    >
                      <span className="text-sm text-gray-600">{q.use}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {q.name}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== RANGE ===== */}
      <section id="range" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="The Range"
            title={
              <>
                Saburi <span className="text-primary">Plywood</span> Range
              </>
            }
            subtitle={category.rangeSubtitle}
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.05)] ring-1 ring-gray-100 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(2,6,23,0.12)] hover:ring-primary/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50">
                  {p.images[0] && (
                    <SmartImage
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      objectFit="contain"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full p-4 transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  )}
                  {p.certification && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/10 backdrop-blur">
                      {p.certification}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-bold text-gray-900">{p.name}</h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GRADES TABLE ===== */}
      <section className="bg-[#faf8f3] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Grade Guide"
            title={
              <>
                Plywood <span className="text-primary">Grades &amp; Types</span>
              </>
            }
            subtitle="Match the grade to the job: water resistance, certification and the Saburi product for each."
          />
          <div className="overflow-x-auto rounded-2xl shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-gray-200/70">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-5 py-4 font-semibold">Grade</th>
                  <th className="px-5 py-4 font-semibold">IS Code</th>
                  <th className="px-5 py-4 font-semibold">Water Resistance</th>
                  <th className="px-5 py-4 font-semibold">Best For</th>
                  <th className="px-5 py-4 font-semibold">Saburi Product</th>
                </tr>
              </thead>
              <tbody>
                {category.grades.map((g, i) => (
                  <tr
                    key={g.grade}
                    className={`${i % 2 ? "bg-stone-50/60" : "bg-white"} transition-colors hover:bg-primary/[0.04]`}
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">{g.grade}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {g.isCode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{g.waterResistance}</td>
                    <td className="px-5 py-4 text-gray-600">{g.bestFor}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {g.products.map((pr, j) => (
                          <Link
                            key={pr.slug}
                            href={`/products/${pr.slug}`}
                            className="whitespace-nowrap font-medium text-primary hover:underline"
                          >
                            {pr.name}
                            {j < g.products.length - 1 ? "," : ""}
                          </Link>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== HOW TO CHOOSE ===== */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Buying Guide"
            title={
              <>
                How to <span className="text-primary">Choose</span>
              </>
            }
            subtitle="Pick by where the plywood will be used. Each links to the grade we recommend."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.useCases.map((uc) => (
              <Link
                key={uc.title}
                href={uc.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(2,6,23,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <Icon iconKey={uc.iconKey} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display mt-4 text-lg font-bold text-gray-900">{uc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{uc.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICE ===== */}
      <section className="bg-[#faf8f3] py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Price Guide"
            title={
              <>
                Plywood <span className="text-primary">Price</span> in India
              </>
            }
            subtitle="What plywood costs by grade in 2026. A buying guide, not a quote."
          />
          <div className="overflow-x-auto rounded-2xl shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-gray-200/70">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-5 py-4 font-semibold">Grade</th>
                  <th className="px-5 py-4 font-semibold">Indicative Price</th>
                  <th className="px-5 py-4 font-semibold">Typical Use</th>
                </tr>
              </thead>
              <tbody>
                {category.priceGuide.map((row, i) => (
                  <tr key={row.grade} className={i % 2 ? "bg-stone-50/60" : "bg-white"}>
                    <td className="px-5 py-4 font-semibold text-gray-900">{row.grade}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-bold text-primary">{row.range}</td>
                    <td className="px-5 py-4 text-gray-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-gray-500 sm:text-sm">{category.priceNote}</p>
          <div className="mt-7 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY SABURI (dark contrast section) ===== */}
      <section className="relative overflow-hidden bg-neutral-950 py-16 lg:py-24">
        <div className="doodle-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-24 right-[-6rem] h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Why Saburi"
            title={
              <>
                Why <span className="text-primary">Saburi Plywood</span>
              </>
            }
            subtitle="Engineered, certified and warranty-backed. What sets Saburi plywood apart."
            dark
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.usps.map((u) => (
              <div
                key={u.title}
                className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                  <Icon iconKey={u.iconKey} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display mt-4 text-base font-bold text-white">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{u.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHERE TO BUY ===== */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Availability"
            title={
              <>
                Where to <span className="text-primary">Buy</span>
              </>
            }
            subtitle="Saburi Ply is headquartered in Kolkata and supplies plywood across India."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {locations.map((l) => (
              <Link
                key={l.slug}
                href={`/${l.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
              >
                <MapPin className="h-4 w-4 text-primary" />
                {l.city ?? l.state}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Find your nearest dealer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      {category.faqs.length > 0 && (
        <section id="faqs" className="bg-[#faf8f3] py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="FAQ"
              title={
                <>
                  Frequently Asked <span className="text-primary">Questions</span>
                </>
              }
              subtitle="Common questions about plywood types, grades, prices and uses."
            />
            <FaqAccordion faqs={category.faqs} />
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
                Get the right plywood for your project
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 lg:text-base">
                Tell us your application and we&apos;ll recommend the right grade and share a
                competitive quote.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
                >
                  Get a quote
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                >
                  Talk to sales
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
