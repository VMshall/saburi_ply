import type { CSSProperties } from "react";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { HomeProducts } from "@/components/islands/HomeProducts";
import { PlywoodGallery } from "@/components/sections/PlywoodGallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { BecomeOurPartner } from "@/components/sections/BecomeOurPartner";
import { ContactForm } from "@/components/sections/HomeContactForm";
import { EnquiryModal } from "@/components/dialogs/EnquiryModal";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/jsonld";

// Pure SSG (§3). No metadata export — the home/default title, description, OG, canonical (/)
// are inherited from app/layout.tsx; Organization + WebSite JSON-LD are sitewide there.
export const dynamic = "force-static";

/**
 * Home page (§3) — full composition ported from client/pages/Index.jsx, same section order.
 * Server shell + minimal client islands (§9): AboutUs is server; WhyChooseUs / PlywoodTypes
 * (via HomeProducts, which also owns the QuoteModal) / PlywoodGallery / Testimonials /
 * BecomeOurPartner / the #contact ContactForm / EnquiryModal are client islands (SSR'd).
 * The content-visibility wrappers (from the legacy page) defer off-screen layout/paint.
 * Navbar + Footer come from app/layout.tsx.
 */
const cv = (size: string): CSSProperties => ({ contentVisibility: "auto", containIntrinsicSize: size });

export default function HomePage() {
  return (
    <div className="min-h-screen">
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

      {/* Lead-capture enquiry modal (auto-shows on scroll/delay). */}
      <EnquiryModal />

      {/* Home LocalBusiness signal (§6) — preserved from the former sitewide index.html block. */}
      <JsonLd data={localBusinessSchema()} />
    </div>
  );
}
