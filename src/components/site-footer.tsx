import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="footer-copy">{siteConfig.description}</p>
      <p className="footer-copy">{new Date().getFullYear()} {siteConfig.author}</p>
    </footer>
  );
}
