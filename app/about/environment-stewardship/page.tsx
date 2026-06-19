import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { Leaf, Recycle, TreePine, Droplets, Wind, Sun } from "lucide-react";

export const dynamic = "force-static";
export const metadata: Metadata = buildPageMetadata({
  title: "Our Commitment to Environmental Stewardship | Saburi Ply",
  description: "Explore Saburi Ply’s environmental stewardship initiatives focused on sustainable practices, responsible sourcing, and eco-friendly manufacturing for a greener future.",
  keywords: "environmental stewardship, sustainable plywood manufacturing, eco-friendly plywood, green plywood production",
  canonical: "/about/environment-stewardship",
});

export default function EnvironmentStewardship() {
  // const initiatives = [
  //   {
  //     icon: TreePine,
  //     title: "Sustainable Sourcing",
  //     description: "We source our raw materials from FSC-certified forests and engage in responsible forestry practices. Our commitment to sustainable sourcing ensures that we contribute to forest conservation and regeneration.",
  //     stats: "100% responsibly sourced wood"
  //   },
  //   {
  //     icon: Recycle,
  //     title: "Zero Waste Manufacturing",
  //     description: "Our manufacturing process is designed to minimize waste. Wood scraps and by-products are repurposed for energy generation and other industrial uses, ensuring nothing goes to waste.",
  //     stats: "95% waste recycling rate"
  //   },
  //   {
  //     icon: Droplets,
  //     title: "Water Conservation",
  //     description: "Advanced water recycling systems in our facilities ensure minimal water wastage. We treat and reuse water in our manufacturing processes, significantly reducing our freshwater consumption.",
  //     stats: "60% water recycling achieved"
  //   },
  //   {
  //     icon: Wind,
  //     title: "Emission Control",
  //     description: "State-of-the-art emission control systems and regular monitoring ensure that our facilities meet and exceed environmental standards. We continuously invest in cleaner technologies.",
  //     stats: "40% reduction in emissions"
  //   },
  //   {
  //     icon: Sun,
  //     title: "Renewable Energy",
  //     description: "We have integrated solar power systems in our manufacturing units, reducing our dependence on conventional energy sources and our carbon footprint.",
  //     stats: "30% solar energy usage"
  //   },
  //   {
  //     icon: Leaf,
  //     title: "Plantation Drives",
  //     description: "Regular plantation drives and afforestation programs are conducted to give back to nature. We have planted over 100,000 trees in the past five years.",
  //     stats: "100,000+ trees planted"
  //   }
  // ];

  // const commitments = [
  //   "Achieve carbon neutrality by 2030",
  //   "Increase renewable energy usage to 50% by 2027",
  //   "Maintain zero deforestation in our supply chain",
  //   "Support local communities in sustainable livelihood programs",
  //   "Invest in research for eco-friendly adhesives and coatings",
  //   "Partner with environmental organizations for conservation projects"
  // ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/about/environment-stewardship"]} />

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left lg:text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Rooted in Responsibility<br /> Growing for Tomorrow
            </h2>
            <p className="text-md lg:text-lg text-gray-600">
              Every sheet begins with the earth, and we honor that origin. At Saburi Plywood, sustainability is not a department it is a discipline woven into our decisions, materials, and manufacturing culture.
            </p>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-16">
            {/* Nature Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80)',
              }}
            />

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>

            {/* Text Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 relative z-10">
                <Leaf className="h-20 w-20 mx-auto mb-4 opacity-90 drop-shadow-lg" />
                <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">Our Green Promise</h3>
                <p className="text-lg opacity-90 drop-shadow-md">Sustainable. Responsible. Future-Ready.</p>
              </div>
            </div>
          </div>
          <div className="text-left lg:text-center">
            <p className="mb-4">Each year, we plant <strong>over one million saplings</strong>, helping restore forest cover and support ecological balance. By sourcing from responsibly managed plantations and adopting low-emission adhesives, we reduce chemical impact and protect indoor air quality. Our waste-conscious production ensures that timber, water, and energy are used efficiently, with continuous improvements guided by modern environmental standards.</p>
            <p>We believe progress should never come at nature’s cost. As we build strength in every sheet, we also give strength back to the soil, the air, and the generations that follow.</p>
          </div>
        </div>
      </section>

      {/* Environmental Initiatives */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Environmental Initiatives
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive programs driving sustainable operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{initiative.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{initiative.description}</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-green-700">{initiative.stats}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Our Commitments */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Environmental Commitments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Long-term goals that guide our sustainability journey
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200 p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {commitments.map((commitment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1 flex-shrink-0">
                    <Leaf className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-lg">{commitment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Impact Section */}
      {/* <section className="py-16 bg-gradient-to-br from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Environmental Impact
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Measurable results from our sustainability initiatives
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "100K+", label: "Trees Planted" },
              { value: "40%", label: "Emission Reduction" },
              { value: "95%", label: "Waste Recycled" },
              { value: "30%", label: "Solar Energy Use" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Closing Message */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Together for a Sustainable Future
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Environmental stewardship is not just a responsibility—it's a commitment we take seriously.
              By choosing Saburi Ply, you're not only getting premium quality products but also supporting
              a company dedicated to protecting our environment and building a sustainable future.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Learn More About Our Initiatives
              </button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
