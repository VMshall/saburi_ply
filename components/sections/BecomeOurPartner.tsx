"use client";

import { PaintBucket, Building2, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { DealershipDialog } from "@/components/dialogs/DealershipDialog";
import Select from "react-select";

/**
 * "Become Our Partner" section (client). Ported from client/components/BecomeOurPartner.jsx.
 * react-router-dom is gone: navigate('/thank-you', { state }) → router.push with the same
 * context carried as query params (read by components/islands/ThankYouContent.tsx, §8). The
 * three lead forms (Interior Designer / Architect inline here, Dealership via the shared
 * @/components/dialogs/DealershipDialog) POST verbatim payloads to the same-origin proxy
 * /api/forms/become-partner (§8), which forwards to apiv2 server-side.
 */

export function BecomeOurPartner() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    firm: "",
    city: "",
    contact: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [archForm, setArchForm] = useState({
    name: "",
    firm: "",
    location: "",
    contact: "",
    email: "",
    currentProjects: "",
    message: "",
  });
  const [archLoading, setArchLoading] = useState(false);
  const [archError, setArchError] = useState(null);

  const projectTypeOptions = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Retail", label: "Retail" },
    { value: "Hospitality", label: "Hospitality" },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (error) setError(null);
  }

  function handleProjectTypeChange(selectedOption) {
    setForm((s) => ({ ...s, projectType: selectedOption ? selectedOption.value : "" }));
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      firm_name: form.firm,
      city: form.city,
      contact_number: form.contact,
      email: form.email,
      project_type: form.projectType,
      message: form.message,
      partner_type: 'INTERIOR_DESIGNER'
    };

    try {
      // Same-origin proxy (§8) → forwarded to apiv2 server-side.
      const response = await fetch("/api/forms/become-partner", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');

      console.log('Partner form submitted', data);

      // Redirect to thank you page with state
      router.push(
        `/thank-you?title=${encodeURIComponent("Thank you — we received your Interior Designer request.")}&message=${encodeURIComponent("Our team will contact you shortly.")}&buttonText=${encodeURIComponent("Return to Home")}&returnUrl=${encodeURIComponent("/")}`
      );

      // Reset form
      setForm({
        name: "", firm: "", city: "", contact: "", email: "", projectType: "", message: "",
      });
    } catch (err) {
      console.error("Interior Designer submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleArchChange(e) {
    const { name, value } = e.target;
    setArchForm((s) => ({ ...s, [name]: value }));
    if (archError) setArchError(null);
  }

  async function handleArchSubmit(e) {
    e.preventDefault();
    setArchLoading(true);
    setArchError(null);

    const payload = {
      name: archForm.name,
      firm_name: archForm.firm,
      city: archForm.location, // Mapping location to city
      contact_number: archForm.contact,
      email: archForm.email,
      project_type: archForm.currentProjects, // Mapping currentProjects to project_type
      message: archForm.message,
      partner_type: 'ARCHITECT'
    };

    try {
      // Same-origin proxy (§8) → forwarded to apiv2 server-side.
      const response = await fetch("/api/forms/become-partner", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');

      console.log('Architect form submitted', data);

      // Redirect to thank you page with state
      router.push(
        `/thank-you?title=${encodeURIComponent("Thank you — we received your Architect request.")}&message=${encodeURIComponent("Our team will contact you shortly.")}&buttonText=${encodeURIComponent("Return to Home")}&returnUrl=${encodeURIComponent("/")}`
      );

      // Reset form
      setArchForm({
        name: "", firm: "", location: "", contact: "", email: "", currentProjects: "", message: "",
      });
    } catch (err) {
      console.error("Architect submission error:", err);
      setArchError(err.message);
    } finally {
      setArchLoading(false);
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-left lg:text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
            Become Our Partner
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mt-3 font-medium">
            Join hands with Saburi grow, design, and build excellence together with quality that endures generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Interior Designer card with modal dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/40" tabIndex={0} role="button" aria-label="Learn more about Interior Designer partnership">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <PaintBucket className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-black group-hover:text-primary transition-colors duration-300">Interior Designer</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Create inspired spaces using durable, elegant, and sustainable Saburi materials.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>Click to apply</span>
                  <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-[400px] max-h-[95vh] p-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Interior Designer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {error && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="name" id="partner-id-name" value={form.name} onChange={handleChange} required disabled={isLoading} placeholder="Name" aria-label="Enter your name" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                  <input name="firm" id="partner-id-firm" value={form.firm} onChange={handleChange} required disabled={isLoading} placeholder="Firm Name" aria-label="Enter your firm name" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="city" id="partner-id-city" value={form.city} onChange={handleChange} required disabled={isLoading} placeholder="City" aria-label="Enter your city" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                  <input name="contact" id="partner-id-contact" value={form.contact} onChange={handleChange} required disabled={isLoading} placeholder="Contact Number" aria-label="Enter your contact number" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="email" type="email" id="partner-id-email" value={form.email} onChange={handleChange} required disabled={isLoading} placeholder="Email" aria-label="Enter your email address" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                  <div>
                    <Select
                      inputId="partner-id-project-type"
                      name="projectType"
                      aria-label="Select project type"
                      value={projectTypeOptions.find(option => option.value === form.projectType) || null}
                      onChange={handleProjectTypeChange}
                      options={projectTypeOptions}
                      placeholder="Project Type..."
                      isDisabled={isLoading}
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
                          boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--primary) / 0.5)' : 'none',
                          borderRadius: '0.375rem',
                          minHeight: '42px',
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
                      id="partner-projectType"
                      name="projectType"
                      value={form.projectType}
                      required
                    />
                  </div>
                </div>

                <textarea name="message" id="partner-id-message" value={form.message} onChange={handleChange} rows={4} required disabled={isLoading} placeholder="Message" aria-label="Enter your message" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />

                <div className="flex items-center justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isLoading}>Close</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading} className="bg-primary text-white disabled:opacity-70">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Request"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Architect card with modal dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/40" tabIndex={0} role="button" aria-label="Learn more about Architect partnership">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-black group-hover:text-primary transition-colors duration-300">Architect</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Collaborate for innovative, eco-conscious, and timeless wooden design solutions.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>Click to apply</span>
                  <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-[400px] max-h-[95vh] p-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Architect</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleArchSubmit} className="mt-4 space-y-3">
                {archError && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm">{archError}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="name" id="partner-arch-name" value={archForm.name} onChange={handleArchChange} required disabled={archLoading} placeholder="Name" aria-label="Enter your name" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                  <input name="firm" id="partner-arch-firm" value={archForm.firm} onChange={handleArchChange} required disabled={archLoading} placeholder="Firm Name" aria-label="Enter your firm name" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="location" id="partner-arch-location" value={archForm.location} onChange={handleArchChange} required disabled={archLoading} placeholder="Location" aria-label="Enter your location" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                  <input name="contact" id="partner-arch-contact" value={archForm.contact} onChange={handleArchChange} required disabled={archLoading} placeholder="Contact Number" aria-label="Enter your contact number" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="email" type="email" id="partner-arch-email" value={archForm.email} onChange={handleArchChange} required disabled={archLoading} placeholder="Email" aria-label="Enter your email address" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                  <input name="currentProjects" id="partner-arch-projects" value={archForm.currentProjects} onChange={handleArchChange} required disabled={archLoading} placeholder="Current Projects" aria-label="Enter your current projects" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                </div>

                <textarea name="message" id="partner-arch-message" value={archForm.message} onChange={handleArchChange} rows={4} required disabled={archLoading} placeholder="Message" aria-label="Enter your message" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />

                <div className="flex items-center justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={archLoading}>Close</Button>
                  </DialogClose>
                  <Button type="submit" disabled={archLoading} className="bg-primary text-white disabled:opacity-70">
                    {archLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Request"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dealership card with modal dialog */}
          <DealershipDialog>
            <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/40" tabIndex={0} role="button" aria-label="Learn more about Dealership partnership">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-black group-hover:text-primary transition-colors duration-300">Dealership</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Partner with Saburi for trusted supply, strong margins, and nationwide support.
              </p>
              <div className="flex items-center text-primary text-sm font-medium">
                <span>Click to apply</span>
                <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </DealershipDialog>
        </div>
      </div>
    </section>
  );
}
