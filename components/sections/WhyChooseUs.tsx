"use client";

import { useState, useEffect, useCallback } from "react";
import { Sprout, Shield, Flame, Award, Truck, Clock, Microchip, Network, Bot, Target, Globe } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export function WhyChooseUs() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("init", onInit);
    onSelect();
    onInit();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onInit);
    };
  }, [emblaApi]);

  const benefits = [
    { icon: Shield, title: "Assured Quality", description: "Precision-controlled manufacturing ensures every sheet meets global quality standards for strength and stability.", highlight: "100% Quality Assured" },
    { icon: Sprout, title: "Eco Commitment", description: "Sustainable sourcing from farmed timber and recyclable materials to protect the planet.", highlight: "Eco Friendly" },
    { icon: Globe, title: "Wide Range", description: "Plywood, blockboards, flush doors, and smart panels designed for every need and style.", highlight: "Variety of Products" },
    { icon: Clock, title: "Lifetime Warranty", description: "Confidence backed by warranty across multiple product lines for lasting peace of mind.", highlight: "Warranty Assured" },
    { icon: Flame, title: "Fire & Water Resistant", description: "Specialized treatments for safety against moisture, fire, and decay in all climates.", highlight: "Water Resistant" },
    { icon: Microchip, title: "Advanced Technology", description: "Automated, calibrated production ensures uniformity, smoothness, and consistency across boards.", highlight: "Technology" },
    { icon: Network, title: "Trusted Network", description: "Supported by strong dealer and distributor relations built on decades of credibility.", highlight: "Trusted Network" },
    { icon: Bot, title: "Innovation First", description: "Continuous product development through research, design, and field-tested performance.", highlight: "Innovative" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-left lg:text-center mb-8 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 lg:mb-4">Why Choose <span className="text-primary">Saburiply?</span></h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto ps-0 lg:px-4">Engineered for endurance, elegance, and eco-conscious living trusted by professionals and homeowners alike for reliability that lasts generations.</p>
        </div>

        {/* Mobile/Tablet Slider (hidden on lg+) */}
        <div className="lg:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                    <div className="group bg-white border border-gray-200 rounded-lg p-4 sm:p-6 transition-all duration-300 touch-manipulation h-full">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
                            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full hidden sm:inline">{benefit.highlight}</span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-semibold text-black transition-colors">{benefit.title}</h3>
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full inline-block sm:hidden">{benefit.highlight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot Indicators for Mobile Slider */}
          <div className="flex justify-center mt-6 gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? "bg-primary w-6" : "bg-gray-300"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid (hidden on mobile/tablet, visible on lg+) */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="group bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{benefit.highlight}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-black transition-colors">{benefit.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 lg:mt-16 bg-gray-50 rounded-lg p-6 lg:p-8 text-left lg:text-center">
          <h3 className="text-xl lg:text-2xl font-bold text-black mb-3 lg:mb-4">Ready to Experience the Saburiply Difference?</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 max-w-2xl mx-auto ps-0 lg:px-4">Join thousands of satisfied customers who trust Saburiply for their plywood needs. Get a personalized quote for your next project.</p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 py-3 rounded-lg font-medium transition-colors touch-manipulation w-full sm:w-auto" onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>Get Quote Now</button>
            <button className="border border-gray-300 hover:border-primary text-black hover:text-primary px-6 lg:px-8 py-3 rounded-lg font-medium transition-colors touch-manipulation w-full sm:w-auto" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>View Product Range</button>
          </div>
        </div>
      </div>
    </section>
  );
}
