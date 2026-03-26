# Next.js + Notion 个人博客架构设计

## 1. 目标

使用 `Next.js` 作为前端与服务端渲染框架，使用 `Notion Database / Data Source` 作为内容管理后台，实现一个低维护成本、支持 SEO、可扩展的个人博客。

适用场景：

- 个人博客
- 技术文章发布
- 项目展示
- 支持草稿与发布流程

## 2. 技术选型

- 前端框架：`Next.js 15`（App Router）
- 语言：`TypeScript`
- 样式：`Tailwind CSS`
- 内容管理：`Notion Database + Data Source`
- 内容解析：`@notionhq/client` + `react-notion-x` 或自定义 Block Renderer
- 部署：`Vercel`
- 缓存：`Next.js Data Cache` + `revalidateTag`
- 评论系统：`Giscus`（可选）
- 分析统计：`Plausible` / `Umami` / `Google Analytics`（可选）

## 3. 总体架构

```text
Notion Database / Data Source
    |
    | Notion API
    v
Next.js Server Layer
    |- lib/notion/client.ts
    |- lib/notion/queries.ts
    |- lib/notion/mapper.ts
    |
    v
App Router Pages
    |- /                首页
    |- /blog            文章列表
    |- /blog/[slug]     文章详情
    |- /tags/[tag]      标签页
    |- /about           关于页
    |
    v
UI Components + SEO + Cache
```

核心原则：

- `Notion` 只负责内容录入和编辑
- `Next.js` 负责渲染、缓存、SEO、路由和扩展能力
- 所有对 `Notion API` 的调用都收敛在服务端，避免泄露密钥

## 4. 推荐目录结构

```text
src/
  app/
    page.tsx
    about/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    tags/[tag]/page.tsx
    sitemap.ts
    robots.ts
    api/
      revalidate/route.ts
  components/
    site-header.tsx
    site-footer.tsx
    post-card.tsx
    notion-renderer.tsx
    prose.tsx
  lib/
    notion/
      client.ts
      queries.ts
      mapper.ts
      types.ts
    seo/
      metadata.ts
    utils/
      date.ts
      slug.ts
  styles/
    globals.css
public/
```

## 5. Notion 数据库设计

建议使用一个 `Posts` 数据库，至少包含以下字段：

| 字段名 | 类型 | 说明 |
|---|---|---|
| `Title` | Title | 文章标题 |
| `Slug` | Rich text / Formula | URL 唯一路径，如 `my-first-post` |
| `Status` | Select | `Draft` / `Published` |
| `PublishedAt` | Date | 发布时间 |
| `Summary` | Rich text | 列表摘要 |
| `Tags` | Multi-select | 标签 |
| `Category` | Select | 分类 |
| `Cover` | Files & media / URL | 封面图 |
| `Featured` | Checkbox | 是否推荐 |
| `CanonicalURL` | URL | 可选，SEO 规范链接 |

约束建议：

- 只有 `Status = Published` 的文章可对外展示
- `Slug` 必须唯一
- `PublishedAt` 用于排序
- 封面图尽量使用稳定的外链或 Notion 文件对象

## 6. 数据流设计

### 6.1 文章列表页

`/blog`

流程：

1. `Next.js Server Component` 调用 `getPublishedPosts()`
2. 服务端向 `Notion Data Source` 查询已发布文章
3. 将 Notion 原始结构映射成站点内部 `PostMeta`
4. 返回列表页渲染

### 6.2 文章详情页

`/blog/[slug]`

流程：

1. 根据 `slug` 查询数据库中的目标页面
2. 获取页面元数据
3. 拉取页面 block 内容
4. 将 block 渲染成 HTML/React 组件
5. 生成页面 metadata、Open Graph、结构化数据

### 6.3 缓存刷新

两种模式都可以支持：

- 定时增量刷新：`revalidate = 300`
- 主动刷新：Notion 更新后手动调用 `/api/revalidate`

推荐方案：

- 默认使用 `revalidate = 300`
- 后续再加 `revalidateTag('posts')` 精细控制

## 7. 类型设计

