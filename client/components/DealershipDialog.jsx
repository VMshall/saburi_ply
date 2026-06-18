import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { API_CONFIG } from "../config/api";

export function DealershipDialog({ children, open, onOpenChange }) {
  const navigate = useNavigate();
  const [dealerForm, setDealerForm] = useState({
    name: "",
    company: "",
    cityState: "",
    contact: "",
    email: "",
    experience: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleDealerChange(e) {
    const { name, value } = e.target;
    setDealerForm((s) => ({ ...s, [name]: value }));
    if (error) setError(null);
  }

  async function handleDealerSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      name: dealerForm.name,
      firm_name: dealerForm.company || "N/A", // Map company to firm_name
      city: dealerForm.cityState || "N/A", // Map cityState to city
      contact_number: dealerForm.contact,
      email: dealerForm.email,
      project_type: `${dealerForm.experience} Years Experience`, // Map experience to project_type
      message: dealerForm.message,
      partner_type: 'DEALERSHIP'
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARTNER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');

      console.log('Dealership form submitted', data);
      
      // Success - Close dialog and redirect to thank you page
      onOpenChange(false);
      
      navigate('/thank-you', {
        state: {
          title: "Thank you — we received your dealership request.",
          message: "Our team will contact you shortly.",
          buttonText: "Submit Another Request",
          returnUrl: "/"
        }
      });

      // Reset form
      setDealerForm({
        name: "", company: "", cityState: "", contact: "", email: "", experience: "", message: "",
      });
    } catch (err) {
      console.error("Dealership submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-[400px] max-h-[95vh] p-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Become A Dealer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleDealerSubmit} className="mt-4 space-y-3">
          {error && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="name" value={dealerForm.name} onChange={handleDealerChange} required disabled={isLoading} placeholder="Name" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                <input name="company" value={dealerForm.company} onChange={handleDealerChange} disabled={isLoading} placeholder="Company Name" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="cityState" value={dealerForm.cityState} onChange={handleDealerChange} disabled={isLoading} placeholder="City / State" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                <input name="contact" value={dealerForm.contact} onChange={handleDealerChange} required disabled={isLoading} placeholder="Contact Number" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="email" type="email" value={dealerForm.email} onChange={handleDealerChange} required disabled={isLoading} placeholder="Email" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                <input name="experience" type="number" min="0" value={dealerForm.experience} onChange={handleDealerChange} disabled={isLoading} placeholder="Business Experience (Years)" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
              </div>

              <textarea name="message" value={dealerForm.message} onChange={handleDealerChange} rows={4} disabled={isLoading} placeholder="Message" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />

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
  );
}
