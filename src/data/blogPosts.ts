export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  status: "published" | "draft";
}

// Published posts that will be visible in production
export const publishedPosts: BlogPost[] = [
  // No published posts - everything is in drafts for testing
];

// Draft posts for development (not visible in production)
export const draftPosts: BlogPost[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: "2000-01-01",
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
