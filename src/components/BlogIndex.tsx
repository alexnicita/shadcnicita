import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BaseLayout from "./shared/BaseLayout";
import { blogPosts } from "../data/blogPosts";

export default function BlogIndex() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BaseLayout
      showLoading={isLoading}
      loadingText="✍️🧐"
      className="p-8 md:p-16"
    >
      <header className="flex justify-between items-center mb-16">
        <a
          href="/"
          className="text-2xl font-bold hover:text-muted-foreground transition-colors"
        >
          ←
        </a>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-8">
              <Link to={`/blog/${post.slug}`} className="group block">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-muted-foreground transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-muted-foreground">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}
