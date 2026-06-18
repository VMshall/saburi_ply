import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// function GalleryImage({ src, alt, seed, onClick }) {
//     return (
//         <div className="w-full h-56 cursor-pointer hover:scale-105 transition duration-500 overflow-hidden" onClick={onClick}>
//             <LazyImage 
//                 src={src} 
//                 alt={alt} 
//                 className="w-full h-full"
//             />
//         </div>
//     );
// }
// Simplified: Since LazyImage handles loading states, we can integrate it directly or via a wrapper.
// Let's reuse the wrapper logic but use LazyImage.

import { LazyImage } from "@/components/LazyImage";

function GalleryImage({ src, alt, seed, onClick }) {
    return (
        <div
            className="w-full h-56 cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            <LazyImage
                src={src}
                alt={alt}
                className="w-full h-full hover:scale-105 transition-transform duration-500"
            />
        </div>
    );
}

function LightboxModal({ images, currentIndex, onClose, onPrev, onNext }) {
    const [loaded, setLoaded] = useState(false);
    const currentImage = images[currentIndex];

    useEffect(() => {
        setLoaded(false);
    }, [currentIndex]);

    if (!currentImage) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute left-2 sm:left-4 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </button>
            )}

            {/* Image container */}
            <div
                className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={currentImage.src}
                    alt={currentImage.name || currentImage.title || "Gallery image"}
                    className={
                        "max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 " +
                        (loaded ? "opacity-100" : "opacity-0")
                    }
                    onLoad={() => setLoaded(true)}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://picsum.photos/seed/${currentImage.id}/800/600`;
                    }}
                />
                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Next button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-2 sm:right-4 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </button>
            )}

            {/* Image info and counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
                <p className="text-sm sm:text-base font-medium mb-1">
                    {currentImage.title}
                    {currentImage.name && ` - ${currentImage.name}`}
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                    {currentIndex + 1} / {images.length}
                </p>
            </div>
        </div>
    );
}

export default function Gallery() {
    // Categories for future tab functionality (currently commented out)
    // const categories = [
    //     "ALL",
    //     "Annual Meet",
    //     "Exhibitions",
    //     "Factory Tour",
    //     "Influencer Meet",
    // ];

    // Sample gallery items. Replace `src` with local assets in `/public/images/...` as needed.
    const allItems = [
        {
            id: 1,
            title: "Vroom South",
            // name: "Team Gathering",
            src: "/images/gallery/annual-meet/vroom-south/2.webp",
            categories: ["Annual Meet"],
        },
        {
            id: 2,
            title: "Vroom South",
            src: "/images/gallery/annual-meet/vroom-south/1.webp",
            categories: ["Annual Meet"],
        },
        {
            id: 8,
            title: "Abid 2022, Kolkata",
            src: "/images/gallery/exhibitions/abid-2022-kolkata/1.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 10,
            title: "Abid 2022, Kolkata",
            src: "/images/gallery/exhibitions/abid-2022-kolkata/3.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 14,
            title: "IIID 2022, Hyderabad",
            src: "/images/gallery/exhibitions/iiid-2022-hyderabad/2.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 15,
            title: "IIID 2022, Hyderabad",
            src: "/images/gallery/exhibitions/iiid-2022-hyderabad/1.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 20,
            title: "IIID 2025, Odisha",
            src: "/images/gallery/exhibitions/iiid-2025-odisha/1.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 21,
            title: "IIID 2025, Odisha",
            src: "/images/gallery/exhibitions/iiid-2025-odisha/2.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 23,
            title: "Matecia 2022, Delhi",
            src: "/images/gallery/exhibitions/matecia-2022-delhi/3.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 24,
            title: "Matecia 2022, Delhi",
            src: "/images/gallery/exhibitions/matecia-2022-delhi/1.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 50,
            title: "Matecia 2025, Bangalore",
            src: "/images/gallery/exhibitions/matecia-2025-bangalore/1.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 59,
            title: "Matecia 2025, Bangalore",
            src: "/images/gallery/exhibitions/matecia-2025-bangalore/10.webp",
            categories: ["Exhibitions"],
        },
        {
            id: 33,
            title: "Factory Tour",
            src: "/images/gallery/factory-tour/4.webp",
            categories: ["Factory Tour"],
        },
        {
            id: 40,
            title: "Factory Tour",
            src: "/images/gallery/factory-tour/11.webp",
            categories: ["Factory Tour"],
        },
        {
            id: 42,
            title: "Influencer Meet",
            src: "/images/gallery/influencer-meet/4.webp",
            categories: ["Influencer Meet"],
        },
        {
            id: 45,
            title: "Influencer Meet",
            src: "/images/gallery/influencer-meet/1.webp",
            categories: ["Influencer Meet"],
        },

        // Add more items as needed. These paths are examples — update them to match your /public/images structure.
    ];

    // Tab functionality (currently commented out - showing all images)
    // const [active, setActive] = useState("ALL");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Show all items without filtering (tab functionality commented out below)
    const filtered = allItems;
    
    // Original filtering logic (commented out for future use)
    // const filtered =
    //     active === "ALL"
    //         ? allItems
    //         : allItems.filter((it) => it.categories.includes(active));

    const openLightbox = useCallback((index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.style.overflow = "";
    }, []);

    const goToPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1));
    }, [filtered.length]);

    const goToNext = useCallback(() => {
        setLightboxIndex((prev) => (prev === filtered.length - 1 ? 0 : prev + 1));
    }, [filtered.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === "ArrowRight") goToNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, closeLightbox, goToPrev, goToNext]);

    const groupedByTitle = filtered.reduce(
        (acc, item) => {
            const key = typeof item.title === "string" ? item.title.trim() : "";

            if (!acc.map.has(key)) {
                acc.order.push(key);
                acc.map.set(key, []);
            }

            acc.map.get(key).push(item);
            return acc;
        },
        { order: [], map: new Map() }
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <PageHeader title="Gallery" />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <h1 className="text-3xl font-bold text-center mb-6">Gallery</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupedByTitle.order.map((titleKey) => {
                        const items = groupedByTitle.map.get(titleKey) ?? [];
                        const showTitle = Boolean(titleKey);

                        return (
                            <section key={titleKey || "__untitled__"} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                {showTitle && (
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">{titleKey}</h2>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {items.map((item) => (
                                        <figure key={item.id} className="space-y-2">
                                            <div className="overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow bg-white">
                                                <GalleryImage
                                                    src={item.src}
                                                    alt={item.name || item.title || "Gallery image"}
                                                    seed={item.id}
                                                    onClick={() => openLightbox(filtered.indexOf(item))}
                                                />
                                            </div>
                                            {item.name && (
                                                <figcaption className="text-center text-xs text-gray-700">
                                                    {item.name}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            <Footer />

            {lightboxOpen && (
                <LightboxModal
                    images={filtered}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={goToPrev}
                    onNext={goToNext}
                />
            )}
        </div>
    );
}
