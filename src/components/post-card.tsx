import Link from "next/link";
import type { PostMeta } from "@/lib/notion/types";
import { formatDisplayDate } from "@/lib/utils/date";

type PostCardProps = {
  post: PostMeta;
  variant?: "default" | "featured";
};

export function PostCard({ post, variant = "default" }: PostCardProps) {
  return (
    <Link className={`post-card ${variant === "featured" ? "featured" : ""}`} href={`/blog/${post.slug}`}>
      <div className="post-card-content">
        <div className="post-meta">
          <span>{formatDisplayDate(post.publishedAt)}</span>
          {post.category ? <span>{post.category}</span> : null}
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-summary">{post.summary}</p>
        <div className="tag-list">
          {post.tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
