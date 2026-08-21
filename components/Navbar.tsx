"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
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
import { GUIDE_PAGES, GUIDE_LABELS } from "@/data/faq-placement";
import { PRODUCT_NAV } from "@/data/product-nav";

/**
 * Navbar client island (P1). Restyled to mirror rockwool.com/group: a two-tier header — a dark-red
 * utility strip (contact + social) above a bright-red main nav bar with a knocked-out (white) logo
 * and white nav links. Saburi's nav structure, mega-menus, and Get Quote CTA are all preserved.
 */
export function Navbar() {
  // Mobile submenu state
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  /** Which product category is expanded inside the mobile Products accordion (null = none). */
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showAboutMega, setShowAboutMega] = useState(false);
  const [showGuidesMega, setShowGuidesMega] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const toggleMenu = () => setIsOpen(!isOpen);

  // ===== Products click-panel (replaces the old hover mega-menu) =====
  // `productsOpen` controls the panel; `activeCategory` is the drill-down level (null = tile grid).
  const [productsOpen, setProductsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const productsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const productsPanelRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  /**
   * Selector for the element that should receive focus after the next panel render, set by whichever
   * handler caused the change. Consumed (and cleared) by the effect below, so focus only moves on a
   * user-initiated transition — never on an incidental re-render.
   */
  const pendingFocus = useRef<string | null>(null);

  const closeProducts = useCallback((returnFocus = false) => {
    setProductsOpen(false);
    setActiveCategory(null);
    if (returnFocus) productsTriggerRef.current?.focus();
  }, []);

  const toggleProducts = () => {
    if (productsOpen) {
      setProductsOpen(false);
      setActiveCategory(null);
      return;
    }
    pendingFocus.current = "[data-panel-first]";
    // Only one panel at a time — a click on Products dismisses the hover menus.
    setShowGuidesMega(false);
    setShowAboutMega(false);
    setProductsOpen(true);
  };

  /** Drill into a category: focus lands on its back button. */
  const openCategory = useCallback((id: string) => {
    pendingFocus.current = `[data-pane="${id}"] [data-pane-first]`;
    setActiveCategory(id);
  }, []);

  /** Back out to the grid: focus returns to the tile you came from. */
  const backToGrid = useCallback((id: string) => {
    pendingFocus.current = `[data-tile="${id}"]`;
    setActiveCategory(null);
  }, []);

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

  // Timeout refs to prevent immediate closing (Guides + About still use the hover pattern)
  const aboutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guidesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the panel whenever the route changes (a product link was followed).
  useEffect(() => {
    setProductsOpen(false);
    setActiveCategory(null);
  }, [pathname]);

  // Escape: step back out of a drill-down first, then close the panel.
  useEffect(() => {
    if (!productsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      // Go through backToGrid so Escape restores focus to the originating tile rather than
      // dropping it on <body>.
      if (activeCategory) backToGrid(activeCategory);
      else closeProducts(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [productsOpen, activeCategory, closeProducts, backToGrid]);

  // Click outside the header (panel + trigger both live inside it) closes the panel.
  useEffect(() => {
    if (!productsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      closeProducts();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [productsOpen, closeProducts]);

  // Lock body scroll while the panel is open so the page doesn't slide under the overlay.
  useEffect(() => {
    if (!productsOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [productsOpen]);

  // Move focus to whatever the last user action asked for (open → first tile, drill-in → back
  // button, back → the originating tile).
  useEffect(() => {
    const selector = pendingFocus.current;
    if (!productsOpen || !selector) return;
    pendingFocus.current = null;
    productsPanelRef.current?.querySelector<HTMLElement>(selector)?.focus();
  }, [productsOpen, activeCategory]);

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
    closeProducts();
    setShowAboutMega(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setShowAboutMega(false);
    }, 150);
  };

  const handleGuidesMouseEnter = () => {
    if (guidesTimeoutRef.current) {
      clearTimeout(guidesTimeoutRef.current);
    }
    closeProducts();
    setShowGuidesMega(true);
  };

  const handleGuidesMouseLeave = () => {
    guidesTimeoutRef.current = setTimeout(() => {
      setShowGuidesMega(false);
    }, 150);
  };

  const isProductsActive = pathname.startsWith("/products/");

  // "Guides" mega-menu, derived from the guide registry so it auto-syncs with the clusters.
  const isGuidesActive =
    pathname.startsWith("/plywood-guide") || pathname.startsWith("/plywood-buying-guide");
  const guideLabel = (path: string) => GUIDE_LABELS[path.split("/").filter(Boolean).pop() ?? ""] ?? path;
  const guideColumns = GUIDE_PAGES.filter((p) => p.kind === "pillar").map((pillar) => ({
    heading: guideLabel(pillar.path),
    href: pillar.path,
    clusters: (pillar.clusters ?? []).flatMap((slug) => {
      const c = GUIDE_PAGES.find((p) => p.slug === slug);
      return c ? [{ label: guideLabel(c.path), href: c.path }] : [];
    }),
  }));

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

  // White-on-red nav link (Rockwool style): active gets a solid white underline.
  const navLinkClass = (active: boolean) =>
    cn(
      "px-3 py-2 text-[15px] xl:text-[17px] font-medium transition-colors relative",
      active
        ? "text-white after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:bg-white after:rounded-full"
        : "text-white/85 hover:text-white hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:-bottom-1 hover:after:h-0.5 hover:after:bg-white/60 hover:after:rounded-full"
    );

  const megaTriggerClass = (active: boolean) =>
    cn(
      "px-3 py-2 text-[15px] xl:text-[17px] font-medium transition-colors relative",
      active
        ? "text-white after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:bg-white after:rounded-full"
        : "text-white/85 hover:text-white"
    );

  /**
   * Stacks the Products panel's levels. The visible pane is in normal flow (so it sizes the panel);
   * the rest are absolutely positioned and `invisible` — removed from the tab order and a11y tree,
   * but still present in the HTML so their product links stay crawlable.
   */
  const panePosition = (visible: boolean) =>
    cn(
      "transition-opacity duration-150 ease-out motion-reduce:transition-none",
      visible ? "relative opacity-100" : "pointer-events-none invisible absolute inset-0 opacity-0"
    );

  const mobileLinkClass = (active: boolean) =>
    cn(
      "block px-3 py-2 text-base font-semibold tracking-wide transition-colors",
      active ? "text-primary" : "text-black hover:text-primary"
    );

  return (
    <nav className="sticky top-0 z-50 shadow-md">
      {/* Scrim behind the Products panel. Sits under the header wrapper (z-50) but above the page. */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 motion-reduce:transition-none",
          productsOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => closeProducts()}
      />

      {/* Header wrapper: the Products panel anchors to this with `top-full`, so it always sits
          flush under the bar regardless of the utility strip's height (no magic offset). */}
      <div ref={headerRef} className="relative z-50">
      {/* ===== Tier 1: utility strip (Rockwool dark-red) ===== */}
      <div className="hidden lg:block bg-[#8C101E] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 py-2 text-xs">
            <a href="tel:1800313666000" className="flex items-center gap-1.5 transition-colors hover:text-white/75">
              <Phone className="h-3.5 w-3.5" /> <span className="whitespace-nowrap">1800 313 666 000</span>
            </a>
            <a href="mailto:info@saburiply.com" className="flex items-center gap-1.5 transition-colors hover:text-white/75">
              <Mail className="h-3.5 w-3.5" /> <span className="whitespace-nowrap">info@saburiply.com</span>
            </a>
            <div className="flex items-center gap-3">
              <span className="font-semibold tracking-wide">FOLLOW US:</span>
              <a href="https://www.facebook.com/saburiply" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-white/75">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07Z" /></svg>
              </a>
              <a href="https://www.instagram.com/saburiply/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-white/75">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://www.youtube.com/@saburiplywood" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-white/75">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.89 5 12 5 12 5s-5.89 0-7.64.25A2.75 2.75 0 0 0 2.42 7.19C2.17 8.94 2.17 12 2.17 12s0 3.06.25 4.81a2.75 2.75 0 0 0 1.94 1.94C6.11 19 12 19 12 19s5.89 0 7.64-.25a2.75 2.75 0 0 0 1.94-1.94c.25-1.75.25-4.81.25-4.81s0-3.06-.25-4.81zM10 15.5v-7l6 3.5-6 3.5z" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/saburi-ply/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-white/75">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6.94 6.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88zM5.5 8h2.88v10.5H5.5V8zm5.19 0h2.76v1.44h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.9 3.44 4.38v6.16h-2.88v-5.46c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88v5.56h-2.88V8z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Utility strip (mobile) */}
      <div className="lg:hidden bg-[#8C101E] text-white">
        <div className="flex items-center justify-between px-3 py-1.5 text-xs">
          <a href="tel:1800313666000" className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" /> <span className="whitespace-nowrap">1800 313 666 000</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/saburiply" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white/75">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07Z" /></svg>
            </a>
            <a href="https://www.instagram.com/saburiply/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white/75">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://www.youtube.com/@saburiplywood" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white/75">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.89 5 12 5 12 5s-5.89 0-7.64.25A2.75 2.75 0 0 0 2.42 7.19C2.17 8.94 2.17 12 2.17 12s0 3.06.25 4.81a2.75 2.75 0 0 0 1.94 1.94C6.11 19 12 19 12 19s5.89 0 7.64-.25a2.75 2.75 0 0 0 1.94-1.94c.25-1.75.25-4.81.25-4.81s0-3.06-.25-4.81zM10 15.5v-7l6 3.5-6 3.5z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/saburi-ply/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white/75">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6.94 6.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88zM5.5 8h2.88v10.5H5.5V8zm5.19 0h2.76v1.44h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.9 3.44 4.38v6.16h-2.88v-5.46c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88v5.56h-2.88V8z" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* ===== Tier 2: main red nav bar ===== */}
      <div className="bg-[#D20014]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-[92px]">
            {/* Logo (knocked out to white) + desktop nav cluster */}
            <div className="flex items-center gap-6 xl:gap-10">
              <button
                onClick={handleLogoClick}
                className="flex flex-shrink-0 items-center border-0 bg-transparent cursor-pointer"
                aria-label="Saburiply home"
              >
                <img
                  src="/images/saburiLogo.webp"
                  srcSet="/images/saburiLogo-200.webp 200w, /images/saburiLogo-400.webp 400w, /images/saburiLogo.webp 800w"
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 220px"
                  alt="Saburiply Logo"
                  loading="eager"
                  fetchPriority="high"
                  className="h-10 sm:h-11 lg:h-14 w-auto brightness-0 invert"
                />
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1 xl:gap-7">
                <Link href="/" className={navLinkClass(isActive("/", true))}>
                  Home
                </Link>

                {/* Products — click-to-open category panel (panel itself is rendered below the bar) */}
                <div className="relative">
                  <button
                    ref={productsTriggerRef}
                    type="button"
                    onClick={toggleProducts}
                    aria-expanded={productsOpen}
                    aria-controls="products-panel"
                    className={cn(megaTriggerClass(isProductsActive || productsOpen), "inline-flex items-center gap-1")}
                  >
                    Products
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                        productsOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>

                </div>

                {/* Guides Mega Menu (data-driven from GUIDE_PAGES) */}
                <div
                  className="relative"
                  onMouseEnter={handleGuidesMouseEnter}
                  onMouseLeave={handleGuidesMouseLeave}
                >
                  <button className={megaTriggerClass(isGuidesActive || showGuidesMega)}>
                    Guides
                  </button>

                  {showGuidesMega && (
                    <div
                      className="fixed left-0 right-0 top-[124px] z-50"
                      onMouseEnter={handleGuidesMouseEnter}
                      onMouseLeave={handleGuidesMouseLeave}
                    >
                      <div
                        className="relative shadow-2xl border-t-2 border-white/30 pb-16 min-h-[600px]"
                        style={{
                          backgroundImage: 'url(/images/nav-product.jpeg)',
                          backgroundSize: '100% 100%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundColor: '#000000',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
                        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
                          <div className="grid grid-cols-2 gap-16">
                            {guideColumns.map((col) => (
                              <div key={col.href}>
                                <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">
                                  <Link href={col.href} className="transition-colors hover:text-red-500">
                                    {col.heading}
                                  </Link>
                                </h3>
                                <ul className="space-y-3">
                                  {col.clusters.map((c) => (
                                    <li key={c.href}>
                                      <Link
                                        href={c.href}
                                        className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1"
                                      >
                                        {c.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                                <Link
                                  href={col.href}
                                  className="mt-5 inline-block text-sm font-semibold text-white hover:text-red-400 transition-colors"
                                >
                                  View the full guide →
                                </Link>
                              </div>
                            ))}
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
                  <button className={megaTriggerClass(pathname.startsWith("/about") || showAboutMega)}>
                    About Us
                  </button>

                  {showAboutMega && (
                    <div
                      className="fixed left-0 right-0 top-[124px] z-50"
                      onMouseEnter={handleAboutMouseEnter}
                      onMouseLeave={handleAboutMouseLeave}
                    >
                      <div
                        className="relative shadow-2xl border-t-2 border-white/30 pb-16 min-h-[500px]"
                        style={{
                          backgroundImage: 'url(/images/about-nav.webp)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                          <div className="grid grid-cols-3 gap-16">
                            <div>
                              <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">Company</h3>
                              <ul className="space-y-3">
                                <li><Link href="/about" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">Company Overview</Link></li>
                                <li><Link href="/about/accreditation" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">Accreditation</Link></li>
                              </ul>
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white mb-6 pb-3 border-b-2 border-white/30 uppercase tracking-wide">Our Initiatives</h3>
                              <ul className="space-y-3">
                                <li><Link href="/about/national-presence" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">Our National Presence</Link></li>
                                <li><Link href="/about/environment-stewardship" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">Environment Stewardship</Link></li>
                                <li><Link href="/about/privacy-policy" className="text-sm font-semibold text-white/90 hover:text-red-500 hover:translate-x-2 transition-all duration-300 block py-1">Privacy Policy</Link></li>
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
              </div>
            </div>

            {/* Right: Get Quote (white button) + mobile hamburger */}
            <div className="flex items-center gap-2">
              <Button
                className="hidden lg:inline-flex bg-white text-[#D20014] hover:bg-white/90 px-5 py-2 text-sm font-semibold rounded-sm"
                onClick={handleGetQuote}
              >
                Get Quote
              </Button>

              <button
                onClick={toggleMenu}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white touch-manipulation"
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

      {/* ===== Products panel =====
          Always rendered (never conditionally mounted) and toggled with visibility/opacity, so all
          20 product links ship in the static HTML instead of appearing only after an interaction. */}
      <div
        id="products-panel"
        ref={productsPanelRef}
        aria-hidden={!productsOpen}
        className={cn(
          "absolute inset-x-0 top-full hidden border-t-4 border-[#D20014] bg-white shadow-2xl",
          "transition-[opacity,transform] duration-200 ease-out lg:block motion-reduce:transition-none",
          productsOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Panes are stacked: the active one is in flow, the rest are absolute + invisible (which
              keeps them out of the tab order and a11y tree while leaving their links in the HTML).
              No fixed min-height — a one-product category should not open a 400px void. */}
          <div className="relative">
            {/* ---- Level 1: category grid ---- */}
            <div className={panePosition(activeCategory === null)}>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Our Products
              </p>
              <div className="grid grid-cols-3 gap-4">
                {PRODUCT_NAV.map((cat, i) => (
                  <button
                    key={cat.id}
                    type="button"
                    data-tile={cat.id}
                    data-panel-first={i === 0 ? "" : undefined}
                    onClick={() => openCategory(cat.id)}
                    aria-label={`${cat.label} — ${cat.items.length} products`}
                    className={cn(
                      // items-start so every tile title sits on the same baseline regardless of how
                      // many lines its blurb wraps to.
                      "group flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-5 text-left",
                      "transition-colors duration-200 hover:border-[#D20014] hover:bg-[#D20014]/[0.03]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D20014] focus-visible:ring-offset-2",
                      "motion-reduce:transition-none",
                      cat.featured && "col-span-3"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[17px] font-semibold leading-none text-neutral-900 transition-colors group-hover:text-[#D20014] motion-reduce:transition-none">
                          {cat.label}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold leading-none text-neutral-500 transition-colors group-hover:bg-[#D20014] group-hover:text-white motion-reduce:transition-none">
                          {cat.items.length}
                        </span>
                        {cat.featured && (
                          <span className="rounded-sm bg-[#D20014] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-white">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-2 block text-[13px] leading-snug text-neutral-500">
                        {cat.featured ? cat.items.map((p) => p.label).join("   ·   ") : cat.blurb}
                      </span>
                    </span>
                    <ChevronRight
                      className="mt-0.5 h-5 w-5 flex-none text-neutral-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#D20014] motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ---- Level 2: one pane per category ---- */}
            {PRODUCT_NAV.map((cat) => (
              <div key={cat.id} data-pane={cat.id} className={panePosition(activeCategory === cat.id)}>
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                  <button
                    type="button"
                    data-pane-first=""
                    onClick={() => backToGrid(cat.id)}
                    className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-neutral-600 transition-colors hover:text-[#D20014] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D20014] focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    All categories
                  </button>
                  {cat.href && (
                    <Link
                      href={cat.href}
                      className="rounded-sm text-sm font-semibold text-[#D20014] transition-colors hover:text-[#8C101E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D20014] focus-visible:ring-offset-2 motion-reduce:transition-none"
                    >
                      View the {cat.label} range →
                    </Link>
                  )}
                </div>

                <div className="pt-6">
                  <h3 className="text-xl font-bold text-neutral-900">{cat.label}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{cat.blurb}</p>
                  {/* Column count tracks the list length so short categories don't leave a dead grid. */}
                  <ul
                    className={cn(
                      "mt-5 grid gap-x-10",
                      cat.items.length > 4 ? "grid-cols-3" : cat.items.length > 1 ? "grid-cols-2" : "grid-cols-1"
                    )}
                  >
                    {cat.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center justify-between gap-3 rounded-md py-2.5 pr-1 text-[15px] font-medium text-neutral-700",
                            "transition-colors hover:text-[#D20014] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D20014] motion-reduce:transition-none",
                            // Row rules aid scanning in a long list; under a lone product they'd just
                            // draw a stray full-width line.
                            cat.items.length > 1 && "border-b border-neutral-100"
                          )}
                        >
                          {item.label}
                          <ChevronRight
                            className="h-4 w-4 flex-none text-neutral-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#D20014] group-hover:opacity-100 motion-reduce:transition-none"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4 bg-white shadow-lg border-t border-gray-200">
            <Link href="/" className={mobileLinkClass(isActive("/", true))} onClick={toggleMenu}>
              Home
            </Link>
            <button
              className="w-full text-left px-3 py-2 text-base font-semibold tracking-wide text-black flex items-center justify-between transition-colors hover:text-primary min-h-[48px]"
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
              <div className="pl-4 space-y-1">
                {/* Same category-first IA as the desktop panel, as a nested accordion. */}
                {PRODUCT_NAV.map((cat) => {
                  const open = mobileCategory === cat.id;
                  return (
                    <div key={cat.id}>
                      <button
                        className="w-full text-left px-3 py-2 text-sm font-semibold text-black flex items-center justify-between transition-colors hover:text-primary min-h-[44px]"
                        onClick={() => setMobileCategory(open ? null : cat.id)}
                        aria-expanded={open}
                      >
                        <span>
                          {cat.label}
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            {cat.items.length}
                          </span>
                        </span>
                        {open ? (
                          <MdKeyboardArrowDown size={18} aria-hidden="true" />
                        ) : (
                          <MdKeyboardArrowRight size={18} aria-hidden="true" />
                        )}
                      </button>
                      {open && (
                        <div className="pl-5 space-y-1 pb-1">
                          {cat.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block py-2 text-sm text-black hover:text-primary"
                              onClick={toggleMenu}
                            >
                              • {item.label}
                            </Link>
                          ))}
                          {cat.href && (
                            <Link
                              href={cat.href}
                              className="block py-2 text-sm font-semibold text-primary"
                              onClick={toggleMenu}
                            >
                              View the {cat.label} range →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <button
              className={cn("w-full text-left px-3 py-2 text-base font-semibold tracking-wide text-black flex items-center justify-between transition-colors hover:text-primary min-h-[48px]", mobileGuidesOpen ? "" : "")}
              onClick={() => setMobileGuidesOpen((open) => !open)}
              aria-expanded={mobileGuidesOpen}
              aria-label={mobileGuidesOpen ? "Collapse Guides menu" : "Expand Guides menu"}
            >
              Guides
              <span className="ml-2">
                {mobileGuidesOpen ? <MdKeyboardArrowDown size={20} aria-hidden="true" /> : <MdKeyboardArrowRight size={20} aria-hidden="true" />}
              </span>
            </button>
            {mobileGuidesOpen && (
              <div className="pl-6 space-y-1">
                {guideColumns.map((col) => (
                  <div key={col.href} className="pt-1">
                    <Link
                      href={col.href}
                      className="block py-2 text-sm font-semibold text-black hover:text-primary"
                      onClick={toggleMenu}
                    >
                      {col.heading}
                    </Link>
                    {col.clusters.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block py-2 pl-3 text-sm text-black hover:text-primary"
                        onClick={toggleMenu}
                      >
                        • {c.label}
                      </Link>
                    ))}
                  </div>
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
                <a href="tel:1800313666000" className="hover:text-primary transition-colors">1800 313 666 000</a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-black p-2 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@saburiply.com</span>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-bold rounded-sm shadow touch-manipulation"
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
