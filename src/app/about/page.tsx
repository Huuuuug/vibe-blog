import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "这个博客脚手架的目标与实现方式。",
};

const points = [
  "内容管理在 Notion，页面渲染在 Next.js。",
  "所有 Notion API 请求都只发生在服务端。",
  "未配置环境变量时自动回退到本地示例数据。",
  "后续可以继续接评论、统计、RSS 和项目页。",
];

export default function AboutPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <span className="eyebrow">About This Build</span>
        <h1 className="page-title">关于这套博客架构</h1>
        <p className="page-copy max-w-3xl">
          这个项目采用典型的 Headless CMS 思路：Notion 提供内容录入体验，Next.js 提供前台性能、SEO 和扩展能力。这样既保留了写作效率，也避免把博客绑定在单一平台模板上。
        </p>
      </div>
      <div className="card-grid">
        {points.map((point) => (
          <article key={point} className="info-card">
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
