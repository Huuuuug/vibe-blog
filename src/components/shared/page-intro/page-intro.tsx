import { Eyebrow } from "@/components/shared";

type PageIntroProps = {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export function PageIntro({ eyebrow, title, description, className = "" }: PageIntroProps) {
  return (
    <div className={`grid gap-[18px] ${className}`.trim()}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="m-0 font-[var(--font-heading)] text-[clamp(1.8rem,2.6vw,2.8rem)] leading-[1.02] tracking-[-0.03em]">{title}</h1>
      {description ? <p className="max-w-[60ch] text-[0.98rem] leading-7 text-[var(--muted)]">{description}</p> : null}
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <Eyebrow as="p">{eyebrow}</Eyebrow>
        <h2 className="m-0 font-[var(--font-heading)] text-[clamp(1.75rem,2.5vw,2.6rem)] leading-[1.04] tracking-[-0.03em]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
