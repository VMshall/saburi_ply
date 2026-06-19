import { Factory, Users, Globe, CheckCircle, UserCheck } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";

export function NewAboutUs() {
    const achievements = [
        "Two decades of excellence",
        "100% quality-checked products",
        "PAN-India dealer network",
        "Sustainable manufacturing process",
        "Lifetime warranty assurance",
        "Trusted by architects nationwide",
    ];

    return (
        <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 lg:space-y-8 text-left">
                        <div className="space-y-3 lg:space-y-4">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                                About <span className="text-primary">Saburi Ply</span>
                            </h1>
                            {/* <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black">
                                About <span className="text-primary">Saburi Ply</span>
                            </h1> */}
                            <p className="text-gray-700 leading-relaxed font-medium">
                                Saburi Ply is a trusted name
                                known for superior quality, innovation, and
                                sustainable craftsmanship.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-gray-700 leading-relaxed">
                                Founded over three decades ago by <strong>Mr. Gajanand Munka</strong>, has started this business on 1990, Saburi Plywood blends modern technology with traditional integrity to deliver versatile plywood, blockboard, flush doors, and panel products.
                            </p>

                            <p className="text-gray-700 leading-relaxed">
                                Our products are engineered for durability, strength, and environmental responsibility creating healthier homes and workspaces while upholding our legacy of trust and excellence.
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
                                        <span className="text-gray-700">{achievement}</span>
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
                                    className="h-full w-full"
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
                                <div className="text-2xl font-bold text-black">350+</div>
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
                                Delivering better than the best by combining <strong>quality, trust, and sustainability</strong> to build healthier, durable, and eco-friendly spaces for future generations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
