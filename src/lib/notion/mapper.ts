import type { FallbackContentBlock, NotionBlock, PostDetail, PostMeta } from "@/lib/notion/types";

type RichTextItem = {
  plain_text?: string;
};

type NotionFile = {
  type: "external" | "file";
  external?: { url?: string };
  file?: { url?: string };
};

type NotionPropertyValue = {
  title?: RichTextItem[];
  rich_text?: RichTextItem[];
  multi_select?: Array<{ name: string }>;
  select?: { name: string } | null;
  status?: { name: string } | null;
  date?: { start: string | null } | null;
  checkbox?: boolean;
  files?: NotionFile[];
  type?: string;
};

type NotionPropertyMap = Record<string, NotionPropertyValue>;

type NotionPage = {
  id: string;
  properties: NotionPropertyMap;
};

type NotionBlockResponse = {
  id?: string;
  type?: string;
  [key: string]: unknown;
};

function getPlainText(field?: RichTextItem[]) {
  return field?.map((item) => item.plain_text ?? "").join("") ?? "";
}

function getFileUrl(property?: NotionPropertyValue): string | null {
  const file = property?.files?.[0];
  if (!file) {
    return null;
  }

  return file.type === "external" ? file.external?.url ?? null : file.file?.url ?? null;
}

export function mapDatabasePageToPost(page: NotionPage): PostMeta {
  const properties = page.properties;

  return {
    id: page.id,
    title: getPlainText(properties.Title?.title) || "Untitled",
    slug: getPlainText(properties.Slug?.rich_text) || page.id,
    summary: getPlainText(properties.Summary?.rich_text),
    publishedAt: properties.PublishedAt?.date?.start ?? null,
    tags: properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
    category: properties.Category?.select?.name ?? properties.Category?.status?.name ?? null,
    cover: getFileUrl(properties.Cover),
    featured: properties.Featured?.checkbox ?? false,
  };
}

export function mapBlocksToPlainText(blocks: NotionBlockResponse[]): NotionBlock[] {
  return blocks
    .filter((block): block is NotionBlockResponse & { id: string; type: string } => {
      return typeof block.id === "string" && typeof block.type === "string";
    })
    .map((block) => {
      const content = block[block.type];
      const richText =
        typeof content === "object" && content !== null && "rich_text" in content
          ? ((content as { rich_text?: RichTextItem[] }).rich_text ?? [])
          : [];

      return {
        id: block.id,
        type: block.type,
        plainText: richText.map((item) => item.plain_text ?? "").join(""),
      };
    })
    .filter((block) => block.plainText.length > 0);
}

export function mergePostWithBlocks(post: PostMeta, blocks: NotionBlock[]): PostDetail {
  return {
    ...post,
    blocks,
  };
}

export function mergePostWithFallback(post: PostMeta, content: FallbackContentBlock[]): PostDetail {
  return {
    ...post,
    blocks: [],
    content,
  };
}