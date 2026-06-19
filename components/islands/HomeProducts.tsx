"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PlywoodTypes } from "@/components/sections/PlywoodTypes";

// The quote modal has no above-the-fold/SEO content and only renders once a card is clicked, so
// load it client-only (ssr:false) — keeps it out of the home's First-Load JS (§6).
const QuoteModal = dynamic(
  () => import("@/components/dialogs/QuoteModal").then((m) => ({ default: m.QuoteModal })),
  { ssr: false },
);

/**
 * Couples the home PlywoodTypes grid with the page-level QuoteModal (the state lift that lived
 * in the legacy client/pages/Index.jsx). A product card's "Get Quote"/brochure button calls
 * onOpenQuoteModal(name, brochureUrl) → opens the modal (which portals to <body>, so the
 * full-page backdrop works regardless of where it sits in the tree).
 */
export function HomeProducts() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBrochure, setSelectedBrochure] = useState("");

  const handleOpenQuoteModal = (productName: string, brochureUrl?: string) => {
    setSelectedProduct(productName);
    setSelectedBrochure(brochureUrl || "");
    setIsQuoteModalOpen(true);
  };

  return (
    <>
      <PlywoodTypes onOpenQuoteModal={handleOpenQuoteModal} />
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={selectedProduct}
        brochureUrl={selectedBrochure}
      />
    </>
  );
}
