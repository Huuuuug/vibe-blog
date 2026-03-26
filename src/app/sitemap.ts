import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/notion/queries";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/about", "/blog"].map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }));

  return [...staticRoutes, ...postRoutes];
}
