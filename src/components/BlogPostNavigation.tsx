import { Link } from "react-router-dom";
import { publishedPosts } from "../data/blogPosts";

interface BlogPostNavigationProps {
  currentSlug: string;
}

const orderedPublishedPosts = [...publishedPosts]
  .sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });

export default function BlogPostNavigation({
  currentSlug,
}: BlogPostNavigationProps) {
  if (orderedPublishedPosts.length < 2) return null;

  const currentIndex = orderedPublishedPosts.findIndex(
    (post) => post.slug === currentSlug,
  );
  if (currentIndex === -1) return null;

  const nextIndex = (currentIndex + 1) % orderedPublishedPosts.length;
  const nextPost = orderedPublishedPosts[nextIndex];

  return (
    <nav className="mt-14 border-t border-border pt-8" aria-label="Blog post">
      <Link
        to={`/blog/${nextPost.slug}`}
        className="group flex w-full justify-end text-right text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground md:text-base"
      >
        <span>NEXT →</span>
      </Link>
    </nav>
  );
}
