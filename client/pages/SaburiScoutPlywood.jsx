import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { GrMultiple } from "react-icons/gr";
import { PiPottedPlant } from "react-icons/pi";
import {
  ArrowLeft,
  ArrowRight,
  QrCode,
  Armchair,
  ChevronUp,
  ChevronDown,
  Award,
  Droplets
} from "lucide-react";

function ReadMoreBlock({ text, limit = 280 }) {
  const [expanded, setExpanded] = useState(false);
  const short = text.length > limit ? text.slice(0, limit) + "..." : text;
  return (
    <div className={`space-y-3 ${!expanded ? "md:min-h-[96px]" : ""}`}>
      <p className="text-gray-700 leading-relaxed">{expanded ? text : short}</p>
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

export default function SaburiScoutPlywood() {
  const images = [
    {
      id: 1,
      src: "/images/scoutPly1.webp",
      alt: "Saburi Scout 710 BWP plywood",
    },
    {
      id: 2,
      src: "/images/scoutPly2.webp",
      alt: "Saburi Scout 303 BWR plywood",
    },
    {
      id: 3,
      src: "/images/scoutPly3.webp",
      alt: "Saburi Scout MR plywood",
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

  const premium = `Made with high grade and treated wood veneers from matured plantation timber of high density wood, each panel is crafted with extreme precision and care. Saburi SCOUT plywood is pressed at 130°C and extreme pressure to compress the veneer-resin pack to obtain superior quality plywood. The bonding process is done using highly viscous melamine- fortified resin with a high solid content which keeps its layers strongly bonded for a lasting affair. To ensure maximum protection, this plywood is treated with unique and specially formulated chemicals to protect from Termites and Borers. It is dimensionally stable and amazingly durable, ensuring satisfaction for the entire woodworking need according to the designers and architects.`;

  const features = [
    "Available Thickness: 4mm, 6mm, 9mm, 12mm, 16mm, 18mm, 25mm",
    "Best for commercial interior furniture making",
    "Manufactured by matured plantation timber of Eucalyptus and Poplar",
    "Perform better than other brand because of its manufacturing process",
  ];

  const applications = [
    "Kitchen, Wardrobes, Almirahs, Tables",
    "Partitions, cabinets, Panelling",
    "Structural Home Building, Ceiling, Furniture, Cupboards, Staircases",
    "Temples, Engineered Doors, Carved Surfaces, Handicrafts etc.",
  ];

  const thickness = ["4mm", "6mm", "9mm", "12mm", "16mm", "18mm", "25mm"];
  const sizes = ["8x4 ft.", "7x4 ft. etc."];

  const badges = [
    { id: "variants", icon: GrMultiple, title: "Multiple Variants", sub: "Available" },
    { id: "plant", icon: PiPottedPlant, title: "Matured Plantation", sub: "High" },
    { id: "furniture", icon: Armchair, title: "Commercial Furniture", sub: "Available" },
  ];

  const scrollToDetails = () => {
    const el = document.getElementById("scout-details");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // FAQ Data
  const faqs = [
    {
      question: "What does \"MR Grade\" mean for Saburi Scout?",
      answer: "MR stands for Moisture Resistant. Saburi Scout is engineered to withstand high indoor humidity and dampness. While it is not designed for continuous, direct water contact like Marine Grade, it performs exceptionally well in standard interior climates."
    },
    {
      question: "Which areas of the home are best suited for Saburi Scout?",
      answer: "Saburi Scout is the ideal, cost-effective choice for dry and moderately humid interior spaces. It is perfect for living room furniture, bedroom wardrobes, study tables, wall paneling, and interior partitions."
    },
    {
      question: "Is Saburi Scout protected against pest attacks?",
      answer: "Yes. Even though it is an interior-grade product, Saburi Scout undergoes specific glue-line poisoning and chemical treatments to make it highly resistant to standard indoor pests like termites and wood borers."
    },
    {
      question: "Why should I choose Saburi Scout over local commercial plywood?",
      answer: "Saburi Scout offers superior uniform thickness, tighter core gaps, and better resin quality compared to unbranded commercial plywood. This guarantees a smoother finish for your laminates and a much longer lifespan for your furniture."
    },
    {
      question: "Does Saburi Scout warp during seasonal weather changes?",
      answer: "Saburi Scout is manufactured with perfectly seasoned wood, ensuring the optimal moisture content is locked in. This prevents the plywood from warping, expanding, or contracting during seasonal transitions."
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title="Saburi Scout Plywood" trail={[{ name: "Home", to: "/" }, { name: "Products" }]} />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">SABURI SCOUT PLYWOOD</h1>
            {/* <div className="mt-3 flex items-center justify-center gap-2">
              <span className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">IS: 303</span>
              <span className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">BWR GRADE</span>
            </div> */}
            <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold text-gray-700 tracking-wider">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                IS: 303
              </span>
              <span className="w-px h-4 bg-gray-300"></span>
              <span className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                BWR GRADE
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
                <button
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
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-primary" : "bg-gray-300"}`}
                  />
                ))}
              </div>
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
                  <span className="px-3 py-1 text-xs rounded-full border bg-white text-gray-700">SCOUT SERIES</span>
                </div> */}

                {/* brand block */}
                <div className="mb-2">
                  <div className="inline-flex items-baseline gap-3">
                    <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Saburi Scout (IS: 303)</h2>
                    {/* <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Premium Quality</span> */}
                  </div>
                </div>

                <div className="mt-2">
                  <ReadMoreBlock text={premium} />
                </div>

                <hr className="my-5 border-gray-200" />

                {/* Tabs with scrollable lists matching left image height */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div role="tablist" aria-label="Scout details" className="inline-flex flex-wrap rounded-lg border p-1 bg-gray-50 gap-1">
                    {features && features.length > 0 && (
                      <button
                        role="tab"
                        aria-selected={activeTab === "features"}
                        onClick={() => setActiveTab("features")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "features" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Benefits
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
              Find answers to common questions about Saburi Perennial plywood
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
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
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
