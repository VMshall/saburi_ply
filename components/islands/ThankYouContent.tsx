"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefId } from "@/components/islands/RefId";

/**
 * /thank-you content (client). Form-specific context is carried via query params (§8 — the
 * App Router replacement for the legacy router location.state), with sensible defaults. The
 * page stays statically generated; this island reads the query at runtime (Suspense-wrapped).
 */
export function ThankYouContent() {
  const sp = useSearchParams();
  const title = sp.get("title") || "Thank You!";
  const message =
    sp.get("message") ||
    "Your inquiry has been submitted successfully. Our team will contact you within 24 hours with a personalized quote and detailed product information.";
  const buttonText = sp.get("buttonText") || "Return to Home";
  // Only honour internal return paths (avoid open-redirect via the query).
  const returnRaw = sp.get("returnUrl");
  const returnUrl = returnRaw && returnRaw.startsWith("/") ? returnRaw : "/";

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="p-2">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <CheckCircle className="absolute inset-0 w-16 h-16 text-green-500 animate-bounce" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="text-sm text-gray-500 mb-6">
          Reference ID: <RefId />
        </div>
        <Link href={returnUrl}>
          <Button className="mt-6 bg-primary hover:bg-primary/90 text-white">{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
}
