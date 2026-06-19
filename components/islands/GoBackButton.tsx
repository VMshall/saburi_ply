"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/** "Go Back" — history.back() needs the browser, so it's a tiny client island. */
export function GoBackButton() {
  return (
    <Button
      variant="outline"
      className="border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back
    </Button>
  );
}
