import { useState, useEffect } from "react";
import { X, Mail, User, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { API_CONFIG } from "../config/api";

export function QuoteModal({ isOpen, onClose, productName, brochureUrl }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    product_type: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Update product_type when productName changes or modal opens
  useEffect(() => {
    if (isOpen && productName) {
      setFormData(prev => ({
        ...prev,
        product_type: productName
      }));
    }
  }, [isOpen, productName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone_number.trim() || !formData.product_type.trim()) {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setIsSubmitting(false);
        toast({
          title: "Error", 
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^[0-9+\-\s()]{10,20}$/;
      if (!phoneRegex.test(formData.phone_number)) {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Please enter a valid phone number",
          variant: "destructive"
        });
        return;
      }

      // Send data to API
      console.log('Submitting data:', formData);
      console.log('API URL:', `${API_CONFIG.BASE_URL}/save-data`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/save-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('API Response status:', response.status);
      const result = await response.json();
      console.log('API Response data:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit quote request');
      }

      toast({
        title: "Success!",
        description: "Your quote request has been submitted successfully. We'll contact you soon.",
      });

      // Open brochure in new tab if brochureUrl is provided
      if (brochureUrl) {
        window.open(brochureUrl, '_blank', 'noopener,noreferrer');
      }

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        product_type: ""
      });
      onClose();
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">View Brochure {productName}</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Hidden product type field */}
          <input
            type="hidden"
            name="product_type"
            value={formData.product_type}
          />

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
          </div>

          {/* Product Info Display */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Product:</span> {productName}
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "View Brochure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
