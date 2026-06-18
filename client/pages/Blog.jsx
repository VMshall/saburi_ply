import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { Footer } from "../components/Footer";
import { Search } from "lucide-react";

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState("");

    // Sample blog posts data
    const blogPosts = [
        {
            id: 1,
            slug: "top-7-stylish-panel-door-for-your-home-interiors",
            title: "Top 7 Stylish Panel Door for Your Home Interiors",
            date: "September 11, 2025",
            author: "admin",
            category: "Plywood",
            image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
            excerpt: "A panel door is a type of door construction where surface of door is textured created or raised by panels in the central door design. These panel doors for your home interiors can be in number, and shape style. A panel door is made up of 2 to 8 rectangular or square panels or mixture [...]",
        },
        {
            id: 2,
            slug: "top-5-isi-certified-termite-proof-plywood-brands-in-india",
            title: "Top 5 ISI-Certified Termite-Proof Plywood Brands in India",
            date: "August 28, 2025",
            author: "admin",
            category: "Plywood",
            image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80",
            excerpt: "Termites can cause significant damage to wooden structures, making termite-proof plywood essential for long-lasting furniture and interiors. ISI certification ensures quality and reliability. Here are the top 5 ISI-certified termite-proof plywood brands in India.",
        },
        {
            id: 3,
            slug: "advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india",
            title: "Advantages of Best Boiling Water-Proof (BWP) Plywood Brand in India",
            date: "August 15, 2025",
            author: "admin",
            category: "Plywood",
            image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
            excerpt: "BWP plywood is designed to withstand extreme moisture conditions, making it ideal for areas prone to water exposure. Discover the advantages of choosing the best BWP plywood brand in India for your construction and interior needs.",
        },
        {
            id: 4,
            slug: "top-7-trends-of-plywood-brand-in-india",
            title: "Top 7 Trends of Plywood Brand in India",
            date: "July 22, 2025",
            author: "admin",
            category: "Interior Designer",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
            excerpt: "The plywood industry in India is evolving with new trends in design, sustainability, and technology. Explore the top 7 trends shaping the future of plywood brands in India and how they're revolutionizing interior design.",
        },
        {
            id: 5,
            slug: "top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation",
            title: "Top 10 Plywood Manufacturers in India: Leading the Industry with Quality and Innovation",
            date: "June 10, 2025",
            author: "admin",
            category: "Home Furniture",
            image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
            excerpt: "India's plywood industry is home to some of the world's leading manufacturers. These top 10 companies are setting benchmarks in quality, innovation, and sustainability, providing premium products for residential and commercial applications.",
        },
    ];

    const recentPosts = [
        { title: "Top 7 Stylish Panel Door for Your Home Interiors", slug: "top-7-stylish-panel-door-for-your-home-interiors" },
        { title: "Top 5 ISI-Certified Termite-Proof Plywood Brands in India", slug: "top-5-isi-certified-termite-proof-plywood-brands-in-india" },
        { title: "Advantages of Best Boiling Water-Proof (BWP) Plywood Brand in India", slug: "advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india" },
        { title: "Top 7 Trends of Plywood Brand in India", slug: "top-7-trends-of-plywood-brand-in-india" },
        { title: "Top 10 Plywood Manufacturers in India: Leading the Industry with Quality and Innovation", slug: "top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation" },
    ];

    const categories = [
        { name: "Home Furniture", count: 12 },
        { name: "Interior Designer", count: 8 },
        { name: "Plywood", count: 24 },
        { name: "Real Estate", count: 6 },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <PageHeader title="Blog" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                {/* Featured Image */}
                                <div className="relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-64 sm:h-80 object-cover"
                                    />
                                    {/* Category Badge */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-primary text-white px-4 py-2 text-sm font-semibold rounded shadow-lg">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="p-6 sm:p-8">
                                    {/* Meta Information */}
                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <span>Posted on </span>
                                        <span className="text-gray-900 font-medium mx-1">{post.date}</span>
                                        <span className="mx-2">by</span>
                                        <span className="text-primary font-medium">{post.author}</span>
                                    </div>

                                    {/* Title */}
                                    <Link to={`/blog/${post.slug}`}>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 hover:text-primary transition-colors cursor-pointer leading-tight">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    {/* Excerpt */}
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        {post.excerpt}
                                    </p>

                                    {/* Read More Button */}
                                    <Link 
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                                    >
                                        READ MORE
                                    </Link>

                                    {/* Filed Under */}
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">Filed under: </span>
                                        <a href="#" className="text-sm text-primary hover:underline font-medium">
                                            {post.category}
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {/* Pagination */}
                        <div className="flex justify-center items-center space-x-2 mt-12">
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                                1
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                3
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Search Widget */}
                        <div className="bg-gray-100 rounded-lg p-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Recent Posts Widget */}
                        <div className="bg-gray-100 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h3>
                            <ul className="space-y-3">
                                {recentPosts.map((post, index) => (
                                    <li key={index}>
                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="text-primary hover:text-primary/80 transition-colors text-sm leading-relaxed block"
                                        >
                                            {post.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recent Comments Widget */}
                        <div className="bg-gray-100 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Comments</h3>
                            <p className="text-gray-600 text-sm">No comments to show.</p>
                        </div>

                        {/* Categories Widget */}
                        <div className="bg-gray-100 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center justify-between group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                                                {category.name}
                                            </span>
                                            <span className="text-gray-500 text-xs">({category.count})</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

