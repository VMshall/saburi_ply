import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import type { GuideCompareTable, GuideFact, GuidePage, Product } from "@/data/types";
import { JsonLd } from "@/components/JsonLd";
import { SmartImage } from "@/components/SmartImage";
import { GuideToc } from "@/components/islands/GuideToc";
import { getProduct } from "@/data/products";
import {
  getFaqsForPage,
  getGuideNav,
  getGuidePage,
  getGuideReadMinutes,
  getGuideSections,
  type GuideSection,
} from "@/lib/faqs";
import { breadcrumbSchema, guideArticleSchema, faqSchema } from "@/lib/jsonld";
import { GUIDE_LABELS } from "@/data/faq-placement";

/**
 * Shared knowledge-hub template — powers the `/plywood-guide` and `/plywood-buying-guide` pillars
 * and their topic clusters (e.g. /plywood-guide/is-standards). Fully server-rendered; the only
 * client island is GuideToc, and it renders its full anchor list on the server, so the page is
 * pure-SSG and completely crawlable. Emits BreadcrumbList + Article + FAQPage JSON-LD (schema
 * text == visible text).
 *
 * A cluster reads as a document, not a widget: an editorial hero with an at-a-glance fact card,
 * a sticky table of contents scroll-spying the article, every library FAQ rendered OPEN as a
 * linkable `<h2>` section (AEO answer promoted to a "quick answer" lead, SEO answer as body
 * prose), then takeaways and prev/next so a chapter is never a dead end. The pillar reuses the
 * hero and lists its chapters.
 *
 * Layout offsets: the Navbar is `sticky top-0` and 162px tall on desktop / 130px on mobile, so
 * sticky rails sit at top-[186px] and headings carry a matching `scroll-mt` (kept in sync with
 * OFFSET in GuideToc).
 */

const SCROLL_MT = "scroll-mt-[146px] lg:scroll-mt-[178px]";

// Section headings are full questions and run long — fluid from 21px on a 320px phone to 26px on
// desktop, so a three-line heading on mobile doesn't swallow the screen.
const H2 = "text-[clamp(1.3rem,1.1rem+0.9vw,1.625rem)]";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="h-px w-7 bg-primary" />
      {children}
    </span>
  );
}

/**
 * Long library answers arrive as a single dense paragraph. Break them every few sentences so the
 * body reads as prose — a conservative split on sentence boundaries only (a `.` mid-number or
 * mid-abbreviation has no following space + capital, so it never splits).
 */
function toParagraphs(text: string, sentencesPerPara = 3): string[] {
  if (text.length < 400) return [text];
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += sentencesPerPara) {
    paras.push(sentences.slice(i, i + sentencesPerPara).join(" "));
  }
  return paras;
}

/** Meta row under the H1: read time always; date/byline only once the data supplies them. */
function ArticleMeta({ items }: { items: string[] }) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-500">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-4">
          {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-gray-400" />}
          {item}
        </span>
      ))}
    </div>
  );
}

