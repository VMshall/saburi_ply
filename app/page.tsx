import type { CSSProperties } from "react";
import dynamicImport from "next/dynamic";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/jsonld";

// Below-fold sections/islands are code-split (lazy) so they stay out of the home's First-Load
// JS (§6 CWV). They still SSR (ssr:true), so their content is in the HTML for crawlers; only the
// hydration JS is deferred into per-section chunks. Hero + AboutUs (above the fold) stay eager.
const WhyChooseUs = dynamicImport(() =>
  import("@/components/sections/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs })),
);
const HomeProducts = dynamicImport(() =>
  import("@/components/islands/HomeProducts").then((m) => ({ default: m.HomeProducts })),
);
const PlywoodGallery = dynamicImport(() =>
  import("@/components/sections/PlywoodGallery").then((m) => ({ default: m.PlywoodGallery })),
);
const Testimonials = dynamicImport(() =>
  import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const BecomeOurPartner = dynamicImport(() =>
  import("@/components/sections/BecomeOurPartner").then((m) => ({ default: m.BecomeOurPartner })),
);
const ContactForm = dynamicImport(() =>
  import("@/components/sections/HomeContactForm").then((m) => ({ default: m.ContactForm })),
);
// Enquiry modal is deferred client-only (ssr:false) via this island so its JS stays out of the
// home's First-Load bundle (§6).
const DeferredEnquiry = dynamicImport(() =>
  import("@/components/islands/DeferredEnquiry").then((m) => ({ default: m.DeferredEnquiry })),
);

// Pure SSG (§3). Home/default meta (title, OG, canonical /) inherited from app/layout.tsx;
// Organization + WebSite JSON-LD are sitewide there.
export const dynamic = "force-static";

const cv = (size: string): CSSProperties => ({
  contentVisibility: "auto",
  containIntrinsicSize: size,
});

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Preload the LCP hero per breakpoint (§6) — restores the index.html hero preload lost in
          the migration; the single biggest LCP lever on the home. The hero deliberately stays an
          art-directed <picture> (next/image can't art-direct the desk/tab/mob crops, and under
          `next start` its on-demand optimization measured far worse than the direct static webp),
          so these manual hints — not `priority` — drive the hero's early fetch. The mobile hint
          targets the same 824w source the <img> srcSet resolves to at Lighthouse-mobile DPR. */}
      <link
        rel="preload"
        as="image"
        href="/images/heroBanners/fire-retardant-desk.webp"
        media="(min-width: 1024px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/heroBanners/fire-retardant-tab.webp"
        media="(min-width: 768px) and (max-width: 1023px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/heroBanners/fire-retardant-mob.webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      <Hero />

      <div style={cv("600px")}>
        <AboutUs />
      </div>
      <div style={cv("800px")}>
        <WhyChooseUs />
      </div>
      <div style={cv("800px")}>
        <HomeProducts />
      </div>
      <div style={cv("600px")}>
        <PlywoodGallery />
      </div>
      <div style={cv("400px")}>
        <Testimonials />
      </div>
      <div style={cv("500px")}>
        <BecomeOurPartner />
      </div>
      <div style={cv("600px")}>
        <ContactForm />
      </div>

      {/* Lead-capture enquiry modal (auto-shows on scroll/delay) — deferred client-only. */}
      <DeferredEnquiry />

      {/* Home LocalBusiness signal (§6) — preserved from the former sitewide index.html block. */}
      <JsonLd data={localBusinessSchema()} />
    </div>
  );
}
