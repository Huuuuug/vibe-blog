import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/notion/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "基于 Next.js 与 Notion 的个人博客文章列表。",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <span className="eyebrow">Archive</span>
        <h1 className="page-title">文章列表</h1>
        <p className="page-copy">
          所有文章都通过服务端统一从 Notion 拉取。当前如果没有配置环境变量，会回退到本地示例内容，方便先开发页面。
        </p>
      </div>
      <div className="grid gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
