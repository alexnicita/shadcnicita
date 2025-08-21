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
    description:
      "Nobody has a one word answer. Volunteers, friends, family––these seem to be good choices.",
    status: "published",
    date: "2025-08-21",
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
];

// SECURITY: Only expose published posts to the app (both dev and prod)
export const blogPosts: BlogPost[] = [...publishedPosts];

// Runtime validation function for additional security
export function isPostAccessible(slug: string): boolean {
  return publishedPosts.some((p) => p.slug === slug);
}
