import { unstable_cache } from "next/cache";
import { getNotionClient, getNotionDataSourceId, hasNotionEnv } from "@/lib/notion/client";
import { mapBlocksToPlainText, mapDatabasePageToPost, mergePostWithBlocks } from "@/lib/notion/mapper";
import { mockPosts } from "@/lib/notion/mock-data";
import type { PostDetail, PostMeta } from "@/lib/notion/types";

const CACHE_WINDOW_SECONDS = 300;

function toPostMeta(post: PostDetail): PostMeta {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    publishedAt: post.publishedAt,
    tags: post.tags,
    category: post.category,
    cover: post.cover,
    featured: post.featured,
  };
}

const getPublishedPostsCached = unstable_cache(
  async (): Promise<PostMeta[]> => {
    if (!hasNotionEnv()) {
      return mockPosts
        .map(toPostMeta)
        .sort((a, b) => (a.publishedAt && b.publishedAt ? b.publishedAt.localeCompare(a.publishedAt) : 0));
    }

    const notion = getNotionClient();
    const dataSourceId = getNotionDataSourceId();

    if (!notion || !dataSourceId) {
      return [];
    }

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "PublishedAt",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page) => mapDatabasePageToPost(page as never));
  },
  ["published-posts"],
  {
    revalidate: CACHE_WINDOW_SECONDS,
    tags: ["posts"],
  },
);

export async function getPublishedPosts() {
  return getPublishedPostsCached();
}

export async function getFeaturedPosts() {
  const posts = await getPublishedPosts();
  const featured = posts.filter((post) => post.featured);
  return featured.length > 0 ? featured.slice(0, 2) : posts.slice(0, 2);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  if (!hasNotionEnv()) {
    return mockPosts.find((post) => post.slug === slug) ?? null;
  }

  const notion = getNotionClient();
  const dataSourceId = getNotionDataSourceId();

  if (!notion || !dataSourceId) {
    return null;
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
    page_size: 1,
  });

  const page = response.results[0];
  if (!page) {
    return null;
  }

  const meta = mapDatabasePageToPost(page as never);
  const blocksResponse = await notion.blocks.children.list({
    block_id: page.id,
    page_size: 100,
  });

  return mergePostWithBlocks(meta, mapBlocksToPlainText(blocksResponse.results));
}

export async function getPostsByTag(tag: string) {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.tags.includes(tag));
}