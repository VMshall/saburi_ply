import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, MapPin, GraduationCap, Phone, Mail, User, Home, Briefcase, CheckCircle2, Link2, Award } from "lucide-react";

export default function Career() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      formRef.current?.reset();
    }, 1700);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title="Careers" />

      <section className="relative py-8 sm:py-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 opacity-10"><div className="doodle-grid w-full h-full" /></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">Build Your Career With Saburi</h1>
            <p className="mt-2 text-gray-700">Join a growth‑first team shaping the future of wood solutions across India.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1 shadow-sm"><Award className="h-3.5 w-3.5 text-primary" /> Learning & Growth</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1 shadow-sm"><Award className="h-3.5 w-3.5 text-primary" /> Inclusive Culture</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1 shadow-sm"><Award className="h-3.5 w-3.5 text-primary" /> Performance Rewards</span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div id="career-form" className="p-[1.5px] rounded-2xl bg-gradient-to-br from-primary via-rose-500 to-orange-400 shadow-2xl">
              <div className="rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-white/30">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="bg-gradient-to-r from-primary to-rose-500 text-white text-center py-3 font-semibold tracking-wide uppercase">Submit Your Details</div>
                </div>

                <div className="px-4 sm:px-6 py-6">
                  {submitted ? (
                    <div className="flex flex-col items-center gap-2 text-center rounded-xl border border-green-200/60 bg-green-50/90 p-5" aria-live="polite">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <p className="font-medium">Thanks! We will reach you shortly.</p>
                    </div>
                  ) : (
                    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input required name="name" id="name" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="name" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Full Name*</label>
                        </div>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input type="email" required name="email" id="email" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="email" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Email Address*</label>
                        </div>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input required name="phone" id="phone" inputMode="tel" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="phone" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Mobile No.*</label>
                        </div>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input required name="location" id="location" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="location" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Location*</label>
                        </div>
                        <div className="relative">
                          <GraduationCap className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input name="qualification" id="qualification" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="qualification" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Qualification*</label>
                        </div>
                        <div className="relative">
                          <Briefcase className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input name="position" id="position" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="position" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Applying For (optional)</label>
                        </div>
                        <div className="relative sm:col-span-2">
                          <Link2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                          <input name="linkedin" id="linkedin" placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="linkedin" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">LinkedIn / Portfolio URL (optional)</label>
                        </div>
                        <div className="relative sm:col-span-2">
                          <Home className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                          <textarea name="address" id="address" rows={3} placeholder=" " className="peer w-full rounded-lg pl-10 pr-3 py-3 bg-white placeholder-transparent border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/25 shadow-sm" />
                          <label htmlFor="address" className="absolute left-10 top-2.5 text-slate-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm">Contact Address*</label>
                        </div>
                        <div className="relative sm:col-span-2">
                          <label className="flex items-center justify-between gap-3 w-full rounded-lg px-3 py-3 bg-white border border-dashed border-gray-300 hover:border-primary cursor-pointer text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4 text-primary" /> Upload Resume (PDF/DOC)
                            </div>
                            <input type="file" name="resume" className="hidden" accept=".pdf,.doc,.docx" />
                          </label>
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-500/90 text-white shadow-lg">Submit Details</Button>
                      <p className="text-xs text-gray-500 text-center">We review applications within 3–5 working days. Your information is confidential.</p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
