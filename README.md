# Vibe Notes

一个基于 `Next.js + Notion` 的个人博客脚手架。

## 本地开发

```bash
npm install
npm run dev
```

默认会使用 `src/lib/notion/mock-data.ts` 中的示例文章。

如果要接入真实 Notion：

1. 复制 `.env.example` 为 `.env.local`
2. 填写 `NOTION_TOKEN`
3. 填写 `NOTION_DATA_SOURCE_ID`
4. 可选填写 `NEXT_PUBLIC_SITE_URL` 和 `REVALIDATE_SECRET`

## 当前已经包含

- 首页、博客列表页、文章详情页、标签页、关于页
- `@notionhq/client` 服务端接入层
- Notion 数据映射与本地回退数据
- `sitemap.ts`、`robots.ts`
- `/api/revalidate` 缓存刷新接口

## 推荐的 Notion 字段

- `Title` `title`
- `SubTitle` `rich_text`
- `Slug` `rich_text`
- `Status` `status`
- `PublishedAt` `date`
- `Summary` `rich_text`
- `Tags` `multi_select`
- `Category` `select`
- `Cover` `files`
- `Featured` `checkbox`
