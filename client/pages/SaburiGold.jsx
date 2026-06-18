import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { FaBacteria } from "react-icons/fa";
// import { GiThrustBend } from "react-icons/gi";
// import { GiLifeBar } from "react-icons/gi";
import {
  ArrowLeft,
  ArrowRight,
  // QrCode,
  Flame,
  Dumbbell,
  Bug,
  ChevronDown,
  ChevronUp,
  Award,
  Droplets
  // IndianRupee
} from "lucide-react";

function ReadMoreBlock({ text, limit = 280 }) {
  const [expanded, setExpanded] = useState(false);
  const short = text.length > limit ? text.slice(0, limit) + "..." : text;
  return (
    <div className={`space-y-3 ${!expanded ? "md:min-h-[96px]" : ""}`}>
      <p
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: expanded ? text : short }}
      />
      {text.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function SaburiGold() {
  const images = [
    {
      id: 1,
      src: "/images/plywood-product/Saburi Gold.webp",
      alt: "Saburi Gold board full view",
    },
  ];
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const featuresRailRef = useRef(null);
  const scrollRail = (dir) => {
    const el = featuresRailRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const [activeTab, setActiveTab] = useState("features");
  const imageBoxRef = useRef(null);
  const leftCardRef = useRef(null);
  const [rightCardHeight, setRightCardHeight] = useState(null);
  useEffect(() => {
    const updateHeights = () => {
      if (!leftCardRef.current) return;
      // Sync only on large screens where cards are side-by-side
      if (window.innerWidth < 1024) {
        setRightCardHeight(null);
        return;
      }
      const leftHeight = leftCardRef.current.getBoundingClientRect().height;
      setRightCardHeight(leftHeight);
    };
    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, [index]);

  const premium = `Saburi Gold Plywood is the dependable choice for applications where moisture resistance cannot be compromised. Manufactured 
 from select hardwood with phenolic glued core veneers and a long panel finish, it conforms to Marine Grade IS: 710 standards, 
 making it suitable for the most demanding environments.
 Each veneer is treated with preservatives prior to pressing, ensuring uniform distribution of moisture and adhesive throughout the 
 panel. The plywood is boiling water proof and performs reliably in both indoor and outdoor conditions.
 Saburi Gold 710 is recommended for partitions, panelling, all types of furniture, roofing, boat construction, and outdoor applications 
 where structural integrity and moisture resistance are essential. Every panel carries a 30-year warranty.
 Saburi Ply is a leading <strong>Marine Plywood Manufacturer in India</strong> and the foremost producer of marine plywood in Bengal. All 
 products are IS: 710 certified and engineered to perform consistently across dry and wet conditions, meeting the requirements of a 
 broad range of construction and fabrication applications.
 As a recognised <strong>Marine Plywood Supplier in India</strong>, Saburi Ply serves customers across Kolkata and throughout the country. For 
 projects that demand durable, high-quality marine plywood, Saburi Ply remains the preferred choice among builders, fabricators, 
 and contractors alike.`;

  const features = [
    "Emission Free Product",
    "Boiling Water proof",
    "Manufactured through QuadPro Process",
    "Resistant to termites and powdering",
    "Antifungal treated",
    "Calibrated",
    "Made from select hardwood",
    "Can be used for making indoor as well as outdoor furniture",
  ];

  const applications = [
    "This category of plywood is most suitable for partition and panelling, panel insert in doors, false ceiling, lawn chairs, garden tables and chairs, cavity flooring, cupboard shelving and also as kitchen cabinets",
    "This plywood is perfect to construct boats, kayaks, etc. Saburi Gold Plywood and is of high quality hardwood, bonded with un-extended BWP type phenolic resin using superior technology. The outstanding feature of this plywood is its ability to withstand dry and wet conditions, making it an ideal choice for boats, roofing and other outdoor applications where it's exposed to water for a prolonged period",
  ];

  const thickness = ["4mm", "6mm", "9mm", "12mm", "16mm", "18mm", "25mm"];
  const sizes = ["10x4 ft.", "8x4 ft.", "7x4 ft. etc."];

  const badges = [
    { id: "waterproof", icon: Droplets, title: "Boiling Waterproof", sub: "Available" },
    { id: "calibrated", icon: Dumbbell, title: "Calibrated", sub: "High" },
    { id: "emission", icon: Flame, title: "Emission Free", sub: "Available" },
    { id: "Termite Proof", icon: Bug, title: "Termite Proof", sub: "High" },
    { id: "Antifungal", icon: FaBacteria, title: "Antifungal", sub: "High" },
  ];

  const scrollToDetails = () => {
    const el = document.getElementById("saburigold-details");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // FAQ Data
  const faqs = [
    {
      question: "What makes Saburi Gold officially \"Marine Grade\"?",
      answer: "Saburi Gold is manufactured using premium BWP (Boiling Water Proof) grade phenolic resins and selected hardwood veneers. It can withstand 72 hours in boiling water with zero surface damage, no swelling, and no layer separation, ensuring exceptional durability even in extreme moisture and humidity conditions."
    },
    {
      question: "Is Saburi Gold the right choice for kitchen cabinets and bathrooms?",
      answer: "Yes, it is the perfect choice. Because kitchens and bathrooms are high-moisture zones prone to steam and water spills, Saburi Gold's waterproof properties prevent swelling and damage, extending the life of your interior woodwork."
    },
    {
      question: "Does Saburi Gold Marine Grade Plywood come in a 10 ft × 4 ft size?",
      answer: "Yes. Saburi Gold Marine Grade Plywood is available in a 10 ft × 4 ft size, specially designed for large structural and marine applications. Its premium BWP bonding ensures superior strength, durability, and excellent performance even in high-moisture environments."
    },
    {
      question: "Can I use Saburi Gold to build outdoor furniture?",
      answer: "Yes, Saburi Gold's exceptional weather resistance makes it highly suitable for outdoor furniture, patio fixtures, and even boat-building applications where water exposure is a constant factor. As a trusted <strong>Marine Plywood Manufacturer in India</strong>, Saburi Ply engineers every panel to perform reliably in such conditions."
    },
    {
      question: "How does Saburi Gold maintain its screw-holding capacity?",
      answer: "We use gap-free, high-density core veneers that are tightly bonded. This uniform density ensures superior nail and screw-holding capacity, so your furniture joints remain sturdy and intact for decades. Saburi Ply, a leading <strong>Marine Plywood Supplier in India</strong>, maintains this standard consistently across its entire product range"
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title="Best Marine Plywood Manufacturer and Supplier in India" trail={[{ name: "Home", to: "/" }, { name: "Products" }]} />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">BEST MARINE PLYWOOD MANUFACTURER <br />AND SUPPLIER IN INDIA</h1>
            {/* <div className="mt-3 flex items-center justify-center gap-2">
              <span className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">IS: 710</span>
              <span className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">MARINE GRADE</span>
            </div> */}
            <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold text-gray-700 tracking-wider">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                IS: 710
              </span>
              <span className="w-px h-4 bg-gray-300"></span>
              <span className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                Marine GRADE
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: image slider */}
            <div ref={leftCardRef} className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 p-4 sticky top-24 self-start max-w-2xl mx-auto lg:mx-0">
              <div className="relative rounded-lg overflow-hidden">
                <div ref={imageBoxRef} className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg flex items-center justify-center">
                  <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black shadow flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black shadow flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ArrowRight className="h-5 w-5" />
                </button> */}
              </div>
              {/* <div className="flex items-center justify-center gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-primary" : "bg-gray-300"}`}
                  />
                ))}
              </div> */}
            </div>

            {/* Right: info card */}
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 p-6 relative" style={{ height: rightCardHeight || undefined }}>
              <div className="flex h-full flex-col">
                {/* QR code */}
                {/* <div className="absolute right-4 top-4 w-12 h-12 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-gray-700" />
                  <span className="sr-only">QR code</span>
                </div> */}

                {/* chips */}
                {/* <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-xs rounded-full border bg-white text-gray-700">MARINE PLYWOOD</span>
                </div> */}

                {/* brand block */}
                <div className="mb-2">
                  <div className="inline-flex items-baseline gap-3">
                    <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Saburi Gold (IS: 710)</h2>
                    {/* <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">30 Years Warranty</span> */}
                  </div>
                </div>

                <div className="mt-2">
                  <ReadMoreBlock text={premium} />
                </div>

                <hr className="my-5 border-gray-200" />

                {/* Tabs with scrollable lists matching left image height */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div role="tablist" aria-label="Saburi Gold details" className="inline-flex flex-wrap rounded-lg border p-1 bg-gray-50 gap-1">
                    {features && features.length > 0 && (
                      <button
                        role="tab"
                        aria-selected={activeTab === "features"}
                        onClick={() => setActiveTab("features")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "features" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Unique Features
                      </button>
                    )}
                    {applications && applications.length > 0 && (
                      <button
                        role="tab"
                        aria-selected={activeTab === "applications"}
                        onClick={() => setActiveTab("applications")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "applications" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Application
                      </button>
                    )}
                    {thickness && thickness.length > 0 && (
                      <button
                        role="tab"
                        aria-selected={activeTab === "thickness"}
                        onClick={() => setActiveTab("thickness")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "thickness" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Available Thickness
                      </button>
                    )}
                    {sizes && sizes.length > 0 && (
                      <button
                        role="tab"
                        aria-selected={activeTab === "sizes"}
                        onClick={() => setActiveTab("sizes")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "sizes" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Available Sizes
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex-1 overflow-y-auto pr-1">
                    {activeTab === "features" && features && features.length > 0 && (
                      <ul className="space-y-2">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                              <ArrowRight className="h-3 w-3" />
                            </span>
                            <span className="text-gray-800 text-sm">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {activeTab === "applications" && applications && applications.length > 0 && (
                      <ul className="space-y-2">
                        {applications.map((a) => (
                          <li key={a} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                              <ArrowRight className="h-3 w-3" />
                            </span>
                            <span className="text-gray-800 text-sm">{a}</span>
                          </li>
                        ))}
                        <li className="text-xs text-gray-500 italic mt-3">*T&C apply</li>
                      </ul>
                    )}
                    {activeTab === "thickness" && thickness && thickness.length > 0 && (
                      <ul className="space-y-2">
                        {thickness.map((t) => (
                          <li key={t} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                              <ArrowRight className="h-3 w-3" />
                            </span>
                            <span className="text-gray-800 text-sm">{t}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {activeTab === "sizes" && sizes && sizes.length > 0 && (
                      <ul className="space-y-2">
                        {sizes.map((s) => (
                          <li key={s} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                              <ArrowRight className="h-3 w-3" />
                            </span>
                            <span className="text-gray-800 text-sm">{s}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* bottom spacing inside card */}
                <div className="mt-2" />
              </div>
            </div>
          </div>

          {/* Full-width feature badges rail + action bar */}
          <div className="mt-8 bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous badge"
                onClick={() => scrollRail(-1)}
                className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-full border bg-white hover:bg-gray-50 text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div ref={featuresRailRef} className="flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                <div className="flex items-stretch gap-6 sm:gap-8 min-w-max px-2 py-1">
                  {badges.map(({ id, icon: Icon, title, sub }) => (
                    <div key={id} className="shrink-0 text-center snap-start min-w-[80px]">
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-500 ring-1 ring-red-100 flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="mt-2 text-sm font-medium">{title}</div>
                      <div className="text-xs text-gray-500">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-label="Next badge"
                onClick={() => scrollRail(1)}
                className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-full border bg-white hover:bg-gray-50 text-gray-700"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">Explore specifications and ask our team for details.</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToDetails}
                  className="inline-flex items-center justify-center h-10 rounded-full px-5 border bg-white hover:bg-gray-50 text-gray-800"
                >
                  Know More
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center h-10 rounded-full px-5 bg-primary text-white hover:bg-primary/90"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Saburi GOLD plywood
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={openFAQ === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96' : 'max-h-0'
                      }`}
                  >
                    <div className="px-6 pb-4">
                      <p
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="text-sm text-gray-600 mb-6">
              Still have questions? Our team is here to help you.
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-12 rounded-full px-8 bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
