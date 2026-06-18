import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "../components/Footer";
import { CheckCircle2, Award, Shield, FileCheck, FileText } from "lucide-react";

export default function Accreditation() {
  const [hoveredCert, setHoveredCert] = useState(null);
  const certifications = [
    {
      icon: Award,
      title: "Certificate Of Conformance",
      description: "Forest Wood Industries, Inc.",
      pdfUrl: "/certificates/certificate_of_conformance.webp"
    },
    {
      icon: Shield,
      title: "FSC Certificate",
      description: "Bureau Veritas Certification",
      pdfUrl: "/certificates/bureau_veritas_certificate.webp"
    },
    {
      icon: FileCheck,
      title: "ISO 9001:2015",
      description: "Quality Management System 2015",
      pdfUrl: "/certificates/iso_9001_2015.webp"
    },
    {
      icon: FileCheck,
      title: "ISO 14001:2015",
      description: "Environment Management System 2015",
      pdfUrl: "/certificates/iso_14001_2015.webp"
    },
    {
      icon: FileCheck,
      title: "ISO 45001:2018",
      description: "Health and Safety Management System",
      pdfUrl: "/certificates/iso_45001_2018.webp"
    },
    {
      icon: CheckCircle2,
      title: "ASTM D7032 - 17",
      description: "Manufacturer of Super Quality Plywood Panel Boards, WPC & PVC - 2017",
      pdfUrl: "/certificates/astm_d7032_17.webp"
    },
    {
      icon: CheckCircle2,
      title: "ISO 20819-1:2020",
      description: "Manufacturer of Super Quality Plywood Panel Boards, WPC & PVC - 2020",
      pdfUrl: "/certificates/iso_20819-1_2020.webp"
    },
    {
      icon: CheckCircle2,
      title: "Certificate of Conformity",
      description: "Certificate of Conformity",
      pdfUrl: "/certificates/certificate_of_conformity.webp"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title="Accreditation & Certifications" />

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left lg:text-center max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Certifications
            </h2>
            <p className="text-md lg:text-lg text-gray-600">
              Our manufacturing excellence is backed by nationally recognized standards and certifications. Strict quality controls, advanced testing processes, and compliance with industry benchmarks ensure our plywood consistently delivers durability, safety, and performance across residential, commercial, and industrial applications.
            </p>
          </div>

          {/* Certifications Grid with Image Tooltip on Hover */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCert(index)}
                onMouseLeave={() => setHoveredCert(null)}
              >
                {/* Certificate Card with Image */}
                <div className="cursor-pointer rounded-lg overflow-hidden border-4 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105">
                  {/* Certificate Image */}
                  <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                    <img
                      src={cert.pdfUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback icon (hidden by default) */}
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex-col items-center justify-center p-6 text-center">
                      <div className="mb-4 p-4 rounded-full bg-primary/10">
                        <FileText className="h-12 w-12 text-primary" />
                      </div>
                      <div className="text-xs font-semibold text-gray-700 line-clamp-2">
                        {cert.title}
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="text-center text-white px-4">
                        <p className="text-sm font-semibold">Hover to Enlarge</p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Title Below */}
                  <div className="p-3 bg-white text-center">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>
                </div>

                {/* Beautiful Tooltip with Image Preview */}
                {hoveredCert === index && (
                  <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-primary/20 overflow-hidden w-[80vw] sm:w-[75vw] md:w-[300px] lg:w-[350px]">
                      {/* Tooltip Header */}
                      <div className="bg-gradient-to-r from-primary to-primary/80 px-3 py-3 md:px-6 md:py-4">
                        <h3 className="text-base md:text-xl font-bold text-white text-center drop-shadow-lg">
                          {cert.title}
                        </h3>
                      </div>
                      {/* Image Preview */}
                      <div className="relative bg-gray-50 p-3 md:p-6">
                        <div className="bg-white rounded-lg shadow-inner p-1 md:p-2">
                          <img
                            src={cert.pdfUrl}
                            alt={cert.title}
                            className="w-full h-auto max-h-[700px] object-contain rounded"
                          />
                        </div>
                        {/* View PDF/Certificate Button */}
                        <div className="mt-4 flex justify-center">
                          <a
                            href={cert.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-2 md:px-5 md:py-2 bg-primary text-white font-semibold rounded shadow hover:bg-primary/90 transition-colors duration-200 border border-primary"
                          >
                            View Certificate
                          </a>
                        </div>
                      </div>
                      {/* Tooltip Footer */}
                      <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-3 py-3 md:px-6 md:py-4 text-center border-t border-gray-200">
                        <p className="text-sm text-gray-700 font-medium">
                          {cert.description}
                        </p>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
