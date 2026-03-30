# UI 包样式结构

当前项目的 `ui` 目录已按“未来可拆成独立 package”的方向组织。

## 结构

```text
src/components/ui/
  index.ts
  lib/
    cn.ts
  styles/
    base.css
  radio-group/
    radio-group.tsx
  surface/
    surface.tsx
```

## 原则

- `ui` 包自带 token 和主题变量，不依赖 `app` 目录持有组件库样式。
- 宿主项目只负责在入口引入 `@/components/ui/styles/base.css`。
- `ui` 组件优先消费 `--ui-*` 前缀 token，避免和宿主项目变量冲突。
- 项目级 `globals.css` 只保留页面背景、排版、滚动条等宿主样式。

## Tailwind 4 语法约定

以后在 `ui` 组件里，凡是直接消费 CSS 变量的 Tailwind 类，统一使用 Tailwind 4 的 token 风格简写：

- `rounded-(--ui-radius-pill)`
- `bg-(--ui-color-card)`
- `border-(--ui-color-border-strong)`
- `text-(--ui-color-foreground)`
- `shadow-(--ui-shadow-surface)`

不要再优先写旧风格：

- `rounded-[var(--ui-radius-pill)]`
- `bg-[var(--ui-color-card)]`
- `border-[var(--ui-color-border-strong)]`

## 后续建议

下一步新增 `Button`、`Input`、`Tabs` 时，继续沿用这个模式：

- 组件逻辑与组件目录同级
- 公共工具留在 `ui/lib`
- token/theme 留在 `ui/styles`
- 对外统一从 `ui/index.ts` 导出