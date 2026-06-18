import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* 404 Number with Animation */}
          <div className="relative mb-8">
            <div className="text-9xl sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 opacity-20">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl sm:text-8xl font-bold text-gray-800 animate-pulse">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into thin air. 
            Don't worry, even the best wood gets lost sometimes!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-lg"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
