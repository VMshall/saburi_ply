"use client";

import dynamic from "next/dynamic";

// Client-only wrapper so the auto-popup enquiry modal can be ssr:false (a Server Component can't
// pass ssr:false to next/dynamic). The modal has no SEO content and only appears after a delay/
// scroll, so deferring it keeps its JS out of the home's First-Load bundle (§6 CWV).
const EnquiryModal = dynamic(
  () => import("@/components/dialogs/EnquiryModal").then((m) => ({ default: m.EnquiryModal })),
  { ssr: false },
);

export function DeferredEnquiry() {
  return <EnquiryModal />;
}
