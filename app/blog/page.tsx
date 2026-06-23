import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getBlogIndexMeta } from "@/lib/blog";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";

/**
 * Blog index (P8) — pure SSG listing of the in-app posts (newest first). Replaces the external
 * WordPress /blog listing; meta is preserved from the live page (content/blog/_index.json).
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
    images: [{ url: "/images/saburi.jpg", width: 1200, height: 630, alt: "Saburi Ply" }],
  },
  twitter: {
    card: "summary_large_image",
    title: indexMeta.title,
    description: indexMeta.description,
    images: ["/images/saburi.jpg"],
  },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Saburi Ply Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600">{indexMeta.description}</p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <article key={post.slug} className="group flex flex-col overflow-hidden rounded-xl ring-1 ring-gray-100 bg-white shadow-[0_6px_24px_rgba(2,6,23,0.05)] transition-shadow hover:shadow-[0_12px_32px_rgba(2,6,23,0.10)]">
              <Link href={`/blog/${post.slug}`} className="block">
                {post.image ? (
                  <SmartImage
                    src={post.image}
                    alt={post.title}
                    aspectRatio="16/9"
                    objectFit="cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full"
                    priority={i === 0}
                  />
                ) : (
                  <div className="aspect-[16/9] bg-gray-100" />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                {formatDate(post.date) && (
                  <time dateTime={post.date} className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {formatDate(post.date)}
                  </time>
                )}
                <h2 className="mt-2 text-lg font-semibold leading-snug text-gray-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  aria-label={`Read more: ${post.title}`}
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <JsonLd data={breadcrumbSchema("/blog")} />
    </div>
  );
}
