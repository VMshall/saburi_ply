import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPost } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, blogBreadcrumbSchema } from "@/lib/jsonld";

/**
 * In-app blog post (P8). Pure SSG over the scraped content/blog/<slug>.mdx files — WordPress is
 * retired. Body is cleaned article HTML rendered in a Tailwind `prose` container; metadata + JSON-LD
 * mirror what the live WordPress/Yoast page served (canonical is the slash-less in-app form).
 */
export const dynamic = "force-static";
export const dynamicParams = false; // unknown slugs → 404 (no on-demand rendering)

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const images = post.image ? [post.image] : [];
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "Saburi Ply",
      title: post.metaTitle,
      description: post.description,
      url,
      publishedTime: post.date || undefined,
      modifiedTime: post.modified || undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      site: "@saburiply",
      title: post.metaTitle,
      description: post.description,
      images,
    },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const dateLabel = formatDate(post.date);

  return (
    <div className="min-h-screen bg-background">
      {/* LCP featured image preload — same direct-image pattern as the other templates (§6/P6). */}
      {post.image && <link rel="preload" as="image" href={post.image} fetchPriority="high" />}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <span>{post.author}</span>
          {dateLabel && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{dateLabel}</time>
            </>
          )}
        </div>

        {post.image &&
          (post.imageWidth && post.imageHeight ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.title}
              width={post.imageWidth}
              height={post.imageHeight}
              loading="eager"
              fetchPriority="high"
              className="mt-8 w-full h-auto rounded-xl ring-1 ring-gray-100"
            />
          ) : (
            <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-gray-100 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} loading="eager" className="w-full h-full object-cover" />
            </div>
          ))}

        <div
          className="prose prose-lg max-w-none mt-8 prose-headings:text-gray-900 prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="mt-12 border-t border-gray-200 pt-6">
          <Link href="/blog" className="inline-flex items-center font-medium text-primary hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </article>

      <JsonLd data={[blogBreadcrumbSchema(post.title, post.slug), articleSchema(post)]} />
    </div>
  );
}
