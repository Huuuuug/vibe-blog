import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Plum } from "@/components/plum";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Next.js", "Notion", "Blog", "Personal Website"],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

const themeInitScript = `
(() => {
  const key = ${JSON.stringify(THEME_STORAGE_KEY)};
  const stored = window.localStorage.getItem(key);
  const preference = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  const resolved = preference === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preference;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${heading.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <Plum />
        <div className="min-h-screen">
          <SiteHeader />
          <main className="mx-auto w-[min(1120px,calc(100vw-20px))] px-0 pb-[72px] pt-5 md:w-[min(1120px,calc(100vw-32px))] md:pt-7 lg:pt-[148px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

