import { Prose } from "@/components/prose";
import type { FallbackContentBlock, NotionBlock } from "@/lib/notion/types";

type NotionRendererProps = {
  blocks: NotionBlock[];
  fallbackMarkdown?: FallbackContentBlock[];
};

function renderFallbackBlock(block: FallbackContentBlock) {
  switch (block.type) {
    case "heading_2":
      return <h2 key={block.id}>{block.text}</h2>;
    case "heading_3":
      return <h3 key={block.id}>{block.text}</h3>;
    case "bulleted_list_item":
      return <li key={block.id}>{block.text}</li>;
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

export function NotionRenderer({ blocks, fallbackMarkdown = [] }: NotionRendererProps) {
  if (blocks.length > 0) {
    return (
      <Prose>
        {blocks.map((block) => (
          <p key={block.id}>{block.plainText}</p>
        ))}
      </Prose>
    );
  }

  const listBlocks = fallbackMarkdown.filter((block) => block.type === "bulleted_list_item");
  const otherBlocks = fallbackMarkdown.filter((block) => block.type !== "bulleted_list_item");

  return (
    <Prose>
      {otherBlocks.map(renderFallbackBlock)}
      {listBlocks.length > 0 ? (
        <ul>
          {listBlocks.map((block) => (
            <li key={block.id}>{block.text}</li>
          ))}
        </ul>
      ) : null}
    </Prose>
  );
}
