import { ChevronRight, BadgeCheck } from "lucide-react";

export function ProcessQuality() {
  const leftSteps = [
    "Careful selection of timber",
    "Peeling",
    "Separation into face & core",
    "Drying",
    "Core composition",
    "Application of adhesive & GLP (Glue Line Protection)",
  ];

  const rightSteps = [
    "Matt ply pressing",
    "Calibration",
    "Face over-laying press",
    "Sanding & trimming",
    "Preservative treatment",
    "Branding & dispatch",
  ];

  return (
    <section id="process-quality" className="relative overflow-hidden py-12 sm:py-16 lg:py-20 ">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="doodle-grid w-full h-full"></div>
        </div>
        <div className="relative grid grid-cols-1 gap-8 lg:gap-12 xl:gap-20 items-start">
          {/* Header - spans both columns */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Process & <span className="text-primary">Quality</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <p className="text-gray-700 leading-relaxed">
                Saburi Ply’s automated manufacturing ensures consistency and excellence at every stage. From log peeling to final branding, each process is monitored with calibrated temperature, pressure, and moisture control. In-house recycling reduces waste, conserving energy and resources.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Quality checks are integrated across stages from veneer thickness to adhesive bonding ensuring every product leaving the factory meets the highest standards of strength, finish, and reliability. Certified by CVI for sustainability and recyclability, Saburi Plywood reflects precision, innovation, and responsibility.
              </p>
            </div>
          </div>

          {/* Left column pointers */}
          <div className="space-y-3">
            {leftSteps.map((step) => (
              <div key={step} className="flex items-center gap-3 px-1 py-2 border-b border-gray-200 last:border-b-0">
                <span className="inline-block w-2.5 h-2.5 bg-primary"></span>
                <span className="text-sm sm:text-base text-gray-800">{step}</span>
              </div>
            ))}
          </div>

          {/* Right column pointers */}
          <div className="space-y-3">
            {rightSteps.map((step) => (
              <div key={step} className="flex items-center gap-3 px-1 py-2 border-b border-gray-200 last:border-b-0">
                <span className="inline-block w-2.5 h-2.5 bg-primary"></span>
                <span className="text-sm sm:text-base text-gray-800">{step}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
