import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { FaBacteria } from "react-icons/fa";
import { GiThrustBend } from "react-icons/gi";
import { GiLifeBar } from "react-icons/gi";
import {
    ArrowLeft,
    ArrowRight,
    QrCode,
    Flame,
    Droplets,
    Dumbbell,
    Bug,
    IndianRupee
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

export default function SaburiBestPlywoodKerela() {
    const images = [
        {
            id: 1,
            src: "/images/south-region-plywoods/Kerala.webp",
            alt: "Saburi Best Plywood Kerela board full view",
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

    const premium = `As the best plywood manufacturer and supplier in Kerala, Saburi Ply provides durable premium-grade plywood for all construction requirements. We are one of the best plywood brands in Kerala, we have an extensive product range meeting diverse specifications, ranging from interior plywood to marine-grade plywood.`;

    const features = [
        "E0 emission",
        "Double face 0.60mm",
        "Pressure impregnated with preservatives",
        "Boiling water and termite proof",
        "Made up of non toxic compounds",
        "Three stages preservative treated",
        "Antifungal treated",
        "Both Side Calibrated",
        "Bend resistant: balanced construction ensures dimensional stability which prevents warpage and builds strength",
        "Veneers cooked at 60° for removal of starch & micro-organism",
        "QuadPro Technology",
        "Money back warranty",
        "Lifetime warranty",
    ];

    const applications = [
        "An elite class product for premium furniture in personal/commercial spaces, hotel suites, auditoriums, dining halls, partitions and panelings",
        "Suitable for areas with high moisture exposure",
        "Ship‑building and boats",
        "Structural applications",
    ];

    const thickness = ["4mm", "6mm", "9mm", "12mm", "16mm", "18mm", "25mm"];
    const sizes = ["10x4 ft.", "8x4 ft.", "7x4 ft. etc."];

    const badges = [
        { id: "waterproof", icon: Droplets, title: "Waterproof", sub: "Available" },
        { id: "Bil Resistant", icon: Flame, title: "Fire Resistant", sub: "Available" },
        { id: "strength", icon: Dumbbell, title: "Strength", sub: "High" },
        { id: "Bend Resistant", icon: GiThrustBend, title: "Bend Resistant", sub: "Seamless" },
        { id: "Termite Proof", icon: Bug, title: "Termite Proof", sub: "High" },
        { id: "Lifetime Warranty", icon: GiLifeBar, title: "Lifetime Warranty", sub: "Reliable" },
        { id: "Antifungal", icon: FaBacteria, title: "Antifungal", sub: "High" },
        { id: "Money Back Warranty", icon: IndianRupee, title: "Money Back Warranty", sub: "Assured" },
    ];

    const scrollToDetails = () => {
        const el = document.getElementById("perennial-details");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <PageHeader title="Best Plywood Kerela" trail={[{ name: "Home", to: "/" }, { name: "Products" }]} />

            <section className="py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">Plywood Manufacturer & Supplier Kerala</h1>
                        {/* <div className="mt-3 flex items-center justify-center gap-2">
                            <span className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">IS: 10701</span>
                            <span className="px-3 py-1 text-xs rounded-full border bg-white text-gray-700">STRUCTURAL GRADE</span>
                        </div> */}
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
                        <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-auto ring-1 ring-gray-100 p-6 relative" style={{ height: rightCardHeight || undefined }}>
                            <div className="flex h-full flex-col">
                                {/* QR code */}
                                {/* <div className="absolute right-4 top-4 w-12 h-12 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <QrCode className="h-6 w-6 text-gray-700" />
                                    <span className="sr-only">QR code</span>
                                </div> */}

                                {/* chips */}
                                {/* <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 text-xs rounded-full border bg-white text-gray-700">LUXURY</span>
                                </div> */}

                                {/* brand block */}
                                <div className="mb-2">
                                    <div className="inline-flex items-baseline gap-3">
                                        <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">The Best Plywood Manufacturer <br /> and Supplier in Kerala</h2>
                                        {/* <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Truly Everlasting</span> */}
                                    </div>
                                </div>

                                <div className="mt-2">
                                    {/* <ReadMoreBlock text={premium} /> */}
                                    <p className="mb-2">As the best plywood manufacturer and supplier in Kerala, Saburi Ply provides durable premium-grade plywood for all construction requirements. We are one of the best plywood brands in Kerala, we have an extensive product range meeting diverse specifications, ranging from interior plywood to marine-grade plywood.</p>
                                    <p className="mb-2">Being one of the well-reckoned plywood suppliers in Kerala, we ensure that our products adhere to the top industry standards, offering unmatched strength and durability. Our commitment towards quality has made us one of the most sought-after plywood manufacturers in Kerala and one of the best plywood companies in Kerala.</p>
                                    <p className="mb-2">We are one of the top Kerala plywood manufacturers and plywood suppliers in Kochi. We provide plywood at best plywood prices in Kerala without compromising quality, thus becoming one of the choices among the best plywood brands in Kochi.</p>
                                    <p className="mb-2">Choose us for quality, reliability, and expert craftsmanship. We are the top choice in plywood solutions in Kerala today!</p>
                                    <p>Known for eco-friendly plywood solutions, Saburi Ply is one of the best plywood manufacturer and supplier in Kerala. As one of the best plywood brands Kerala, we offer high-quality products for construction, furniture, and interiors at competitive prices. Trusted as reliable plywood suppliers in Kerala, we deliver exceptional service across the state, making us the first choice among the best plywood companies in Kerala.</p>
                                </div>

                                {/* <hr className="my-5 border-gray-200" /> */}

                                {/* Tabs with scrollable lists matching left image height */}
                                {/* <div className="flex-1 flex flex-col min-h-0">
                                    <div role="tablist" aria-label="Perennial details" className="inline-flex flex-wrap rounded-lg border p-1 bg-gray-50 gap-1">
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
                                </div> */}

                                {/* bottom spacing inside card */}
                                <div className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Full-width feature badges rail + action bar */}
                    {/* <div className="mt-8 bg-white rounded-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-gray-100 overflow-hidden">
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
                    </div> */}
                </div>
            </section>

            <Footer />
        </div>
    );
}
