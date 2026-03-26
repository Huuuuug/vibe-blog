import { Prose } from "@/components/prose";
import type { FallbackContentBlock, NotionBlock } from "@/lib/notion/types";
import { slugifyHeading } from "@/lib/utils/slug";

type NotionRendererProps = {
  blocks: NotionBlock[];
  fallbackMarkdown?: FallbackContentBlock[];
};

function renderFallbackBlock(block: FallbackContentBlock) {
  const anchor = slugifyHeading(block.text) || block.id;

  switch (block.type) {
    case "heading_2":
      return <h2 id={anchor} key={block.id}>{block.text}</h2>;
    case "heading_3":
      return <h3 id={anchor} key={block.id}>{block.text}</h3>;
    case "code":
      return (
        <pre key={block.id}>
          <code>{block.text}</code>
        </pre>
      );
    default:
      return <p key={block.id}>{block.text}</p>;
  }
}

function renderFallbackContent(blocks: FallbackContentBlock[]) {
  const rendered: React.ReactNode[] = [];
  let listItems: FallbackContentBlock[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    rendered.push(
      <ul key={`list-${listItems[0]?.id ?? rendered.length}`}>
        {listItems.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  blocks.forEach((block) => {
    if (block.type === "bulleted_list_item") {
      listItems.push(block);
      return;
    }

    flushList();
    rendered.push(renderFallbackBlock(block));
  });

  flushList();
  return rendered;
}

function renderNotionBlock(block: NotionBlock) {
  const anchor = slugifyHeading(block.plainText) || block.id;

  switch (block.type) {
    case "heading_1":
      return <h2 id={anchor} key={block.id}>{block.plainText}</h2>;
    case "heading_2":
      return <h2 id={anchor} key={block.id}>{block.plainText}</h2>;
    case "heading_3":
      return <h3 id={anchor} key={block.id}>{block.plainText}</h3>;
    case "bulleted_list_item":
      return <li key={block.id}>{block.plainText}</li>;
    case "code":
      return (
        <pre key={block.id}>
          <code>{block.plainText}</code>
        </pre>
      );
    default:
      return <p key={block.id}>{block.plainText}</p>;
  }
}

function renderNotionContent(blocks: NotionBlock[]) {
  const rendered: React.ReactNode[] = [];
  let listItems: NotionBlock[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    rendered.push(
      <ul key={`list-${listItems[0]?.id ?? rendered.length}`}>
        {listItems.map((item) => (
          <li key={item.id}>{item.plainText}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  blocks.forEach((block) => {
    if (block.type === "bulleted_list_item") {
      listItems.push(block);
      return;
    }

    flushList();
    rendered.push(renderNotionBlock(block));
  });

  flushList();
  return rendered;
}

export function NotionRenderer({ blocks, fallbackMarkdown = [] }: NotionRendererProps) {
  if (blocks.length > 0) {
    return <Prose>{renderNotionContent(blocks)}</Prose>;
  }

  return <Prose>{renderFallbackContent(fallbackMarkdown)}</Prose>;
}
