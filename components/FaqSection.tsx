import { FaqAccordion } from "@/components/islands/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/jsonld";
import type { Faq } from "@/data/types";

/**
 * Drop-in FAQ section for content pages (e.g. the bespoke /about/* pages). Renders the accordion
 * and emits the matching FAQPage JSON-LD (schema text == visible text). Server-rendered; the
 * FaqAccordion island receives already-resolved Faq[] as props, so the FAQ library never reaches
 * the client bundle. Returns null when there are no FAQs.
 */
export function FaqSection({
  faqs,
  eyebrow = "FAQ",
  title = "Frequently Asked Questions",
  subtitle,
}: {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  if (!faqs.length) return null;
  const schema = faqSchema(faqs);
  return (
    <section id="faqs" className="bg-[#faf8f3] py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center lg:mb-14">
          <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-7 bg-primary" />
            {eyebrow}
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        <FaqAccordion faqs={faqs} />
      </div>
      {schema && <JsonLd data={[schema]} />}
    </section>
  );
}
