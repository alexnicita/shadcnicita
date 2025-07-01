import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import BaseLayout from "./shared/BaseLayout";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

// Import the same blog posts data from BlogIndex
const blogPosts: BlogPost[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: new Date().toISOString().split("T")[0],
    description: "Description",
  },
  {
    slug: "sample-post",
    title: "Sample Post",
    date: new Date().toISOString().split("T")[0],
    description: "Another test post for the blog",
  },
];

interface PostData {
  title: string;
  date: string;
  description: string;
  content: string;
}

interface PostMetadata {
  title?: string;
  date?: string;
  description?: string;
}

function parseMarkdown(text: string): PostData {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = text.match(frontmatterRegex);

  if (!match) {
    return {
      title: "Untitled",
      date: "",
      description: "",
      content: text,
    };
  }

  const [, frontmatter, content] = match;
  const metadata: PostMetadata = {};

  frontmatter.split("\n").forEach((line) => {
    const [key, ...value] = line.split(":");
    if (key && value.length) {
      const cleanKey = key.trim() as keyof PostMetadata;
      const cleanValue = value
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
      metadata[cleanKey] = cleanValue;
    }
  });

  return {
    title: metadata.title || "Untitled",
    date: metadata.date || "",
    description: metadata.description || "",
    content: content.trim(),
  };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        // Find the blog post data from our array
        const blogPostData = blogPosts.find((p) => p.slug === slug);
        if (!blogPostData) {
          setError("Post not found");
          return;
        }

        // Dynamic import of the markdown file
        const module = await import(`../blog/${slug}/index.md?raw`);
        const markdownText = module.default;
        const parsedData = parseMarkdown(markdownText);

        // Use the title and date from blogPosts array, content from markdown
        const postData: PostData = {
          title: blogPostData.title,
          date: blogPostData.date,
          description: blogPostData.description,
          content: parsedData.content,
        };

        setPost(postData);
      } catch (err) {
        console.error("Error loading post:", err);
        setError("Post not found");
      }
    };

    loadPost();
  }, [slug]);

  if (error || !post) {
    return (
      <BaseLayout
        showLoading={isLoading}
        loadingText="✍️🧐"
        className="p-8 md:p-16"
      >
        <header className="flex justify-between items-center mb-16">
          <Link
            to="/blog"
            className="text-2xl font-bold hover:text-muted-foreground transition-colors"
          >
            ←
          </Link>
        </header>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      showLoading={isLoading}
      loadingText="✍️🧐"
      className="p-8 md:p-16"
    >
      <header className="flex justify-between items-center mb-16">
        <Link
          to="/blog"
          className="text-2xl font-bold hover:text-muted-foreground transition-colors"
        >
          ←
        </Link>
      </header>

      <div className="max-w-2xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            {post.date && (
              <p className="text-muted-foreground text-sm">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => {
                  // Handle relative image paths - convert to public folder paths
                  let imageSrc = src;
                  if (src?.startsWith("./")) {
                    const filename = src.slice(2); // Remove "./"
                    imageSrc = `/${filename}`; // Serve from public folder
                  }

                  return (
                    <img
                      src={imageSrc}
                      alt={alt}
                      className="max-w-full h-auto rounded-lg"
                      style={{
                        maxWidth: "400px",
                        margin: "2rem auto",
                        display: "block",
                      }}
                    />
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </BaseLayout>
  );
}
