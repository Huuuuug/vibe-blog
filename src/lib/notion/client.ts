import { Client } from "@notionhq/client";

export type NotionSchema = {
  dataSourceId: string | null;
  titleProperty: string;
  slugProperty: string;
  summaryProperty: string;
  publishedAtProperty: string;
  tagsProperty: string;
  categoryProperty: string;
  coverProperty: string;
  featuredProperty: string;
  statusProperty: string;
  publishedValue: string;
};

let notionClient: Client | null = null;

function readEnv(name: string, fallback: string) {
  return process.env[name]?.trim() || fallback;
}

export function getNotionClient() {
  if (!process.env.NOTION_TOKEN) {
    return null;
  }

  if (!notionClient) {
    notionClient = new Client({ auth: process.env.NOTION_TOKEN });
  }

  return notionClient;
}

export function getNotionSchema(): NotionSchema {
  return {
    dataSourceId: process.env.NOTION_DATA_SOURCE_ID?.trim() || null,
    titleProperty: readEnv("NOTION_TITLE_PROPERTY", "Title"),
    slugProperty: readEnv("NOTION_SLUG_PROPERTY", "Slug"),
    summaryProperty: readEnv("NOTION_SUMMARY_PROPERTY", "Summary"),
    publishedAtProperty: readEnv("NOTION_PUBLISHED_AT_PROPERTY", "PublishedAt"),
    tagsProperty: readEnv("NOTION_TAGS_PROPERTY", "Tags"),
    categoryProperty: readEnv("NOTION_CATEGORY_PROPERTY", "Category"),
    coverProperty: readEnv("NOTION_COVER_PROPERTY", "Cover"),
    featuredProperty: readEnv("NOTION_FEATURED_PROPERTY", "Featured"),
    statusProperty: readEnv("NOTION_STATUS_PROPERTY", "Status"),
    publishedValue: readEnv("NOTION_PUBLISHED_VALUE", "Published"),
  };
}

export function getNotionDataSourceId() {
  return getNotionSchema().dataSourceId;
}

export function hasNotionEnv() {
  return Boolean(process.env.NOTION_TOKEN?.trim() && getNotionDataSourceId());
}
