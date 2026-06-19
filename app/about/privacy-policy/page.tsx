import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { buildPageMetadata } from "@/lib/seo";
import { Shield, Lock, Eye, Database, UserCheck, FileText, Info, Share2, Cookie, Globe, Clock, Link as LinkIcon, Baby, RefreshCw } from "lucide-react";

export const dynamic = "force-static";
export const metadata: Metadata = buildPageMetadata({
  title: "Read our Privacy Policy Page | Saburi Ply",
  description: "Read Saburi Ply’s privacy policy to understand how personal information is collected, used, and protected while ensuring data security and user confidentiality.",
  keywords: "saburi ply privacy policy, data protection, user privacy, personal information protection",
  canonical: "/about/privacy-policy",
});

type PolicySection = {
  icon: typeof Info;
  title: string;
  intro?: string;
  content?: string[];
  note?: string;
  hasSubsections?: boolean;
};

export default function PolicyPage() {
  const sections: PolicySection[] = [
    {
      icon: Info,
      title: "1. Who We Are",
      content: [
        "Saburi Plywood is a business engaged in manufacturing and distribution of plywood, blockboards, WPC smart panels, etc., under the brand \"Saburi\". We operate the Website to provide product information, support, dealer-locator services, digital marketing, and customer engagement."
      ]
    },
    {
      icon: Database,
      title: "2. What Information We Collect",
      hasSubsections: true
    },
    {
      icon: Eye,
      title: "3. How We Use Your Information",
      intro: "We use the information we collect for purposes including, but not limited to:",
      content: [
        "Responding to your enquiries, requests or support needs",
        "Sending you product information, newsletters, marketing communications (with your consent where required)",
        "Customising and improving the Website, its content and its functionality",
        "Analysing Website usage, trends, performance metrics",
        "Managing dealer/distributor relationships",
        "Ensuring compliance with legal and regulatory obligations"
      ]
    },
    {
      icon: Share2,
      title: "4. How We May Share or Disclose Your Information",
      intro: "We will not sell your personal information to third parties. We may disclose your information:",
      content: [
        "To our service providers, contractors or business partners (for example, IT hosting, email services, marketing agencies) who help us run the Website or our operations we require such partners to adhere to equivalent data protection obligations",
        "In connection with a merger, acquisition, sale of business or transfer of assets in which case any new owner will be bound by this Privacy Policy",
        "When required by law, regulation, court order or governmental request",
        "To protect the rights, property or safety of Saburi Plywood, our users or others"
      ]
    },
    {
      icon: Cookie,
      title: "5. Cookies, Tracking & Similar Technologies",
      content: [
        "We use cookies, web beacons, log files, and similar technologies to collect information automatically. Cookies help with login status, preferences, website navigation and analytics.",
        "You may set your browser to refuse cookies or notify you when cookies are offered, but please note: certain features of the Website may not function properly if cookies are disabled."
      ]
    },
    {
      icon: Lock,
      title: "6. Data Security",
      content: [
        "We take reasonable steps to protect the personal information you submit via the Website from loss, misuse, unauthorised access, alteration or destruction.",
        "However, no internet transmission or electronic storage can be guaranteed 100% secure. You use the Website at your own risk."
      ]
    },
    {
      icon: Globe,
      title: "7. International Transfers",
      content: [
        "If you are accessing the Website from outside India, your data may be transferred to and processed in India or other countries where our servers or service providers are located.",
        "By using the Website, you consent to such transfers."
      ]
    },
    {
      icon: Clock,
      title: "8. Retention of Your Information",
      content: [
        "We will retain your personal information for as long as necessary to fulfil the purposes outlined in this policy (entitlements, operational support, legal compliance) and for a reasonable period thereafter unless a longer retention is required or permitted by law."
      ]
    },
    {
      icon: UserCheck,
      title: "9. Your Rights & Choices",
      intro: "Depending on applicable laws, you may have rights such as:",
      content: [
        "Access your personal information we hold",
        "Request correction or deletion of your information",
        "Withdraw consent where relevant",
        "Request portability or restrict processing"
      ],
      note: "To exercise any of these rights, please contact us at the details below. We may verify your identity before responding."
    },
    {
      icon: LinkIcon,
      title: "10. Links to Other Websites",
      content: [
        "Our Website may contain links to third-party websites. We are not responsible for their privacy practices.",
        "We encourage you to read their privacy policies."
      ]
    },
    {
      icon: Baby,
      title: "11. Children's Privacy",
      content: [
        "Our Website is not intended for children under the age of 16 (or the minimum age required by law in your jurisdiction).",
        "We do not knowingly collect personal information from children under that age.",
        "If we become aware that we have collected such information, we will delete it."
      ]
    },
    {
      icon: RefreshCw,
      title: "12. Changes to this Privacy Policy",
      content: [
        "We may update this policy occasionally to reflect changes in our practices or legal requirements.",
        "We will post the updated policy on the Website with the 'Last Updated' date.",
        "Your continued use of the Website after such changes constitutes your acceptance of the revised policy."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/about/privacy-policy"]} />

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-left lg:text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Privacy Matters to Us
              </h2>
              {/* <p className="text-lg text-gray-600">
                At Saburi Ply, we are committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how we collect, use, and
                safeguard your data when you interact with our website and services.
              </p> */}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12">
              <p className="text-gray-700">
                <strong>Last Updated:</strong> December 8, 2025
              </p>
              <p className="text-gray-600 mt-2">
                Welcome to <a href="http://www.saburiply.com" target="_blank" className="text-primary hover:underline" rel="noopener noreferrer">www.saburiply.com</a> (hereinafter “the Website”, “we”, “us”, “our”). At Saburi Plywood, protecting your personal information is a priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Website or interact with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-6">
                    {/* <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div> */}
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{section.title}</h3>
                  </div>

                  <div className="ml-0">
                    {section.intro && (
                      <p className="text-gray-700 mb-4">{section.intro}</p>
                    )}

                    {section.hasSubsections ? (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">a) Passive / Automatically Collected Information</h4>
                          <p className="text-gray-700 mb-2">When you visit the Website, we may collect certain information automatically:</p>
                          <ul className="space-y-2 mb-3">
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Your IP address</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Browser type and version</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Pages you visited on the Website</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Date and time of your visit</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Referring URL</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Device type and operating system</p>
                            </li>
                          </ul>
                          <p className="text-gray-600 italic text-sm mt-2">This helps us understand Website usage trends and improve our service.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">b) Information You Provide Actively</h4>
                          <p className="text-gray-700 mb-2">You may provide us with information when you:</p>
                          <ul className="space-y-2 mb-3">
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Fill out contact / enquiry forms</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Request product brochures or join our mailing list</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Register as a dealer or distributor</p>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">Submit feedback or support requests</p>
                            </li>
                          </ul>
                          <p className="text-gray-600 italic text-sm mt-2">Such information may include your name, company name (if applicable), email address, phone number, postal address, region, job role, and enquiry details.</p>
                        </div>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {section.content && section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="bg-primary rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700">{item}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.note && (
                      <p className="text-gray-600 italic text-sm mt-4">{section.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact for Privacy Concerns */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              If you have questions, concerns or requests about this Privacy Policy or our data practices, please contact:
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Saburi Plywood</strong>
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:info@saburiply.com" className="text-primary hover:underline">info@saburiply.com</a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> <a href="tel:1800313666000" className="text-primary hover:underline">1800 313 666 000</a>
                </p>
                <p className="text-gray-700">
                  <strong>Website:</strong> <a href="http://www.saburiply.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.saburiply.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Important Notice
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            By using our Website and services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            If you do not agree with any part of this policy, please discontinue use of the Website immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
