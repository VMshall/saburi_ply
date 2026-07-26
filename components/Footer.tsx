"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Youtube,
  Linkedin,
  Instagram,
  ArrowUp,
  MessageCircle,
  X,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RateOnGoogle } from "@/components/RateOnGoogle";
import { FaWhatsapp } from "react-icons/fa";
import dynamic from "next/dynamic";

// Lazy-load the lead dialogs (restored P5) so they don't bloat the sitewide Footer bundle —
// each becomes its own chunk, fetched when the Footer mounts (matches the legacy React.lazy).
const DealershipDialog = dynamic(() =>
  import("@/components/dialogs/DealershipDialog").then((m) => ({ default: m.DealershipDialog })),
);
const MobileQuoteForm = dynamic(() =>
  import("@/components/dialogs/MobileQuoteForm").then((m) => ({ default: m.MobileQuoteForm })),
);
const InteriorDesignerDialog = dynamic(() =>
  import("@/components/dialogs/InteriorDesignerDialog").then((m) => ({
    default: m.InteriorDesignerDialog,
  })),
);
const ArchitectDialog = dynamic(() =>
  import("@/components/dialogs/ArchitectDialog").then((m) => ({ default: m.ArchitectDialog })),
);

/**
 * Footer client island (P1). Ported from client/components/Footer.jsx with react-router-dom
 * removed (Link to→href). Self-contained features kept: nav/links, certifications,
 * newsletter subscribe, runtime sitemap dialog, WhatsApp widget, scroll-to-top.
 *
 * DEFERRED to P5 (Forms → same-origin proxy): the four lazy lead-form modals
 * (DealershipDialog, InteriorDesignerDialog, ArchitectDialog, MobileQuoteForm). Their
 * triggers fall back to /contact for now so no control is a dead click; restore the modals
 * when forms move onto the /api/forms/* proxy.
 */

// Same-origin proxy (§8) → forwarded to the external admin API server-side (unchanged
// endpoint/payload). The apiv2 origin never reaches the browser.
const SUBSCRIBE_URL = "/api/forms/subscribers";

type SitemapEntry = {
  full: string;
  relative: string;
  displayPath: string;
  isExternal: boolean;
};

type FooterLink = {
  name: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
};

