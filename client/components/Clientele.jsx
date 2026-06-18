import { Building, Users, Award, TrendingUp } from "lucide-react";

export function Clientele() {
  const clientCategories = [
    { icon: Building, title: "Construction Companies", description: "Leading builders and developers trust our plywood for residential and commercial projects", count: "500+", examples: ["Kumar Builders", "Metro Construction", "Skyline Developers", "Urban Projects Ltd"] },
    { icon: Users, title: "Furniture Manufacturers", description: "Premium furniture makers choose our calibrated and decorative plywood ranges", count: "300+", examples: ["Elite Furniture", "Royal Interiors", "Modern Living", "Classic Designs"] },
    { icon: Award, title: "Retail Partners", description: "Authorized dealers and retailers across India distributing our products", count: "1000+", examples: ["Building Materials Hub", "Construction Store", "Home Depot", "Builder's Choice"] },
    { icon: TrendingUp, title: "Industrial Clients", description: "Industrial applications and specialized manufacturing companies", count: "200+", examples: ["Tech Industries", "Marine Applications", "Transport Solutions", "Industrial Corp"] },
  ];



  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Our <span className="text-primary">Clientele</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Trusted by leading businesses across India. From small retailers to large construction companies, see who chooses Saburiply for their plywood needs.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {clientCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-lg p-8 hover:bg-primary/5 transition-colors">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{category.count}</div>
                  <h3 className="text-lg font-semibold text-black mb-3">{category.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{category.description}</p>
                  <div className="space-y-1">
                    {category.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="text-xs text-gray-500">{example}</div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-black text-center mb-8">Trusted by Leading Brands</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {testimonialLogos.map((client, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:scale-105">
                <div className={`aspect-square ${client.bgColor} rounded-lg overflow-hidden mb-3 group-hover:shadow-md transition-shadow`}>
                  <img src={client.image} alt={`${client.name} - ${client.category}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-black truncate mb-1">{client.name}</div>
                  <div className="text-xs text-gray-500">{client.category}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Award className="h-6 w-6 text-primary" /></div>
              <h4 className="font-semibold text-black mb-2">Dealer Benefits</h4>
              <p className="text-gray-600 text-sm">Competitive margins, marketing support, and exclusive territory rights for our dealer partners.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><TrendingUp className="h-6 w-6 text-primary" /></div>
              <h4 className="font-semibold text-black mb-2">Volume Discounts</h4>
              <p className="text-gray-600 text-sm">Special pricing for bulk orders and long-term partnerships with construction companies.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="h-6 w-6 text-primary" /></div>
              <h4 className="font-semibold text-black mb-2">Technical Support</h4>
              <p className="text-gray-600 text-sm">Dedicated technical assistance and product training for all our business partners.</p>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-black mb-4">Become Our Partner</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Join our network of successful partners across India. Whether you're a retailer, dealer, or bulk buyer, we have partnership programs tailored for your business.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors" onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>Become a Dealer</button>
              <button className="border border-gray-300 hover:border-primary text-black hover:text-primary px-8 py-3 rounded-lg font-medium transition-colors" onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>Request Partnership Info</button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
