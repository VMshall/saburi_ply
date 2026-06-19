"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Top-level error boundary (§3). Renders within the root layout (Navbar/Footer present). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Something went wrong</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        An unexpected error occurred. Please try again, or head back to the homepage.
      </p>
      <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-white px-6 py-3">
        Try again
      </Button>
    </div>
  );
}
