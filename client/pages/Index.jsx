import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { QuoteModal } from "../components/QuoteModal";

// Lazy load almost everything to keep critical bundle tiny
const AboutUs = lazy(() => import("../components/AboutUs").then(m => ({ default: m.AboutUs })));
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs").then(m => ({ default: m.WhyChooseUs })));
const PlywoodTypes = lazy(() => import("../components/PlywoodTypes").then(m => ({ default: m.PlywoodTypes })));
const PlywoodGallery = lazy(() => import("../components/PlywoodGallery").then(m => ({ default: m.PlywoodGallery })));
const Testimonials = lazy(() => import("../components/Testimonials").then(module => ({ default: module.Testimonials })));
const BecomeOurPartner = lazy(() => import("../components/BecomeOurPartner").then(module => ({ default: module.BecomeOurPartner })));
const ContactForm = lazy(() => import("../components/ContactForm").then(module => ({ default: module.ContactForm })));
const EnquiryModal = lazy(() => import("../components/EnquiryModal").then(module => ({ default: module.EnquiryModal })));

export default function Index() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBrochure, setSelectedBrochure] = useState("");

  const handleOpenQuoteModal = (productName, brochureUrl) => {
    setSelectedProduct(productName);
    setSelectedBrochure(brochureUrl || "");
    setIsQuoteModalOpen(true);
  };

  useEffect(() => {
    // Defer EnquiryModal significantly to avoid blocking Lighthouse audits
    // Trigger only after 4s or 400px scroll
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowModal(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const timer = setTimeout(() => {
      setShowModal(true);
      window.removeEventListener("scroll", handleScroll);
    }, 2000);

    window.addEventListener("scroll", handleScroll, { passive: true });

    if (location.state?.scrollTo === "contact") {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById("contact");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
      window.history.replaceState({}, document.title);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.state]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <Suspense fallback={<div className="h-96" />}>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <AboutUs />
        </div>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <WhyChooseUs />
        </div>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <PlywoodTypes onOpenQuoteModal={handleOpenQuoteModal} />
        </div>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <PlywoodGallery />
        </div>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '400px' }}>
          <Testimonials />
        </div>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}>
          <BecomeOurPartner />
        </div>
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <ContactForm />
        </div>
      </Suspense>

      <Footer />

      {showModal && (
        <Suspense fallback={null}>
          <EnquiryModal />
        </Suspense>
      )}

      {/* Quote Modal - Rendered at page level for full page backdrop */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={selectedProduct}
        brochureUrl={selectedBrochure}
      />
    </div>
  );
}