function AtAGlanceCard({ facts }: { facts: GuideFact[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/80 shadow-[0_18px_50px_rgba(28,25,23,0.07)]">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
        <span aria-hidden className="h-px w-5 bg-primary" />
        At a glance
      </div>
      {/* Label/value share a row from 400px up; below that both would wrap into a ragged 2×2
          block, so the value stacks under its label instead. */}
      <dl className="mt-5 divide-y divide-gray-200/80 text-[14.5px]">
        {facts.map((f) => (
          <div
            key={f.label}
            className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 min-[400px]:flex-row min-[400px]:items-baseline min-[400px]:justify-between min-[400px]:gap-4"
          >
            <dt className="text-gray-500">{f.label}</dt>
            <dd className="font-semibold text-gray-900 min-[400px]:text-right">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Guide hero — replaces the empty PageHeader banner strip (guide pages have no banner image). */
function GuideHero({
  eyebrow,
  h1,
  subhead,
  meta,
  aside,
}: {
  eyebrow: ReactNode;
  h1: string;
  subhead?: string;
  meta?: string[];
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-gray-200/70 bg-[#faf8f3]">
      <div aria-hidden className="doodle-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
            {eyebrow}
            {/* Fluid rather than stepped: the old 36→48px jump landed exactly on the sm
                breakpoint and read as a glitch when resizing. 32px at 320 → 54px at 1280+. */}
            <h1 className="font-display mt-5 text-[clamp(2rem,1.35rem+2.6vw,3.375rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-gray-900">
              {h1}
            </h1>
            {subhead && (
              <p className="mt-5 max-w-xl text-base leading-[1.6] text-gray-600 sm:text-lg">{subhead}</p>
            )}
            {meta && meta.length > 0 && <ArticleMeta items={meta} />}
          </div>
          {/* Capped between sm and lg — full-bleed across a 720px tablet leaves the fact rows
              stranded either side of a huge gap. */}
          {aside && <div className="sm:max-w-md lg:col-span-5 lg:max-w-none lg:pl-4">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

function CompareTable({ table }: { table: GuideCompareTable }) {
  // A two-column table fits a 320px phone, so don't force it to scroll; three and four columns
  // need a floor or the cells crush into unreadable slivers.
  const cols = table.columns.length;
  const minWidth = cols <= 2 ? "" : cols === 3 ? "min-w-[30rem]" : "min-w-[34rem]";
  const scrolls = cols > 2;

  return (
    <section id="at-a-glance" className={`mt-10 ${SCROLL_MT}`}>
      <h2 className={`font-display ${H2} font-bold tracking-tight text-gray-900`}>
        {table.heading ?? "At a glance"}
      </h2>
      {/* The scroller needs `min-w-0` to actually scroll: as a descendant of a grid item it would
          otherwise push its intrinsic width up the tree instead of clipping (that's what made the
          whole page scroll sideways on phones). The right-edge fade signals there's more to see. */}
      <div className="relative mt-5">
        <div className="min-w-0 overflow-x-auto rounded-2xl ring-1 ring-gray-200/80">
          <table className={`w-full ${minWidth} text-left text-sm`}>
            <thead className="bg-[#faf8f3] text-[11px] uppercase tracking-[0.12em] text-gray-500">
              <tr>
                {table.columns.map((c) => (
                  <th key={c} scope="col" className="px-5 py-3 font-bold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/80">
              {table.rows.map((row, r) => (
                <tr key={row[0]} className={r === table.highlightRow ? "bg-primary/[0.03]" : undefined}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-5 py-4 text-left align-top font-normal">
                        <span className="font-semibold text-gray-900">{cell}</span>
                        {table.rowNotes?.[r] && (
                          <span className="block text-xs font-normal text-gray-500">{table.rowNotes[r]}</span>
                        )}
                      </th>
                    ) : (
                      <td key={c} className="px-5 py-4 align-top text-gray-600">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {scrolls && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-2xl bg-gradient-to-l from-white to-transparent sm:hidden"
          />
        )}
      </div>
      {scrolls && (
        <p className="mt-2 text-xs text-gray-400 sm:hidden">Scroll the table sideways for every column.</p>
      )}
    </section>
  );
}

/** One library FAQ as an open, linkable article section. */
function QaSection({ section }: { section: GuideSection }) {
  return (
    <section id={section.id} className={`mt-12 ${SCROLL_MT}`}>
      <h2 className={`font-display ${H2} font-bold leading-tight tracking-tight text-gray-900`}>
        {section.question}
      </h2>

      {/* AEO answer, promoted out of the old accordion — the extractable short answer, visible first */}
      <div className="mt-4 rounded-xl border-l-[3px] border-primary bg-[#faf8f3] px-5 py-4">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          Quick answer
        </p>
        <p className="text-[15.5px] leading-[1.6] text-gray-900">{section.aeoAnswer}</p>
      </div>

      <div className="mt-5 text-[17px] leading-[1.75] text-gray-700">
        {toParagraphs(section.seoAnswer).map((p, i) => (
          <p key={i} className="mb-[1.15rem] last:mb-0">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function TakeawaysCard({ points }: { points: string[] }) {
  return (
    <section id="key-takeaways" className={`mt-14 ${SCROLL_MT}`}>
      <div className="rounded-2xl bg-gray-900 p-7 text-white">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
          Key takeaways
        </h2>
        <ul className="mt-4 space-y-3 text-[15.5px] leading-[1.6] text-white/85">
          {points.map((p, i) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden className="flex-shrink-0 font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProductRail({ products, heading }: { products: Product[]; heading: string }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">{heading}</p>
      <div className="space-y-2">
        {products.map((p) => {
          // Product names carry their standard inline — "Saburi Gold (IS: 710)". Split it out so the
          // card reads name-over-grade instead of printing "IS: 710" twice.
          const [, title, inlineGrade] = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(p.name) ?? [];
          const grade = inlineGrade ?? p.gradePills[0]?.label ?? p.certification;
          return (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="flex items-center gap-3 rounded-xl p-2.5 ring-1 ring-gray-200/80 transition-colors hover:ring-primary/40"
            >
              {p.images[0] ? (
                <SmartImage
                  src={p.images[0].src}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg"
                  objectFit="cover"
                />
              ) : (
                <span aria-hidden className="h-9 w-9 flex-shrink-0 rounded-lg bg-gray-100" />
              )}
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold leading-tight text-gray-900">
                  {title ?? p.name}
                </span>
                {grade && <span className="block text-[11.5px] text-gray-500">{grade}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CtaCard() {
  return (
    <div className="rounded-2xl bg-[#faf8f3] p-6 ring-1 ring-gray-200/80">
      <p className="font-display text-[17px] font-bold leading-snug text-gray-900">
        Not sure which grade you need?
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-gray-600">
        Tell us the application — we&apos;ll name the right IS grade and the product that meets it.
      </p>
      <Link
        href="/contact"
        className="mt-4 block rounded-full bg-primary px-4 py-2.5 text-center text-[13.5px] font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Get a recommendation
      </Link>
      <Link
        href="/plywood"
        className="mt-2 block rounded-full px-4 py-2.5 text-center text-[13.5px] font-semibold text-gray-900 ring-1 ring-gray-200 transition-colors hover:ring-primary/40"
      >
        Browse the range
      </Link>
    </div>
  );
}

/** Closing CTA band — charcoal, so brand red stays an accent rather than a full-bleed wash. */
function CtaBand() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 lg:px-14">
          <div aria-hidden className="doodle-grid absolute inset-0 opacity-30" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="lg:max-w-xl">
              <h2 className="font-display text-2xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-4xl">
                Spec the right grade the first time.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                Send us the application and we&apos;ll come back with the IS grade, the Saburi product
                that meets it, and your nearest stocking dealer.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto">
              <Link
                href="/contact"
                className="rounded-full bg-primary px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Get a recommendation
              </Link>
              <Link
                href="/plywood"
                className="rounded-full px-7 py-3.5 text-center text-sm font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
              >
                Browse the range
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChapterCard({ page, index }: { page: GuidePage; index: number }) {
  return (
    <Link
      href={page.path}
      className="group rounded-2xl bg-white p-6 ring-1 ring-gray-200/80 transition-all hover:ring-primary/40 hover:shadow-[0_16px_40px_rgba(28,25,23,0.07)]"
    >
      <span className="text-[11px] font-bold text-gray-400">{String(index).padStart(2, "0")}</span>
      <h3 className="font-display mt-2 text-[17px] font-bold leading-snug text-gray-900">
        {GUIDE_LABELS[page.slug] ?? page.h1}
      </h3>
      {page.heroSubhead && (
        <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">{page.heroSubhead}</p>
      )}
      <span className="mt-4 flex items-center justify-between text-xs text-gray-400">
        {page.faqNumbers.length} question{page.faqNumbers.length === 1 ? "" : "s"}
        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ClusterPage({ page, sections }: { page: GuidePage; sections: GuideSection[] }) {
  const nav = getGuideNav(page);
  const products = page.relatedProducts
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== undefined);

  const tocItems = [
    ...(page.compareTable ? [{ id: "at-a-glance", label: page.compareTable.heading ?? "At a glance" }] : []),
    ...sections.map((s) => ({ id: s.id, label: s.question })),
    ...(page.takeaways?.length ? [{ id: "key-takeaways", label: "Key takeaways" }] : []),
  ];

  const meta = [
    `${getGuideReadMinutes(page, sections)} min read`,
    ...(page.updatedOn
      ? [
          `Updated ${new Date(page.updatedOn).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          })}`,
        ]
      : []),
    ...(page.reviewedBy ? [`Reviewed by ${page.reviewedBy}`] : []),
  ];

  return (
    <>
      <GuideHero
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
            {nav
              ? `${GUIDE_LABELS[nav.pillar.slug] ?? page.eyebrow} · Chapter ${String(nav.chapter).padStart(2, "0")}`
              : page.eyebrow}
          </span>
        }
        h1={page.h1}
        subhead={page.heroSubhead}
        meta={meta}
        aside={page.atAGlance?.length ? <AtAGlanceCard facts={page.atAGlance} /> : undefined}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Mobile contents — plain <details>, no JS, collapsed by default */}
        {tocItems.length > 1 && (
          <details className="group mb-10 rounded-2xl bg-[#faf8f3] px-5 py-4 ring-1 ring-gray-200/80 lg:hidden">
            {/* Chevron leads rather than trails: on the right it lands under the fixed WhatsApp
                button on every viewport below lg, which hides the only open/close affordance. */}
            <summary className="flex cursor-pointer list-none items-center gap-2.5 text-sm font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
              <ChevronDown
                aria-hidden
                className="h-4 w-4 flex-shrink-0 text-primary transition-transform group-open:rotate-180"
              />
              <span>
                Contents <span className="font-normal text-gray-400">({tocItems.length})</span>
              </span>
            </summary>
            <ul className="mt-3 space-y-2 border-t border-gray-200/80 pt-3 text-sm">
              {tocItems.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-gray-600">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Fixed rails, fluid measure. The right rail only earns its keep at xl — at 1024 it would
            squeeze the article to ~440px, so there the layout is TOC + article and the products
            move below the piece. */}
        <div className="grid gap-10 lg:grid-cols-[190px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px] xl:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-[186px]">
              <GuideToc items={tocItems} />
            </div>
          </aside>

          {/* `min-w-0` is load-bearing: a grid item's automatic minimum size is its min-content,
              so without it the compare table's intrinsic width sets the track and the page
              scrolls sideways. The max-width holds the body at ~65ch from md through lg, where
              there's no right rail to do it; at xl the grid track already lands at ~59ch. */}
          <article className="min-w-0 md:max-w-[42rem] xl:max-w-none">
            <div
              className="font-display text-[18px] font-medium leading-[1.5] sm:text-[21px] text-gray-900 [&>p]:mb-4 [&>p:last-child]:mb-0 [&_strong]:text-primary"
              dangerouslySetInnerHTML={{ __html: page.introHtml }}
            />

            {page.compareTable && <CompareTable table={page.compareTable} />}

            {sections.map((s) => (
              <QaSection key={s.id} section={s} />
            ))}

            {page.takeaways?.length ? <TakeawaysCard points={page.takeaways} /> : null}

            {nav && (nav.prev || nav.next) && (
              <nav className="mt-12 grid gap-4 sm:grid-cols-2">
                {nav.prev ? (
                  <Link
                    href={nav.prev.path}
                    className="rounded-2xl p-5 ring-1 ring-gray-200/80 transition-colors hover:ring-primary/40"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-400">
                      <ArrowLeft className="h-3.5 w-3.5" /> Previous
                    </span>
                    <span className="font-display mt-1.5 block font-bold leading-snug text-gray-900">
                      {GUIDE_LABELS[nav.prev.slug] ?? nav.prev.h1}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {nav.next && (
                  <Link
                    href={nav.next.path}
                    className="rounded-2xl p-5 ring-1 ring-gray-200/80 transition-colors hover:ring-primary/40 sm:text-right"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-400 sm:justify-end">
                      Next <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-display mt-1.5 block font-bold leading-snug text-gray-900">
                      {GUIDE_LABELS[nav.next.slug] ?? nav.next.h1}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-[186px] space-y-6">
              <CtaCard />
              {products.length > 0 && <ProductRail products={products} heading="Products on this page" />}
            </div>
          </aside>
        </div>

        {/* Below xl the rail is gone, so the products still need a home (the closing CTA band
            covers the call to action) */}
        {products.length > 0 && (
          <div className="mt-12 sm:max-w-md xl:hidden">
            <ProductRail products={products} heading="Products on this page" />
          </div>
        )}
      </div>

      {nav && nav.siblings.length > 0 && (
        <section className="border-y border-gray-200/70 bg-[#faf8f3]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Keep reading</Eyebrow>
                <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                  Continue in the {GUIDE_LABELS[nav.pillar.slug]?.toLowerCase() ?? "guide"}
                </h2>
              </div>
              <Link
                href={nav.pillar.path}
                className="hidden whitespace-nowrap text-[13.5px] font-semibold text-primary sm:block"
              >
                All {nav.total} chapters →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nav.siblings.slice(0, 3).map((s) => (
                <ChapterCard
                  key={s.slug}
                  page={s}
                  index={(nav.pillar.clusters ?? []).indexOf(s.slug) + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}

function PillarPage({ page }: { page: GuidePage }) {
  const clusters = (page.clusters ?? [])
    .map((slug) => getGuidePage(slug))
    .filter((c): c is GuidePage => c !== undefined);
  const questionCount = clusters.reduce((n, c) => n + c.faqNumbers.length, 0);
  const first = clusters[0];

  return (
    <>
      <GuideHero
        eyebrow={<Eyebrow>{page.eyebrow}</Eyebrow>}
        h1={page.h1}
        subhead={page.heroSubhead}
        meta={[`${clusters.length} chapters`, `${questionCount} questions answered`]}
        aside={
          first ? (
            <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/80 shadow-[0_18px_50px_rgba(28,25,23,0.07)]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                <span aria-hidden className="h-px w-5 bg-primary" />
                Start here
              </div>
              <p className="font-display mt-4 text-xl font-bold leading-snug text-gray-900">
                {GUIDE_LABELS[first.slug] ?? first.h1}
              </p>
              {first.heroSubhead && (
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{first.heroSubhead}</p>
              )}
              <Link
                href={first.path}
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Read chapter 01 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : undefined
        }
      />

      <section className="bg-white pb-4 pt-14 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* max-w-2xl, not 3xl: centred text loses the reader past ~55ch, and a narrower block
              also keeps the line ends clear of the fixed floating buttons on tablet. */}
          <div
            className="font-display mx-auto max-w-2xl text-center text-[18px] font-medium leading-[1.5] text-gray-900 sm:text-[21px] [&>p]:mb-4 [&>p:last-child]:mb-0 [&_strong]:text-primary"
            dangerouslySetInnerHTML={{ __html: page.introHtml }}
          />

          {clusters.length > 0 && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clusters.map((c, i) => (
                <ChapterCard key={c.slug} page={c} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export function GuideTemplate({ page }: { page: GuidePage }) {
  const sections = getGuideSections(page);

  const missing = page.relatedProducts.filter((slug) => !getProduct(slug));
  if (missing.length) {
    // Non-fatal: keep the build green, but flag placement-map slug drift in the build log.
    console.warn(`[GuideTemplate] ${page.path}: unknown related product slug(s): ${missing.join(", ")}`);
  }

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(page.path, GUIDE_LABELS),
    guideArticleSchema({ path: page.path, headline: page.h1, description: page.seo.description }),
  ];
  // Schema text still mirrors the visible text — the answers just aren't collapsed any more.
  const fq = faqSchema(getFaqsForPage(page));
  if (fq) schemas.push(fq);

  return (
    <div className="min-h-screen bg-background">
      {page.kind === "pillar" ? (
        <PillarPage page={page} />
      ) : (
        <ClusterPage page={page} sections={sections} />
      )}
      <JsonLd data={schemas} />
    </div>
  );
}
