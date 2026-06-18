import React, { useEffect, useRef } from "react";
import { MousePointerClick, SplitSquareHorizontal, Columns, PaintBucket, ArrowDown, Hammer, Layers2, Scale, Settings, Package, CheckCircle, Layers } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { id: 1, icon: MousePointerClick, title: "Timber log selection in yard", image: "/images/howItWorks/Step 1_Timber-in-yard.webp", description: "Core logs of Burma Gurjan, Eucalyptus, Lambu, Kadam, and other premium hardwoods are carefully selected for density, moisture balance, and grain consistency to ensure long-term strength.", details: ["Guarantees stable and uniform core quality", "Only graded hardwood species are approved"] },

    { id: 2, icon: Settings, title: "Machine peeling logs", image: "/images/howItWorks/Step 2_Machine-peeling-logs.webp", description: "Logs are peeled into fine veneers using precision lathes for smooth, uniform layers. For a 25 mm ply, around 17 veneers are typically used.", details: ["Maintains even veneer thickness throughout", "Minimizes material loss and surface flaws"] },

    { id: 3, icon: SplitSquareHorizontal, title: "Face vs. core veneer split", image: "/images/howItWorks/Step 3_core-veneer-split.webp", description: "Veneers are sorted as face or core based on texture and strength. Face veneers include Gurjan, Okoume, Birch, and Recon species.", details: ["Face sheets chosen for superior surface finish", "Core sheets provide structural stability and bonding strength"] },

    { id: 4, icon: Columns, title: "Drying sheets in line", image: "/images/howItWorks/Step 4_Drying-Sheets.webp", description: "Veneers are passed through controlled hot-air dryers to achieve optimal moisture levels. Up to 95% moisture is reduced for perfect resin absorption.", details: ["Prevents warping, cracking, or delamination later", "Enhances bonding consistency during hot pressing"] },

    { id: 5, icon: PaintBucket, title: "Adhesive application scene", image: "/images/howItWorks/Step 5_Adhesive-application-scene.webp", description: "Eco-safe adhesives such as Phenol Formaldehyde, Melamine Formaldehyde, and Urea Formaldehyde are evenly applied before sheet assembly.", details: ["Uniform resin layer ensures superior bonding", "Uses low-emission, environment-friendly resins"] },

    { id: 6, icon: Layers, title: "Core sheet arrangement", image: "/images/howItWorks/Step 6_Core-sheet-arrangement.webp", description: "Core veneers are stacked with alternating grain directions for maximum stability. Depending on type — FR, BWP, BWR, or MR plywood — the layup process is customized.", details: ["Balances internal stress for dimensional stability", "Delivers enhanced strength and structural uniformity"] },

    { id: 7, icon: ArrowDown, title: "Pressing in hydraulic press", image: "/images/howItWorks/Step 7_Pressing-in-hydraulic-press.webp", description: "The stacked veneers are bonded under high temperature and pressure using the Quad Pro process for enhanced durability.", details: ["Ensures perfect adhesion across all layers", "Produces solid, void-free, high-density plywood panels"] },

    { id: 8, icon: Scale, title: "Calibration machine", image: "/images/howItWorks/Step_8_Calibration-Machine.webp", description: "Each plywood sheet passes through calibration machines to achieve precise thickness and surface uniformity.", details: ["Guarantees consistent thickness in every board", "Enables flawless surface finish and lamination ease"] },

    { id: 9, icon: Hammer, title: "Cutting & sanding edge view", image: "/images/howItWorks/Step 9_Sanding-and-cutting-prcess.webp", description: "Boards are trimmed to size and sanded for fine edges and smooth surfaces.", details: ["Provides accurate sizing for varied applications", "Ensures a polished, splinter-free finish"] },

    { id: 10, icon: Layers2, title: "Face veneer overlay close-up", image: "/images/howItWorks/Step 10_Face-veneer-overlay-close-up.webp", description: "A premium face veneer is laminated on the panel to enhance beauty and protection.", details: ["Adds rich natural wood aesthetics", "Safeguards surface from wear and abrasion"] },

    { id: 11, icon: CheckCircle, title: "Quality check with tools", image: "/images/howItWorks/Step 11_Quality-Check.webp", description: "Each plywood sheet undergoes multiple quality checks for bonding strength, uniform thickness, and surface finish.", details: ["Complies with relevant IS standards and benchmarks", "Ensures consistent quality across every production batch"] },

    { id: 12, icon: Package, title: "Final branding + packaged boards stacked", image: "/images/howItWorks/Step 12_Branding_2.webp", description: "Finished boards are printed with Saburi branding and specifications, neatly stacked, and made ready for distribution.", details: ["Reflects Saburi's assurance of premium quality", "Packed for swift Pan-India delivery and export"] },
  ];

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const items = container.querySelectorAll('.timeline-item');

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const itemTop = rect.top - containerRect.top;
        const itemCenter = itemTop + rect.height / 2;
        const viewportCenter = container.clientHeight / 2;

        // Calculate distance from center
        const distance = Math.abs(itemCenter - viewportCenter);
        const maxDistance = container.clientHeight;

        // Calculate opacity and scale based on distance from center
        const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7);
        const scale = Math.max(0.85, 1 - (distance / maxDistance) * 0.15);

        item.style.opacity = opacity;
        item.style.transform = `scale(${scale})`;
      });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="process" className="relative h-screen w-full bg-white overflow-hidden">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-white via-white to-transparent pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            How <span className="text-red-600">It Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Precision in every step — from log to masterpiece, each board is crafted with care.
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32">
          {/* Center Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2">
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-red-600 via-red-600 to-red-600 opacity-30"></div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-32">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.id}
                  id={`step-${step.id}`}
                  className="timeline-item relative transition-all duration-300 ease-out"
                >
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${isEven ? "" : "lg:grid-flow-col-dense"}`}>
                    {/* Text Content */}
                    <div className={`${isEven ? "lg:text-right" : "lg:text-left"} mb-8 lg:mb-0`}>
                      <div className="lg:max-w-lg lg:mx-auto">
                        <div className={`flex items-center mb-4 ${isEven ? "lg:justify-end" : "lg:justify-start"}`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-red-600">Step {step.id}</span>
                              <h3 className="text-xl font-bold text-black">{step.title}</h3>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                        <div className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div
                              key={detailIndex}
                              className={`flex items-center space-x-2 ${isEven ? "lg:justify-end" : "lg:justify-start"}`}
                            >
                              <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image Content */}
                    <div className={`${isEven ? "lg:col-start-2" : "lg:col-start-1"}`}>
                      <div className="aspect-video rounded-lg overflow-hidden shadow-md relative">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-red-600/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span className="text-xs bg-red-600/80 px-2 py-1 rounded">Step {step.id}</span>
                          </div>
                          <p className="font-medium">{step.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg z-10">
                    <div className="w-full h-full bg-red-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* <nav className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white/95 to-transparent py-3 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 justify-start scrollbar-hide">
          {steps.map((step) => (
            <a
              key={step.id}
              href={`#step-${step.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(`step-${step.id}`);
                const container = containerRef.current;
                if (element && container) {
                  const rect = element.getBoundingClientRect();
                  const containerRect = container.getBoundingClientRect();
                  const offset = rect.top - containerRect.top + container.scrollTop - (container.clientHeight / 2) + (rect.height / 2);
                  container.scrollTo({ top: offset, behavior: 'smooth' });
                }
              }}
              className="flex-shrink-0 text-center px-3 py-2 text-sm bg-orange-600 text-white font-medium rounded hover:bg-orange-700 transition shadow-sm"
            >
              {step.id}
            </a>
          ))}
        </div>
      </nav> */}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;