import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getNotionClient, getNotionDataSourceId, getNotionSchema, hasNotionEnv } from "@/lib/notion/client";
import {
  getPageStatus,
  hasConfiguredStatusProperty,
  mapBlocksToPlainText,
  mapDatabasePageToPost,
  mergePostWithBlocks,
} from "@/lib/notion/mapper";
import type { PostDetail, PostMeta } from "@/lib/notion/types";

const CACHE_WINDOW_SECONDS = 300;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 350;

type QueryPageResponse = {
  id: string;
  properties: Record<string, unknown>;
};

type QueryResponse = {
  results: QueryPageResponse[];
  has_more?: boolean;
  next_cursor?: string | null;
};

type BlockListResponse = {
  results: Array<Record<string, unknown>>;
  has_more?: boolean;
  next_cursor?: string | null;
};

let lastSuccessfulPages: QueryPageResponse[] | null = null;
const lastSuccessfulBlocks = new Map<string, Array<Record<string, unknown>>>();

function sortPosts(posts: PostMeta[]) {
  return [...posts].sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) {
      return 0;
    }

    if (!a.publishedAt) {
      return 1;
    }

    if (!b.publishedAt) {
      return -1;
    }

    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

function assertNotionEnv() {
  if (!hasNotionEnv()) {
    throw new Error("Notion environment is not fully configured.");
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorCode(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const record = error as { code?: string; cause?: { code?: string }; status?: number };
  return record.code ?? record.cause?.code ?? (typeof record.status === "number" ? String(record.status) : null);
}

function isRetryableError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const record = error as {
    code?: string;
    status?: number;
    body?: string;
    cause?: { code?: string };
  };

  const code = record.code ?? record.cause?.code ?? null;
  if (code && ["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "UND_ERR_CONNECT_TIMEOUT", "ECONNREFUSED"].includes(code)) {
    return true;
  }

  if (record.status === 429) {
    return true;
  }

  return typeof record.body === "string" && record.body.includes("rate_limited");
}

async function withRetry<T>(label: string, task: () => Promise<T>) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        break;
      }

      const delay = RETRY_BASE_MS * (attempt + 1);
      console.warn(`[notion] ${label} failed with ${getErrorCode(error) ?? "unknown"}; retrying in ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError;
}

const queryAllPages = cache(async () => {
  const notion = getNotionClient();
  const dataSourceId = getNotionDataSourceId();

  if (!notion || !dataSourceId) {
    throw new Error("Notion client or data source id is unavailable.");
  }

  const pages: QueryPageResponse[] = [];
  let nextCursor: string | undefined;

  try {
    do {
      const response = (await withRetry("Querying data source", () =>
        notion.dataSources.query({
          data_source_id: dataSourceId,
          page_size: 100,
          start_cursor: nextCursor,
        }),
      )) as QueryResponse;

      pages.push(...response.results);
      nextCursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (nextCursor);

    lastSuccessfulPages = pages;
    return pages;
  } catch (error) {
    if (lastSuccessfulPages && lastSuccessfulPages.length > 0) {
      console.warn("[notion] Falling back to last successful page snapshot after repeated query failures.");
      return lastSuccessfulPages;
    }

    throw error;
  }
});

const listAllBlocks = cache(async (blockId: string) => {
  const notion = getNotionClient();
  if (!notion) {
    throw new Error("Notion client is unavailable while loading page blocks.");
  }

  const blocks: Array<Record<string, unknown>> = [];
  let nextCursor: string | undefined;

  try {
    do {
      const response = (await withRetry(`Loading blocks for ${blockId}`, () =>
        notion.blocks.children.list({
          block_id: blockId,
          page_size: 100,
          start_cursor: nextCursor,
        }),
      )) as BlockListResponse;

      blocks.push(...response.results);
      nextCursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (nextCursor);

    lastSuccessfulBlocks.set(blockId, blocks);
    return blocks;
  } catch (error) {
    const cachedBlocks = lastSuccessfulBlocks.get(blockId);
    if (cachedBlocks && cachedBlocks.length > 0) {
      console.warn(`[notion] Falling back to last successful block snapshot for ${blockId}.`);
      return cachedBlocks;
    }

    throw error;
  }
});

function isPublished(page: QueryPageResponse) {
  const schema = getNotionSchema();

  if (!hasConfiguredStatusProperty(page as never, schema)) {
    return true;
  }

  return getPageStatus(page as never, schema) === schema.publishedValue;
}

const getPublishedPostsCached = unstable_cache(
  async (): Promise<PostMeta[]> => {
    assertNotionEnv();

    const schema = getNotionSchema();
    const pages = await queryAllPages();

    return sortPosts(pages.filter(isPublished).map((page) => mapDatabasePageToPost(page as never, schema)));
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

const getPostBySlugCached = cache(async (slug: string): Promise<PostDetail | null> => {
  assertNotionEnv();

  const schema = getNotionSchema();
  const pages = await queryAllPages();
  const page = pages.find((entry) => {
    const post = mapDatabasePageToPost(entry as never, schema);
    return post.slug === slug && isPublished(entry);
  });

  if (!page) {
    return null;
  }

  const meta = mapDatabasePageToPost(page as never, schema);
  const blocks = await listAllBlocks(page.id);

  return mergePostWithBlocks(meta, mapBlocksToPlainText(blocks as never));
});

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return getPostBySlugCached(slug);
}

export async function getPostsByTag(tag: string) {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
