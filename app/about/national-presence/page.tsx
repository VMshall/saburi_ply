import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SmartImage } from "@/components/SmartImage";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { FaqSection } from "@/components/FaqSection";
import { getAboutFaqs } from "@/lib/faqs";
import { MapPin, Building2, Users, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const metadata: Metadata = buildPageMetadata({
  title: "National Presence | Saburi Ply Across India",
  description: "Discover Saburi Ply’s strong national presence with an expanding network across India, ensuring wide availability, reliable supply, and consistent quality products.",
  keywords: "saburi ply national presence, plywood distribution india, plywood network, saburi ply locations",
  canonical: "/about/national-presence",
});

export default function NationalPresence() {
  // State to route mapping
  const stateRoutes: Record<string, string> = {
    "Kerala": "/best-plywood-kerela",
    "Andhra Pradesh": "/best-plywood-andhra-pradesh",
    "Telangana": "/best-plywood-telangana",
    "Bangalore": "/best-plywood-bangalore",
    "Tamil Nadu": "/best-plywood-tamilnadu",
    // Add more state mappings as needed
  };

  const regions = [

    {
      name: "North India",
      states: ["Haryana", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Chhattisgarh"],
      dealers: 150,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "South India",
      states: ["Andhra Pradesh", "Kerala", "Tamil Nadu", "Telangana", "Bangalore"],
      dealers: 100,
      color: "from-green-500 to-green-600"
    },
    {
      name: "East India",
      states: ["Bihar", "Jharkhand", "Odisha", "West Bengal", "Arunachal Pradesh", "Assam", "Meghalaya", "Mizoram", "Tripura"],
      dealers: 200,
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "West India",
      states: ["Gujarat", "Maharashtra", "Rajasthan"],
      dealers: 160,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Union Territories",
      states: ["Delhi", "Jammu & Kashmir", "Chandigarh", "Puducherry", "Dadra & Nagar Haveli", "Daman & Diu"],
      dealers: 120,
      color: "from-red-500 to-red-600"
    }
  ];

  // const stats = [
  //   {
  //     icon: MapPin,
  //     label: "Cities Covered",
  //     value: "500+",
  //     description: "Across all states"
  //   },
  //   {
  //     icon: Building2,
  //     label: "Dealer Network",
  //     value: "600+",
  //     description: "Authorized dealers nationwide"
  //   },
  //   {
  //     icon: Users,
  //     label: "Employees",
  //     value: "2000+",
  //     description: "Skilled workforce"
  //   },
  //   {
  //     icon: TrendingUp,
  //     label: "Manufacturing Units",
  //     value: "12",
  //     description: "State-of-the-art facilities"
  //   }
  // ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/about/national-presence"]} />

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left lg:text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nationwide Network, Local Service
            </h2>
            <p className="text-md lg:text-lg text-gray-600">
              With a strong presence across India, Saburi Ply has established itself as a trusted name
              in the plywood industry. Our extensive dealer network ensures that quality products and
              excellent service are always within your reach.
            </p>
          </div>

          {/* National Presence Map */}
          <div className="flex justify-center">
            <SmartImage
              src="/images/national-presence.webp"
              alt="Saburi Ply National Presence Map"
              aspectRatio="1/1"
              objectFit="cover"
              sizes="(max-width: 1080px) 100vw, 1080px"
              className={cn("w-full max-w-[1080px]")}
            />
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              );
            })}
          </div> */}


        </div>
      </section>

      {/* Regional Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left lg:text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Regional Coverage
            </h2>
            <p className="text-md lg:text-lg text-gray-600">
              Our dealer network spans across all regions of India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {regions.map((region, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`bg-gradient-to-r ${region.color} p-4 text-white`}>
                  <h3 className="text-xl font-bold">{region.name}</h3>
                  <p className="text-sm opacity-90">{region.dealers}+ Dealers</p>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {region.states.map((state, idx) => {
                      const route = stateRoutes[state];
                      return (
                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          {route ? (
                            <Link
                              href={route}
                              className="text-gray-700 hover:underline hover:decoration-primary hover:scale-105 transition-all duration-200 cursor-pointer group inline-flex items-center gap-1"
                              title={`Explore ${state} products`}
                            >
                              {state}
                              <ArrowRight className="h-4 w-4 text-primary -rotate-[55deg] group-hover:scale-110 transition-transform duration-200" />
                            </Link>
                          ) : (
                            <span className="text-gray-700">{state}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Units */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Manufacturing Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our strategically located manufacturing units ensure efficient distribution and
              timely delivery across the country.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 border border-primary/20">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Saburi Ply operates 12 state-of-the-art manufacturing facilities strategically positioned
                across India. These units are equipped with cutting-edge technology and machinery, enabling
                us to maintain consistent quality while meeting the growing demand for our products.
              </p>
              <p className="mb-4">
                Each manufacturing unit employs skilled craftsmen and technicians who work diligently to
                produce plywood that meets the highest quality standards. Our production capacity exceeds
                10 million square feet annually, making us one of the leading plywood manufacturers in India.
              </p>
              <p>
                The strategic location of our facilities ensures minimal transportation time, reduced carbon
                footprint, and the ability to serve our customers efficiently across all regions.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find a Dealer Near You
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Locate our authorized dealers in your city and experience the quality of Saburi Ply products firsthand.
          </p>
          <button
            onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us for Dealer Information
          </button>
        </div>
      </section> */}
      <FaqSection
        faqs={getAboutFaqs("/about/national-presence")}
        eyebrow="Manufacturing & Reach"
        title="Manufacturing & Reach — FAQs"
      />
    </div>
  );
}
