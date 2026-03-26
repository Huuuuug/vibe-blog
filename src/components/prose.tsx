export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] px-6 py-8 shadow-[var(--shadow)] backdrop-blur-[10px] sm:px-10 sm:py-10 [&_h2]:scroll-mt-28 [&_h2]:font-[var(--font-heading)] [&_h2]:text-[1.28rem] [&_h2]:leading-[1.14] [&_h2]:tracking-[-0.03em] [&_h2:not(:first-child)]:mt-12 [&_h3]:scroll-mt-28 [&_h3]:font-[var(--font-heading)] [&_h3]:text-[1.02rem] [&_h3]:leading-[1.22] [&_h3]:tracking-[-0.02em] [&_h3:not(:first-child)]:mt-8 [&_p]:my-0 [&_p]:text-[0.92rem] [&_p]:leading-[1.78] [&_p]:text-[color:var(--foreground)]/80 [&_p+*]:mt-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-[0.92rem] [&_ul]:leading-[1.78] [&_ul+*]:mt-5 [&_li]:leading-[1.78] [&_li]:text-[color:var(--foreground)]/80 [&_pre]:mt-5 [&_pre]:overflow-x-auto [&_pre]:rounded-[18px] [&_pre]:bg-[#1d1b19] [&_pre]:p-[18px] [&_pre]:text-[#fff7ee] [&_code]:rounded-lg [&_code]:bg-[rgba(29,27,25,0.08)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_pre_code]:bg-transparent [&_pre_code]:p-0">
      {children}
    </div>
  );
}
