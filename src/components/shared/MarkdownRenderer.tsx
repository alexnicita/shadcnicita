import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    // Lightweight markdown parsing optimized for your specific content
    let processed = content
      // Headers
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>'
      )
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>'
      )

      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Images with optimized handling
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        let imageSrc = src;
        if (src.startsWith("./")) {
          imageSrc = `/${src.slice(2)}`;
        }
        return `<img src="${imageSrc}" alt="${alt}" class="max-w-full h-auto rounded-lg mx-auto my-8" style="max-width: 400px; margin: 2rem auto; display: block;" />`;
      })

      // Blockquotes
      .replace(
        /^> "(.+)" - (.+)$/gm,
        '<blockquote class="border-l-4 border-muted-foreground pl-4 italic my-6 text-muted-foreground">"$1" - $2</blockquote>'
      )

      // List items
      .replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')

      // Wrap consecutive list items in ul
      .replace(
        /((?:<li class="mb-1">.*<\/li>\s*)+)/g,
        '<ul class="list-disc ml-6 mb-4">$1</ul>'
      )

      // Paragraphs - split by double newlines
      .split("\n\n")
      .map((paragraph) => {
        if (
          paragraph.includes("<h2") ||
          paragraph.includes("<h3") ||
          paragraph.includes("<blockquote") ||
          paragraph.includes("<ul") ||
          paragraph.includes("<img")
        ) {
          return paragraph;
        }
        return paragraph.trim()
          ? `<p class="mb-4">${paragraph.trim()}</p>`
          : "";
      })
      .join("");

    return processed;
  }, [content]);

  return (
    <div
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
