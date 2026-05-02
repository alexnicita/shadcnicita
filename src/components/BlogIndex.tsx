import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import BaseLayout from "./shared/BaseLayout";
import { blogPosts } from "../data/blogPosts";
import { useTheme as useUiTheme } from "@/components/theme-provider";
import { useSeo } from "../lib/seo";

export default function BlogIndex() {
  const location = useLocation();
  const { setTheme } = useUiTheme();
  const [excerptsBySlug, setExcerptsBySlug] = useState<Record<string, string>>(
    {},
  );
  const navigationState = location.state as { isDarkMode?: boolean } | null;

  useSeo({
    title: "Blog",
    description: "Essays and notes by Alexander Nicita.",
    path: "/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Alexander Nicita Blog",
      url: `${window.location.origin}/blog`,
      hasPart: blogPosts
        .filter((post) => post.status === "published")
        .map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${window.location.origin}/blog/${post.slug}`,
          datePublished: `${post.date}T00:00:00.000Z`,
          description: post.description,
        })),
    },
  });

  useLayoutEffect(() => {
    if (typeof navigationState?.isDarkMode === "boolean") {
      setTheme(navigationState.isDarkMode ? "dark" : "light");
    }
  }, [navigationState?.isDarkMode, setTheme]);

  const sortedPosts = useMemo(
    () =>
      [...blogPosts].sort((a, b) => {
        if (a.status === "draft" && b.status === "draft") return 0;
        if (a.status === "draft") return 1;
        if (b.status === "draft") return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    [],
  );

  // Extract the content area after frontmatter and return the first sentence
  function extractFirstSentence(markdownRaw: string): string {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdownRaw.match(frontmatterRegex);
    const content = match ? match[2] : markdownRaw;

    // Remove images and basic markdown syntax for a cleaner excerpt
    const withoutImages = content.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
    const withoutHeaders = withoutImages.replace(/^#{1,6}\s+/gm, "");
    const withoutBlockquotes = withoutHeaders.replace(/^>\s?/gm, "");
    const inlineClean = withoutBlockquotes
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`([^`]*)`/g, "$1");

    const normalized = inlineClean.replace(/\s+/g, " ").trim();
    if (!normalized) return "";
    const sentences = normalized.split(/(?<=[.!?])\s+/);
    return sentences[0]?.trim() ?? "";
  }

  // Load excerpts for each post from its markdown
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      const results: Record<string, string> = {};
      await Promise.all(
        sortedPosts.map(async (post) => {
          try {
            const folder = post.status === "published" ? "published" : "drafts";
            // SECURITY: Only load drafts in development
            if (folder === "drafts" && import.meta.env.MODE === "production") {
              results[post.slug] = post.description;
              return;
            }
            const mod = await import(
              `../blog/${folder}/${post.slug}/index.md?raw`
            );
            const raw = mod.default as string;
            const excerpt = extractFirstSentence(raw);
            results[post.slug] = excerpt || post.description;
          } catch (_err) {
            results[post.slug] = post.description;
          }
        }),
      );
      if (!isCancelled) setExcerptsBySlug(results);
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [sortedPosts]);

  return (
    <BaseLayout className="site-contained-scroll p-8 md:p-16">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          {sortedPosts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-8">
              <Link to={`/blog/${post.slug}`} className="group block">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-muted-foreground transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {post.status === "draft"
                    ? "Draft"
                    : new Date(post.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                </p>
                <p className="text-muted-foreground">
                  {excerptsBySlug[post.slug] ?? post.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}
