"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { RateOnGoogle } from "@/components/RateOnGoogle";

/**
 * Reusable inline success panel (client) — shown after a form submits (e.g. /contact). Ported
 * from client/components/ThankYou.jsx. The reference id is computed in an effect (client-only)
 * to avoid a server/client hydration mismatch from Date.now().
 */
export function ThankYou({
  onReset,
  title = "Thank You!",
  message,
  buttonText = "Submit New Quote",
}: {
  onReset?: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}) {
  const [refId, setRefId] = useState("");
  useEffect(() => {
    setRefId(`SAB-${Date.now().toString().slice(-6)}`);
  }, []);

  return (
    <section className="py-14 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-2">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <CheckCircle className="absolute inset-0 w-16 h-16 text-green-500 animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">
              {message ||
                "Your inquiry has been submitted successfully. Our team will contact you within 24 hours with a personalized quote and detailed product information."}
            </p>
            <div className="text-sm text-gray-500">Reference ID: {refId}</div>
            <RateOnGoogle variant="card" placement="thank_you_inline" className="mt-6" />
            <button
              onClick={onReset}
              className="mt-8 text-sm font-medium text-gray-500 underline-offset-4 transition-colors hover:text-gray-800 hover:underline"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
