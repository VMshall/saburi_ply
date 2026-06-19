import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/islands/ContactForm";

export const dynamic = "force-static";
export const metadata: Metadata = buildPageMetadata({
  title: "Contact Saburi Ply - Plywood Manufacturer India | Reach Us",
  description: "Get in touch with Saburi Ply for product inquiries, support, or dealership opportunities. Reach our team for reliable plywood solutions across India.",
  keywords: "contact saburi ply, plywood manufacturer contact, reach saburi ply, plywood inquiries, customer support",
  canonical: "/contact",
});

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/contact"]} />
      <ContactForm />
      <JsonLd data={[breadcrumbSchema("/contact"), localBusinessSchema({ pathname: "/contact" })]} />
    </div>
  );
}
