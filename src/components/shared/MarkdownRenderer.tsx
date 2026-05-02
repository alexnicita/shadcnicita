import { Children, isValidElement, type ReactNode, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
}

interface LinkPreviewData {
  href: string;
  label: string;
  title: string;
  description?: string;
}

interface LinkElementProps {
  href?: unknown;
  title?: unknown;
  children?: ReactNode;
}

function isExternalHref(href: unknown): href is string {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

function getDisplayHost(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function getTextContent(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(value)) {
    return getTextContent(value.props.children);
  }

  return "";
}

function getNodeProperty(node: unknown, propertyName: string): unknown {
  if (!node || typeof node !== "object" || !("properties" in node)) {
    return undefined;
  }

  const properties = (node as { properties?: Record<string, unknown> })
    .properties;
  return properties?.[propertyName];
}

function hasNodeProperty(node: unknown, propertyName: string): boolean {
  return (
    Boolean(getNodeProperty(node, propertyName)) ||
    Boolean(getNodeProperty(node, propertyName.replace(/[A-Z]/g, "-$&").toLowerCase()))
  );
}

function getStandaloneLinkPreview(children: ReactNode): LinkPreviewData | null {
  const meaningfulChildren = Children.toArray(children).filter((child) => {
    return typeof child !== "string" || child.trim().length > 0;
  });

  if (meaningfulChildren.length !== 1) return null;

  const candidate = meaningfulChildren[0];
  if (!isValidElement<LinkElementProps>(candidate)) return null;

  const { href, title, children: linkChildren } = candidate.props;
  if (!isExternalHref(href)) return null;

  const linkText = getTextContent(linkChildren).trim();
  const description = typeof title === "string" ? title.trim() : "";

  return {
    href,
    label: getDisplayHost(href),
    title: linkText || href,
    description: description || undefined,
  };
}

function LinkPreview({
  href,
  label,
  title,
  description,
}: LinkPreviewData) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group my-6 block rounded-md border border-border bg-card/40 p-4 text-left no-underline transition-colors hover:border-muted-foreground/60 hover:bg-accent/40 hover:no-underline"
    >
      <span className="mb-2 flex min-w-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </span>
      <span className="block text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-muted-foreground">
        {title}
      </span>
      {description && (
        <span className="mt-2 block text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      )}
    </a>
  );
}

const markdownComponents: Components = {
  h1({ node, className, ...props }) {
    void node;
    return (
      <h1
        className={cn("mb-5 mt-8 text-3xl font-bold md:text-4xl", className)}
        {...props}
      />
    );
  },
  h2({ node, className, id, ...props }) {
    void node;
    return (
      <h2
        id={id}
        className={cn(
          id === "footnote-label"
            ? "sr-only"
            : "mb-4 mt-8 text-2xl font-bold",
          className,
        )}
        {...props}
      />
    );
  },
  h3({ node, className, ...props }) {
    void node;
    return (
      <h3
        className={cn("mb-3 mt-6 text-xl font-semibold", className)}
        {...props}
      />
    );
  },
  p({ node, children, className, ...props }) {
    void node;
    const preview = getStandaloneLinkPreview(children);

    if (preview) {
      return <LinkPreview {...preview} />;
    }

    return (
      <p className={cn("mb-4 leading-7", className)} {...props}>
        {children}
      </p>
    );
  },
  a({ node, className, href, title, ...props }) {
    const isFootnoteRef =
      hasNodeProperty(node, "dataFootnoteRef") || "data-footnote-ref" in props;
    const isFootnoteBackref =
      hasNodeProperty(node, "dataFootnoteBackref") ||
      "data-footnote-backref" in props ||
      (typeof className === "string" &&
        className.split(" ").includes("data-footnote-backref"));
    const isExternal = isExternalHref(href);

    return (
      <a
        className={cn(
          "transition-colors hover:text-foreground",
          isFootnoteRef
            ? "blog-footnote-ref-link no-underline"
            : isFootnoteBackref
            ? "blog-footnote-backref no-underline"
            : "font-medium underline underline-offset-4",
          className,
        )}
        href={href}
        title={title}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  },
  sup({ node, className, ...props }) {
    void node;
    return (
      <sup
        className={cn(
          "blog-footnote-ref",
          className,
        )}
        {...props}
      />
    );
  },
  blockquote({ node, className, ...props }) {
    void node;
    return (
      <blockquote
        className={cn(
          "not-prose my-6 border-l-4 border-muted-foreground pl-4 italic text-muted-foreground [&>p:last-child]:mb-0",
          className,
        )}
        {...props}
      />
    );
  },
  ul({ node, className, ...props }) {
    void node;
    return <ul className={cn("mb-4 ml-6 list-disc", className)} {...props} />;
  },
  ol({ node, className, ...props }) {
    void node;
    return (
      <ol className={cn("mb-4 ml-6 list-decimal", className)} {...props} />
    );
  },
  li({ node, className, ...props }) {
    void node;
    return <li className={cn("mb-1", className)} {...props} />;
  },
  img({ node, className, src, alt, ...props }) {
    void node;
    const imageSrc = src?.startsWith("./") ? `/${src.slice(2)}` : src;

    return (
      <img
        src={imageSrc}
        alt={alt ?? ""}
        className={cn("mx-auto my-8 h-auto max-w-full rounded-lg", className)}
        style={{ maxWidth: "400px", margin: "2rem auto", display: "block" }}
        {...props}
      />
    );
  },
  section({ node, className, ...props }) {
    const isFootnotes =
      hasNodeProperty(node, "dataFootnotes") ||
      "data-footnotes" in props ||
      (typeof className === "string" &&
        className.split(" ").includes("footnotes"));

    return (
      <section
        className={cn(
          isFootnotes &&
            "blog-footnotes",
          className,
        )}
        {...props}
      />
    );
  },
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    return content
      .replace(/\s?--\s?/g, "—")
      .replace(/\s?–\s?–\s?/g, "—");
  }, [content]);

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        components={markdownComponents}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
