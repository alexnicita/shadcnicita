// Base interface for all blog posts
interface BaseBlogPost {
  slug: string;
  title: string;
  description: string;
}

// Published posts must have a date
interface PublishedPost extends BaseBlogPost {
  status: "published";
  date: string;
}

// Draft posts don't need a date (will be set when published)
interface DraftPost extends BaseBlogPost {
  status: "draft";
  date?: never; // Explicitly prevent date on drafts
}

export type BlogPost = PublishedPost | DraftPost;

// Published posts that will be visible in production
export const publishedPosts: PublishedPost[] = [
  {
    slug: "antonym-of-the-market",
    title: "Antonym of the Market",
    description: "Nobody has a one word answer.",
    status: "published",
    date: "2025-08-21",
  },
  {
    slug: "knowledge-work-after-superintelligent-ai",
    title: "Knowledge Work After Superintelligent AI",
    description: "Every major technological wave creates new labor categories.",
    status: "published",
    date: "2026-02-09",
  },
];

// Draft posts for development (not visible in production)
export const draftPosts: DraftPost[] = [
  {
    slug: "market-antonym",
    title: "Antonym of Market",
    description: "Defining the opposite of a market to reveal what makes markets good.",
    status: "draft",
  },
  {
    slug: "markdown-feature-preview",
    title: "Markdown Feature Preview",
    description: "A local-only draft for footnotes, quotes, and link previews.",
    status: "draft",
  },
];

// SECURITY: Only expose published posts to the app (both dev and prod)
export const blogPosts: BlogPost[] = [...publishedPosts];

// Drafts stay off the index, but can be opened directly while running locally.
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const publishedPost = publishedPosts.find((p) => p.slug === slug);
  if (publishedPost) return publishedPost;

  if (import.meta.env.DEV && import.meta.env.MODE !== "production") {
    return draftPosts.find((p) => p.slug === slug);
  }

  return undefined;
}

// Runtime validation function for additional security
export function isPostAccessible(slug: string): boolean {
  return Boolean(getBlogPostBySlug(slug));
}
