import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion/queries";
import { formatDisplayDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Blog",
  description: "基于 Next.js 与 Notion 的个人博客文章列表。",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const posts = await getPublishedPosts();
  const { category } = await searchParams;
  const selectedCategory = typeof category === "string" ? decodeURIComponent(category) : undefined;
  const categories = [...new Set(posts.map((post) => post.category).filter((value): value is string => Boolean(value)))].sort(
    (a, b) => a.localeCompare(b, "zh-CN"),
  );
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <section className="-mt-3 min-h-[calc(100vh-220px)] px-2 py-6 text-foreground sm:-mt-5 sm:px-4 lg:-mt-[112px] lg:px-0">
      <div className="mx-auto max-w-[720px]">
        <div className="grid gap-4 border-b border-[var(--border)] pb-6">
          <div className="grid gap-3">
            <h1 className="font-[var(--font-heading)] text-[clamp(2.6rem,5vw,4rem)] leading-none tracking-[-0.05em] text-foreground">
              Blog
            </h1>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/42">{filteredPosts.length} posts</p>
          </div>
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={[
                  "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[0.83rem] font-semibold transition-colors duration-150",
                  selectedCategory
                    ? "border-[var(--border)] bg-transparent text-[color:var(--foreground)]/62 hover:border-[var(--border-strong)] hover:text-[color:var(--foreground)]/82"
                    : "border-[var(--border-strong)] bg-[var(--accent-soft)] text-foreground",
                ].join(" ")}
              >
                全部
              </Link>
              {categories.map((item) => {
                const active = item === selectedCategory;

                return (
                  <Link
                    key={item}
                    href={`/blog?category=${encodeURIComponent(item)}`}
                    className={[
                      "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[0.83rem] font-semibold transition-colors duration-150",
                      active
                        ? "border-[var(--border-strong)] bg-[var(--accent-soft)] text-foreground"
                        : "border-[var(--border)] bg-transparent text-[color:var(--foreground)]/62 hover:border-[var(--border-strong)] hover:text-[color:var(--foreground)]/82",
                    ].join(" ")}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="grid gap-0 pt-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border-b border-[var(--border)] py-5 transition-colors duration-150 hover:border-[var(--border-strong)]"
            >
              <div className="grid gap-2.5">
                <div className="grid gap-1.5">
                  <h2 className="text-[1.9rem] font-[var(--font-heading)] leading-[1.08] tracking-[-0.04em] text-foreground transition-colors duration-150 group-hover:text-[var(--accent)]">
                    {post.title}
                  </h2>
                  {post.subtitle ? (
                    <p className="text-[0.98rem] leading-6 text-[color:var(--foreground)]/58 transition-colors duration-150 group-hover:text-[color:var(--foreground)]/72">
                      {post.subtitle}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2 text-[0.92rem] text-[color:var(--foreground)]/54">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[0.92rem] text-[color:var(--foreground)]/40">
                  <span className="text-[0.95rem] leading-none">🕒</span>
                  <span>{formatDisplayDate(post.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredPosts.length === 0 ? (
            <div className="py-10 text-[0.95rem] text-[color:var(--foreground)]/45">
              当前分类下还没有文章。
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

