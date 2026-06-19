import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { NewAboutUs } from "@/components/sections/NewAboutUs";
import { ProcessQuality } from "@/components/sections/ProcessQuality";
import { PlywoodGallery } from "@/components/sections/PlywoodGallery";
import { GoGreen } from "@/components/sections/GoGreen";
import { Mission, Vision } from "@/components/sections/MissionVision";
import Link from "next/link";

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
      {/* P5: restore <BecomeOurPartner/> lead form (deferred — heavy form, moves to the forms phase) */}
      <section className="py-12 sm:py-16 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-wide">Partner with Saburi Ply</h2>
          <p className="mt-3 text-gray-600">Become a dealer, architect or interior-design partner — our team will get you started.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center justify-center h-12 rounded-full px-8 bg-primary text-white hover:bg-primary/90 transition-colors font-medium">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
