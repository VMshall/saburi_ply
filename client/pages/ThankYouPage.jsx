import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the passed state data
  const { title, message, buttonText, returnUrl } = location.state || {};
  
  const handleReturn = () => {
    if (returnUrl) {
      // Check if returnUrl contains a hash (scroll to element)
      if (returnUrl.includes('#')) {
        navigate(returnUrl.split('#')[0], { state: { scrollTo: returnUrl.split('#')[1] } });
      } else {
        navigate(returnUrl);
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-14 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-2">
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16">
                  <CheckCircle className="absolute inset-0 w-16 h-16 text-green-500 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
                {title || "Thank You!"}
              </h3>
              <p className="text-gray-600 mb-6">
                {message || "Your inquiry has been submitted successfully. Our team will contact you within 24 hours with a personalized quote and detailed product information."}
              </p>
              <div className="text-sm text-gray-500 mb-6">
                Reference ID: SAB-{Date.now().toString().slice(-6)}
              </div>
              <Button
                onClick={handleReturn}
                className="mt-6 bg-primary hover:bg-primary/90 text-white"
              >
                {buttonText || "Return to Home"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
