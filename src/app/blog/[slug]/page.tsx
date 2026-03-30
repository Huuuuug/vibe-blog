import type { Metadata } from "next";
import Link from "next/link";
import { NotionRenderer } from "@/components/features/blog";
import { BackToTopButton } from "@/components/layout";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion/queries";
import { notFound } from "next/navigation";
import { Surface } from "@/components/ui";
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

function FloatingOutline({ outline }: { outline: OutlineItem[] }) {
  if (outline.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-[20px] top-[168px] z-30 hidden h-[min(72vh,680px)] w-[88px] lg:block">
      <div className="group/outline pointer-events-auto relative h-full w-full">
        <Surface
          as="section"
          className="absolute left-0 top-0 h-full w-[300px] overflow-y-auto p-3 opacity-0 -translate-x-4 transition duration-250 ease-out pointer-events-none group-hover/outline:pointer-events-auto group-hover/outline:translate-x-0 group-hover/outline:opacity-100 group-focus-within/outline:pointer-events-auto group-focus-within/outline:translate-x-0 group-focus-within/outline:opacity-100"
        >
          <nav className="grid gap-1.5">
            {outline.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={[
                  "rounded-[12px] px-3 py-2 text-[0.82rem] leading-5 text-[color:var(--foreground)]/70 transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
                  item.depth === 3 ? "ml-3 text-[color:var(--foreground)]/58" : "font-semibold text-foreground",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Surface>
      </div>
    </div>
  );
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
    <article className="relative -mt-3 mx-auto max-w-[920px] md:-mt-5 lg:-mt-[112px]">
      <FloatingOutline outline={outline} />     <BackToTopButton />

      <div className="grid gap-6 lg:-translate-x-[44px]">
        <div className="mx-auto grid w-full max-w-[760px] gap-6 rounded-[32px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--card-strong),var(--card))] px-6 py-7 shadow-[var(--shadow)] backdrop-blur-[10px] sm:px-10 sm:py-10">
          <div className="grid gap-3 border-b border-[var(--border)] pb-6">
            <h1 className="m-0 max-w-[18ch] font-[var(--font-heading)] text-[clamp(2.1rem,4vw,3.45rem)] leading-[0.98] tracking-[-0.045em]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              <span>{formatDisplayDate(post.publishedAt)}</span>
              {post.category ? (
                <>
                  <span className="text-[color:var(--foreground)]/22">/</span>
                  <span>{post.category}</span>
                </>
              ) : null}
            </div>
            <p className="max-w-[54ch] text-[1rem] leading-[1.82] text-[color:var(--foreground)]/72">
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

        <div className="mx-auto flex w-full max-w-[760px] justify-end">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-[var(--border-strong)] px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]/72 transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </article>
  );
}


