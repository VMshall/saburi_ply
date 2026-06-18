import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { Layers, Hammer, Ruler, ArrowLeft, ArrowRight, ArrowRight as Arrow } from "lucide-react";

function ReadMoreBlock({ paragraphs, limit = 320 }) {
  const [expanded, setExpanded] = useState(false);
  const full = paragraphs.join(" ");
  const short = full.length > limit ? full.slice(0, limit) + "..." : full;
  return (
    <div className="space-y-3">
      {expanded ? (
        paragraphs.map((p, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
        ))
      ) : (
        <p className="text-gray-700 leading-relaxed">{short}</p>
      )}
      {full.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function BlockBoard() {
  const images = [
    {
      id: 1,
      src: "/placeholder.svg",
      alt: "Saburi Gold Block Board",
    },
  ];
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const intro = [
    "Only selected species of timber are used, and prophylactic treatment is applied by impregnating with a concentrated preservative solution of insecticide and fungicide for long‑lasting protection.",
    "Saburi Gold 710 Block Board offers high dimensional stability, excellent screw holding capacity, and does not expand, contract or warp like solid wood. Suitable for both internal and external areas.",
  ];

  const features = [
    "100% Pinewood core",
    "Kiln seasoned to less than 8–10% moisture content",
    "High dimensional stability and mechanical properties",
    "Excellent screw and nail holding capacity",
    "Does not expand, contract or warp like solid wood",
    "Calibrated and quality checked",
  ];

  const usage = [
    "Cabinets, almirahs and other furniture",
    "Doors, partitions, shelves and interior applications",
    "Roofing, ceiling and exterior applications",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title="Block Board" />


      <section className="relative py-10 sm:py-14 lg:py-18">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="doodle-grid w-full h-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">BLOCK BOARD</h1>
            <p className="text-gray-700 mt-2">BLOCK BOARD IS: 1659</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: content */}
            <div className="space-y-8">
              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                  <Layers className="mx-auto h-6 w-6 text-primary" />
                  <div className="text-xs text-gray-700 mt-1">Selected Timber</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                  <Hammer className="mx-auto h-6 w-6 text-primary" />
                  <div className="text-xs text-gray-700 mt-1">Strong & Stable</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                  <Ruler className="mx-auto h-6 w-6 text-primary" />
                  <div className="text-xs text-gray-700 mt-1">Calibrated</div>
                </div>
              </div>

              {/* Description with Read More */}
              <ReadMoreBlock paragraphs={intro} />

              <div>
                <h2 className="text-lg font-semibold text-primary uppercase">Core</h2>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Arrow className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-gray-800">100% Pinewood</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-primary uppercase">Benefits</h2>
                <ul className="mt-3 space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Arrow className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-gray-800">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-primary uppercase">Usage</h2>
                <ul className="mt-3 space-y-2">
                  {usage.map((u) => (
                    <li key={u} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Arrow className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-gray-800">{u}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-2">*T&C apply</p>
              </div>
            </div>

            {/* Right: image (sticky) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-24 self-start">
              <div className="relative rounded-md overflow-hidden">
                <div className="h-[60vh] sm:h-[65vh] lg:h-[70vh] bg-gray-50 overflow-hidden rounded-md">
                  <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-black shadow flex items-center justify-center"
                      aria-label="Previous image"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIndex((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-black shadow flex items-center justify-center"
                      aria-label="Next image"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
