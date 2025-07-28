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
  // No published posts - everything is in drafts for testing
];

// Draft posts for development (not visible in production)
export const draftPosts: DraftPost[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    description: "Description",
    status: "draft",
  },
];

// SECURITY: Environment-based filtering
// Production builds will ONLY include published posts
// Development builds include both published and draft posts
const isProduction = import.meta.env.MODE === "production";

export const blogPosts: BlogPost[] = [
  ...publishedPosts,
  // Only include drafts in development - NEVER in production
  ...(isProduction ? [] : draftPosts),
];

// Runtime validation function for additional security
export function isPostAccessible(slug: string): boolean {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return false;

  // In production, only published posts are accessible
  if (isProduction && post.status !== "published") {
    return false;
  }

  return true;
}
