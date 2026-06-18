import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { API_CONFIG } from "../config/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactSelect from "react-select";
import * as yup from "yup";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];

const products = [
  "Saburi Perennial",
  "Saburi Club H Plus",
  "Saburi Titanium",
  "Saburi Gold",
  "Saburi Scout Plywood",
  "Saburi Flushdoor Gold",
  "Saburi Flushdoor Scout",
  "Saburi Flexible Gold",
  "Saburi Shine Platinum",
  "Saburi Modwud Pre-Lam",
  "Saburi Modwud Plain",
  "Saburi Perennial Blockboard",
  "Saburi FR Blockboard",
  "Saburi Club H Plus Blockboard",
  "Saburi Gold Blockboard",
  "Saburi Fire Retardant",
  "Saburi Smart Panel PVC Board",
  "Saburi Smart Panel WPC Board",
  "Saburi Smart WPC Door Frames",
  "Saburi Lam"
];

// Validation schema
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("phone-format", "Phone number must be exactly 10 digits", function(value) {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length === 10;
    }),
  email: yup
    .string()
    .transform((value) => value === "" ? undefined : value)
    .email("Please enter a valid email address")
    .nullable(),
  state: yup
    .string()
    .required("State is required")
    .min(1, "State is required"),
  product: yup
    .string()
    .nullable(),
  message: yup
    .string()
    .max(500, "Message must not exceed 500 characters")
    .nullable(),
});

export function MobileQuoteForm({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    product: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleClose = () => {
    // Reset all states when closing
    setError(null);
    setValidationErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validate form data
    try {
      await validationSchema.validate(formData, { abortEarly: false, stripUnknown: true });
    } catch (err) {
      const errors = {};
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
      } else if (err.path) {
        errors[err.path] = err.message;
      }
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    setIsLoading(true);

    // Map frontend fields to backend expected format
    const payload = {
      name: formData.name,
      email: formData.email || "",
      phone_number: formData.phone,
      state: formData.state,
      city: formData.city || "",
      product: formData.product || "",
      message: formData.message || "",
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENQUIRY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Something went wrong. Please try again.');
      }

      // Success
      console.log("Mobile enquiry submitted successfully:", data);
      
      // Close modal and redirect to thank you page
      handleClose();
      
      navigate('/thank-you', {
        state: {
          title: "Thank You! Your enquiry has been received.",
          message: "Your enquiry has been submitted successfully. Our team will contact you within 24 hours with detailed information about your inquiry.",
          buttonText: "Submit Another Enquiry",
          returnUrl: "/"
        }
      });

      // Reset form data after dialog is closed
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          state: "",
          product: "",
          message: ""
        });
      }, 300);

    } catch (err) {
      console.error("Mobile form submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field when user types
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStateChange = (state) => {
    setFormData(prev => ({
      ...prev,
      state
    }));
    // Clear validation error for state when user selects
    if (validationErrors.state) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.state;
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-[400px] max-h-[95vh] overflow-y-auto p-4 sm:mx-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold text-primary text-center">
            Enquire Now
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center text-xs">
            Please fill in your details to help us serve you better.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pb-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className={`w-full h-9 text-sm px-3 py-1 rounded border focus:border-primary focus:ring-1 focus:ring-primary ${
                    validationErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="off"
                  disabled={isLoading}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className={`w-full h-9 text-sm px-3 py-1 rounded border focus:border-primary focus:ring-1 focus:ring-primary ${
                    validationErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="off"
                  disabled={isLoading}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                )}
              </div>
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full h-9 text-sm px-3 py-1 rounded border focus:border-primary focus:ring-1 focus:ring-primary ${
                    validationErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="off"
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <ReactSelect
                  id="state"
                  classNamePrefix="react-select"
                  options={states.map((state) => ({ label: state, value: state }))}
                  value={formData.state ? { label: formData.state, value: formData.state } : null}
                  onChange={(option) => handleStateChange(option ? option.value : "")}
                  placeholder="Select State *"
                  isClearable
                  isDisabled={isLoading}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: 36,
                      fontSize: 14,
                      borderRadius: 6,
                      borderColor: validationErrors.state ? '#ef4444' : state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999, fontSize: 14 }),
                  }}
                />
                {validationErrors.state && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.state}</p>
                )}
                <input
                  type="hidden"
                  name="state"
                  value={formData.state}
                  required
                />
              </div>
              <div>
                <ReactSelect
                  id="product"
                  classNamePrefix="react-select"
                  options={products.map((product) => ({ label: product, value: product }))}
                  value={formData.product ? { label: formData.product, value: formData.product } : null}
                  onChange={(option) => handleInputChange("product", option ? option.value : "")}
                  placeholder="Enquire For Product"
                  isClearable
                  isDisabled={isLoading}
                  styles={{
                    control: (base) => ({ ...base, minHeight: 36, fontSize: 14, borderRadius: 6, borderColor: '#d1d5db' }),
                    menu: (base) => ({ ...base, zIndex: 9999, fontSize: 14 }),
                  }}
                />
              </div>
              <div>
                <Textarea
                  id="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={2}
                  className={`w-full text-sm px-3 py-1 rounded border focus:border-primary focus:ring-1 focus:ring-primary resize-none ${
                    validationErrors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {validationErrors.message && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded shadow-md"
              >
                {isLoading ? "Sending..." : "Send An Enquiry"}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
