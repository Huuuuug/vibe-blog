type SurfaceProps = {
  as?: "article" | "div" | "section" | "header";
  children: React.ReactNode;
  className?: string;
};

const baseClassName = "rounded-[22px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] backdrop-blur-[10px] sm:rounded-[28px]";

export function Surface({ as: Tag = "div", children, className = "" }: SurfaceProps) {
  return <Tag className={`${baseClassName} ${className}`.trim()}>{children}</Tag>;
}
