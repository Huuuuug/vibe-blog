import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/">
        <span className="brand-badge">V</span>
        <span className="brand-copy">
          <span className="brand-title">{siteConfig.name}</span>
          <span className="brand-subtitle">Next.js + Notion Blog</span>
        </span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
