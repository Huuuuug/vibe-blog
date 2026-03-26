export const siteConfig = {
  name: "Vibe Notes",
  author: "Your Name",
  description: "一个基于 Next.js 与 Notion 的个人博客脚手架。",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