export function Footer() {
  const router = useRouter();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const whatsAppWrapperRef = useRef<HTMLDivElement | null>(null);
  const WHATSAPP_NUMBER = "919062066655";
  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to know more about Saburiply.")}`;

  // Newsletter Subscription State
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionType, setSubscriptionType] = useState(""); // success or error

  // Dynamic Sitemap State
  const [sitemapUrls, setSitemapUrls] = useState<SitemapEntry[]>([]);
  const [currentSitemapUrl, setCurrentSitemapUrl] = useState("");
  const [isSitemapDialogOpen, setIsSitemapDialogOpen] = useState(false);

  // Lead dialogs (restored P5 → /api/forms/* proxy).
  const [isDealerDialogOpen, setIsDealerDialogOpen] = useState(false);
  const [isInteriorDesignerOpen, setIsInteriorDesignerOpen] = useState(false);
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);
  const [isMobileQuoteOpen, setIsMobileQuoteOpen] = useState(false);

  // P5: lead-form modals are deferred — their triggers route to /contact for now.
  const goToContact = () => router.push("/contact");

  // Newsletter Subscription Handler
  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setSubscriptionMessage("Please enter a valid email address");
      setSubscriptionType("error");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage("");

    try {
      const response = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          status: "pending",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Subscription failed");

      setSubscriptionMessage("Successfully subscribed! Thank you for joining our newsletter.");
      setSubscriptionType("success");
      setEmail("");
    } catch (err: any) {
      setSubscriptionMessage(err.message || "Failed to subscribe. Please try again.");
      setSubscriptionType("error");
    } finally {
      setIsSubscribing(false);
    }
  };

  // Dynamic Sitemap Handler — reads the live /sitemap.xml (still served from public/ in P1;
  // becomes the generated app/sitemap.ts in P5, same URL).
  const fetchSitemap = async () => {
    try {
      const response = await fetch("/sitemap.xml");
      const xmlText = await response.text();

      // Parse XML to extract URLs
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const urlElements = xmlDoc.getElementsByTagName("url");

      const urls: SitemapEntry[] = [];
      for (let i = 0; i < urlElements.length; i++) {
        const locElement = urlElements[i].getElementsByTagName("loc")[0];
        if (locElement) {
          const url = locElement.textContent || "";
          const urlObj = new URL(url);
          const relativePath = urlObj.pathname;

          urls.push({
            full: url,
            relative: relativePath,
            displayPath: relativePath, // Keep original for display
            isExternal: relativePath.endsWith(".xml") || relativePath.endsWith(".pdf"),
          });
        }
      }

      // Store the current domain for XML link
      const currentDomain = window.location.origin;
      setSitemapUrls(urls);
      setCurrentSitemapUrl(`${currentDomain}/sitemap.xml`);
    } catch (error) {
      console.error("Error fetching sitemap:", error);
      // Fallback to static sitemap.xml if fetch fails
      const currentDomain = window.location.origin;
      setSitemapUrls([
        { full: `${currentDomain}/sitemap.xml`, relative: "/sitemap.xml", displayPath: "/sitemap.xml", isExternal: true },
      ]);
      setCurrentSitemapUrl(`${currentDomain}/sitemap.xml`);
    }
  };

  // Open Sitemap Dialog
  const handleSitemapClick = () => {
    setIsSitemapDialogOpen(true);
    fetchSitemap();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!isWhatsAppOpen) return;
      const el = whatsAppWrapperRef.current;
      if (!el) return;
      if (event.target instanceof Node && !el.contains(event.target)) {
        setIsWhatsAppOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isWhatsAppOpen) return;
      if (event.key === "Escape") setIsWhatsAppOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWhatsAppOpen]);

  const quickLinks: FooterLink[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Sitemap", onClick: handleSitemapClick },
  ];
  const productLinks: FooterLink[] = [
    { name: "All Plywood Grades", href: "/plywood" },
    { name: "Saburi Perennial", href: "/products/saburi-perennial" },
    { name: "Saburi Club H+", href: "/products/saburi-club-h-plus" },
    { name: "Fire Retardant", href: "/products/saburi-fr-blockboard" },
    { name: "Saburi Flush Door Gold", href: "/products/flush-door-india" },
    { name: "Saburi Gold Block Board", href: "/products/saburi-gold-blockboard" },
    { name: "Saburi Shine Platinum", href: "/products/shuttering-plywood-india" },
    { name: "Saburi Modwud Pre-Lam", href: "/products/saburi-modwud-pre-lam" },
    { name: "Saburi Smart Panel PVC Board", href: "/products/saburi-smart-panel-pvc-board" },
    { name: "Saburi Lam", href: "/products/saburi-lam" },
  ];
  const businessLinks: FooterLink[] = [
    { name: "Become a Dealer", href: "#contact" },
    { name: "Interior Designer", onClick: () => setIsInteriorDesignerOpen(true) },
    { name: "Architect", onClick: () => setIsArchitectOpen(true) },
    { name: "Technical Support", href: "/contact" },
    { name: "Quality Assurance", href: "/about/accreditation" },
  ];

  const locations: { city: string; state: string; href?: string }[] = [
    { city: "Kolkata", state: "West Bengal", href: "/best-plywood-kolkata" },
    { city: "Mumbai", state: "Maharashtra" },
    { city: "Delhi", state: "NCR" },
    { city: "Chennai", state: "Tamil Nadu", href: "/best-plywood-tamilnadu" },
    { city: "Bangalore", state: "Karnataka", href: "/plywood-dealers-bangalore" },
    { city: "Hyderabad", state: "Telangana", href: "/best-plywood-telangana" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <img
                  src="/images/saburiLogo.webp"
                  srcSet="/images/saburiLogo-200.webp 200w, /images/saburiLogo-400.webp 400w, /images/saburiLogo.webp 800w"
                  sizes="(max-width: 640px) 150px, 200px"
                  alt="Saburiply Logo"
                  className="h-12 w-auto mb-4 brightness-0 invert"
                />
                <p className="text-gray-300 leading-relaxed">
                  India's trusted plywood manufacturer since 1990. Delivering
                  premium quality plywood products with unmatched reliability
                  and customer service across the nation.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="https://maps.app.goo.gl/bh5wyDfbZjP2ji5r9" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-primary transition-colors duration-200">
                    New Town Square, Unit 3A, Atghora Rajarhat, Chinar Park Crossing, Kolkata – 700136, West Bengal, India
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:1800313666000" className="text-gray-300 text-sm hover:text-primary transition-colors duration-200">1800 313 666 000</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:info@saburiply.com" className="text-gray-300 text-sm hover:text-primary transition-colors duration-200">info@saburiply.com</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Mon - Sat: 10:00 AM - 8:00 PM</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-2 lg:space-x-3">
                  <a href="https://www.facebook.com/saburiply" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors touch-manipulation">
                    <Facebook className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a href="https://www.instagram.com/saburiply/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors touch-manipulation">
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a href="https://www.youtube.com/@saburiplywood" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our YouTube channel" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors touch-manipulation">
                    <Youtube className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a href="https://www.linkedin.com/in/saburi-ply/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors touch-manipulation">
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
                {/* Google review CTA — persistent trust anchor + collect (Feature 1) */}
                <div className="mt-5">
                  <RateOnGoogle variant="footer" placement="footer" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-1">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors text-sm">
                        {link.name}
                      </a>
                    ) : link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-gray-300 hover:text-primary transition-colors text-sm text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link href={link.href!} className="text-gray-300 hover:text-primary transition-colors text-sm">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Certifications */}
              <div className="mt-8">
                <h5 className="font-semibold mb-4 text-lg">Certifications</h5>
                <div className="space-y-2 text-xs text-gray-400">
                  <a href="/footer-certificate/CARB_certification.pdf" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    CARB certification
                  </a>
                  <a href="/footer-certificate/CE_certification.pdf" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    CE certification
                  </a>
                  <a href="/footer-certificate/IGBC_Certification.pdf" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    IGBC Certification
                  </a>
                  <a href="/footer-certificate/FSC_certification.pdf" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    FSC certification
                  </a>
                  <a href="/footer-certificate/ISO_90012015_Certified.pdf" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    ISO 9001:2015 Certified
                  </a>
                  <a href="/certificates/iso_14001_2015.webp" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    ISO 14001:2015 Certified
                  </a>
                  <a href="/certificates/iso_45001_2018.webp" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-primary transition-colors text-sm">
                    ISO 45001:2018 Certified
                  </a>
                  <span className="block text-gray-300 text-sm">ISI (BIS) Certified</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Products</h4>
              <ul className="space-y-1">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-300 hover:text-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Business Hours */}
              <div className="mt-8">
                <h5 className="font-semibold mb-3 text-sm">Business Hours</h5>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>Monday - Saturday: 10:00 AM - 8:00 PM</div>
                  <div>Sunday: Closed</div>
                  <div className="text-primary">24/7 Emergency Support</div>
                </div>
              </div>
            </div>

            {/* Business Solutions */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Business Solutions</h4>
              <ul className="space-y-1">
                {businessLinks.map((link, index) => (
                  <li key={index}>
                    {link.name === "Become a Dealer" ? (
                      <button
                        onClick={() => setIsDealerDialogOpen(true)}
                        className="text-gray-300 hover:text-primary transition-colors text-sm text-left"
                      >
                        {link.name}
                      </button>
                    ) : link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-gray-300 hover:text-primary transition-colors text-sm text-left"
                      >
                        {link.name}
                      </button>
                    ) : link.href!.startsWith("#") ? (
                      <a href={link.href} className="text-gray-300 hover:text-primary transition-colors text-sm">
                        {link.name}
                      </a>
                    ) : (
                      <Link href={link.href!} className="text-gray-300 hover:text-primary transition-colors text-sm">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Service Locations */}
              <div className="mt-8">
                <h5 className="font-semibold mb-3 text-sm">Service Locations</h5>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                  {locations.map((location, index) => (
                    <div key={index}>
                      {location.href ? (
                        <Link href={location.href} className="hover:text-primary transition-colors">
                          {location.city}, {location.state}
                        </Link>
                      ) : (
                        <>
                          {location.city}, {location.state}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <Link href="/about/national-presence" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  <div className="text-primary text-xs mt-2">+ 22 More States</div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-semibold text-lg mb-2">Stay Updated</h4>
              <p className="text-gray-300 text-sm">
                Get the latest updates on new products, industry insights, and
                special offers.
              </p>
            </div>
            <div>
              <div className="flex space-x-3">
                <form onSubmit={handleNewsletterSubscribe} className="flex space-x-3 flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    disabled={isSubscribing}
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              </div>
              {subscriptionMessage && (
                <div className="mt-2">
                  <small className={`text-xs ${subscriptionType === "success" ? "text-green-400" : "text-red-400"}`}>
                    {subscriptionMessage}
                  </small>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 space-x-2">
              <span>&copy; {new Date().getFullYear()} Saburiply. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400 flex items-center space-x-2">
                <span className="flex items-center space-x-2">
                  <span>Made in India</span>
                  <svg role="img" aria-label="India flag" className="h-4 w-6 inline-block ml-1 flex-shrink-0" viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
                    <rect width="3" height="2" fill="#FF9933" />
                    <rect y="0.6667" width="3" height="0.6666" fill="#FFFFFF" />
                    <rect y="1.3333" width="3" height="0.6667" fill="#128807" />
                    <circle cx="1.5" cy="1" r="0.18" fill="#000080" />
                  </svg>
                </span>
                <span className="text-gray-400">|</span>
                <span>Design &amp; Developed by <a href="https://webingo.in" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">Webingo.</a></span>
              </div>
              <button onClick={scrollToTop} className="w-12 h-12 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors shadow-lg" aria-label="Scroll back to top">
                <ArrowUp className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quote Button - Mobile Only → MobileQuoteForm (restored P5) */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[60] lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileQuoteOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#F44336] text-white shadow-lg hover:bg-[#d32f2f] transition-colors flex items-center justify-center"
          aria-label="Get a quote"
        >
          <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <div ref={whatsAppWrapperRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60]">
        {isWhatsAppOpen && (
          <div className="absolute bottom-16 right-0 sm:bottom-[72px] w-[280px] sm:w-[320px] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Welcome to Saburiply!</div>
                    <div className="text-xs text-gray-500 mt-0.5">How can we help you?</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <FaWhatsapp className="h-4 w-4" />
                  Chat on WhatsApp
                </span>
                <span className="text-white/90">→</span>
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsWhatsAppOpen((v) => !v)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
          aria-label="Open WhatsApp chat"
        >
          <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Sitemap Dialog (self-contained — ui/dialog + runtime /sitemap.xml fetch) */}
      <Dialog open={isSitemapDialogOpen} onOpenChange={setIsSitemapDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Site Map</DialogTitle>
            <DialogDescription>
              Browse all pages of Saburiply website
            </DialogDescription>
            <DialogClose />
          </DialogHeader>

          <div className="mt-6">
            {sitemapUrls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sitemapUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {url.isExternal ? (
                      <a
                        href={url.full}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm transition-colors flex items-center space-x-1"
                      >
                        {url.relative.endsWith(".pdf") ? "📄" : "📋"} {url.displayPath === "" ? "Home" : url.displayPath}
                      </a>
                    ) : (
                      <Link
                        href={url.relative}
                        className="text-primary hover:text-primary/80 text-sm transition-colors flex items-center space-x-1"
                        onClick={() => setIsSitemapDialogOpen(false)}
                        title={`Navigate to: ${url.relative}`}
                      >
                        🔗 {url.displayPath === "" ? "Home" : url.displayPath}
                        {url.relative !== url.displayPath && (
                          <span className="text-xs text-gray-400 ml-1">→ {url.relative}</span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading sitemap...</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Total pages: {sitemapUrls.length}
                </p>
                <div className="space-x-2">
                  <Button
                    onClick={() => window.open(currentSitemapUrl || "/sitemap.xml", "_blank")}
                    variant="outline"
                    size="sm"
                  >
                    View XML Sitemap
                  </Button>
                  <Button
                    onClick={fetchSitemap}
                    variant="outline"
                    size="sm"
                  >
                    🔄 Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead-capture dialogs (restored P5 → /api/forms/* proxy) */}
      <DealershipDialog open={isDealerDialogOpen} onOpenChange={setIsDealerDialogOpen} />
      <InteriorDesignerDialog open={isInteriorDesignerOpen} onOpenChange={setIsInteriorDesignerOpen} />
      <ArchitectDialog open={isArchitectOpen} onOpenChange={setIsArchitectOpen} />
      <MobileQuoteForm isOpen={isMobileQuoteOpen} onClose={() => setIsMobileQuoteOpen(false)} />
    </footer>
  );
}
