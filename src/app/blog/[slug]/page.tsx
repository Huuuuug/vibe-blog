import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/eyebrow";
import { NotionRenderer } from "@/components/notion-renderer";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion/queries";
import { notFound } from "next/navigation";
import { Surface } from "@/components/surface";
import { formatDisplayDate } from "@/lib/utils/date";
import { slugifyHeading } from "@/lib/utils/slug";
import type { FallbackContentBlock, NotionBlock } from "@/lib/notion/types";

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

type OutlineItem = {
  id: string;
  label: string;
  depth: 2 | 3;
};

function getOutlineFromFallback(blocks: FallbackContentBlock[] = []): OutlineItem[] {
  return blocks
    .filter((block): block is FallbackContentBlock & { type: "heading_2" | "heading_3" } => {
      return block.type === "heading_2" || block.type === "heading_3";
    })
    .map((block) => ({
      id: slugifyHeading(block.text) || block.id,
      label: block.text,
      depth: block.type === "heading_2" ? 2 : 3,
    }));
}

function getOutlineFromBlocks(blocks: NotionBlock[] = []): OutlineItem[] {
  return blocks
    .filter((block) => block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3")
    .map((block) => ({
      id: slugifyHeading(block.plainText) || block.id,
      label: block.plainText,
      depth: block.type === "heading_3" ? 3 : 2,
    }));
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

  const outline = post.blocks.length > 0 ? getOutlineFromBlocks(post.blocks) : getOutlineFromFallback(post.content);

  return (
    <article className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="grid gap-6">
        <div className="grid gap-4 rounded-[32px] border border-[var(--border)] bg-[var(--card)] px-6 py-7 shadow-[var(--shadow)] backdrop-blur-[10px] sm:px-10 sm:py-9">
          <Link href="/blog">
            <Eyebrow>Back to Blog</Eyebrow>
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--muted)]">
            {post.category ? <span>{post.category}</span> : null}
            <span>{formatDisplayDate(post.publishedAt)}</span>
          </div>
          <div className="grid gap-3 border-b border-[var(--border)] pb-8">
            <h1 className="m-0 max-w-[18ch] font-[var(--font-heading)] text-[clamp(1.9rem,3.8vw,3.2rem)] leading-[1.01] tracking-[-0.04em]">
              {post.title}
            </h1>
            <p className="max-w-[56ch] text-[0.94rem] leading-[1.75] text-[color:var(--foreground)]/72">
              {post.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-[0.78rem] font-semibold text-[var(--accent)]"
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <NotionRenderer blocks={post.blocks} fallbackMarkdown={post.content ?? []} />
      </div>

      <aside className="lg:sticky lg:top-24">
        <Surface as="section" className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-2">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">导读</p>
            <p className="text-[0.86rem] leading-6 text-[color:var(--foreground)]/72">
              参考 mmeme 的编排方式，把标题、摘要、元信息和目录先放在阅读入口，正文区域保持更聚焦的单列宽度。
            </p>
          </div>
          <div className="grid gap-3 border-t border-[var(--border)] pt-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">目录</p>
            {outline.length > 0 ? (
              <nav className="grid gap-2">
                {outline.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-[0.86rem] leading-6 text-[color:var(--foreground)]/72 transition-colors hover:text-[var(--accent)] ${item.depth === 3 ? "pl-4" : "pl-0 font-semibold text-foreground"}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            ) : (
              <p className="text-[0.86rem] leading-6 text-[var(--muted)]">当前文章没有可提取的章节标题。</p>
            )}
          </div>
        </Surface>
      </aside>
    </article>
  );
}
