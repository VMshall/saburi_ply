"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, User, Home, MessageSquare, Globe, Send } from "lucide-react";
import Select from "react-select";
import { ThankYou } from "@/components/ThankYou";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const formRef = useRef(null);

  const stateOptions = states.map(state => ({ value: state, label: state }));

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    if (error) setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone_number: formData.get("phone"),
      state: selectedState ? selectedState.value : "",
      message: formData.get("message"),
    };

    try {
      // Same-origin proxy (§8) → forwarded to apiv2 server-side.
      const response = await fetch("/api/forms/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Failed to send message. Please try again.");
      }

      setSubmitted(true);
      formRef.current?.reset();
      setSelectedState(null);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-10 sm:py-14 lg:py-18">
      <div className="pointer-events-none absolute inset-0 opacity-10"><div className="doodle-grid w-full h-full" /></div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-left lg:text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">Contact Us</h1>
          <p className="text-gray-700 mt-2">If you have questions, concerns or requests about this Privacy Policy or our data practices, please contact:</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Info card */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-primary uppercase mb-4">Saburi Plywood</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-gray-800">
                    New Town Square, Unit 3A, Atghora Rajarhat, Chinar Park Crossing,<br />Kolkata – 700136, West Bengal, India
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a className="text-gray-800 hover:text-primary" href="tel:1800313666000">1800 313 666 000</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a className="text-gray-800 hover:text-primary" href="mailto:info@saburiply.com">info@saburiply.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-gray-800">Monday - Saturday: 10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <a className="text-gray-800 hover:text-primary" href="https://www.saburiply.com" target="_blank" rel="noreferrer">www.saburiply.com</a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-video bg-gray-50">
                <iframe
                  title="Saburiply Location"
                  src="https://www.google.com/maps?q=New+Town+Square+Kolkata&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="p-[1.5px] rounded-2xl bg-gradient-to-br from-primary via-rose-500 to-orange-400 shadow-2xl">
              <div className="rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-white/30">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="bg-gradient-to-r from-primary to-rose-500 text-white text-center py-3 font-semibold tracking-wide uppercase">Send Us a Message</div>
                </div>

                <div className="px-4 sm:px-6 py-6">
                  {submitted ? (
                    <ThankYou
                      onReset={() => setSubmitted(false)}
                      title="Thanks! We'll get back to you soon."
                      message="Your message has been sent successfully. We'll respond within 24 hours."
                      buttonText="Send Another Message"
                    />
                  ) : (
                    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative sm:col-span-2">
                          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input name="name" id="c_name" required disabled={isLoading} placeholder="Full Name*" className="w-full rounded-lg pl-10 pr-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm disabled:opacity-50" />
                        </div>
                        <div className="relative sm:col-span-2">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input type="email" name="email" id="c_email" required disabled={isLoading} placeholder="Email Address*" className="w-full rounded-lg pl-10 pr-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm disabled:opacity-50" />
                        </div>
                        <div className="relative sm:col-span-2">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input name="phone" id="c_phone" inputMode="tel" required disabled={isLoading} placeholder="Mobile No.*" className="w-full rounded-lg pl-10 pr-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm disabled:opacity-50" />
                        </div>
                        <div className="relative sm:col-span-2">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <div className="w-full">
                            <Select
                              name="state"
                              id="c_state"
                              value={selectedState}
                              onChange={handleStateChange}
                              options={stateOptions}
                              placeholder="Select State*"
                              isDisabled={isLoading}
                              isSearchable={true}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={{
                                control: (base, state) => ({
                                  ...base,
                                  borderColor: state.isFocused ? 'hsl(var(--primary))' : '#e5e7eb',
                                  boxShadow: state.isFocused ? '0 0 0 4px hsl(var(--primary) / 0.25)' : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                  borderRadius: '0.5rem',
                                  minHeight: '48px',
                                  paddingLeft: '40px',
                                  paddingRight: '12px',
                                  backgroundColor: 'white',
                                  '&:hover': {
                                    borderColor: state.isFocused ? 'hsl(var(--primary))' : '#e5e7eb',
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
                                input: (base) => ({
                                  ...base,
                                  margin: '0',
                                  padding: '0',
                                }),
                                valueContainer: (base) => ({
                                  ...base,
                                  padding: '0',
                                }),
                                indicatorsContainer: (base) => ({
                                  ...base,
                                  paddingRight: '8px',
                                }),
                              }}
                            />
                            <input
                              type="hidden"
                              name="state"
                              value={selectedState ? selectedState.value : ""}
                              required
                            />
                          </div>
                        </div>
                        <div className="relative sm:col-span-2">
                          <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                          <textarea name="message" id="c_message" rows={3} required disabled={isLoading} placeholder="Message*" className="w-full rounded-lg pl-10 pr-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm disabled:opacity-50" />
                        </div>
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-primary to-rose-500 text-white hover:from-primary/90 hover:to-rose-500/90 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" /> Send Message
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 text-center">We typically respond within 24 hours.</p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
