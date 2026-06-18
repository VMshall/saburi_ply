import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ZoomIn } from "lucide-react";
import { LazyImage } from "./LazyImage";

export function PlywoodGallery() {
  const [selectedImage, setSelectedImage] = useState(0);

  const galleryImages = [
    {
      id: 1,
      src: "/images/plywoodGallery/Core Strength.webp",
      title: "Core Strength",
      description:
        "Engineered for uncompromising durability and lasting performance.",
    },
    {
      id: 2,
      src: "/images/plywoodGallery/Boiling Water Proof.webp",
      title: "Boiling Water Proof",
      description:
        "Designed to withstand moisture, heat, and time—without compromise.",
    },
    {
      id: 3,
      src: "/images/plywoodGallery/Fire Resistant Proof.webp",
      title: "Fire Resistant",
      description: "Strength that stands firm—even in high-heat conditions.",
    },
    {
      id: 4,
      src: "/images/plywoodGallery/Eco Friendly Core.webp",
      title: "Eco Friendly Core",
      description: "Eco-friendly at the core, superior in performance.",
    },
    {
      id: 5,
      src: "/images/plywoodGallery/Flawless Surface Finish.webp",
      title: "Flawless Surface Finish",
      description: "Smooth, uniform finish for premium aesthetics.",
    },
    {
      id: 6,
      src: "/images/plywoodGallery/Door of Strength.webp",
      title: "Door of Strength",
      description: "Engineered to stand strong, season after season.",
    },
    // {
    //   id: 7,
    //   src: "/images/plywoodGallery/WPC-doors.jpg",
    //   title: "Raw Material Storage",
    //   description: "Organized storage of premium timber and wood materials",
    // },
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  return (
    <section className="py-12 sm:py-12 lg:py-14 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 lg:mb-4">
            Our <span className="text-primary">Product Gallery</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4 font-medium">
            Explore our craftsmanship where design, durability, and detail come together in every panel we produce.
          </p>
        </div>

        {/* Main Image Display */}
        <div className="mb-4 flex justify-center">
          <div className="relative rounded-lg shadow-lg overflow-hidden group w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px]">
            <div className="aspect-square relative">
              {/* Image wrapper with overlay and text */}
              <div key={selectedImage} className="relative w-full h-full animate-in fade-in duration-1000">
                <LazyImage
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Image Info Overlay */}
                <div className="absolute bottom-4 left-2 right-2 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-base lg:text-lg font-bold mb-0.5">
                    {galleryImages[selectedImage].title}
                  </h3>
                  <p className="text-xs lg:text-sm opacity-90">
                    {galleryImages[selectedImage].description}
                  </p>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
              aria-label="Next image"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Product Showcase - Now Below Main Image */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-xl lg:text-2xl font-semibold text-black mb-6 text-center">
            Product Showcase
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === index
                  ? "ring-2 ring-primary shadow-lg transform scale-105"
                  : "hover:shadow-md hover:scale-105"
                  }`}
              >
                <div className="aspect-square relative p-2">
                  <LazyImage
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full"
                    objectFit="contain"
                  />
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${selectedImage === index
                      ? "bg-primary/20"
                      : "bg-black/0 hover:bg-black/20"
                      }`}
                  />
                  {selectedImage === index && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <h4
                    className={`text-xs lg:text-sm font-medium transition-colors text-center ${selectedImage === index ? "text-primary" : "text-black"
                      }`}
                  >
                    {image.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 lg:mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  50+
                </div>
                <div className="text-xs lg:text-sm text-gray-700 font-medium">
                  Product Variants
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  100%
                </div>
                <div className="text-xs lg:text-sm text-gray-700 font-medium">
                  Quality Tested
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  15+
                </div>
                <div className="text-xs lg:text-sm text-gray-700 font-medium">
                  Thickness Options
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  24/7
                </div>
                <div className="text-xs lg:text-sm text-gray-700 font-medium">
                  Customer Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
