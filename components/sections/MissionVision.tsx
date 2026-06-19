import { CheckCircle } from "lucide-react";

type MissionVisionProps = {
  title?: string;
  description?: string;
  bullets?: string[];
  imageSrc?: string;
  imageAlt?: string;
};

export function Mission({
  title = "Our Mission",
  description =
  "Saburi Plywood aims to strengthen its leadership in India’s plywood industry by delivering uncompromised quality, sustainable practices, and long-term trust. Our mission is to create healthier homes and workspaces through continuous improvement and responsible craftsmanship.",
  bullets = [
    "Premium quality as standard",
    "Trust built through consistency",
    "Sustainable, responsible manufacturing",
  ],
  imageSrc =
  "/images/Our-Mission.webp",
  imageAlt = "Precision manufacturing process",
}: MissionVisionProps) {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-3">
              Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">{title}</h2>
            <p className="text-gray-700">{description}</p>
            <ul className="mt-4 space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg max-w-lg">
            <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Vision({
  title = "Our Vision",
  description =
  "Saburi Plywood envisions a future driven by innovation, reliability, and value creation for every stakeholder. We strive to enhance product performance through technology, thoughtful design, and ongoing improvements that shape modern, sustainable architectural spaces across India.",
  bullets = [
    "Innovation for better products",
    "Value-addition for stakeholders",
    "Continuous improvement always",
  ],
  imageSrc =
  "/images/Our-Vission.webp",
  imageAlt = "Stacked wood inventory representing future vision",
}: MissionVisionProps) {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div className="relative rounded-2xl overflow-hidden shadow-lg max-w-lg">
            <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-3">
              Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">{title}</h2>
            <p className="text-gray-700">{description}</p>
            <ul className="mt-4 space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
