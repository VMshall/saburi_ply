import { Factory, Users, Globe, CheckCircle, UserCheck } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

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
      desc: "IS: 5509 certified. Burning rate exceeds 20 minutes. Flame penetration exceeds 30 minutes. 30% less smoke.",
    },
    {
      label: "Flush Door:",
      desc: "100% pinewood core. High dimensional stability.",
    },
    {
      label: "Certifications:",
      desc: "IS: 710, IS: 1659, IS: 2202, IS: 5509. ISO 9001:2015 & BIS certified.",
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-left">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                The Best Plywood Manufacturer and <span className="text-primary">Supplier in India</span>
              </h1>
              {/* <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black">
                About Saburiply
              </h2> */}
              <p className="text-gray-700 leading-relaxed font-medium">
                In 1990, Mr. Gajanand Munka started Saburi Ply in Kolkata with one simple belief: that the wood going beneath your floor, behind your ceiling,
                inside your furniture, and across your doors deserved to be made as carefully as anything visible.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                That belief became the standard Saburi Ply has upheld ever since.<br />
                Today, Saburi Ply operates three manufacturing facilities, employs over a thousand people, supplies across 427+ districts, and has served more
                than a lakh clients across India.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Every product, plywood, blockboard, flush doors, fire retardant panels, shuttering ply, flexi plywood, WPC panels, marine grade sheets is
                manufactured through an automated process with numerically controlled temperature, pressure, and adhesive spread. Each product line
                holds an Indian Standard certification. Every product is backed by ISO 9001:2015 & BIS certified.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you are searching for the <strong>best plywood manufacturer and supplier in India</strong>, what you are really searching for is someone who stands
                behind what they make long after the job is done. Saburi Ply has been doing exactly that since 1990.
              </p>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">
                Our Achievements
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>{achievement.label}</strong> {achievement.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Stats & Visual */}
          <div className="space-y-8">
            {/* Manufacturing Facility Image */}
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden">
                <SmartImage
                  src="/images/aboutUs/About-Saburi.webp"
                  alt="Saburiply Premium Plywood Stacks"
                  fill
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className={cn("h-full w-full")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-medium">
                    Modern Manufacturing Facility
                  </p>
                  <p className="text-sm opacity-90">Kolkata, West Bengal</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-2 bg-primary text-white rounded-lg p-[10px] shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">35+</div>
                  <div className="text-sm">Years</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <Factory className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-black">3</div>
                <div className="text-sm text-gray-600">Manufacturing Units</div>
              </div>

              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-black">1000+</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>

              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-black">427+</div>
                <div className="text-sm text-gray-600">Districts Served</div>
              </div>
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-black">1 Lakh+</div>
                <div className="text-sm text-gray-600">Client Served</div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-3">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Saburi Ply exists to give every builder, architect, contractor, and
                family in India a material they can rely on completely one
                that performs where it cannot be seen, and lasts longer than
                expected.<br /><br />
                Delivering better than the best is not a slogan. It is the only
                standard we know
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
