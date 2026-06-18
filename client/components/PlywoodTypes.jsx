import { useState, useEffect, useRef } from "react";
import { LazyImage } from "./LazyImage";
import { useIsMobile } from "../hooks/use-mobile";
import { DoorOpen, Frame, CheckCircle, ArrowRight } from "lucide-react";
import { GiWoodBeam } from "react-icons/gi";
import { SiHiveBlockchain } from "react-icons/si";
import { TfiBlackboard } from "react-icons/tfi";
import { PiChalkboardFill } from "react-icons/pi";
import { GrFormView } from "react-icons/gr";

export function PlywoodTypes({ onOpenQuoteModal }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);

  const categories = [
    { id: 0, name: "Plywood", icon: GiWoodBeam, image: "images/plywoodRange/Plywood.webp", description: "Stack of premium plywood sheets with rich natural grains and an inset of elegant interiors. Durable, termite-proof, and fire-resistant plywood engineered through QuadPro technology for strength and smooth finish.", features: ["Durable ", "Eco-Safe", "Fire-Resistant", "Termite-Proof"], applications: ["Furniture ", "Wall Panels", "Flooring", "Partition"], thickness: "4mm–25mm", sizes: "10x4 ft., 8x4 ft., 7x4 ft., etc", highlight: "Most Popular", brochure: "/brochure/plywood.pdf" },

    { id: 1, name: "Blockboard", icon: SiHiveBlockchain, image: "images/plywoodRange/Blockboard.webp", description: "High-density blockboard used for wardrobes and cabinets. Dimensional stability with high screw-holding strength and anti-warp treatment.", features: ["Stable ", "Strong", "Seasoned ", "Long-Lasting"], applications: ["Cabinets", "Shelves", "Doors", "Interiors"], thickness: "19mm, 25mm", sizes: "10x4 ft., 8x4 ft., 7x4 ft., etc", highlight: "Best Value", brochure: "/brochure/blockboard.pdf" },

    { id: 2, name: "Flush Door", icon: DoorOpen, image: "images/plywoodRange/Flush-Door.webp", description: "Modern flush door at a stylish DoorOpen entry. BWP grade doors offering superior strength, smooth finish, and termite resistance.", features: ["BWP ", "Termite-Proof", "Sturdy", "Elegant"], applications: ["Main Door", "Bedrooms", "Offices", "Hotels"], thickness: "25mm–40mm", sizes: "Upto 10 Ft.", highlight: "Smooth Finish", brochure: "/brochure/flushdoor.pdf" },

    { id: 3, name: "Shuttering Ply", icon: Frame, image: "images/plywoodRange/Shuttering-Ply.webp", description: "Construction site scene with shuttering ply used for concrete framework. High-density ply with mirror-finish surface for repeated concrete use.", features: ["Reusable", "Heavy-Duty", "Smooth", "Weather-Resistant"], applications: ["Beams", "Columns", "Slabs", "Framework"], thickness: "9mm–25mm", mass: "30–51kg variants", sizes: "8x4 ft.", highlight: "Weather-Resistant", brochure: "/brochure/shuttering.pdf" },

    { id: 4, name: "Chipboard", icon: TfiBlackboard, image: "images/plywoodRange/Chipboard.webp", description: "Close-up of chipboard texture with modern furniture made from it. High-density, smooth surface boards with uniform core and excellent machinability", features: ["Dense", "Smooth", "Durable", "Versatile"], applications: ["Cabinets", "Tables", "Shelves", "Partitions"], thickness: "9mm–25mm", sizes: "8x6 ft., 9x6 ft.", highlight: "Versatile", brochure: "/brochure/chipboard.pdf" },

    { id: 5, name: "WPC / PVC Boards", icon: PiChalkboardFill, image: "images/plywoodRange/WPC-doors.webp", description: "Waterproof boards shown in kitchen and bathroom contexts. 100% waterproof, termite-proof, eco-friendly panels with lifetime warranty.", features: ["Waterproof", "Termite-Proof", "Recyclable", "Paintable"], applications: ["Kitchen", "Bathroom", "Ceiling", "Furniture"], thickness: "6mm–18mm", sizes: "8 x 4 ft.", highlight: "Lifetime Warranty", brochure: "/brochure/wpc-pvc.pdf" },
  ];

  useEffect(() => {
    if (!isPaused && !isMobile) {
      const timer = setInterval(() => {
        setActiveCategory((prev) => (prev + 1) % categories.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isPaused, isMobile]);

  const activeProduct = categories[activeCategory];
  const ActiveIcon = activeProduct.icon;

  return (
    <section id="products" ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-left lg:text-center mb-8 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 lg:mb-4">Our <span className="text-primary">Plywood Range</span></h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto ps-0 lg:px-4">Explore our diverse product range crafted for strength, style, and sustainability to suit every space and purpose.</p>
        </div>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 space-y-3 lg:space-y-4 order-2 lg:order-1" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} onClick={() => {
                  setActiveCategory(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 1000);
                  if (isMobile && sectionRef.current) {
                    const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }} className={`cursor-pointer rounded-lg p-4 lg:p-6 transition-all duration-300 relative overflow-hidden touch-manipulation ${activeCategory === index ? "bg-primary text-white shadow-lg transform scale-105" : "bg-white hover:bg-gray-50 hover:shadow-md hover:scale-102"}`}>
                  {activeCategory === index && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30"><div className="h-full bg-white w-full animate-pulse" /></div>
                  )}
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${activeCategory === index ? "bg-white/20" : "bg-primary/10"}`}>
                      <IconComponent className={`h-5 w-5 lg:h-6 lg:w-6 ${activeCategory === index ? "text-white" : "text-primary"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-sm lg:text-base font-semibold ${activeCategory === index ? "text-white" : "text-black"}`}>{category.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full hidden sm:inline ${activeCategory === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{category.highlight}</span>
                      </div>
                      <p className={`text-xs lg:text-sm ${activeCategory === index ? "text-white/90" : "text-gray-700 font-medium"}`}>{category.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-8 order-1 lg:order-2" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500">
              <div className="aspect-video relative overflow-hidden">
                <LazyImage key={activeProduct.id} src={activeProduct.image} alt={activeProduct.name} className="w-full h-full transition-all duration-500 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 mb-2"><ActiveIcon className="h-6 w-6" /><span className="bg-primary px-2 py-1 rounded text-xs font-medium">{activeProduct.highlight}</span></div>
                  <p className="text-lg font-medium">{activeProduct.name}</p>
                </div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 gap-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-black transition-all duration-300">{activeProduct.name}</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 self-start">{activeProduct.highlight}</span>
                </div>
                <p className="text-sm lg:text-base text-gray-700 mb-4 lg:mb-6 leading-relaxed transition-all duration-300 font-medium">{activeProduct.description}</p>
                <div className="grid sm:grid-cols-2 gap-4 lg:gap-8">
                  <div>
                    <h4 className="text-base lg:text-lg font-semibold text-black mb-3 lg:mb-4">Key Features</h4>
                    <div className="space-y-2">
                      {activeProduct.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-primary flex-shrink-0" /><span className="text-gray-700 text-xs lg:text-sm">{feature}</span></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base lg:text-lg font-semibold text-black mb-3 lg:mb-4">Applications</h4>
                    <div className="space-y-2">
                      {activeProduct.applications.map((application, index) => (
                        <div key={index} className="flex items-center space-x-2"><ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 text-primary flex-shrink-0" /><span className="text-gray-700 text-xs lg:text-sm">{application}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
                  <h4 className="text-base lg:text-lg font-semibold text-black mb-3 lg:mb-4">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    {activeProduct.thickness && <div><span className="text-xs lg:text-sm text-gray-500">Available Thickness</span><p className="text-sm lg:text-base font-medium text-black">{activeProduct.thickness}</p></div>}
                    {activeProduct.mass && <div><span className="text-xs lg:text-sm text-gray-500">Mass</span><p className="text-sm lg:text-base font-medium text-black">{activeProduct.mass}</p></div>}
                    {activeProduct.sizes && <div><span className="text-xs lg:text-sm text-gray-500">Standard Sizes</span><p className="text-sm lg:text-base font-medium text-black">{activeProduct.sizes}</p></div>}
                  </div>
                </div>
                <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex-1 text-sm lg:text-base touch-manipulation" onClick={() => onOpenQuoteModal(activeProduct.name, activeProduct.brochure)}>Get Quote for {activeProduct.name}</button>
                  <button
                    className="border border-gray-300 hover:border-primary text-black hover:text-primary px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors text-sm lg:text-base touch-manipulation flex items-center justify-center flex-1"
                    onClick={() => onOpenQuoteModal(activeProduct.name, activeProduct.brochure)}
                  >
                    <GrFormView className="h-8 w-8 mr-3" />
                    <span>View Brochure</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
