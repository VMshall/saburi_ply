import type { Location } from "@/data/types";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/jsonld";

/**
 * Shared state/city location page (§3). Fully server-rendered — these pages render only the
 * intro prose block (the legacy pages' tabs/badges/FAQ are commented out), so no client islands
 * are needed. Emits BreadcrumbList + LocalBusiness-with-areaServed JSON-LD (§6 — the key signal
 * for "best plywood in <place>" queries).
 */
export function LocationTemplate({ location }: { location: Location }) {
  const { name, heading, introHtml, images } = location;
  const pathname = `/${location.slug}`;

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbSchema(pathname),
    localBusinessSchema({
      pathname,
      name: `Saburi Ply — ${location.state}`,
      areaServed: location.areaServed,
    }),
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={location.bannerImage} />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
              {heading}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: image */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 p-4 sticky top-24 self-start max-w-2xl mx-auto lg:mx-0">
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg flex items-center justify-center">
                  {images[0] && (
                    <img
                      src={images[0].src}
                      alt={images[0].alt}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right: info card with intro prose */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-auto ring-1 ring-gray-100 p-6 relative">
              <div className="mb-2">
                <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {name}
                </h2>
              </div>
              <div
                className="mt-2 text-gray-700 leading-relaxed [&>p]:mb-2 [&_strong]:text-primary [&_strong]:font-semibold [&_ul]:mt-2 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: introHtml }}
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={schemas} />
    </div>
  );
}
