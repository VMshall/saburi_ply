"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/**
 * Client provider boundary (§3). Mirrors the old App.jsx provider stack MINUS:
 *  - HelmetProvider  → replaced by the Metadata API (app/layout.tsx)
 *  - BrowserRouter   → replaced by the App Router
 *  - QueryClientProvider → DROPPED (§0.2: verified zero useQuery/useMutation in the repo)
 *
 * TopProgress (top-bar route loader) lands in P4 alongside not-found/error/loading.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
}
