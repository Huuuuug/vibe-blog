import Link from "next/link";
import { Eyebrow } from "@/components/eyebrow";
import { SectionHeading } from "@/components/page-intro";
import { PostCard } from "@/components/post-card";
import { Surface } from "@/components/surface";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/notion/queries";

export default async function HomePage() {
  const [featuredPosts, allPosts] = await Promise.all([
    getFeaturedPosts(),
    getPublishedPosts(),
  ]);

  const latestPosts = allPosts.slice(0, 3);

  return (
    <div className="grid gap-7">
      <section className="grid gap-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="grid gap-[18px]">
          <Eyebrow>Personal Publishing System</Eyebrow>
          <h1 className="m-0 max-w-full font-[var(--font-heading)] text-[clamp(2.35rem,5.4vw,4.5rem)] leading-[0.98] tracking-[-0.035em] lg:max-w-[12ch]">
            用 Next.js 做前台，用 Notion 处理内容，搭一个长期可维护的个人博客。
          </h1>
          <p className="max-w-[46rem] text-[1rem] leading-[1.8] text-[color:var(--foreground)]/78">
            这套骨架已经把站点布局、文章路由、SEO、Notion 查询层和本地回退数据接好了。你现在就可以先写页面，之后再把真实 Notion 数据库接进来。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-[18px] font-bold text-background" href="/blog">
              浏览文章
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-[18px] font-bold" href="/about">
              了解架构
            </Link>
          </div>
        </div>
        <Surface className="p-5 sm:p-7">
          <p className="text-[0.92rem] text-[var(--muted)]">当前能力</p>
          <ul className="mt-4 pl-[18px] text-[0.96rem] leading-[1.8]">
            <li>App Router 博客结构</li>
            <li>Notion API 服务端接入</li>
            <li>文章列表与详情页</li>
            <li>标签聚合页</li>
            <li>SEO、Sitemap、Robots</li>
            <li>Webhook Revalidate 接口</li>
          </ul>
        </Surface>
      </section>

      <Surface as="section" className="p-5 sm:p-7">
        <SectionHeading eyebrow="Featured Posts" title="推荐文章" />
        <div className="mt-[18px] grid gap-[18px] lg:grid-cols-2">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="featured" />
          ))}
        </div>
      </Surface>

      <Surface as="section" className="p-5 sm:p-7">
        <SectionHeading
          eyebrow="Latest Writing"
          title="最新文章"
          action={
            <Link className="text-[0.92rem] font-bold" href="/blog">
              查看全部
            </Link>
          }
        />
        <div className="mt-[18px] grid gap-[18px]">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Surface>
    </div>
  );
}
