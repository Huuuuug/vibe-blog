import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotionRenderer } from "@/components/notion-renderer";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion/queries";
import { formatDisplayDate } from "@/lib/utils/date";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-10">
      <header className="space-y-5 border-b border-stone-200 pb-8">
        <Link className="eyebrow" href="/blog">
          Back to Blog
        </Link>
        <div className="space-y-4">
          <h1 className="page-title max-w-3xl">{post.title}</h1>
          <p className="page-copy max-w-2xl">{post.summary}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-stone-600">
          <span>{formatDisplayDate(post.publishedAt)}</span>
          {post.category ? <span>{post.category}</span> : null}
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>
      <NotionRenderer blocks={post.blocks} fallbackMarkdown={post.content ?? []} />
    </article>
  );
}
