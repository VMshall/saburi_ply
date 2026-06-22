"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

/**
 * Navbar client island (P1). Ported from client/components/Navbar.jsx with react-router-dom
 * removed: Link `to`→`href` (next/link), NavLink → usePathname-derived active state,
 * useLocation → usePathname, useNavigate → useRouter. The "Get Quote" cross-page state nav
 * (navigate("/", { state: { scrollTo: "contact" } })) becomes hash navigation to /#contact.
 * The Blog link points at the same-origin /blog (rewritten to WordPress, §7) instead of an
 * absolute non-www URL, avoiding an extra 301 hop.
 */
export function Navbar() {
  // Mobile submenu state
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProductsMega, setShowProductsMega] = useState(false);
  const [showAboutMega, setShowAboutMega] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleGetQuote = () => {
    if (pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
  };

  const handleLogoClick = () => {
    if (pathname === "/") {
      // If already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If on different page, navigate to homepage
      router.push("/");
    }
  };

  const mobileProductLinks = [
    "/products/saburi-titanium-plus",
    "/products/saburi-perennial",
    "/products/saburi-club-h-plus",
    "/products/fire-retardant-india",
    "/products/marine-plywood-india",
    "/products/saburi-perennial-blockboard",
    "/products/block-board-india",
    "/products/saburi-gold-blockboard",
    "/products/saburi-fr-blockboard",
    "/products/saburi-scout-plywood",
    "/products/flexi-plywood-india",
    "/products/shuttering-plywood-india",
    "/products/flush-door-india",
    "/products/saburi-smart-panel-wpc-board",
    "/products/saburi-smart-wpc-door-frame",
    "/products/saburi-modwud-pre-lam",
    "/products/saburi-modwud-plain",
    "/products/saburi-lam",
    "/products/saburi-hydramax-board",
    "/products/saburi-neowud",
  ];

  // Timeout refs to prevent immediate closing
  const productsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleProductsMouseEnter = () => {
    if (productsTimeoutRef.current) {
      clearTimeout(productsTimeoutRef.current);
    }
    setShowProductsMega(true);
  };

  const handleProductsMouseLeave = () => {
    productsTimeoutRef.current = setTimeout(() => {
      setShowProductsMega(false);
    }, 150);
  };

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
    setShowAboutMega(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setShowAboutMega(false);
    }, 150);
  };

  const productPaths = [
    "/products/saburi-perennial",
    "/products/saburi-titanium-plus",
    "/products/saburi-club-h-plus",
    "/products/marine-plywood-india",
    "/products/fire-retardant-india",
    "/products/saburi-scout-plywood",
    "/products/shuttering-plywood-india",
    "/products/saburi-perennial-blockboard",
    "/products/saburi-fr-blockboard",
    "/products/block-board-india",
    "/products/saburi-gold-blockboard",
    "/products/flush-door-india",
    "/products/flexi-plywood-india",
    "/products/saburi-smart-panel-wpc-board",
    "/products/saburi-smart-wpc-door-frame",
    "/products/saburi-modwud-pre-lam",
    "/products/saburi-modwud-plain",
    "/products/saburi-lam",
    "/products/saburi-hydramax-board",
    "/products/saburi-neowud",
  ];
  const isProductsActive = productPaths.some((p) => pathname.startsWith(p));

  const routeNameByPath: Record<string, string> = {
    "/": "Home",
    "/about": "About Us",
    "/about/our-journey": "Our Journey",
    "/about/accreditation": "Accreditation",
    "/about/national-presence": "Our National Presence",
    "/about/environment-stewardship": "Environment Stewardship",
    "/about/privacy-policy": "Privacy Policy",
    "/products/saburi-perennial": "Saburi Perennial",
    "/products/saburi-club-h-plus": "Saburi Club H+",
    "/products/saburi-titanium-plus": "Saburi Titanium Plus",
    "/products/saburi-perennial-blockboard": "Saburi Perennial Block Board",
    "/products/block-board-india": "Saburi Club H+ Block Board",
    "/products/saburi-gold-blockboard": "Saburi Gold Block Board",
    "/products/saburi-fr-blockboard": "Saburi FR Block Board",
    "/products/flush-door-india": "Saburi Flushdoor Gold",
    "/products/saburi-flushdoor-scout": "Saburi Flushdoor Scout",
    "/products/flexi-plywood-india": "Saburi Gold Flexi",
    "/products/saburi-scout-plywood": "Saburi Scout",
    "/products/shuttering-plywood-india": "Saburi Shine Platinum",
    "/products/saburi-modwud-pre-lam": "Saburi Modwud Pre-Lam",
    "/products/saburi-modwud-plain": "Saburi Modwud Plain",
    "/products/saburi-smart-panel-wpc-board": "Saburi Smart Panel WPC Board",
    "/products/saburi-smart-wpc-door-frame": "Saburi Smart WPC Door Frame",
    "/products/saburi-lam": "Saburi Lam",
    "/products/saburi-hydramax-board": "Saburi Modwud Hydramax",
    "/products/saburi-neowud": "Saburi Neowud",
    "/best-plywood-andhra-pradesh": "Best Plywood Andhra Pradesh",
    "/best-plywood-kerela": "Best Plywood Kerala",
    "/best-plywood-tamilnadu": "Best Plywood Tamil Nadu",
    "/best-plywood-telangana": "Best Plywood Telangana",
    "/plywood-dealers-bangalore": "Best Plywood Bangalore",
    "/career": "Careers",
    "/contact": "Contact",
    "/sitemap": "Sitemap",
    "/gallery": "Gallery",
    "/blog": "Blog",
  };

  const formatLabel = (path: string) => {
    const slug = path.replace(/^\/+|\/+$/g, "");
    if (!slug) return "Home";
    return slug
      .split("/")
      .pop()!
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const currentLabel = routeNameByPath[pathname] ?? formatLabel(pathname);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const navLinkClass = (active: boolean) =>
    cn(
      "px-3 py-2 text-sm font-medium transition-colors relative",
      active
        ? "text-primary after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-primary after:rounded-full"
        : "text-black hover:text-primary hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:-bottom-0.5 hover:after:h-0.5 hover:after:bg-primary/60 hover:after:rounded-full"
    );

  const mobileLinkClass = (active: boolean) =>
    cn(
      "block px-3 py-2 text-base font-semibold tracking-wide transition-colors",
      active ? "text-primary" : "text-black hover:text-primary"
    );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] lg:gap-4">
          {/* Desktop Logo Block */}
          <div className="hidden lg:flex items-center justify-start">
            <button
              onClick={handleLogoClick}
              className="inline-flex items-center justify-center bg-white border-0 bg-transparent cursor-pointer"
            >
              <img
                src="/images/saburiLogo.webp"
                srcSet="/images/saburiLogo-200.webp 200w, /images/saburiLogo-400.webp 400w, /images/saburiLogo.webp 800w"
                sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                alt="Saburiply Logo"
                loading="eager"
                fetchPriority="high"
                className="h-18 w-auto"
              />
            </button>
          </div>

          <div className="flex flex-col w-full">
            {/* Top Header Bar - Desktop */}
            <div className="bg-[#fff] text-xs sm:text-sm hidden lg:flex w-full">
              <div className="flex flex-wrap items-center justify-end py-2 min-h-[48px] gap-4 w-full">
                {/* Contact Info */}
                <div className="flex items-center gap-5 text-black">
                  <a href="tel:1800313666000" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Phone className="h-3.5 w-3.5" /> <span className="whitespace-nowrap">1800 313 666 000</span>
                  </a>
                  <a href="mailto:info@saburiply.com" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" /> <span className="whitespace-nowrap">info@saburiply.com</span>
                  </a>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-2 sm:gap-3 text-black">
                  <span className="hidden sm:inline font-medium tracking-wide">FOLLOW US:</span>
                  <a href="https://www.facebook.com/saburiply" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07Z" /></svg>
                  </a>
                  <a href="https://www.instagram.com/saburiply/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="https://www.youtube.com/@saburiplywood" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.89 5 12 5 12 5s-5.89 0-7.64.25A2.75 2.75 0 0 0 2.42 7.19C2.17 8.94 2.17 12 2.17 12s0 3.06.25 4.81a2.75 2.75 0 0 0 1.94 1.94C6.11 19 12 19 12 19s5.89 0 7.64-.25a2.75 2.75 0 0 0 1.94-1.94c.25-1.75.25-4.81.25-4.81s0-3.06-.25-4.81zM10 15.5v-7l6 3.5-6 3.5z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/saburi-ply-347865308/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6.94 6.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88zM5.5 8h2.88v10.5H5.5V8zm5.19 0h2.76v1.44h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.9 3.44 4.38v6.16h-2.88v-5.46c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88v5.56h-2.88V8z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Top Header Bar - Mobile */}
            <div className="bg-gray-50 text-xs sm:text-sm lg:hidden w-full">
              <div className="flex items-center justify-between pb-2 px-3 sm:px-4 sm:py-0 min-h-[40px] gap-2">
                {/* Left: 24X7 Support */}
                <div className="flex items-center text-black">
                  <span className="whitespace-nowrap font-medium">24X7 support:</span>
                  <a href="tel:1800313666000" className="flex items-center gap-1 hover:text-primary transition-colors ml-1">
                    <Phone className="h-3.5 w-3.5" /> <span className="whitespace-nowrap">1800 313 666 000</span>
                  </a>
                </div>

                {/* Right: Social Icons */}
                <div className="flex items-center gap-2 text-black">
                  <a href="https://www.facebook.com/saburiply" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07Z" /></svg>
                  </a>
                  <a href="https://www.instagram.com/saburiply/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="https://www.youtube.com/@saburiplywood" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.89 5 12 5 12 5s-5.89 0-7.64.25A2.75 2.75 0 0 0 2.42 7.19C2.17 8.94 2.17 12 2.17 12s0 3.06.25 4.81a2.75 2.75 0 0 0 1.94 1.94C6.11 19 12 19 12 19s5.89 0 7.64-.25a2.75 2.75 0 0 0 1.94-1.94c.25-1.75.25-4.81.25-4.81s0-3.06-.25-4.81zM10 15.5v-7l6 3.5-6 3.5z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/saburi-ply-347865308/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6.94 6.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88zM5.5 8h2.88v10.5H5.5V8zm5.19 0h2.76v1.44h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.9 3.44 4.38v6.16h-2.88v-5.46c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88v5.56h-2.88V8z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center h-14 sm:h-16 py-3 lg:py-2 w-full">
              {/* Logo (mobile/tablet) */}
              <div className="flex-shrink-0 lg:hidden">
                <button onClick={handleLogoClick} className="flex items-center border-0 bg-transparent cursor-pointer">
                  <img
                    src="/images/saburiLogo.webp"
                    srcSet="/images/saburiLogo-200.webp 200w, /images/saburiLogo-400.webp 400w, /images/saburiLogo.webp 800w"
                    sizes="(max-width: 640px) 150px, 200px"
                    alt="Saburiply Logo"
                    loading="eager"
                    fetchPriority="high"
                    className="h-10 sm:h-12 w-auto"
                  />
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex flex-1 justify-end items-center">
                <div className="flex items-end space-x-4 xl:space-x-8">
                  <Link href="/" className={navLinkClass(isActive("/", true))}>
                    Home
                  </Link>

                  {/* Products Mega Menu */}
                  <div
                    className="relative"
                    onMouseEnter={handleProductsMouseEnter}
                    onMouseLeave={handleProductsMouseLeave}
                  >
                    <button
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors relative",
                        isProductsActive || showProductsMega
                          ? "text-primary after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-primary after:rounded-full"
                          : "text-black hover:text-primary hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:-bottom-0.5 hover:after:h-0.5 after:bg-primary/60 hover:after:rounded-full"
                      )}
                    >
                      Products
                    </button>

                    {/* Mega Menu Dropdown - Full Width */}
                    {showProductsMega && (
                      <div
                        className="fixed left-0 right-0 top-[112px] z-50"
                        onMouseEnter={handleProductsMouseEnter}
                        onMouseLeave={handleProductsMouseLeave}
                      >
                        <div
                          className="relative shadow-2xl border-t-2 border-primary/30 pb-16"
                          style={{
                            backgroundImage: 'url(/images/nav-product.jpeg)',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: '#000000'
                          }}
                        >
                          {/* Dark overlay for readability (increased darkness) */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>

                          {/* Content */}
                          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <div className="grid grid-cols-8 gap-4">
                              {/* Column 1: Plywood */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  <Link href="/plywood" className="transition-colors hover:text-red-500">
                                    Plywood
                                  </Link>
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/saburi-titanium-plus" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Titanium Plus
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-perennial" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Perennial
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-club-h-plus" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Club H+
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/marine-plywood-india" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Gold
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/fire-retardant-india" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi FR
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-scout-plywood" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Scout
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/flexi-plywood-india" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Gold Flexi
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/shuttering-plywood-india" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Shine Platinum
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 2: Block Board */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  Block Board
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/saburi-perennial-blockboard" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Perennial Block Board
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-fr-blockboard" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi FR Block Board
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/block-board-india" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Club H+ Block Board
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-gold-blockboard" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Gold Block Board
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 3: Saburi Flush door */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  Flush Door
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/flush-door-india" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Flush Door Gold
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 7: WPC/PVC */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  WPC
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/saburi-smart-panel-wpc-board" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Smart Panel WPC Board
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-smart-wpc-door-frame" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Smart WPC Door Frame
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 6: ChipBoard */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  ChipBoard
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/saburi-modwud-pre-lam" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Modwud Pre-Lam
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-modwud-plain" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Modwud Plain
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 8: Lamination */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  Liner
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/saburi-lam" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Lam
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 8: Lamination */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  New Launch
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/products/saburi-hydramax-board" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Modwud Hydramax
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/products/saburi-neowud" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Saburi Neowud
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href="/gallery" className={navLinkClass(isActive("/gallery"))}>
                    Gallery
                  </Link>

                  {/* About Us Mega Menu */}
                  <div
                    className="relative"
                    onMouseEnter={handleAboutMouseEnter}
                    onMouseLeave={handleAboutMouseLeave}
                  >
                    <button
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors relative",
                        pathname.startsWith("/about") || showAboutMega
                          ? "text-primary after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-primary after:rounded-full"
                          : "text-black hover:text-primary hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:-bottom-0.5 hover:after:h-0.5 after:bg-primary/60 hover:after:rounded-full"
                      )}
                    >
                      About Us
                    </button>

                    {/* Mega Menu Dropdown - Full Width */}
                    {showAboutMega && (
                      <div
                        className="fixed left-0 right-0 top-[112px] z-50"
                        onMouseEnter={handleAboutMouseEnter}
                        onMouseLeave={handleAboutMouseLeave}
                      >
                        <div
                          className="relative shadow-2xl border-t-2 border-primary/30 pb-16 min-h-[500px]"
                          style={{
                            backgroundImage: 'url(/images/about-nav.webp)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          {/* Dark overlay for readability (increased darkness) */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

                          {/* Content */}
                          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <div className="grid grid-cols-3 gap-16">
                              {/* Column 1 */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  Company
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/about" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Company Overview
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/about/accreditation" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Accreditation
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 2 */}
                              <div>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  Our Initiatives
                                </h3>
                                <ul className="space-y-3">
                                  <li>
                                    <Link href="/about/national-presence" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Our National Presence
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/about/environment-stewardship" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Environment Stewardship
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/about/privacy-policy" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">
                                      Privacy Policy
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <a href="/blog" className={navLinkClass(pathname === "/blog")}>
                    Blog
                  </a>
                  <Link href="/contact" className={navLinkClass(isActive("/contact"))}>
                    Contact
                  </Link>

                  {/* Get Quote Button - moved inline with nav */}
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 text-sm ml-2"
                    onClick={handleGetQuote}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary touch-manipulation"
                  aria-label={isOpen ? "Close main menu" : "Open main menu"}
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4 bg-white shadow-lg border-t border-gray-200">
            {/* Main menu headings - visually identical */}
            <Link href="/" className={mobileLinkClass(isActive("/", true))} onClick={toggleMenu}>
              Home
            </Link>
            <button
              className={cn("w-full text-left px-3 py-2 text-base font-semibold tracking-wide text-black flex items-center justify-between transition-colors hover:text-primary min-h-[48px]", mobileProductsOpen ? "" : "")}
              onClick={() => setMobileProductsOpen((open) => !open)}
              aria-expanded={mobileProductsOpen}
              aria-label={mobileProductsOpen ? "Collapse Products menu" : "Expand Products menu"}
            >
              Products
              <span className="ml-2">
                {mobileProductsOpen ? <MdKeyboardArrowDown size={20} aria-hidden="true" /> : <MdKeyboardArrowRight size={20} aria-hidden="true" />}
              </span>
            </button>
            {mobileProductsOpen && (
              <div className="pl-6 space-y-1">
                {mobileProductLinks.map((to) => (
                  <Link
                    key={to}
                    href={to}
                    className="block py-2 text-sm text-black hover:text-primary"
                    onClick={toggleMenu}
                  >
                    • {routeNameByPath[to] ?? formatLabel(to)}
                  </Link>
                ))}
              </div>
            )}
            <button
              className={cn("w-full text-left px-3 py-2 text-base font-semibold tracking-wide text-black flex items-center justify-between transition-colors hover:text-primary", mobileAboutOpen ? "" : "")}
              onClick={() => setMobileAboutOpen((open) => !open)}
              aria-expanded={mobileAboutOpen}
            >
              About Us
              <span className="ml-2">
                {mobileAboutOpen ? <MdKeyboardArrowDown size={20} /> : <MdKeyboardArrowRight size={20} />}
              </span>
            </button>
            {mobileAboutOpen && (
              <div className="pl-6 space-y-1">
                <Link href="/about" className="block py-2 text-sm text-black hover:text-primary" onClick={toggleMenu}>
                  • Company Overview
                </Link>
                <Link href="/about/accreditation" className="block py-2 text-sm text-black hover:text-primary" onClick={toggleMenu}>
                  • Accreditation
                </Link>
                <Link href="/about/national-presence" className="block py-2 text-sm text-black hover:text-primary" onClick={toggleMenu}>
                  • Our National Presence
                </Link>
                <Link href="/about/environment-stewardship" className="block py-2 text-sm text-black hover:text-primary" onClick={toggleMenu}>
                  • Environment Stewardship
                </Link>
                <Link href="/about/privacy-policy" className="block py-2 text-sm text-black hover:text-primary" onClick={toggleMenu}>
                  • Privacy Policy
                </Link>
              </div>
            )}
            <Link href="/gallery" className={mobileLinkClass(isActive("/gallery"))} onClick={toggleMenu}>
              Gallery
            </Link>
            <a
              href="/blog"
              className="block px-3 py-2 text-base font-semibold tracking-wide transition-colors text-black hover:text-primary"
              onClick={toggleMenu}
            >
              Blog
            </a>
            <Link href="/contact" className={mobileLinkClass(isActive("/contact"))} onClick={toggleMenu}>
              Contact
            </Link>
            <div className="px-3 py-4 border-t border-gray-200 mt-3 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-black p-2 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-black p-2 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@saburiply.com</span>
              </div>
              <Button
                className="w-full bg-[#F44336] hover:bg-[#d32f2f] text-white py-3 text-base font-bold rounded-md shadow touch-manipulation"
                onClick={() => {
                  handleGetQuote();
                  toggleMenu();
                }}
              >
                Get Quote Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {pathname !== "/" && (
        <div className="relative text-white">
          <div className="relative bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.92)] to-[hsl(var(--primary))]">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'url("/images/saburiLogo.webp")',
                backgroundRepeat: "repeat",
                backgroundSize: "140px",
                backgroundPosition: "center",
              }}
            />
            <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2">
              <Breadcrumb>
                <BreadcrumbList className="text-white/85">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="hover:text-white">
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {isProductsActive && (
                    <>
                      <BreadcrumbSeparator className="text-white/80" />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#products" className="hover:text-white">Products</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  <BreadcrumbSeparator className="text-white/80" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">{currentLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="h-[2px] w-full bg-[hsl(var(--primary)/0.8)]" />
        </div>
      )}
    </nav>
  );
}
