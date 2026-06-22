"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactSelect from "react-select";
import * as yup from "yup";
import { X } from "lucide-react";

/* =========================
   DATA
========================= */

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const products = [
  "Saburi Perennial", "Saburi Club H Plus", "Saburi Titanium", "Saburi Gold",
  "Saburi Scout Plywood", "Saburi Flushdoor Gold", "Saburi Flushdoor Scout",
  "Saburi Flexible Gold", "Saburi Shine Platinum", "Saburi Modwud Pre-Lam",
  "Saburi Modwud Plain", "Saburi Perennial Blockboard", "Saburi FR Blockboard",
  "Saburi Club H Plus Blockboard", "Saburi Gold Blockboard",
  "Saburi Fire Retardant", "Saburi Smart Panel PVC Board",
  "Saburi Smart Panel WPC Board", "Saburi Smart WPC Door Frames", "Saburi Lam",
];

/* =========================
   YUP VALIDATION (ONLY CHANGE)
========================= */

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  phone: yup
    .string()
    .required("Phone number is required")
    .test("phone", "Enter a valid 10 digit phone number", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }),

  email: yup
    .string()
    .transform((v) => (v === "" ? undefined : v))
    .email("Please enter a valid email address")
    .nullable(),

  state: yup.string().required("State is required"),

  product: yup.string().nullable(),

  message: yup
    .string()
    .max(500, "Message must not exceed 500 characters")
    .nullable(),
});

/* =========================
   COMPONENT
========================= */

export function EnquiryModal() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    phone: "",
    email: "",
    state: "",
    product: "",
    message: "",
  });

  // Opens on mount via useState(true); the DeferredEnquiry island gates WHEN this mounts (2s / 400px scroll).

  // Handle ESC key to close modal and focus trap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    const modalRef = document.querySelector('[data-modal-content]');

    if (open && modalRef) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus trap: keep focus within modal
      const focusableElements = modalRef.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      modalRef.addEventListener('keydown', handleTab);
      // Focus first element when modal opens
      if (firstElement) firstElement.focus();

      return () => {
        document.removeEventListener('keydown', handleEscape);
        modalRef.removeEventListener('keydown', handleTab);
        // Restore body scroll when modal is closed
        document.body.style.overflow = 'unset';
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        if (e.path) errors[e.path] = e.message;
      });
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    const payload = {
      name: formData.name,
      phone_number: formData.phone.replace(/\D/g, ""),
      email: formData.email || "",
      state: formData.state,
      product: formData.product || "",
      message: formData.message || "",
    };

    try {
      const response = await fetch(
        `/api/forms/enquiry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Success - Redirect to thank you page
      console.log("Enquiry submitted successfully:", data);

      // Close modal and redirect to thank you page
      setOpen(false);

      router.push(`/thank-you?title=${encodeURIComponent("Thank You! Your enquiry has been received.")}&message=${encodeURIComponent("Your enquiry has been submitted successfully. Our team will contact you within 24 hours with detailed information about your inquiry.")}&buttonText=${encodeURIComponent("Submit Another Enquiry")}&returnUrl=${encodeURIComponent("/")}`);

      // Reset form data
      setFormData({
        name: "",
        phone: "",
        email: "",
        state: "",
        product: "",
        message: "",
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Custom Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div
            data-modal-content
            className="relative w-full max-w-[400px] sm:max-w-[420px] max-h-[95vh] bg-white rounded-lg shadow-xl p-4 sm:p-6 z-50 overflow-y-auto -ml-3 sm:-ml-12"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </button>

            {/* Modal Header */}
            <div className="mb-2 text-center">
              <h2 id="modal-title" className="text-lg font-bold text-primary">
                Enquire Now
              </h2>
              <p id="modal-description" className="text-gray-600 text-xs mt-1">
                Please fill in your details to help us serve you better.
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

                <Input
                  placeholder="Your Name *"
                  id="enquiry-name"
                  aria-label="Your Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border border-gray-300"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs">{validationErrors.name}</p>
                )}

                <Input
                  placeholder="Phone Number *"
                  id="enquiry-phone"
                  aria-label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border border-gray-300"
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs">{validationErrors.phone}</p>
                )}

                <Input
                  placeholder="Email"
                  id="enquiry-email"
                  aria-label="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border border-gray-300"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs">{validationErrors.email}</p>
                )}

                <ReactSelect
                  inputId="enquiry-state"
                  aria-label="Select State"
                  options={states.map((s) => ({ label: s, value: s }))}
                  value={
                    formData.state
                      ? { label: formData.state, value: formData.state }
                      : null
                  }
                  onChange={(opt) =>
                    handleInputChange("state", opt ? opt.value : "")
                  }
                  placeholder="Select State *"
                  isClearable
                  styles={{
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: '14px',
                      color: '#808080',
                    }),
                  }}
                />
                {validationErrors.state && (
                  <p className="text-red-500 text-xs">{validationErrors.state}</p>
                )}

                <ReactSelect
                  inputId="enquiry-product"
                  aria-label="Enquire For Product"
                  options={products.map((p) => ({ label: p, value: p }))}
                  value={
                    formData.product
                      ? { label: formData.product, value: formData.product }
                      : null
                  }
                  onChange={(opt) =>
                    handleInputChange("product", opt ? opt.value : "")
                  }
                  placeholder="Enquire For Product"
                  isClearable
                  styles={{
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: '14px',
                      color: '#808080',
                    }),
                  }}
                />

                <Textarea
                  placeholder="Message"
                  id="enquiry-message"
                  aria-label="Your Message"
                  rows={2}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="border border-gray-300"
                />
                {validationErrors.message && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.message}
                  </p>
                )}

                {/* Modal Footer */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded shadow-md"
                  >
                    {isLoading ? "Sending..." : "Send An Enquiry"}
                  </Button>
                </div>
              </form>
          </div>
        </div>
      )}
    </>
  );
}
