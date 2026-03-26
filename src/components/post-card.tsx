import Link from "next/link";
import type { PostMeta } from "@/lib/notion/types";
import { formatDisplayDate } from "@/lib/utils/date";

type PostCardProps = {
  post: PostMeta;
  variant?: "default" | "featured";
};

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const featured = variant === "featured";

  return (
    <Link
      className={[
        "block rounded-[22px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] backdrop-blur-[10px] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(31,42,38,0.12)] sm:rounded-[28px] sm:p-6",
        featured ? "min-h-[260px] bg-[linear-gradient(180deg,var(--card-strong),var(--card))]" : "",
      ].join(" ")}
      href={`/blog/${post.slug}`}
    >
      <div className="flex h-full flex-col gap-3.5">
        <div className="flex flex-wrap gap-3 text-[0.86rem] text-[var(--muted)]">
          <span>{formatDisplayDate(post.publishedAt)}</span>
          {post.category ? <span>{post.category}</span> : null}
        </div>
        <h3 className="m-0 font-[var(--font-heading)] text-[1.45rem] leading-[1.12] tracking-[-0.03em]">{post.title}</h3>
        <p className="m-0 text-[0.96rem] leading-7 text-[color:var(--foreground)]/76">{post.summary}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              className="inline-flex min-h-[30px] items-center rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-2.5 text-[0.78rem] font-bold text-[var(--accent)]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
