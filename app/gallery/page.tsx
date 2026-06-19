import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { GalleryGrid } from "@/components/islands/GalleryGrid";
import { buildPageMetadata } from "@/lib/seo";

// Pure SSG (§3/§4). Server shell that owns metadata + the PageHeader banner and static H1;
// the interactive grid + lightbox live in the GalleryGrid client island (a "use client" page
// cannot export metadata). Navbar + Footer are provided by app/layout.tsx.
export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata({
  title: "Brand Highlights, Events & Market Presence | Saburi Ply",
  description:
    "Explore Saburi Ply’s brand highlights, key events, and growing market presence, showcasing innovation, industry reach, and commitment to quality wood solutions.",
  keywords: "saburi ply gallery, plywood showcase, plywood projects, plywood applications, product images",
  canonical: "/gallery",
});

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/gallery"]} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-6">Gallery</h1>

        <GalleryGrid />
      </main>
    </div>
  );
}
