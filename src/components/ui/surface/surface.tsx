import { cn } from "@/components/ui/lib/cn";

type SurfaceProps = {
  as?: "article" | "div" | "section" | "header";
  children: React.ReactNode;
  className?: string;
};

const baseClassName = cn(
  "rounded-(--ui-radius-surface) border border-ui-border bg-ui-card shadow-(--ui-shadow-surface) backdrop-blur-[10px]",
  "sm:rounded-(--ui-radius-surface-lg)",
);

export function Surface({ as: Tag = "div", children, className = "" }: SurfaceProps) {
  return <Tag className={cn(baseClassName, className)}>{children}</Tag>;
}