import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion/queries";
import { formatDisplayDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Blog",
  description: "基于 Next.js 与 Notion 的个人博客文章列表。",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="min-h-[calc(100vh-220px)] px-2 py-6 text-[#f3f4f7] sm:px-4 lg:px-0">
      <div className="mx-auto max-w-[720px]">
        <div className="grid gap-3 border-b border-white/10 pb-6">
          <h1 className="font-[var(--font-heading)] text-[clamp(2.6rem,5vw,4rem)] leading-none tracking-[-0.05em] text-white">
            Blog
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/45">{posts.length} posts</p>
        </div>

        <div className="grid gap-0 pt-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border-b border-white/8 py-5 transition-colors duration-150 hover:border-white/18"
            >
              <div className="grid gap-2">
                <h2 className="text-[1.9rem] font-[var(--font-heading)] leading-[1.08] tracking-[-0.04em] text-white transition-colors duration-150 group-hover:text-white/80">
                  {post.title}
                </h2>
                <div className="flex flex-wrap gap-2 text-[0.92rem] text-white/52">
                  {post.category ? <span className="font-medium text-white/68">{post.category}</span> : null}
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[0.92rem] text-white/38">
                  <span className="text-[1rem] leading-none">◌</span>
                  <span>{formatDisplayDate(post.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
