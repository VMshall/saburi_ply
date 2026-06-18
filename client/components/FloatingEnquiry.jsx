import { useState } from "react";
import {
  X,
  Send,
  MessageCircle,
  Phone as PhoneIcon,
  User,
  Mail,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";

const BRAND_LOGO =
  "/placeholder.icoo";

export function FloatingEnquiry() {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", email: "", state: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "", state: "", message: "" });
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      {open && (
        <div className="fixed right-2 sm:right-4 top-[16%] z-[60] w-[92vw] max-w-md sm:max-w-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-2xl bg-white/95 dark:bg-neutral-900/95 text-foreground shadow-2xl border border-gray-200/70 dark:border-white/10 backdrop-blur-sm">
            <button
              aria-label="Close enquiry form"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-4 pb-2 text-center">
              {/* <img src={BRAND_LOGO} alt="Saburiply Logo" className="mx-auto w-24 rounded-full object-contain" /> */}
              <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Get a Quote</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Fill the details below and our team will reach you soon.</p>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <Info className="h-4 w-4" />
                <span className="text-xs">We typically respond within 24 hours.</span>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-5">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green-200/60 dark:border-green-800 bg-green-50/90 dark:bg-green-900/20 p-5 text-center" aria-live="polite">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                  <p className="font-medium">Thank you! We will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "40ms" }}>
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        placeholder="Full Name"
                        className="relative z-0 w-full rounded-lg pl-10 pr-3 py-2 bg-white/90 dark:bg-neutral-800/70 placeholder-slate-500 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-sm"
                      />
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "90ms" }}>
                      <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        required
                        inputMode="tel"
                        pattern="[0-9+\-() ]{7,15}"
                        placeholder="Phone Number"
                        className="relative z-0 w-full rounded-lg pl-10 pr-3 py-2 bg-white/90 dark:bg-neutral-800/70 placeholder-slate-500 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-sm"
                      />
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "140ms" }}>
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="Email (optional)"
                        className="relative z-0 w-full rounded-lg pl-10 pr-3 py-2 bg-white/90 dark:bg-neutral-800/70 placeholder-slate-500 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-sm"
                      />
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "190ms" }}>
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                      <select
                        name="state"
                        value={form.state}
                        onChange={onChange}
                        className="relative z-0 w-full appearance-none rounded-lg pl-10 pr-10 py-2 bg-white/90 dark:bg-neutral-800/70 text-foreground border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-sm"
                      >
                        <option value="">Select state</option>
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "240ms" }}>
                      <MessageSquareText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        rows={3}
                        placeholder="Message"
                        className="relative z-0 w-full rounded-lg pl-10 pr-3 py-2 bg-white/90 dark:bg-neutral-800/70 placeholder-slate-500 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-lg">
                    <Send className="h-4 w-4" />
                    <span>Send Query</span>
                  </Button>

                  <p className="text-xs text-gray-500 text-center">Your information is safe with us.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-3 sm:right-4 bottom-16 z-[70] flex flex-col items-end gap-3 select-none">
        <button
          aria-label="Open enquiry form"
          onClick={() => setOpen(true)}
          className="group relative grid place-items-center h-12 w-12 rounded-full bg-white/80 text-primary shadow-lg ring-1 ring-primary/20 backdrop-blur-xl hover:bg-white transition-all active:scale-95"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="pointer-events-none absolute right-full mr-2 origin-right scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition text-xs font-medium bg-black/80 text-white px-2 py-1 rounded-md shadow-lg">
            Enquire Now
          </span>
        </button>

        <a
          href="tel:+919876543210"
          aria-label="Call now"
          className="group relative grid place-items-center h-12 w-12 rounded-full bg-white/80 text-emerald-600 shadow-lg ring-1 ring-emerald-200 backdrop-blur-xl hover:bg-white transition-all active:scale-95"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="pointer-events-none absolute right-full mr-2 origin-right scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition text-xs font-medium bg-black/80 text-white px-2 py-1 rounded-md shadow-lg">
            Call Now
          </span>
        </a>
      </div>
    </>
  );
}

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
  "Puducherry",
];
