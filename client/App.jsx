import { lazy, Suspense, useState, useEffect, useTransition } from "react";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import { HelmetProvider } from "react-helmet-async";
import PageMeta from "./components/PageMeta";
import NotFound from "./pages/NotFound";

import Index from "./pages/Index";
const About = lazy(() => import("./pages/About"));
// const OurJourney = lazy(() => import("./pages/OurJourney"));
const Accreditation = lazy(() => import("./pages/Accreditation"));
const NationalPresence = lazy(() => import("./pages/NationalPresence"));
const EnvironmentStewardship = lazy(() => import("./pages/EnvironmentStewardship"));
const PrivacyPolicy = lazy(() => import("./pages/PolicyPage"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));

// const Career = lazy(() => import("./pages/Career"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));

// const NotFound = lazy(() => import("./pages/NotFound"));

// Plywoods
const SaburiPerennial = lazy(() => import("./pages/SaburiPerennial"));
const SaburiClubHPlus = lazy(() => import("./pages/SaburiClubHPlus"));
const SaburiTitanium = lazy(() => import("./pages/SaburiTitanium"));
const SaburiGold = lazy(() => import("./pages/SaburiGold"));
const SaburiFireRetardant = lazy(() => import("./pages/FireRetardant"));
const SaburiScoutPlywood = lazy(() => import("./pages/SaburiScoutPlywood"));
const SaburiFlexibleGold = lazy(() => import("./pages/SaburiFlexibleGold"));
const SaburiShinePlatinumShuttering = lazy(() => import("./pages/SaburiShinePlatinumShuttering"));

// Blockboards
const SaburiPerennialBlockboard = lazy(() => import("./pages/SaburiPerennialBlockboard"));
const SaburiFRBlockBoard = lazy(() => import("./pages/SaburiFRBlockBoard"));
const SaburiClubHPlusBlockBoard = lazy(() => import("./pages/SaburiClubHPlusBlockBoard"));
const SaburiGoldBlockboard = lazy(() => import("./pages/SaburiGoldBlockboard"));

// Flushdoors
const SaburiFlushdoorGold = lazy(() => import("./pages/SaburiFlushdoorGold"));
const SaburiFlushdoorScout = lazy(() => import("./pages/SaburiFlushdoorScout"));

// WPC
const SaburiSmartPanelWPCBoard = lazy(() => import("./pages/SaburiSmartPanelWPCBoard"));
const SaburiSmartWPCDoorFrames = lazy(() => import("./pages/SaburiSmartWPCDoorFrames"));
const SaburiSmartPanelPVCBoard = lazy(() => import("./pages/SaburiSmartPanelPVCBoard"));

// Chipboards
const SaburiModwudPreLaminated = lazy(() => import("./pages/SaburiModwudPreLaminated"));
const SaburiModwudPlain = lazy(() => import("./pages/SaburiModwudPlain"));

// Laminated
const SaburiLam = lazy(() => import("./pages/SaburiLam"));

// New Launch
const SaburiModwudMarine = lazy(() => import("./pages/SaburiModwudMarine"));
const SaburiNeowud = lazy(() => import("./pages/SaburiNeowud"));

// Popular Cities Plywood
const SaburiBestPlywoodKerela = lazy(() => import("./pages/SaburiBestPlywoodKerela"));
const SaburiBestPlywoodAP = lazy(() => import("./pages/SaburiBestPlywoodAP"));
const SaburiBestPlywoodTelangana = lazy(() => import("./pages/SaburiBestPlywoodTelangana"));
const SaburiBestPlywoodBangalore = lazy(() => import("./pages/SaburiBestPlywoodBangalore"));
const SaburiBestPlywoodTamilNadu = lazy(() => import("./pages/SaburiBestPlywoodTamilNadu"));




const queryClient = new QueryClient();

