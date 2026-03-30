import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-[min(1120px,calc(100vw-20px))] flex-col justify-between gap-4 px-0 pb-7 text-[0.92rem] text-[var(--muted)] md:w-[min(1120px,calc(100vw-32px))] lg:flex-row">
      <p>{siteConfig.description}</p>
      <p>{new Date().getFullYear()} {siteConfig.author}</p>
    </footer>
  );
}
