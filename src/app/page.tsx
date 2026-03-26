import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/notion/queries";

export default async function HomePage() {
  const [featuredPosts, allPosts] = await Promise.all([
    getFeaturedPosts(),
    getPublishedPosts(),
  ]);

  const latestPosts = allPosts.slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="hero-grid">
        <div className="space-y-6">
          <span className="eyebrow">Personal Publishing System</span>
          <h1 className="hero-title">
            用 Next.js 做前台，用 Notion 处理内容，搭一个长期可维护的个人博客。
          </h1>
          <p className="hero-copy">
            这套骨架已经把站点布局、文章路由、SEO、Notion 查询层和本地回退数据接好了。你现在就可以先写页面，之后再把真实 Notion 数据库接进来。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="button-primary" href="/blog">
              浏览文章
            </Link>
            <Link className="button-secondary" href="/about">
              了解架构
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">当前能力</p>
          <ul className="panel-list">
            <li>App Router 博客结构</li>
            <li>Notion API 服务端接入</li>
            <li>文章列表与详情页</li>
            <li>标签聚合页</li>
            <li>SEO、Sitemap、Robots</li>
            <li>Webhook Revalidate 接口</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Posts</p>
            <h2 className="section-title">推荐文章</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="featured" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest Writing</p>
            <h2 className="section-title">最新文章</h2>
          </div>
          <Link className="text-sm font-semibold text-stone-700" href="/blog">
            查看全部
          </Link>
        </div>
        <div className="grid gap-5">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
