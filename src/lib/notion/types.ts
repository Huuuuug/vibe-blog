export type PostMeta = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  summary: string;
  publishedAt: string | null;
  tags: string[];
  category: string | null;
  cover: string | null;
  featured: boolean;
};

export type NotionBlock = {
  id: string;
  type: string;
  plainText: string;
};

export type FallbackContentBlock = {
  id: string;
  type: "paragraph" | "heading_2" | "heading_3" | "bulleted_list_item" | "code";
  text: string;
};

export type PostDetail = PostMeta & {
  blocks: NotionBlock[];
  content?: FallbackContentBlock[];
};
