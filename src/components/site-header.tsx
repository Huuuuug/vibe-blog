"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { RadioGroup, type RadioGroupItem } from "@/components/radio-group";
import { siteConfig } from "@/lib/site-config";

const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((mod) => mod.ThemeToggle),
  { ssr: false },
);

const navItems: RadioGroupItem[] = [
  { label: "首页", value: "" },
  { label: "文章", value: "blog" },
  { label: "项目", value: "about" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const currentValue =
    pathname === "/"
      ? ""
      : pathname.startsWith("/blog") || pathname.startsWith("/tags")
        ? "blog"
        : pathname.startsWith("/about")
          ? "about"
          : "";

  return (
    <header className="sticky top-0 z-10 w-full">
      <div className="grid w-full gap-4  bg-[var(--card-strong)] px-5 py-[14px] backdrop-blur-[16px] sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:px-8">
        <div className="flex min-w-0 justify-start">
          <Link className="inline-flex min-w-0 items-center gap-3" href="/" aria-label={siteConfig.name}>
            <Logo className="size-12 shrink-0 stroke-[var(--foreground)] stroke-[2.75]" />
          </Link>
        </div>
        <div className="flex justify-start lg:justify-center">
          <RadioGroup
            items={navItems}
            value={currentValue}
            onChange={(value) => router.push(value ? `/${value}` : "/")}
          />
        </div>
        <div className="flex min-h-[42px] justify-start lg:justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

