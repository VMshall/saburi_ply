"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail, ChevronDown, ArrowRight } from "lucide-react";
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

/** The three hover-opened nav panels. One is open at a time, or none. */
type PanelId = "products" | "guides" | "about";

/**
 * How the seven product groups fill the panel's four columns. Plywood holds 8 of the 20 products,
 * so it takes a column alone and the remaining six pair up — the columns balance without inventing
 * groupings that don't exist in the catalogue.
 */
const PRODUCT_COLUMN_IDS: string[][] = [
  ["plywood"],
  ["block-board", "flush-door"],
  ["wpc", "chipboard"],
  ["liner", "new-launch"],
];

const PRODUCT_COLUMNS = PRODUCT_COLUMN_IDS.map((ids) =>
  ids.flatMap((id) => PRODUCT_NAV.filter((c) => c.id === id))
);

/**
 * About Us is five static links in two groups — small enough that a `data/` module would be more
 * indirection than it saves. Products lives in `data/product-nav.ts` because it drives a drill-down
 * over the catalogue and needs a drift check against real product slugs; this doesn't.
 */
const ABOUT_NAV: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Company",
    items: [
      { label: "Company Overview", href: "/about" },
      { label: "Accreditation", href: "/about/accreditation" },
    ],
  },
  {
    heading: "Our Initiatives",
    items: [
      { label: "Our National Presence", href: "/about/national-presence" },
      { label: "Environment Stewardship", href: "/about/environment-stewardship" },
      { label: "Privacy Policy", href: "/about/privacy-policy" },
    ],
  },
];

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
  const pathname = usePathname();
  const router = useRouter();
  const toggleMenu = () => setIsOpen(!isOpen);

  // ===== Nav panels (Products / Guides / About) =====
  // All three share one surface, one trigger behaviour and one set of effects. A single `openPanel`
  // (rather than three booleans) makes "only one panel at a time" fall out of the data model instead
  // of needing every trigger to explicitly close its siblings.
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const triggerRefs = useRef<Partial<Record<PanelId, HTMLButtonElement | null>>>({});
  const panelRefs = useRef<Partial<Record<PanelId, HTMLDivElement | null>>>({});
  const headerRef = useRef<HTMLDivElement | null>(null);
  /**
   * Selector for the element that should receive focus after the next panel render, set by whichever
   * handler caused the change. Consumed (and cleared) by the effect below, so focus only moves on a
   * user-initiated transition — never on an incidental re-render.
   */
  const pendingFocus = useRef<string | null>(null);

  const closePanel = useCallback((returnFocusTo?: PanelId) => {
    setOpenPanel(null);
    if (returnFocusTo) triggerRefs.current[returnFocusTo]?.focus();
  }, []);

  /** Grace period so moving the pointer from a trigger down into its panel doesn't close it. */
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelScheduledClose = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    hoverTimeout.current = setTimeout(() => closePanel(), 150);
  }, [cancelScheduledClose, closePanel]);
  useEffect(() => cancelScheduledClose, [cancelScheduledClose]);

  /** Hover-open. Never moves focus — yanking focus out from under a moving mouse is hostile. */
  const openPanelById = useCallback(
    (id: PanelId) => {
      cancelScheduledClose();
      setOpenPanel(id);
    },
    [cancelScheduledClose]
  );

  /**
   * Hover props for a trigger's wrapper (which spans the full bar height, so there's no dead gap
   * between the label and the panel). Gated to a real mouse; on touch there is no hover, so the tap
   * falls through to the activation handler below.
   */
  const triggerHoverProps = (id: PanelId) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") openPanelById(id);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") scheduleClose();
    },
  });

  /**
   * Activating a trigger. `detail === 0` means keyboard (Enter/Space) — that toggles and moves focus
   * into the panel. A real mouse/touch click only ever opens: toggling would fight hover, since the
   * pointer is still on the trigger and pointerenter won't fire again.
   */
  const handleTriggerActivate = (id: PanelId) => (e: React.MouseEvent) => {
    if (e.detail === 0) {
      if (openPanel === id) {
        closePanel();
        return;
      }
      pendingFocus.current = "[data-panel-first]";
      openPanelById(id);
      return;
    }
    if (openPanel !== id) openPanelById(id);
  };

  /** Props shared by all three panel surfaces, keeping the pointer inside them from closing. */
  const panelHoverProps = {
    onPointerEnter: cancelScheduledClose,
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") scheduleClose();
    },
  };


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

  // Close whatever is open whenever the route changes (a nav link was followed).
  useEffect(() => {
    setOpenPanel(null);
  }, [pathname]);

  // Escape: step back out of the Products drill-down first, then close.
  useEffect(() => {
    if (!openPanel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closePanel(openPanel);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openPanel, closePanel]);

  // Click outside the header (panels + triggers all live inside it) closes.
  useEffect(() => {
    if (!openPanel) return;
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      closePanel();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openPanel, closePanel]);

  // No body scroll lock: panels open on hover, and freezing the page because the pointer happened
  // to cross a nav item would be hostile. The scrim stays purely visual.

  // Move focus to whatever the last user action asked for (open → first item, drill-in → back
  // button, back → the originating tile).
  useEffect(() => {
    const selector = pendingFocus.current;
    if (!openPanel || !selector) return;
    pendingFocus.current = null;
    panelRefs.current[openPanel]?.querySelector<HTMLElement>(selector)?.focus();
  }, [openPanel]);

  const isProductsActive = pathname.startsWith("/products/");

  // "Guides" panel, derived from the guide registry so it auto-syncs with the clusters.
  const isGuidesActive =
    pathname.startsWith("/plywood-guide") || pathname.startsWith("/plywood-buying-guide");
  const guideLabel = (path: string) => GUIDE_LABELS[path.split("/").filter(Boolean).pop() ?? ""] ?? path;
  const guideColumns = GUIDE_PAGES.filter((p) => p.kind === "pillar").map((pillar) => ({
    heading: guideLabel(pillar.path),
    // The pillar's own hero subhead, reused verbatim — the orienting line the cards were missing,
    // already authored in the registry rather than duplicated here.
    blurb: pillar.heroSubhead,
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

  const panelTriggerClass = (active: boolean) =>
    cn(
      "px-3 py-2 text-[15px] xl:text-[17px] font-medium transition-colors relative",
      active
        ? "text-white after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:bg-white after:rounded-full"
        : "text-white/85 hover:text-white"
    );

  /**
   * The shared panel surface. Always rendered and toggled with visibility rather than conditionally
   * mounted, so every link inside ships in the static HTML instead of only existing after a hover.
   * Anchored with `top-full` on the header wrapper, so it tracks the header's real height.
   */
  const panelSurfaceClass = (open: boolean) =>
    cn(
      "absolute inset-x-0 top-full hidden border-t border-black/10 bg-white shadow-2xl",
      "transition-[opacity,transform] duration-200 ease-out lg:block motion-reduce:transition-none",
      open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0"
    );

  /**
   * The big section title at the top-left of every panel. Uses the display face (Bricolage
   * Grotesque) that the rest of the site's headings use — its heavier bold is what gives the
   * reference its weight, which the body sans could not reach at any numeric weight.
   */
  const panelTitleClass =
    "font-display mb-10 text-[34px] font-extrabold leading-none tracking-[-0.7px] text-neutral-900";
  const panelTitleLinkClass =
    "inline-flex items-center gap-3 rounded-sm transition-colors hover:text-[#D20014] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D20014] focus-visible:ring-offset-2 motion-reduce:transition-none";

  /**
   * A destination row. Deliberately borderless — in this pattern the column structure carries the
   * grouping, and rules between every item would fight the whitespace doing that job.
   */
  const panelItemClass = (current: boolean) =>
    cn(
      "inline-flex items-baseline gap-2 rounded-sm text-[16px] leading-snug transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D20014] focus-visible:ring-offset-2 motion-reduce:transition-none",
      current ? "font-semibold text-[#D20014]" : "text-neutral-600 hover:text-[#D20014]"
    );

  const panelChipClass =
    "flex-none rounded-sm bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none tracking-tight text-neutral-500";

  /**
   * Column heading. Gets the red arrow only when it actually links somewhere — six of the seven
   * product categories still have no hub page, and an arrow that goes nowhere is a broken promise.
   */
  const PanelGroupHeading = ({ label, href }: { label: string; href?: string }) => {
    const inner = (
      <>
        {label}
        {href && <ArrowRight className="h-4 w-4 text-[#D20014]" aria-hidden="true" />}
      </>
    );
    return (
      <h3 className="font-display flex items-center gap-2 text-[20px] font-extrabold leading-tight tracking-[-0.3px] text-neutral-900">
        {href ? (
          <Link href={href} className={panelTitleLinkClass}>
            {inner}
          </Link>
        ) : (
          inner
        )}
      </h3>
    );
  };

  const mobileLinkClass = (active: boolean) =>
    cn(
      "block px-3 py-2 text-base font-semibold tracking-wide transition-colors",
      active ? "text-primary" : "text-black hover:text-primary"
    );

  return (
    <nav className="sticky top-0 z-50 shadow-md">
      {/* Scrim behind whichever panel is open. Sits under the header wrapper (z-50), above the page. */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 motion-reduce:transition-none",
          openPanel ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => closePanel()}
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

                {/* Products — hover-to-open category panel (panel itself is rendered below the bar).
                    The wrapper spans the full bar height so there's no dead gap between the label
                    and the panel for the pointer to fall through on its way down. */}
                <div className="relative flex h-full items-center" {...triggerHoverProps("products")}>
                  <button
                    ref={(el) => {
                      triggerRefs.current.products = el;
                    }}
                    type="button"
                    onClick={handleTriggerActivate("products")}
                    aria-expanded={openPanel === "products"}
                    aria-controls="products-panel"
                    className={cn(
                      panelTriggerClass(isProductsActive || openPanel === "products"),
                      "inline-flex items-center gap-1"
                    )}
                  >
                    Products
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                        openPanel === "products" && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Guides — hover-to-open panel */}
                <div className="relative flex h-full items-center" {...triggerHoverProps("guides")}>
                  <button
                    ref={(el) => {
                      triggerRefs.current.guides = el;
                    }}
                    type="button"
                    onClick={handleTriggerActivate("guides")}
                    aria-expanded={openPanel === "guides"}
                    aria-controls="guides-panel"
                    className={cn(
                      panelTriggerClass(isGuidesActive || openPanel === "guides"),
                      "inline-flex items-center gap-1"
                    )}
                  >
                    Guides
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                        openPanel === "guides" && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* About Us — hover-to-open panel. Sits directly after Guides so the three
                    panel triggers are contiguous and the plain links follow; this also matches the
                    order the mobile menu has always used. */}
                <div className="relative flex h-full items-center" {...triggerHoverProps("about")}>
                  <button
                    ref={(el) => {
                      triggerRefs.current.about = el;
                    }}
                    type="button"
                    onClick={handleTriggerActivate("about")}
                    aria-expanded={openPanel === "about"}
                    aria-controls="about-panel"
                    className={cn(
                      panelTriggerClass(pathname.startsWith("/about") || openPanel === "about"),
                      "inline-flex items-center gap-1"
                    )}
                  >
                    About Us
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                        openPanel === "about" && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <Link href="/gallery" className={navLinkClass(isActive("/gallery"))}>
                  Gallery
                </Link>

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

      {/* ===== Nav panels =====
          Flat multi-column mega-menus (the Rockwool pattern the founder picked): every destination
          visible at once, no cards, no drill-down, no images — the hierarchy is carried by type
          weight and whitespace alone. Always rendered and toggled with visibility, so every link
          stays in the static HTML rather than appearing only after a hover. */}
      <div
        id="products-panel"
        ref={(el) => {
          panelRefs.current.products = el;
        }}
        aria-hidden={openPanel !== "products"}
        {...panelHoverProps}
        className={panelSurfaceClass(openPanel === "products")}
      >
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 lg:px-8">
          <h2 className={panelTitleClass}>Products</h2>
          {/* Plywood carries 8 of the 20 products, so it holds a column alone and the remaining six
              groups pair up. Balances the columns without inventing groupings. */}
          <div className="grid grid-cols-4 gap-x-10">
            {PRODUCT_COLUMNS.map((column, ci) => (
              <div key={ci}>
                {column.map((cat, gi) => (
                  <div key={cat.id} className={gi > 0 ? "mt-9" : undefined}>
                    <PanelGroupHeading label={cat.label} href={cat.href} />
                    <ul className="mt-4 space-y-3">
                      {cat.items.map((item, ii) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={pathname === item.href ? "page" : undefined}
                            data-panel-first={ci === 0 && gi === 0 && ii === 0 ? "" : undefined}
                            className={panelItemClass(pathname === item.href)}
                          >
                            <span>{item.label}</span>
                            {item.certification && (
                              <span className={panelChipClass}>
                                {item.certification.replace(":", "").replace(/\s+/g, " ")}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guides — 2 pillars. Same language, fewer columns: 13 links spread over four columns would
          leave half the panel empty. */}
      <div
        id="guides-panel"
        ref={(el) => {
          panelRefs.current.guides = el;
        }}
        aria-hidden={openPanel !== "guides"}
        {...panelHoverProps}
        className={panelSurfaceClass(openPanel === "guides")}
      >
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 lg:px-8">
          <h2 className={panelTitleClass}>Plywood Guides</h2>
          {/* Same four-track grid as Products, so column positions don't shift as you move between
              panels — but each pillar spans two tracks and splits its clusters, which fills the
              width and halves the height instead of leaving the right half of the panel empty. */}
          <div className="grid grid-cols-4 gap-x-10">
            {guideColumns.map((col, ci) => (
              <div key={col.href} className="col-span-2">
                <PanelGroupHeading label={col.heading} href={col.href} />
                <p className="mt-2 max-w-[420px] text-[13px] leading-snug text-neutral-500">
                  {col.blurb}
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3">
                  {col.clusters.map((c, ii) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        aria-current={pathname === c.href ? "page" : undefined}
                        data-panel-first={ci === 0 && ii === 0 ? "" : undefined}
                        className={panelItemClass(pathname === c.href)}
                      >
                        <span>{c.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us — 5 links in 2 groups. */}
      <div
        id="about-panel"
        ref={(el) => {
          panelRefs.current.about = el;
        }}
        aria-hidden={openPanel !== "about"}
        {...panelHoverProps}
        className={panelSurfaceClass(openPanel === "about")}
      >
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 lg:px-8">
          <h2 className={panelTitleClass}>
            <Link href="/about" className={panelTitleLinkClass}>
              About Saburi
              <ArrowRight className="h-5 w-5 text-[#D20014]" aria-hidden="true" />
            </Link>
          </h2>
          <div className="grid grid-cols-4 gap-x-10">
            {ABOUT_NAV.map((group, gi) => (
              <div key={group.heading}>
                <PanelGroupHeading label={group.heading} />
                <ul className="mt-4 space-y-3">
                  {group.items.map((item, ii) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        data-panel-first={gi === 0 && ii === 0 ? "" : undefined}
                        className={panelItemClass(pathname === item.href)}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
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
                        <span>{cat.label}</span>
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
                {/* Same source as the desktop panel, so the two can't drift apart. */}
                {ABOUT_NAV.flatMap((g) => g.items).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-sm text-black hover:text-primary"
                    onClick={toggleMenu}
                  >
                    • {item.label}
                  </Link>
                ))}
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
