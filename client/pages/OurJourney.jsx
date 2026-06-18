import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { Footer } from "../components/Footer";

export default function OurJourney() {
    const [selectedIndex, setSelectedIndex] = useState(2); // Start at index 2 (1944)
    const timelineRefs = useRef([]);

    const timelineData = [
        {
            year: "1986",
            title: "Humble Beginnings",
            place: "Purnia, Bihar",
            image: "/images/journey/1. Humble Beginnings.webp",
            description: "The journey began when Mr. Gajanand Munka, driven by hard work and vision, started crafting tea boxes and shoe boxes from plywood in a small workshop. It was the spark of an enduring dream — to build something lasting, from the strength of wood itself."
        },
        {
            year: "1990",
            title: "The First Step into Plywood Manufacturing",
            place: "Kishanganj, Bihar",
            image: "/images/journey/2.The First Step into Plywood Manufacturing.webp",
            description: "A small unit producing 2x4 ft plywood sheets marked the company’s first real venture into manufacturing. With limited tools but limitless determination, every sheet carried the founder’s belief in quality and honesty."
        },
        {
            year: "1993 (Feb)",
            title: "Rebuilding from Ashes",
            place: "Kishanganj, Bihar",
            image: "/images/journey/3.Rebuilding from Ashes.webp",
            description: "A burnt, second-hand machine was bought from Araria, Bihar and painstakingly rebuilt by Mr. Munka’s own hands. This moment defined the company’s core — resilience, craftsmanship, and the will to rise from any setback."
        },
        {
            year: "1993 (Jun)",
            title: "The First Factory",
            place: "Kishanganj, Bihar",
            image: "/images/journey/4.The First Factory.webp",
            description: "From a modest setup, the first small factory came alive. It was not just machinery starting to run — it was the heartbeat of a growing enterprise built on faith, family, and relentless work."
        },
        {
            year: "1993 (Sep)",
            title: "The Siliguri Breakthrough",
            place: "Kishanganj, Bihar",
            image: "/images/journey/5.The Siliguri Breakthrough.webp",
            description: "A bulk order of 9 tons per day arrived from Siliguri. The factory, capable of only 5 tons, stretched beyond limits. The team worked tirelessly day and night to meet the order — proving that quality and commitment can overcome any capacity."
        },
        {
            year: "1995",
            title: "Expansion in Kishanganj",
            place: "Kishanganj, Bihar",
            image: "/images/journey/6. Expansion in Kishanganj.webp",
            description: "With rising trust and growing demand, the Kishanganj factory expanded. This was the foundation for scaling the business, ensuring consistency, and focusing on stronger quality standards."
        },
        {
            year: "2002",
            title: "The Leap to Kolkata",
            place: "Kolkata, West Bengal",
            image: "/images/journey/7. The Leap to Kolkata.webp",
            description: "To expand further, Mr. Munka moved to Kolkata and joined hands with Mr. Manish Birdika. Together, they began trading plywood and rapidly built a reputation for integrity, service, and reliability. The Saburi name started resonating across markets."
        },
        {
            year: "2010",
            title: "Establishing a Major Manufacturing Unit",
            place: "Sondalia, West Bengal",
            image: "/images/journey/8.Establishing a Major Manufacturing Unit.webp",
            description: "A state-of-the-art factory was set up in Sondalia — the company’s first large-scale plant. It signaled the shift toward automation, organized production, and national growth ambitions, raising product quality to meet modern standards."
        },
        {
            year: "2015",
            title: "The Birth of Kanki Dham (Phase 1)",
            place: "Kanki, West Bengal",
            image: "/images/journey/9.The Birth of Kanki Dham (Phase 1).webp",
            description: "With deep faith and gratitude, the first phase of Sri Krishna Avatar Baba Ramdev Mandir was established at Kanki, near Kishanganj. It reflected the company’s spiritual foundation — built on perseverance, devotion, and purpose."
        },
        {
            year: "2018",
            title: "A Corporate Milestone in Kolkata",
            place: "Kolkata, West Bengal",
            image: "/images/journey/10.A Corporate Milestone in Kolkata.webp",
            description: "Mr. Ankit Munka led the creation of the company’s first major corporate office in Kolkata, symbolizing professionalism and national presence. The brand began taking shape — Saburi was no longer just a name, but a standard in the plywood world."
        },
        {
            year: "2023",
            title: "Completion of Kanki Dham (Phase 2)",
            place: "Kanki, West Bengal",
            image: "/images/journey/11.Completion of Kanki Dham (Phase 2).webp",
            description: "The final phase of Sri Krishna Avatar Baba Ramdev Mandir was completed — a tribute to years of dedication, community, and divine grace. It stands as a reflection of Saburi’s philosophy — “Judey Rahe Hamesha” — to stay connected, rooted, and humble."
        },
        {
            year: "2023",
            title: "A Horizon of a Factory",
            place: "Visakhapatnam, Andhra Pradesh",
            image: "/images/journey/12.A Horizon of a Factory.webp",
            description: "A new, much larger manufacturing facility was inaugurated in Visakhapatnam — marking Saburi’s entry into South India. With advanced automation, sustainability practices, and strict quality control, the company embraced its vision of globalisation, eco-friendly production, and excellence across product lines."
        },
        {
            year: "Today",
            title: "From Local Workshop to National Brand",
            place: "",
            image: "/images/journey/13.From Local Workshop to National Brand.webp",
            description: "What began in 1986 as a small plywood workshop has grown into a nationwide brand synonymous with trust and endurance. Saburi Plywood stands tall — a professionally managed, innovation-driven company committed to quality, sustainability, and growth that lasts generations."
        }
    ];

    // const handleNext = () => {
    //     if (selectedIndex < timelineData.length - 1) {
    //         setSelectedIndex(selectedIndex + 1);
    //     }
    // };

    // const handlePrev = () => {
    //     if (selectedIndex > 0) {
    //         setSelectedIndex(selectedIndex - 1);
    //     }
    // };

    const handleYearClick = (index) => {
        setSelectedIndex(index);
    };

    // Scroll the selected timeline item into view
    useEffect(() => {
        if (timelineRefs.current[selectedIndex]) {
            timelineRefs.current[selectedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }, [selectedIndex]);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Modern Gradient Background */}
            <div className="fixed inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-primary/5"></div>

                {/* Animated gradient orbs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-full blur-3xl opacity-40"></div>

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }}></div>
            </div>

            <Navbar />
            <PageHeader title="Our Journey" />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">{/* Header Section */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide uppercase">
                            Our Journey
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        A Century of
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                            Excellence & Innovation
                        </span>
                    </h2>
                    <p className="text-md md:text-lg text-gray-600 max-w-6xl mx-auto leading-relaxed">
                        From humble beginnings in India’s wood heartland to becoming a trusted national plywood brand, our journey reflects commitment, innovation, and continuous improvement. Every milestone has been shaped by craftsmanship, technology adoption, and a dedication to reliable quality.
                    </p>
                    {/* Decorative line */}
                    {/* <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div> */}
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Timeline Container */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start justify-center">
                        {/* Dates Column - Enhanced with Scroll */}
                        <div className="lg:w-40 flex lg:flex-col gap-3 lg:gap-2 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 relative scrollbar-hide lg:scrollbar-auto lg:max-h-[600px] lg:pr-2">
                            {timelineData.map((item, index) => (
                                <button
                                    key={item.year}
                                    ref={(el) => (timelineRefs.current[index] = el)}
                                    onClick={() => handleYearClick(index)}
                                    className={`group relative flex-shrink-0 transition-all duration-500 text-left ${selectedIndex === index
                                        ? "text-primary font-bold text-xl lg:text-2xl scale-105"
                                        : "text-gray-400 hover:text-primary/80 text-xl lg:text-2xl hover:scale-105"
                                        }`}
                                    style={{
                                        padding: "1rem 0 1rem 2.5rem",
                                        minWidth: "100px",
                                    }}
                                >
                                    {/* Vertical line background for each item */}
                                    {index < timelineData.length - 1 && (
                                        <div className="hidden lg:block absolute left-4 top-1/2 w-1 bg-gradient-to-b from-primary/40 to-primary/10 rounded-full pointer-events-none"
                                            style={{ height: 'calc(100% + 0.5rem)' }}>
                                        </div>
                                    )}

                                    {/* Enhanced Dot indicator */}
                                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 z-10 ${selectedIndex === index
                                        ? "w-5 h-5 bg-primary shadow-lg shadow-primary/50 ring-4 ring-primary/20"
                                        : "w-3 h-3 bg-gray-300 group-hover:bg-primary/50 group-hover:w-4 group-hover:h-4"
                                        }`}>
                                        {selectedIndex === index && (
                                            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></span>
                                        )}
                                    </span>
                                    <span className={`block transition-all duration-300 ${selectedIndex === index ? "translate-x-1" : ""
                                        }`}>
                                        {item.year}
                                    </span>
                                    {selectedIndex === index && (
                                        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-primary opacity-0 lg:opacity-100"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Column - Enhanced */}
                        <div className="flex-1 relative min-h-[600px]">
                            {/* Premium Content Card */}
                            <div className="relative  overflow-hidden   ">
                                {/* Animated gradient background */}
                                <div className="absolute "></div>

                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64  from-primary/10 to-transparent rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl"></div>

                                {/* Content wrapper */}
                                <div className="relative min-h-[550px] lg:min-h-[600px] flex flex-col items-center justify-center p-8 lg:p-12">
                                    {timelineData.map((item, index) => (
                                        <div
                                            key={item.year}
                                            className={`absolute inset-0 flex flex-col items-center justify-center p-8 lg:p-12 transition-all duration-700 ${selectedIndex === index
                                                ? "opacity-100 scale-100 translate-y-0"
                                                : "opacity-0 scale-95 translate-y-8 pointer-events-none"
                                                }`}
                                        >
                                            {/* Image with modern treatment */}
                                            <div className={`relative mb-8 transition-all duration-1000 ${selectedIndex === index ? "scale-100 opacity-100" : "scale-90 opacity-0"
                                                }`}>
                                                <div className="absolute inset-0 from-primary/20 to-primary/5 rounded-3xl blur-2xl scale-110"></div>
                                                <div className="relative p-4">
                                                    <img
                                                        src={item.image}
                                                        alt={`Milestone ${item.year}`}
                                                        className="w-80 h-80 lg:w-94 lg:h-94 object-contain mx-auto rounded-2xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Year display with modern typography */}
                                            <div className={`relative mb-6 transition-all duration-700 delay-100 ${selectedIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                                }`}>
                                                <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/70 tracking-tight">
                                                    {item.title}
                                                </h1>
                                                <p className="text-xl lg:text-2xl text-center mb-4">{item.place}</p>
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                                            </div>

                                            {/* Description with modern styling */}
                                            <div className={`transition-all duration-700 delay-200 ${selectedIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                                }`}>
                                                <p className="text-gray-700 text-base lg:text-lg leading-relaxed max-w-2xl text-center font-light">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Decorative quote marks */}
                                            {/* <div className="absolute top-8 left-8 text-primary/10 text-6xl font-serif">"</div> */}
                                            {/* <div className="absolute bottom-8 right-8 text-primary/10 text-6xl font-serif rotate-180">"</div> */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modern Progress Indicator */}
                    <div className="mt-24 mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {timelineData.map((item, index) => (
                                <button
                                    key={item.year}
                                    onClick={() => handleYearClick(index)}
                                    className={`group relative transition-all duration-500 rounded-full ${selectedIndex === index
                                        ? "w-16 h-4 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30"
                                        : "w-4 h-4 bg-gray-300 hover:bg-primary/50 hover:scale-125"
                                        }`}
                                    aria-label={`Go to ${item.year}`}
                                >
                                    {selectedIndex === index && (
                                        <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-40"></span>
                                    )}
                                    {/* Tooltip on hover */}
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.year}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                Milestone <span className="text-primary font-bold">{selectedIndex + 1}</span> of {timelineData.length}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};