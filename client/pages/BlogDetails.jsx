import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { Footer } from "../components/Footer";
import { Search, Calendar, User } from "lucide-react";

export default function BlogDetails() {
    const { slug } = useParams();
    const [comment, setComment] = useState({ name: "", email: "", website: "", message: "" });

    // Sample blog posts data (same as Blog.jsx for consistency)
    const blogPosts = [
        {
            id: 1,
            slug: "top-7-stylish-panel-door-for-your-home-interiors",
            title: "Top 7 Stylish Panel Door for Your Home Interiors",
            date: "September 11, 2025",
            author: "admin",
            category: "Plywood",
            image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
            content: `
                <p>A panel door is a type of door construction where surface of door is textured created or raised by panels in the central door design. These panel doors for your home interiors can be in number, and shape style. A panel door is made up of 2 to 8 rectangular or square panels or mixture of both. Panel doors are a classic choice and can add character to any room.</p>

                <p>Panel doors have been a staple in home design for centuries, offering both aesthetic appeal and structural integrity. Whether you're renovating your home or building a new one, choosing the right panel door can significantly impact your interior design.</p>

                <h2>1. VICTORIAN-INSPIRED PANEL DOOR</h2>
                <p>Victorian-style panel doors feature intricate designs and ornate details that reflect the elegance of the Victorian era. These doors typically have multiple panels with decorative moldings and can be made from various wood types. They work exceptionally well in traditional and vintage-inspired interiors.</p>

                <h2>2. RUSTIC KNOTTY PINE PANEL DOOR</h2>
                <p>Rustic knotty pine doors bring warmth and natural beauty to any space. The visible knots and grain patterns create a charming, countryside aesthetic. These doors are perfect for cabin-style homes, farmhouses, or any space where you want to add a touch of rustic elegance.</p>

                <h2>3. SHAKER-STYLE PANEL DOOR</h2>
                <p>Shaker-style doors are known for their simplicity and clean lines. With flat panels and minimal ornamentation, these doors embody the "less is more" philosophy. They're versatile enough to work in both modern and traditional settings, making them a popular choice for contemporary homes.</p>

                <h2>4. TWO-PANEL ARCHED DOOR</h2>
                <p>Two-panel arched doors feature elegant curved tops that add architectural interest to any room. The arched design creates a sense of height and grandeur, making them ideal for entryways or rooms with high ceilings. These doors work beautifully in Mediterranean, Spanish, or traditional home styles.</p>

                <h2>5. THREE-PANEL CRAFTSMAN DOOR</h2>
                <p>Craftsman-style three-panel doors showcase the beauty of fine woodworking with their distinctive horizontal and vertical panel arrangements. These doors emphasize quality craftsmanship and natural materials, making them perfect for Arts and Crafts or bungalow-style homes.</p>

                <h2>6. CLASSICAL RAISED PANEL DOOR</h2>
                <p>Classical raised panel doors feature panels that protrude from the door's surface, creating depth and dimension. These doors are timeless and work well in formal settings. The raised panels can be simple or ornate, depending on your preference and the overall design of your home.</p>

                <h2>7. CONTEMPORARY FLAT PANEL DOOR</h2>
                <p>Contemporary flat panel doors offer a sleek, modern look with their smooth, flat surfaces. These doors are perfect for minimalist and modern interiors where clean lines and simplicity are valued. They can be painted in bold colors or finished in natural wood tones.</p>

                <h2>FINAL THOUGHTS</h2>
                <p>Choosing the right panel door for your home involves considering your overall interior design style, the architectural features of your space, and your personal preferences. Each of these seven panel door styles offers unique characteristics that can enhance your home's aesthetic appeal.</p>

                <p>Whether you prefer the ornate details of Victorian-inspired doors or the clean lines of contemporary designs, there's a panel door style that's perfect for your home. Consider factors such as durability, maintenance requirements, and how the door will complement your existing décor when making your final decision.</p>
            `,
        },
        {
            id: 2,
            slug: "top-5-isi-certified-termite-proof-plywood-brands-in-india",
            title: "Top 5 ISI-Certified Termite-Proof Plywood Brands in India",
            date: "August 28, 2025",
            author: "admin",
            category: "Plywood",
            image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80",
            content: `<p>Termites can cause significant damage to wooden structures, making termite-proof plywood essential for long-lasting furniture and interiors. ISI certification ensures quality and reliability. Here are the top 5 ISI-certified termite-proof plywood brands in India.</p>`,
        },
        {
            id: 3,
            slug: "advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india",
            title: "Advantages of Best Boiling Water-Proof (BWP) Plywood Brand in India",
            date: "August 15, 2025",
            author: "admin",
            category: "Plywood",
            image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
            content: `<p>BWP plywood is designed to withstand extreme moisture conditions, making it ideal for areas prone to water exposure. Discover the advantages of choosing the best BWP plywood brand in India for your construction and interior needs.</p>`,
        },
        {
            id: 4,
            slug: "top-7-trends-of-plywood-brand-in-india",
            title: "Top 7 Trends of Plywood Brand in India",
            date: "July 22, 2025",
            author: "admin",
            category: "Interior Designer",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
            content: `<p>The plywood industry in India is evolving with new trends in design, sustainability, and technology. Explore the top 7 trends shaping the future of plywood brands in India and how they're revolutionizing interior design.</p>`,
        },
        {
            id: 5,
            slug: "top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation",
            title: "Top 10 Plywood Manufacturers in India: Leading the Industry with Quality and Innovation",
            date: "June 10, 2025",
            author: "admin",
            category: "Home Furniture",
            image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
            content: `<p>India's plywood industry is home to some of the world's leading manufacturers. These top 10 companies are setting benchmarks in quality, innovation, and sustainability, providing premium products for residential and commercial applications.</p>`,
        },
    ];

    const recentPosts = [
        { slug: "top-7-stylish-panel-door-for-your-home-interiors", title: "Top 7 Stylish Panel Door for Your Home Interiors" },
        { slug: "top-5-isi-certified-termite-proof-plywood-brands-in-india", title: "Top 5 ISI-Certified Termite-Proof Plywood Brands in India" },
        { slug: "advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india", title: "Advantages of Best Boiling Water-Proof (BWP) Plywood Brand in India" },
        { slug: "top-7-trends-of-plywood-brand-in-india", title: "Top 7 Trends of Plywood Brand in India" },
        { slug: "top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation", title: "Top 10 Plywood Manufacturers in India: Leading the Industry with Quality and Innovation" },
    ];

    const categories = [
        { name: "Home Furniture", count: 12 },
        { name: "Interior Designer", count: 8 },
        { name: "Plywood", count: 24 },
        { name: "Real Estate", count: 6 },
    ];

    // Find the current post
    const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        console.log("Comment submitted:", comment);
        // Reset form
        setComment({ name: "", email: "", website: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <PageHeader title="Blog Details" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Post Header */}
                            <div className="p-6 sm:p-8 border-b border-gray-200">
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {post.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Posted on <span className="text-gray-900 font-medium">{post.date}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>by <span className="text-primary font-medium">{post.author}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-64 sm:h-96 object-cover"
                                />
                            </div>

                            {/* Post Content */}
                            <div className="p-6 sm:p-8">
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>p]:mb-6 [&>p]:leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </article>

                        {/* Comment Form */}
                        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Leave a Comment</h3>
                            <p className="text-gray-600 mb-6">Your email address will not be published. Required fields are marked *</p>

                            <form onSubmit={handleCommentSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={comment.name}
                                            onChange={(e) => setComment({ ...comment, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={comment.email}
                                            onChange={(e) => setComment({ ...comment, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            id="website"
                                            value={comment.website}
                                            onChange={(e) => setComment({ ...comment, website: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Comment *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="6"
                                        required
                                        value={comment.message}
                                        onChange={(e) => setComment({ ...comment, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Your comment..."
                                    />
                                </div>

                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="saveInfo"
                                        className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
                                        Save my name, email, and website in this browser for the next time I comment.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Post Comment
                                </button>
                            </form>
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
                                {recentPosts.map((recentPost) => (
                                    <li key={recentPost.slug}>
                                        <Link
                                            to={`/blog/${recentPost.slug}`}
                                            className="text-primary hover:text-primary/80 transition-colors text-sm leading-relaxed block"
                                        >
                                            {recentPost.title}
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