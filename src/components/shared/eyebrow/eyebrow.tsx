type EyebrowProps = {
  children: React.ReactNode;
  as?: "span" | "p";
  className?: string;
};

const baseClassName = "inline-flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]";

export function Eyebrow({ children, as: Tag = "span", className = "" }: EyebrowProps) {
  return <Tag className={`${baseClassName} ${className}`.trim()}>{children}</Tag>;
}
