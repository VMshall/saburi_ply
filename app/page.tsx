import { Hero } from "@/components/Hero";

// Pure SSG (§3). No metadata here — the home/default title, description, OG, canonical (/)
// are inherited from app/layout.tsx.
export const dynamic = "force-static";

/**
 * Home page body. Navbar + Footer are provided by app/layout.tsx.
 *
 * P1 renders the Hero island + the primary H1/value-prop so the route has real, crawlable
 * content. The rich interactive sections from the legacy client/pages/Index.jsx — AboutUs,
 * WhyChooseUs, PlywoodTypes, PlywoodGallery, Testimonials, BecomeOurPartner, the #contact
 * ContactForm, and the EnquiryModal/QuoteModal islands — are migrated in P3/P4 as
 * server-shell + client-island compositions.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Best Plywood Manufacturer and Supplier in India
        </h1>
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
          Saburi Ply is the best plywood manufacturer and supplier in India, offering premium
          plywood, block boards, and decorative panels for homes and commercial use. Built on
          superior quality, innovation, and sustainable craftsmanship.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Get a Quote
          </a>
          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            About Saburi Ply
          </a>
        </div>
      </section>
    </div>
  );
}
