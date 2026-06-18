import { Leaf, Recycle, ShieldCheck } from "lucide-react";

export function GoGreen() {
  return (
    <section id="go-green" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-7">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-medium">
                <Leaf className="h-3.5 w-3.5 mr-1" /> Sustainability
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black">
                Go green with <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">Plywood</span>
              </h2>
            </div>

            <div className="space-y-5 text-gray-700 leading-relaxed text-base sm:text-lg">
              <p>
                Plywood supports sustainability sourced from renewable forest farms using rotation cycles that preserve biodiversity. Saburi Ply minimizes environmental impact through energy-efficient production and recycling.
              </p>
              <p>
                Compared to iron or steel, plywood consumes far less energy and emits fewer toxins. Certified as recyclable, non-polluting, and eco-friendly, Saburi Ply stands as a responsible choice for modern interiors and architecture, promoting a greener, safer future.
              </p>
            </div>

            {/* Eco badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
                <Recycle className="h-3.5 w-3.5" /> Low Carbon Footprint
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified Green Product
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1 text-xs font-medium text-lime-800">
                <Leaf className="h-3.5 w-3.5" /> Renewable Resource
              </div>
            </div>
          </div>

          {/* Image / Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-green-200/60 via-emerald-100 to-lime-200/60 blur-2xl" />
              <div className="aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-xl">
                <img
                  src="/images/Go green with Plywood.webp"
                  alt="Go Green with Plywood"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/10" />
              </div>

              {/* Floating decals */}
              <div className="absolute -top-4 -left-4 hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-black/5">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="absolute -bottom-4 -right-4 hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-black/5">
                <Recycle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
