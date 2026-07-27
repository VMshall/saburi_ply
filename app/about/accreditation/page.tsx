import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { FaqSection } from "@/components/FaqSection";
import { getAboutFaqs } from "@/lib/faqs";
import { AccreditationGrid } from "@/components/islands/AccreditationGrid";

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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left lg:text-center max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Certifications
            </h2>
            <p className="text-md lg:text-lg text-gray-600">
              Our manufacturing excellence is backed by nationally recognized standards and certifications. Strict quality controls, advanced testing processes, and compliance with industry benchmarks ensure our plywood consistently delivers durability, safety, and performance across residential, commercial, and industrial applications.
            </p>
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
