import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouContent } from "@/components/islands/ThankYouContent";
import { buildPageMetadata } from "@/lib/seo";

// Pure SSG, robots: noindex, follow (§4). Form-specific title/message/returnUrl are carried via
// query params and read client-side by ThankYouContent (§8).
export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata(
  {
    title: "Thank You - Saburi Ply | Your Request Received",
    description:
      "Thank you for contacting Saburi Ply. Your inquiry has been received successfully. Our team will get back to you shortly with the information you need.",
    keywords: "thank you saburi ply, inquiry received, contact confirmation, saburi ply response",
    canonical: "/thank-you",
  },
  { noindex: true },
);

export default function ThankYouPage() {
  return (
    <main className="py-14 lg:py-16 bg-gray-50 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-gray-500">Loading…</div>}>
          <ThankYouContent />
        </Suspense>
      </div>
    </main>
  );
}
