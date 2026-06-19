import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefId } from "@/components/islands/RefId";
import { buildPageMetadata } from "@/lib/seo";

// Pure SSG, robots: noindex, follow (§4). Form-specific title/message context (legacy
// location.state) is wired via query params in P5; for now it shows the default confirmation.
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
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-2">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <CheckCircle className="absolute inset-0 w-16 h-16 text-green-500 animate-bounce" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your inquiry has been submitted successfully. Our team will contact you within 24
              hours with a personalized quote and detailed product information.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              Reference ID: <RefId />
            </div>
            <Link href="/">
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-white">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
