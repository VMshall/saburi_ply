import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { BsWhatsapp } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { API_CONFIG } from "../config/api";
import Select from "react-select";

export function ContactForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    productType: "",
    quantity: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const inquiryTypeOptions = [
    { value: "bulk-purchase", label: "Bulk Purchase" },
    { value: "dealership", label: "Dealership Inquiry" },
    { value: "retail-purchase", label: "Retail Purchase" },
    { value: "technical-support", label: "Technical Support" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "Other" },
  ];

  const productTypeOptions = [
    { value: "plywood", label: "Plywood" },
    { value: "blockboard", label: "Block Board" },
    { value: "flushdoor", label: "Flush Door" },
    { value: "wpc-pvc", label: "WPC/PVC" },
    { value: "flexible-plywood", label: "Flexible Plywood" },
    { value: "chipboard", label: "Chipboard" },
    { value: "shuttering-plywood", label: "Shuttering Plywood" },
    { value: "liner", label: "Lam" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError(null);
  };

  const handleInquiryTypeChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, inquiryType: selectedOption ? selectedOption.value : "" }));
    if (error) setError(null);
  };

  const handleProductTypeChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, productType: selectedOption ? selectedOption.value : "" }));
    if (error) setError(null);
  };



  // ... imports remain same

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Map frontend fields to backend expected format
    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      company_name: formData.company,
      inquiry_type: formData.inquiryType,
      product_type: formData.productType,
      estimated_qty: formData.quantity,
      additional_requirements: formData.message,
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUOTE}`, {
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
      console.log("Form submitted successfully:", data);

      // Redirect to thank you page with state
      navigate('/thank-you', {
        state: {
          title: "Thank You! Your quote request has been received.",
          message: "Your inquiry has been submitted successfully. Our team will contact you within 24 hours with a personalized quote and detailed product information.",
          buttonText: "Submit New Quote",
          returnUrl: "/#contact"
        }
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        inquiryType: "",
        productType: "",
        quantity: "",
        message: ""
      });

    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-left lg:text-center mb-8 lg:mb-16" id="contact-form">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 lg:mb-4">Get Your <span className="text-primary">Quote Today</span></h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto ps-0 lg:px-4">Ready to experience premium quality plywood? Fill out the form below and our team will provide you with a personalized quote within 24 hours.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Head Office</h4>
                    <a href="https://maps.app.goo.gl/bh5wyDfbZjP2ji5r9" target="_blank" rel="noopener noreferrer">
                      <p className="text-gray-600 text-sm leading-relaxed hover:text-primary transition-colors duration-200">New Town Square, Unit 3A, Atghora Rajarhat, Chinar Park Crossing, Kolkata – 700136, West Bengal, India</p>
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Phone Numbers</h4>
                    <a href="tel:1800313666000" className="text-gray-600 text-sm hover:text-primary transition-colors duration-200">
                      <p>1800 313 666 000</p>
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Email Addresses</h4>
                    <a href="mailto:info@saburiply.com" className="text-gray-600 text-sm hover:text-primary transition-colors duration-200">
                      <p>info@saburiply.com</p>
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Clock className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-sm">Monday - Saturday: 10:00 AM - 8:00 PM<br />Sunday: Closed<br />Emergency: 24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center lg:text-left">
              <h4 className="font-semibold text-black mb-4">Quick Contact</h4>
              <div className="space-y-3">
                <a href="https://wa.me/919062066655" target="_blank" rel="noopener noreferrer" className="w-full bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <BsWhatsapp className="h-5 w-5 mr-3" />
                  <span>WhatsApp: +91 9062066655</span>
                </a>
                <a href="tel:1800313666000" className="w-full bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <IoCallOutline className="h-5 w-5 mr-3" />
                  <span>Call Now: 1800 313 666 000</span>
                </a>
                <a href="mailto:info@saburiply.com" className="w-full bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <MdOutlineEmail className="h-5 w-5 mr-3" />
                  <span>Email: info@saburiply.com</span>
                </a>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8" >
              <h3 className="text-2xl font-bold text-black mb-6">Request a Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-black mb-2">Full Name *</label>
                    <input type="text" id="full-name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your full name" disabled={isLoading} />
                  </div>
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-black mb-2">Email Address *</label>
                    <input type="email" id="email-address" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your email address" disabled={isLoading} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone-number" className="block text-sm font-medium text-black mb-2">Phone Number *</label>
                    <input type="tel" id="phone-number" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="+91 12345 67890" disabled={isLoading} />
                  </div>
                  <div>
                    <label htmlFor="company-name" className="block text-sm font-medium text-black mb-2">Company Name</label>
                    <input type="text" id="company-name" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Your company name" disabled={isLoading} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="inquiry-type-select" className="block text-sm font-medium text-black mb-2">Inquiry Type *</label>
                    <Select
                      inputId="inquiry-type-select"
                      name="inquiryType"
                      value={inquiryTypeOptions.find(option => option.value === formData.inquiryType) || null}
                      onChange={handleInquiryTypeChange}
                      options={inquiryTypeOptions}
                      placeholder="Select inquiry type"
                      isDisabled={isLoading}
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
                          boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--primary) / 0.2)' : 'none',
                          borderRadius: '0.5rem',
                          minHeight: '48px',
                          padding: '2px',
                          '&:hover': {
                            borderColor: state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
                          },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? 'hsl(var(--primary))'
                            : state.isFocused
                              ? 'hsl(var(--primary) / 0.1)'
                              : 'white',
                          color: state.isSelected ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: state.isSelected
                              ? 'hsl(var(--primary))'
                              : 'hsl(var(--primary) / 0.1)',
                          },
                        }),
                      }}
                    />
                    <input
                      type="hidden"
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-type-select" className="block text-sm font-medium text-black mb-2">Product Type</label>
                    <Select
                      inputId="product-type-select"
                      name="productType"
                      value={productTypeOptions.find(option => option.value === formData.productType) || null}
                      onChange={handleProductTypeChange}
                      options={productTypeOptions}
                      placeholder="Select product type"
                      isDisabled={isLoading}
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
                          boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--primary) / 0.2)' : 'none',
                          borderRadius: '0.5rem',
                          minHeight: '48px',
                          padding: '2px',
                          '&:hover': {
                            borderColor: state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
                          },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? 'hsl(var(--primary))'
                            : state.isFocused
                              ? 'hsl(var(--primary) / 0.1)'
                              : 'white',
                          color: state.isSelected ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: state.isSelected
                              ? 'hsl(var(--primary))'
                              : 'hsl(var(--primary) / 0.1)',
                          },
                        }),
                      }}
                    />
                    <input
                      type="hidden"
                      id="productType"
                      name="productType"
                      value={formData.productType}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="estimated-quantity" className="block text-sm font-medium text-black mb-2">Estimated Quantity</label>
                  <input type="text" id="estimated-quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="e.g., 500 sheets, 10 tons, etc." disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="additional-requirements" className="block text-sm font-medium text-black mb-2">Additional Requirements</label>
                  <textarea id="additional-requirements" name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none" placeholder="Please provide details about your requirements, timeline, delivery location, etc." disabled={isLoading} />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Quote...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Submit Quote Request
                    </span>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-left lg:text-center">By submitting this form, you agree to receive communications from Saburiply regarding your inquiry.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