const TransitionRoutes = () => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            startTransition(() => {
                setDisplayLocation(location);
            });
        }
    }, [location, displayLocation]);

    return (
        <>
            {/* Show PageLoader (Top Bar) while the next route is transitioning or suspending in fallback */}
            {(isPending || location.pathname !== displayLocation.pathname) && <PageLoader />}

            <Suspense fallback={<PageLoader />}>
                <Routes location={displayLocation}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    {/* <Route path="/about/our-journey" element={<OurJourney />} /> */}
                    <Route path="/about/accreditation" element={<Accreditation />} />
                    <Route path="/about/national-presence" element={<NationalPresence />} />
                    <Route path="/about/environment-stewardship" element={<EnvironmentStewardship />} />
                    <Route path="/about/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/gallery" element={<Gallery />} />

                    {/* Products URLs prefixed under /products/ per SEO brief */}
                    <Route path="/products/saburi-perennial" element={<SaburiPerennial />} />
                    <Route path="/products/saburi-club-h-plus" element={<SaburiClubHPlus />} />
                    <Route path="/products/saburi-titanium-plus" element={<SaburiTitanium />} />
                    <Route path="/products/fire-retardant-india" element={<SaburiFireRetardant />} />
                    <Route path="/products/marine-plywood-india" element={<SaburiGold />} />
                    <Route path="/products/saburi-perennial-blockboard" element={<SaburiPerennialBlockboard />} />
                    <Route path="/products/saburi-fr-blockboard" element={<SaburiFRBlockBoard />} />
                    <Route path="/products/block-board-india" element={<SaburiClubHPlusBlockBoard />} />
                    <Route path="/products/saburi-gold-blockboard" element={<SaburiGoldBlockboard />} />
                    <Route path="/products/flush-door-india" element={<SaburiFlushdoorGold />} />
                    <Route path="/products/saburi-flushdoor-scout" element={<SaburiFlushdoorScout />} />
                    <Route path="/products/flexi-plywood-india" element={<SaburiFlexibleGold />} />
                    <Route path="/products/saburi-scout-plywood" element={<SaburiScoutPlywood />} />
                    <Route path="/products/shuttering-plywood-india" element={<SaburiShinePlatinumShuttering />} />
                    <Route path="/products/saburi-modwud-pre-lam" element={<SaburiModwudPreLaminated />} />
                    <Route path="/products/saburi-modwud-plain" element={<SaburiModwudPlain />} />
                    <Route path="/products/saburi-smart-panel-pvc-board" element={<SaburiSmartPanelPVCBoard />} />
                    <Route path="/products/saburi-smart-panel-wpc-board" element={<SaburiSmartPanelWPCBoard />} />
                    <Route path="/products/saburi-smart-wpc-door-frame" element={<SaburiSmartWPCDoorFrames />} />
                    <Route path="/products/saburi-hydramax-board" element={<SaburiModwudMarine />} />
                    <Route path="/products/saburi-neowud" element={<SaburiNeowud />} />
                    <Route path="/products/saburi-lam" element={<SaburiLam />} />

                    {/* State Landing Pages */}
                    <Route path="/best-plywood-andhra-pradesh" element={<SaburiBestPlywoodAP />} />
                    <Route path="/best-plywood-kerala" element={<SaburiBestPlywoodKerela />} />
                    <Route path="/best-plywood-tamilnadu" element={<SaburiBestPlywoodTamilNadu />} />
                    <Route path="/best-plywood-telangana" element={<SaburiBestPlywoodTelangana />} />

                    {/* City Landing Page (Bangalore formatted to city format per SEO brief) */}
                    <Route path="/plywood-dealers-bangalore" element={<SaburiBestPlywoodBangalore />} />

                    {/* Typo Redirects */}
                    <Route path="/best-plywood-kerela" element={<Navigate to="/best-plywood-kerala" replace />} />

                    {/* Blog Pages (Slug-based per SEO brief) */}
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetails />} />

                    {/* 301/302 equivalent Client-Side redirects to preserve SEO equity */}
                    <Route path="/best-plywood-bangalore" element={<Navigate to="/plywood-dealers-bangalore" replace />} />
                    <Route path="/saburi-perennial" element={<Navigate to="/products/saburi-perennial" replace />} />
                    <Route path="/saburi-club-h-plus" element={<Navigate to="/products/saburi-club-h-plus" replace />} />
                    <Route path="/saburi-titanium-plus" element={<Navigate to="/products/saburi-titanium-plus" replace />} />
                    <Route path="/fire-retardant-india" element={<Navigate to="/products/fire-retardant-india" replace />} />
                    <Route path="/marine-plywood-india" element={<Navigate to="/products/marine-plywood-india" replace />} />
                    <Route path="/saburi-perennial-blockboard" element={<Navigate to="/products/saburi-perennial-blockboard" replace />} />
                    <Route path="/saburi-fr-blockboard" element={<Navigate to="/products/saburi-fr-blockboard" replace />} />
                    <Route path="/block-board-india" element={<Navigate to="/products/block-board-india" replace />} />
                    <Route path="/saburi-gold-blockboard" element={<Navigate to="/products/saburi-gold-blockboard" replace />} />
                    <Route path="/flush-door-india" element={<Navigate to="/products/flush-door-india" replace />} />
                    <Route path="/saburi-flushdoor-scout" element={<Navigate to="/products/saburi-flushdoor-scout" replace />} />
                    <Route path="/flexi-plywood-india" element={<Navigate to="/products/flexi-plywood-india" replace />} />
                    <Route path="/saburi-scout-plywood" element={<Navigate to="/products/saburi-scout-plywood" replace />} />
                    <Route path="/shuttering-plywood-india" element={<Navigate to="/products/shuttering-plywood-india" replace />} />
                    <Route path="/saburi-modwud-pre-lam" element={<Navigate to="/products/saburi-modwud-pre-lam" replace />} />
                    <Route path="/saburi-modwud-plain" element={<Navigate to="/products/saburi-modwud-plain" replace />} />
                    <Route path="/saburi-smart-panel-pvc-board" element={<Navigate to="/products/saburi-smart-panel-pvc-board" replace />} />
                    <Route path="/saburi-smart-panel-wpc-board" element={<Navigate to="/products/saburi-smart-panel-wpc-board" replace />} />
                    <Route path="/saburi-smart-wpc-door-frame" element={<Navigate to="/products/saburi-smart-wpc-door-frame" replace />} />
                    <Route path="/saburi-hydramax-board" element={<Navigate to="/products/saburi-hydramax-board" replace />} />
                    <Route path="/saburi-neowud" element={<Navigate to="/products/saburi-neowud" replace />} />
                    <Route path="/saburi-lam" element={<Navigate to="/products/saburi-lam" replace />} />

                    {/* Client-side blog redirects to new slug-based URLs */}
                    <Route path="/blog/1" element={<Navigate to="/blog/top-7-stylish-panel-door-for-your-home-interiors" replace />} />
                    <Route path="/blog/2" element={<Navigate to="/blog/top-5-isi-certified-termite-proof-plywood-brands-in-india" replace />} />
                    <Route path="/blog/3" element={<Navigate to="/blog/advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india" replace />} />
                    <Route path="/blog/4" element={<Navigate to="/blog/top-7-trends-of-plywood-brand-in-india" replace />} />
                    <Route path="/blog/5" element={<Navigate to="/blog/top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation" replace />} />

                    {/* <Route path="/career" element={<Career />} /> */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <HelmetProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <ScrollToTop />
                    <PageMeta />
                    <TransitionRoutes />
                </BrowserRouter>
            </HelmetProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

// Handle sitemap.xml as static file - prevent React Router from handling it
if (window.location.pathname === '/sitemap.xml') {
    window.location.href = '/sitemap.xml';
}

const rootEl = document.getElementById("root");
if (rootEl) {
    if (rootEl.hasChildNodes()) {
        // Pre-rendered HTML exists (react-snap SSG) — hydrate instead of re-rendering
        hydrateRoot(rootEl, <App />);
    } else {
        // Development or no pre-rendered HTML — standard client-side render
        createRoot(rootEl).render(<App />);
    }
}