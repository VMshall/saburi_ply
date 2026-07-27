import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { FaqSection } from "@/components/FaqSection";
import { getAboutFaqs } from "@/lib/faqs";
import { NewAboutUs } from "@/components/sections/NewAboutUs";
import { ProcessQuality } from "@/components/sections/ProcessQuality";
import { PlywoodGallery } from "@/components/sections/PlywoodGallery";
import { GoGreen } from "@/components/sections/GoGreen";
import { Mission, Vision } from "@/components/sections/MissionVision";
import { BecomeOurPartner } from "@/components/sections/BecomeOurPartner";

export const dynamic = "force-static";
export const metadata: Metadata = buildPageMetadata({
  title: "About Saburi Ply | Plywood Manufacturer in India",
  description: "Learn about Saburi Ply, a trusted plywood manufacturer in India with 35+ years of experience delivering durable, high-quality wood solutions for homes and projects.",
  keywords: "about saburi ply, plywood company profile, plywood manufacturer history, saburi ply story",
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/about"]} />
      <NewAboutUs />
      <ProcessQuality />
      <PlywoodGallery />
      <GoGreen />
      <Mission />
      <Vision />
      <FaqSection
        faqs={getAboutFaqs("/about")}
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="About Saburi Ply — the company, product range, warranty and support."
      />
      <BecomeOurPartner />
    </div>
  );
}
