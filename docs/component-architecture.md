# 组件架构规范

这份文档定义 `src/components` 的分层边界，目标是让公共组件可持续复用，避免页面开发继续把业务组件、布局组件和基础 UI 混在一起。

## 目录分层

```text
src/components/
  ui/
  shared/
  layout/
  features/
```

### `ui`

放纯公共组件，要求：

- 不直接依赖业务实体类型，例如 `PostMeta`
- 优先提供稳定的 props API，而不是为单个页面硬编码
- 必须支持 `className` 或等价扩展点
- 新增组件时优先考虑是否可被多个页面复用

适合放入：

- `RadioGroup`
- `Surface`
- 后续的 `Button`、`Input`、`Tabs`、`Badge`

### `shared`

放站内通用展示组件，要求：

- 可以带轻量展示语义
- 可以跨多个页面复用
- 不绑定某个业务域的数据模型

适合放入：

- `PageIntro`
- `SectionHeading`
- `Eyebrow`
- `Prose`

### `layout`

放站点骨架组件，要求：

- 负责导航、页头、页脚、主题切换、全局装饰
- 不承担业务域渲染职责

适合放入：

- `SiteHeader`
- `SiteFooter`
- `ThemeToggle`
- `Logo`
- `BackToTopButton`

### `features`

按业务域管理组件，要求：

- 明确归属某个功能模块
- 可以依赖业务类型和业务数据结构
- 不默认视为公共组件

当前示例：

- `features/blog/PostCard`
- `features/blog/NotionRenderer`

## 新增组件判断规则

新增组件前先问三件事：

1. 它是否完全不依赖业务实体？
2. 它是否会跨页面复用？
3. 它是否只是站点骨架的一部分？

判断方式：

- 满足 1 和 2：放 `ui`
- 满足 2 但带轻量展示语义：放 `shared`
- 只属于站点骨架：放 `layout`
- 绑定某个业务域：放 `features/<domain>`

## 管理规则

- 每个分层目录保留 `index.ts` 作为统一出口
- 页面优先从分层入口导入，不直接从零散文件导入
- 公共组件禁止直接依赖页面文件
- 业务组件禁止反向沉到 `ui`