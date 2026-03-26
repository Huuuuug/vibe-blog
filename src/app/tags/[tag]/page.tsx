import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getPostsByTag, getPublishedPosts } from "@/lib/notion/queries";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `标签: ${tag}`,
    description: `所有带有 ${tag} 标签的文章。`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPostsByTag(decodeURIComponent(tag));

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <span className="eyebrow">Tag</span>
        <h1 className="page-title">#{decodeURIComponent(tag)}</h1>
        <p className="page-copy">按标签聚合文章，便于后续扩展专题页或系列内容。</p>
      </div>
      <div className="grid gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
