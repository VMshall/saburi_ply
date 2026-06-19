import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoBackButton } from "@/components/islands/GoBackButton";

/**
 * 404 page (§3/§4) — ported from client/pages/NotFound.jsx. Rendered within the root layout, so
 * Navbar/Footer come from there. As app/not-found.tsx it returns a real HTTP 404 for any
 * unmatched route (verified in §11). The history.back() control is a small client island.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="relative mb-8">
          <div className="text-9xl sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-8xl font-bold text-gray-800 animate-pulse">404</div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          The page you're looking for seems to have vanished into thin air. Don't worry, even the
          best wood gets lost sometimes!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <GoBackButton />
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-lg" />
      </div>
    </div>
  );
}
