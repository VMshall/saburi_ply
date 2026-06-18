import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

// PageHeader supports either being passed an `images` prop (object with desktop/tablet/mobile keys or array of URLs)
// or it will pick images from an internal map keyed by `title`.
// If no images are found, it falls back to the original gradient background.
//
// Usage examples:
// 1. Responsive images: <PageHeader title="..." images={{ desktop: "...", tablet: "...", mobile: "..." }} />
// 2. Single image array (legacy): <PageHeader title="..." images={["..."]} />
// 3. Auto from map: <PageHeader title="Saburi Perennial Blockboard" />
export function PageHeader({ title, images = null }) {
  const location = useLocation();
  const productPaths = [
    "/products/saburi-perennial",
    "/products/saburi-club-h-plus",
    "/products/saburi-titanium-plus",
    "/products/fire-retardant-india",
    "/products/marine-plywood-india",
    "/products/saburi-perennial-blockboard",
    "/products/saburi-fr-blockboard",
    "/products/block-board-india",
    "/products/saburi-gold-blockboard",
    "/products/flush-door-india",
    "/products/saburi-flushdoor-scout",
    "/products/flexi-plywood-india",
    "/products/saburi-scout-plywood",
    "/products/shuttering-plywood-india",
    "/products/saburi-modwud-pre-lam",
    "/products/saburi-modwud-plain",
    "/products/saburi-smart-panel-pvc-board",
    "/products/saburi-smart-panel-wpc-board",
    "/products/saburi-smart-wpc-door-frame",
    "/products/saburi-hydramax-board",
    "/products/saburi-neowud",
    "/products/saburi-lam"
  ];
  const isProductsActive = productPaths.some((p) => location.pathname.startsWith(p));

  // Pages that should show title overlay
  const titleOverlayPages = [
    ...productPaths,
    "/best-plywood-andhra-pradesh",
    "/best-plywood-kerela",
    "/best-plywood-tamilnadu",
    "/best-plywood-telangana",
    "/plywood-dealers-bangalore"
  ];
  const shouldShowTitle = titleOverlayPages.includes(location.pathname);

  // Internal map: match common page titles to responsive background images.
  // Format: { desktop: "url", tablet: "url", mobile: "url" } or legacy array format ["url"]
  const defaultImageMap = {
    "About Us": [
      "/images/breadcrumbs/Products.webp",
    ],
    "Our Journey": [
      "/images/breadcrumbs/Journey.webp",
    ],
    "Accreditation & Certifications": [
      "/images/breadcrumbs/Accreditation.webp",
    ],
    "Our National Presence": {
      desktop: "/images/breadcrumbs/desk-national-presence.webp",
      tablet: "/images/breadcrumbs/tab-national-presence.webp",
      mobile: "/images/breadcrumbs/mob-national-presence.webp",
    },
    "Environment Stewardship": [
      "/images/breadcrumbs/Environmental-Stewardship-.webp",
    ],
    "Privacy Policy": [
      "/images/breadcrumbs/Privacy.webp",
    ],
    "Contact": [
      "/images/breadcrumbs/Contact.webp",
    ],
    "Careers": [
      "/images/breadcrumbs/Careers.webp",
    ],
    "Gallery": {
      desktop: "/images/gallery/breadcrumb/desk-breadcrumb.webp",
      tablet: "/images/gallery/breadcrumb/tab-breadcrumb.webp",
      mobile: "/images/gallery/breadcrumb/mob-breadcrumb.webp",
    },
    "Blog": [
      "/images/breadcrumbs/blog.webp",
    ],
    "Blog Details": [
      "/images/breadcrumbs/blog.webp",
    ],
    // Product pages with responsive images
    "Saburi Perennial": {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread1.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread1.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread1.webp",
    },
    "Saburi Titanium": {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread2.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread2.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread2.webp",
    },
    "Saburi Club H+": {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread3.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread3.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread3.webp",
    },
    "Best Marine Plywood Manufacturer and Supplier in India": {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread4.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread4.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread4.webp",
    },
    "Saburi Fire Retardant": {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread1.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread1.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread1.webp",
    },
    "Saburi Scout Plywood": {
      desktop: "/images/plywood-breadcrumb/desk-ply-bread2.webp",
      tablet: "/images/plywood-breadcrumb/tab-ply-bread2.webp",
      mobile: "/images/plywood-breadcrumb/mob-ply-bread2.webp",
    },
    // Example of responsive images for Saburi Perennial Blockboard
    "Best Plywood & BlockBoard Company in India": {
      desktop: "/images/blockboard-breadcrumb/deskt-bread1.webp",
      tablet: "/images/blockboard-breadcrumb/tab-bread1.webp",
      mobile: "/images/blockboard-breadcrumb/mobile-bread1.webp",
    },
    "Saburi Gold Blockboard": {
      desktop: "/images/blockboard-breadcrumb/deskt-bread2.webp",
      tablet: "/images/blockboard-breadcrumb/tab-bread2.webp",
      mobile: "/images/blockboard-breadcrumb/mobile-bread2.webp",
    },
    "Saburi FR Block Board": {
      desktop: "/images/blockboard-breadcrumb/deskt-bread3.webp",
      tablet: "/images/blockboard-breadcrumb/tab-bread3.webp",
      mobile: "/images/blockboard-breadcrumb/mobile-bread3.webp",
    },
    "Block Board Manufacturer in India": {
      desktop: "/images/blockboard-breadcrumb/deskt-bread4.webp",
      tablet: "/images/blockboard-breadcrumb/tab-bread4.webp",
      mobile: "/images/blockboard-breadcrumb/mobile-bread4.webp",
    },
    "Flush Door Manufacturer in India": {
      desktop: "/images/flushdoor-breadcrumb/desk-flush-bread1.webp",
      tablet: "/images/flushdoor-breadcrumb/tab-flush-bread1.webp",
      mobile: "/images/flushdoor-breadcrumb/mob-flush-bread1.webp",
    },
    "Saburi Flushdoor Scout": {
      desktop: "/images/flushdoor-breadcrumb/desk-flush-bread2.webp",
      tablet: "/images/flushdoor-breadcrumb/tab-flush-bread2.webp",
      mobile: "/images/flushdoor-breadcrumb/mob-flush-bread2.webp",
    },
    "Saburi Smart Panel PVC Board": {
      desktop: "/images/wpcpvc-breadcrumb/desk-pvc.webp",
      tablet: "/images/wpcpvc-breadcrumb/tab-pvc.webp",
      mobile: "/images/wpcpvc-breadcrumb/mob-pvc.webp",
    },
    "Best Smart Panels Manufacturer in India": {
      desktop: "/images/wpcpvc-breadcrumb/desk-wpc.webp",
      tablet: "/images/wpcpvc-breadcrumb/tab-wpc.webp",
      mobile: "/images/wpcpvc-breadcrumb/mob-wpc.webp",
    },
    "Best Door Frame Manufacturer in India": {
      desktop: "/images/wpcpvc-breadcrumb/desk-door.webp",
      tablet: "/images/wpcpvc-breadcrumb/tab-door.webp",
      mobile: "/images/wpcpvc-breadcrumb/mob-door.webp",
    },
    "Saburi Liner": {
      desktop: "/images/lamination-breadcrumb/desk-lam.webp",
      tablet: "/images/lamination-breadcrumb/tab-lam.webp",
      mobile: "/images/lamination-breadcrumb/mob-lam.webp",
    },
    "Best Flexi Plywood Manufacturer and Supplier in India": {
      desktop: "/images/flexiblePly-breadcrumb/desk-flexi-Plywood.webp",
      tablet: "/images/flexiblePly-breadcrumb/desk-flexi-Plywood.webp",
      mobile: "/images/flexiblePly-breadcrumb/desk-flexi-Plywood.webp",
    },
    "Shuttering Plywood Manufacturer in India": {
      desktop: "/images/shuttering-breadcrumb/desk-shuttering-Ply.webp",
      tablet: "/images/shuttering-breadcrumb/desk-shuttering-Ply.webp",
      mobile: "/images/shuttering-breadcrumb/desk-shuttering-Ply.webp",
    },
    "Saburi Modwud Pre-Laminated": {
      desktop: "/images/chipboard-breadcrumb/desk-chipboard.webp",
      tablet: "/images/chipboard-breadcrumb/tab-chipboard.webp",
      mobile: "/images/chipboard-breadcrumb/mob-chipboard.webp",
    },
    "Saburi Modwud Plain": {
      desktop: "/images/chipboard-breadcrumb/desk-chipboard.webp",
      tablet: "/images/chipboard-breadcrumb/tab-chipboard.webp",
      mobile: "/images/chipboard-breadcrumb/mob-chipboard.webp",
    },
    "Marine Plywood Manufacturer in India": {
      desktop: "/images/new-launch-breadcrumb/breadcrumb-hdyramax.webp",
      tablet: "/images/new-launch-breadcrumb/breadcrumb-hdyramax.webp",
      mobile: "/images/new-launch-breadcrumb/breadcrumb-hdyramax.webp",
    },
    "Saburi Neowud": {
      desktop: "/images/new-launch-breadcrumb/Saburi Neowud Breadcrump 2.webp",
      tablet: "/images/new-launch-breadcrumb/Saburi Neowud Breadcrump 2.webp",
      mobile: "/images/new-launch-breadcrumb/Saburi Neowud Breadcrump 2.webp",
    },
    "Best Plywood Kerela": {
      desktop: "/images/kerela-product-breadcrumb/desk-kerela-bread.webp",
      tablet: "/images/kerela-product-breadcrumb/tab-kerela-bread.webp",
      mobile: "/images/kerela-product-breadcrumb/mob-kerela-bread.webp",
    },
    "Best Plywood Andhra Pradesh": {
      desktop: "/images/kerela-product-breadcrumb/desk-kerela-bread.webp",
      tablet: "/images/kerela-product-breadcrumb/tab-kerela-bread.webp",
      mobile: "/images/kerela-product-breadcrumb/mob-kerela-bread.webp",
    },
    "Best Plywood Telangana": {
      desktop: "/images/kerela-product-breadcrumb/desk-kerela-bread.webp",
      tablet: "/images/kerela-product-breadcrumb/tab-kerela-bread.webp",
      mobile: "/images/kerela-product-breadcrumb/mob-kerela-bread.webp",
    },
    "Best Plywood Bangalore": {
      desktop: "/images/kerela-product-breadcrumb/desk-kerela-bread.webp",
      tablet: "/images/kerela-product-breadcrumb/tab-kerela-bread.webp",
      mobile: "/images/kerela-product-breadcrumb/mob-kerela-bread.webp",
    },
    "Best Plywood Tamil Nadu": {
      desktop: "/images/kerela-product-breadcrumb/desk-kerela-bread.webp",
      tablet: "/images/kerela-product-breadcrumb/tab-kerela-bread.webp",
      mobile: "/images/kerela-product-breadcrumb/mob-kerela-bread.webp",
    },
    "Marine Plywood": [
      "/images/breadcrumbs/Products.jpg",
    ],
    "Block Board": [
      "/images/breadcrumbs/Products.jpg",
    ],
    "Flush Door": [
      "/images/breadcrumbs/Products.jpg",
    ],
    "Flexi Plywood": [
      "/images/breadcrumbs/Products.jpg",
    ],
  };

  // Resolve background images from props or map
  let backgroundImages = images;
  if (!backgroundImages) {
    // prefer title-based mapping
    if (title && defaultImageMap[title]) {
      backgroundImages = defaultImageMap[title];
    } else if (isProductsActive) {
      backgroundImages = defaultImageMap.products;
    } else {
      backgroundImages = null; // fallback to gradient
    }
  }

  // Normalize backgroundImages to responsive format
  // If it's an object with desktop/tablet/mobile keys, use it directly
  // If it's an array (legacy format), convert to responsive format using the same image for all screens
  let responsiveImages = null;
  if (backgroundImages) {
    if (Array.isArray(backgroundImages)) {
      // Legacy array format - use first image for all screen sizes
      const firstImage = backgroundImages[0];
      responsiveImages = {
        desktop: firstImage,
        tablet: firstImage,
        mobile: firstImage,
      };
    } else if (typeof backgroundImages === 'object' && backgroundImages.desktop) {
      // New responsive format
      responsiveImages = {
        desktop: backgroundImages.desktop,
        tablet: backgroundImages.tablet || backgroundImages.desktop,
        mobile: backgroundImages.mobile || backgroundImages.tablet || backgroundImages.desktop,
      };
    }
  }

  return (
    // Use responsive fixed heights so the breadcrumb/banner area matches
    // the ideal 1920x450px size on very large screens while remaining
    // responsive on smaller viewports.
    <div className="relative isolate flex items-center h-[220px] sm:h-[280px] md:h-[340px] lg:h-[420px] 2xl:h-[450px]">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-none">
        {responsiveImages ? (
          // Responsive background images with screen-size specific sources
          <>
            {/* Mobile image - visible only on small screens (< 768px) */}
            <img
              src={responsiveImages.mobile}
              alt=""
              aria-hidden="true"
              className="md:hidden absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            />

            {/* Tablet image - visible only on medium screens (768px - 1024px) */}
            <img
              src={responsiveImages.tablet}
              alt=""
              aria-hidden="true"
              className="hidden md:block lg:hidden absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            />

            {/* Desktop image - visible only on large screens (>= 1024px) */}
            <img
              src={responsiveImages.desktop}
              alt=""
              aria-hidden="true"
              className="hidden lg:block absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            />

            {/* light semi-transparent overlay for text contrast */}
            <div className="absolute inset-0 bg-black/30" />
            {/* decorative accents retained from original implementation */}
            <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-white/6 blur-2xl" />
            {/* <div className="absolute right-6 top-8 h-3 w-3 rounded-full bg-white/20" /> */}
            {/* <div className="absolute right-14 top-12 h-2.5 w-2.5 rounded-full bg-white/15" /> */}
          </>
        ) : (
          // original gradient fallback
          <>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-6 top-8 h-3 w-3 rounded-full bg-white/40" />
            <div className="absolute right-14 top-12 h-2.5 w-2.5 rounded-full bg-white/30" />
          </>
        )}
      </div>

      {/* Title Overlay - Only for specific pages - HIDDEN */}
      {/* {shouldShowTitle && title && (
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {title}
            </h1>
          </div>
        </div>
      )} */}
    </div>
  );
}
