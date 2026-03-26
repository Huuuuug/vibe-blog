import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PostCard } from "@/components/post-card";
import { Surface } from "@/components/surface";
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
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);

  return (
    <Surface as="section" className="grid gap-7 p-5 sm:p-7">
      <PageIntro
        eyebrow="Tag"
        title={`#${decodedTag}`}
        description="按标签聚合文章，便于后续扩展专题页或系列内容。"
      />
      <div className="grid gap-[18px]">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Surface>
  );
}
