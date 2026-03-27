import type { NotionSchema } from "@/lib/notion/client";
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
  url?: string | null;
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

function findPropertyByType(properties: NotionPropertyMap, types: string[]) {
  return Object.entries(properties).find(([, property]) => property?.type && types.includes(property.type));
}

function getConfiguredProperty(properties: NotionPropertyMap, propertyName: string) {
  if (!propertyName) {
    return undefined;
  }

  return properties[propertyName];
}

function getPlainText(field?: RichTextItem[]) {
  return field?.map((item) => item.plain_text ?? "").join("") ?? "";
}

function getTextValue(property?: NotionPropertyValue) {
  if (!property) {
    return "";
  }

  return getPlainText(property.title) || getPlainText(property.rich_text) || property.url || "";
}

function getStatusLikeValue(property?: NotionPropertyValue) {
  return property?.status?.name ?? property?.select?.name ?? (getTextValue(property) || null);
}

function getFileUrl(property?: NotionPropertyValue): string | null {
  const file = property?.files?.[0];
  if (!file) {
    return property?.url ?? null;
  }

  return file.type === "external" ? file.external?.url ?? null : file.file?.url ?? null;
}

function getPropertyWithFallback(
  properties: NotionPropertyMap,
  propertyName: string,
  fallbackTypes: string[] = [],
) {
  return getConfiguredProperty(properties, propertyName) ?? findPropertyByType(properties, fallbackTypes)?.[1];
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function mapDatabasePageToPost(page: NotionPage, schema: NotionSchema): PostMeta {
  const properties = page.properties;
  const titleProperty = getPropertyWithFallback(properties, schema.titleProperty, ["title"]);
  const title = getTextValue(titleProperty) || "Untitled";
  const subtitleProperty = getConfiguredProperty(properties, schema.subtitleProperty);
  const slugProperty = getPropertyWithFallback(properties, schema.slugProperty, ["rich_text"]);
  const summaryProperty = getConfiguredProperty(properties, schema.summaryProperty);
  const publishedAtProperty = getPropertyWithFallback(properties, schema.publishedAtProperty, ["date"]);
  const tagsProperty = getConfiguredProperty(properties, schema.tagsProperty);
  const categoryProperty = getConfiguredProperty(properties, schema.categoryProperty);
  const coverProperty = getPropertyWithFallback(properties, schema.coverProperty, ["files", "url"]);
  const featuredProperty = getConfiguredProperty(properties, schema.featuredProperty);

  return {
    id: page.id,
    title,
    subtitle: getTextValue(subtitleProperty),
    slug: getTextValue(slugProperty) || slugify(title) || page.id,
    summary: getTextValue(summaryProperty),
    publishedAt: publishedAtProperty?.date?.start ?? null,
    tags: tagsProperty?.multi_select?.map((tag) => tag.name) ?? [],
    category: getStatusLikeValue(categoryProperty),
    cover: getFileUrl(coverProperty),
    featured: featuredProperty?.checkbox ?? false,
  };
}

export function getPageStatus(page: NotionPage, schema: NotionSchema) {
  const configured = getConfiguredProperty(page.properties, schema.statusProperty);
  return getStatusLikeValue(configured);
}

export function hasConfiguredStatusProperty(page: NotionPage, schema: NotionSchema) {
  return Boolean(getConfiguredProperty(page.properties, schema.statusProperty));
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