```ts
export type PostMeta = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string | null;
  tags: string[];
  category: string | null;
  cover: string | null;
  featured: boolean;
};

export type PostDetail = PostMeta & {
  blocks: unknown[];
};
```

设计原则：

- UI 层不要直接依赖 Notion API 的原始返回结构
- 中间增加 `mapper` 层，统一做字段映射和容错

## 8. 服务端模块拆分

### `lib/notion/client.ts`

职责：

- 初始化 `@notionhq/client`
- 读取环境变量

### `lib/notion/queries.ts`

职责：

- 查询文章列表
- 按 slug 查询文章
- 获取页面 blocks

### `lib/notion/mapper.ts`

职责：

- 将 Notion Page 转换为 `PostMeta`
- 处理空值、默认值、日期格式、封面字段兼容

### `components/notion-renderer.tsx`

职责：

- 渲染文章正文
- 对代码块、图片、Callout、Quote、Heading 做统一样式封装

## 9. 路由设计

建议首期路由：

- `/`：首页，展示个人介绍 + 最新文章
- `/blog`：文章列表页
- `/blog/[slug]`：文章详情页
- `/tags/[tag]`：标签聚合页
- `/about`：关于页

可选扩展：

- `/projects`
- `/rss.xml`
- `/friends`
- `/search`

## 10. SEO 设计

必须实现：

- `generateMetadata`
- `sitemap.ts`
- `robots.ts`
- 文章详情页 `Open Graph`
- `JSON-LD Article` 结构化数据

建议：

- 标题格式：`文章标题 | 站点名`
- 描述优先使用 `Summary`
- `canonical` 来自自定义域名
- 封面图用于社交分享卡片

## 11. 权限与安全

注意事项：

- `NOTION_TOKEN` 只能放在服务端环境变量中
- 不要在 Client Component 中直接请求 Notion API
- `revalidate` 接口需要校验 `secret`

推荐环境变量：

```bash
NOTION_TOKEN=
NOTION_DATA_SOURCE_ID=
NEXT_PUBLIC_SITE_URL=
REVALIDATE_SECRET=
```

## 12. 性能策略

推荐：

- 列表页使用服务端缓存
- 正文渲染尽量在服务端完成
- 图片使用 `next/image`
- 对 Notion blocks 做最小必要转换

如果文章较多：

- 给列表页增加分页或按年份归档
- 对标签页做静态化
- 增加本地缓存层，减少 Notion API 调用次数

## 13. 发布流程

建议工作流：

1. 在 Notion 新建文章
2. 填写标题、摘要、标签、封面、发布日期
3. `Status` 设为 `Draft` 时仅内部可见
4. 准备发布时改为 `Published`
5. 站点通过 ISR 或手动 revalidate 同步更新

## 14. 首期 MVP 范围

第一阶段建议只做这些能力：

- 首页
- 文章列表页
- 文章详情页
- 标签页
- 基础 SEO
- Notion 内容拉取
- ISR 缓存

先不要做：

- 全文搜索
- 多语言
- 本地 MDX 双存储
- 后台管理系统

## 15. 后续扩展方向

当博客稳定后，可以继续扩展：

- `RSS`
- `Giscus` 评论
- `Projects` 项目页
- `View Counter`
- `Reading Time`
- `系列文章`
- `相关文章推荐`
- `Open Graph 动态封面图`

## 16. 推荐实现顺序

1. 初始化 `Next.js` 项目
2. 配置 `Tailwind CSS`
3. 接入 `Notion Client`
4. 完成数据库查询与字段映射
5. 打通 `/blog` 和 `/blog/[slug]`
6. 接入 SEO 与 sitemap
7. 加入缓存刷新和部署配置

## 17. 结论

对于个人博客，`Next.js + Notion` 是一个维护成本低、编辑体验好、扩展空间足够大的方案。

这套架构最关键的点有三个：

- 用 `Notion Database` 管理文章元数据
- 用 `Next.js Server Components` 统一处理数据获取和渲染
- 用 `mapper + cache + SEO` 保证可维护性和线上体验

如果继续实现，下一步最合理的是直接搭一个 `Next.js` 博客骨架，并把 `Notion` 查询层先落好。


