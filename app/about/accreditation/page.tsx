import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { FaqSection } from "@/components/FaqSection";
import { getAboutFaqs } from "@/lib/faqs";
import { AccreditationGrid } from "@/components/islands/AccreditationGrid";
import { CERT_ISSUERS } from "@/data/certifications";

export const dynamic = "force-static";
export const metadata: Metadata = buildPageMetadata({
  title: "Certifications & Accreditations | Saburi Ply",
  description: "View Saburi Ply certifications and accreditations that reflect quality standards, compliance, and commitment to delivering reliable and durable wood products.",
  keywords: "plywood certifications, saburi ply accreditation, iso certification plywood, quality standards plywood",
  canonical: "/about/accreditation",
});

export default function Accreditation() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/about/accreditation"]} />

      {/* Introduction Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-left lg:mb-16 lg:text-center">
            <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-7 bg-primary" />
              Certifications &amp; Compliance
            </span>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Certifications
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600 lg:text-lg">
              Our manufacturing excellence is backed by nationally recognized standards and certifications. Strict quality controls, advanced testing processes, and compliance with industry benchmarks ensure our plywood consistently delivers durability, safety, and performance across residential, commercial, and industrial applications.
            </p>
          </div>

          {/* Standards / issuing bodies — the authority marks buyers scan for before reading prose. */}
          <div className="mb-12 border-y border-stone-200 py-6 lg:mb-16">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              Standards &amp; Issuing Bodies
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
              {CERT_ISSUERS.map((issuer) => (
                <li
                  key={issuer}
                  className="font-display text-base font-bold uppercase tracking-[0.12em] text-stone-400 transition-colors duration-200 hover:text-stone-700 sm:text-lg"
                >
                  {issuer}
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications Grid with Image Tooltip on Hover */}
          <AccreditationGrid />
        </div>
      </section>
      <FaqSection
        faqs={getAboutFaqs("/about/accreditation")}
        eyebrow="Certifications & Quality"
        title="Certifications & Quality — FAQs"
      />
    </div>
  );
}
