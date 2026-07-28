import { Check, ShieldCheck, BadgeCheck } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { ProofBar } from "@/components/sections/ProofBar";

export function AboutUs() {
  const achievements = [
    {
      label: "Saburi Perennial:",
      desc: "Burma Gurjan hardwood, PF resin, E0 certified. Lifetime money-return warranty.",
    },
    {
      label: "Saburi Club H+:",
      desc: "E0 compliant, antibacterial protection. Lifetime money-back warranty.",
    },
    {
      label: "Saburi Fire Retardant:",
      desc: "IS: 5509 certified. Burning rate exceeds 20 minutes. Flame penetration exceeds 30 minutes. Reduced smoke generation.",
    },
    {
      label: "Flush Door:",
      desc: "100% pinewood core. High dimensional stability.",
    },
    {
      label: "Certifications:",
      desc: "IS: 710, IS: 1659, IS: 2202, IS: 5509. ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, FSC, CARB, IGBC, CE & BIS certified.",
    },
  ];

  const productHighlights = achievements.filter((a) => a.label !== "Certifications:");
  const certItem = achievements.find((a) => a.label === "Certifications:");
  // Reformat the existing certification copy into chips — same words, presented as first-class badges.
  const certChips = certItem
    ? certItem.desc
        .replace(/\bcertified\b/gi, "")
        .replace(/&/g, ",")
        .split(/[,.]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Group the certification chips by type so each cluster can carry a sublabel.
  // Derived from certChips (not re-typed), so the source list stays the single source of truth.
  const certGroups = [
    { label: "Product Standards", items: certChips.filter((c) => /^IS[:\s]/i.test(c)) },
    { label: "Management Systems", items: certChips.filter((c) => /^ISO\b/i.test(c)) },
    {
      label: "Eco & Compliance",
      items: certChips.filter((c) => !/^IS[:\s]/i.test(c) && !/^ISO\b/i.test(c)),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <section id="about" className="bg-[#FAF7F1] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Story + Visual */}
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Narrative */}
          <div>
            <h1 className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-stone-900 sm:text-4xl lg:text-[2.75rem]">
              The Best Plywood Manufacturer and{" "}
              <span className="text-primary">Supplier in India</span>
            </h1>

            <p className="mt-6 border-l-2 border-primary pl-5 text-lg font-medium leading-relaxed text-stone-700 sm:text-xl">
              In 1990, Mr. Gajanand Munka started Saburi Ply in Kolkata with one simple
              belief: that the wood going beneath your floor, behind your ceiling, inside
              your furniture, and across your doors deserved to be made as carefully as
              anything visible.
            </p>

            <div className="mt-6 space-y-5 leading-relaxed text-stone-600">
              <p>
                That belief became the standard Saburi Ply has upheld ever since.
                <br />
                Today, Saburi Ply operates three manufacturing facilities, employs over a
                thousand people, supplies across 427+ districts, and has served more than
                a lakh clients across India.
              </p>

              <p>
                Every product — plywood, blockboard, pre-laminated (Modwud) boards, WPC
                &amp; PVC panels, flush doors, and NRFC eco-panels (Neowud) — is
                manufactured through an automated process with numerically controlled
                temperature, pressure, and adhesive spread. Each product line holds an
                Indian Standard certification. Every product is backed by ISO 9001:2015,
                ISO 14001:2015, ISO 45001:2018, FSC, CARB, IGBC, CE and BIS certification.
              </p>

              <p>
                When you are searching for the{" "}
                <strong className="font-semibold text-stone-900">
                  best plywood manufacturer and supplier in India
                </strong>
                , what you are really searching for is someone who stands behind what they
                make long after the job is done. Saburi Ply has been doing exactly that
                since 1990.
              </p>
            </div>
          </div>

          {/* Visual + Mission */}
          <div className="space-y-6">
            <figure className="relative overflow-hidden rounded-3xl shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/10">
              <div className="relative aspect-[4/3]">
                <SmartImage
                  src="/images/aboutUs/About-Saburi.webp"
                  alt="Saburiply Premium Plywood Stacks"
                  fill
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent" />
                <figcaption className="absolute bottom-5 left-5 text-white">
                  <p className="font-display text-lg font-semibold">
                    Modern Manufacturing Facility
                  </p>
                  <p className="text-sm text-white/80">Kolkata, West Bengal</p>
                </figcaption>
                <div className="absolute right-5 top-5 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-lg ring-1 ring-white/20">
                  <div className="font-display text-2xl font-bold leading-none">35+</div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/90">
                    Years
                  </div>
                </div>
              </div>
            </figure>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="h-5 w-1 rounded-full bg-primary" />
                <h3 className="font-display text-lg font-semibold text-stone-900">
                  Our Mission
                </h3>
              </div>
              <p className="mt-3 leading-relaxed text-stone-600">
                Saburi Ply exists to give every builder, architect, contractor, and family
                in India a material they can rely on completely one that performs where it
                cannot be seen, and lasts longer than expected.
                <br />
                <br />
                Delivering better than the best is not a slogan. It is the only standard we
                know
              </p>
            </div>
          </div>
        </div>

        {/* Proof bar (animated count-up island) */}
        <ProofBar />

        {/* Achievements + Certifications */}
        <div className="mt-14 lg:mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Our Achievements
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {productHighlights.map((item) => (
              <div
                key={item.label}
                className="group flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-6 transition-colors duration-200 hover:border-primary/40"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <Check className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <div>
                  <h3 className="font-semibold text-stone-900">
                    {item.label.replace(/:$/, "")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {certItem && (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-0">
                <div className="flex items-center gap-3 sm:shrink-0 sm:border-r sm:border-stone-200 sm:pr-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-base font-semibold text-stone-900">
                    Certifications
                  </h3>
                </div>

                <div className="flex flex-1 flex-col divide-y divide-stone-200 sm:flex-row sm:divide-x sm:divide-y-0 sm:pl-6">
                  {certGroups.map((group) => (
                    <div
                      key={group.label}
                      className="py-5 first:pt-0 last:pb-0 sm:flex-1 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        {group.label}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((chip) => (
                          <span
                            key={chip}
                            className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-stone-800 transition-colors hover:border-primary/50 hover:text-stone-900"
                          >
                            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.25} />
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
