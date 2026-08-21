import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getAllPostCards, getBlogIndexMeta, getCategoryCounts } from "@/lib/blog";
import { PageHeader } from "@/components/PageHeader";
import { STATIC_BANNERS } from "@/data/banners";
import { BlogIndex } from "@/components/islands/BlogIndex";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";

/**
 * Blog index (P8) — pure SSG listing of the in-app posts (newest first). Replaces the external
 * WordPress /blog listing; meta is preserved from the live page (content/blog/_index.json).
 *
 * Server shell only: it owns metadata, the PageHeader banner and the H1, and hands the listing to
 * the BlogIndex island (category filter + search). Cards are passed as BlogCardPost — the article
 * HTML never crosses the client boundary.
 */
export const dynamic = "force-static";

const indexMeta = getBlogIndexMeta();

export const metadata: Metadata = {
  title: indexMeta.title,
  description: indexMeta.description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    siteName: "Saburi Ply",
    title: indexMeta.title,
    description: indexMeta.description,
    url: "/blog",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Saburi Ply" }],
  },
  twitter: {
    card: "summary_large_image",
    title: indexMeta.title,
    description: indexMeta.description,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostCards();
  const categories = getCategoryCounts();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader bannerImage={STATIC_BANNERS["/blog"]} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="max-w-3xl mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Saburi Ply Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600">{indexMeta.description}</p>
        </header>

        <BlogIndex posts={posts} categories={categories} />
      </section>

      <JsonLd data={breadcrumbSchema("/blog")} />
    </div>
  );
}
