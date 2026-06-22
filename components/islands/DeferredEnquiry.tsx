"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Client-only wrapper so the auto-popup enquiry modal can be ssr:false (a Server Component can't
// pass ssr:false to next/dynamic). The modal has no SEO content, so deferring it keeps its JS out
// of the home First-Load bundle (§6 CWV). It mounts only after a 2s delay OR a 400px scroll —
// matching the original Index.jsx gate (parity fix R1); EnquiryModal self-opens on mount.
const EnquiryModal = dynamic(
  () => import("@/components/dialogs/EnquiryModal").then((m) => ({ default: m.EnquiryModal })),
  { ssr: false },
);

export function DeferredEnquiry() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setShow(true);
        cleanup();
      }
    };
    const timer = setTimeout(() => {
      setShow(true);
      cleanup();
    }, 2000);
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);

  return show ? <EnquiryModal /> : null;
}
