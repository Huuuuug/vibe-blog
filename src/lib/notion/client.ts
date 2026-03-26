import { Client } from "@notionhq/client";

let notionClient: Client | null = null;

export function getNotionClient() {
  if (!process.env.NOTION_TOKEN) {
    return null;
  }

  if (!notionClient) {
    notionClient = new Client({ auth: process.env.NOTION_TOKEN });
  }

  return notionClient;
}

export function getNotionDataSourceId() {
  return process.env.NOTION_DATA_SOURCE_ID ?? null;
}

export function hasNotionEnv() {
  return Boolean(process.env.NOTION_TOKEN && getNotionDataSourceId());
}

