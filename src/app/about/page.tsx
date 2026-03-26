import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { Surface } from "@/components/surface";

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
    <Surface as="section" className="grid gap-7 p-5 sm:p-7">
      <PageIntro
        eyebrow="About This Build"
        title="关于这套博客架构"
        description="这个项目采用典型的 Headless CMS 思路：Notion 提供内容录入体验，Next.js 提供前台性能、SEO 和扩展能力。这样既保留了写作效率，也避免把博客绑定在单一平台模板上。"
      />
      <div className="grid gap-[18px] lg:grid-cols-2">
        {points.map((point) => (
          <Surface key={point} as="article" className="p-[22px]">
            <p className="leading-8">{point}</p>
          </Surface>
        ))}
      </div>
    </Surface>
  );
}
