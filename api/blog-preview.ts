import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs";
import path from "node:path";

function parseFrontmatter(markdown: string): {
  title?: string;
  description?: string;
  date?: string;
  content: string;
} {
  const fm = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(fm);
  if (!match) return { content: markdown };
  const [, raw, content] = match;
  const meta: Record<string, string> = {};
  raw.split("\n").forEach((line) => {
    const [k, ...v] = line.split(":");
    if (!k || v.length === 0) return;
    const key = k.trim();
    const value = v.join(":").trim().replace(/^['"]|['"]$/g, "");
    meta[key] = value;
  });
  return {
    title: meta.title,
    description: meta.description,
    date: meta.date,
    content: content.trim(),
  };
}

function firstSentence(text: string): string {
  const cleaned = text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  return sentences[0] || "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = (req.query.slug as string) || "";
  if (!slug) {
    res.status(400).send("Missing slug");
    return;
  }

  // Resolve markdown path only from published posts for previews
  const mdPath = path.join(process.cwd(), "src", "blog", "published", slug, "index.md");
  if (!fs.existsSync(mdPath)) {
    res.status(404).send("Not found");
    return;
  }

  let markdown = "";
  try {
    markdown = fs.readFileSync(mdPath, "utf8");
  } catch {
    res.status(500).send("Failed to read content");
    return;
  }

  const { title, description, content, date } = parseFrontmatter(markdown);
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "nicita.cc") as string;
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const origin = `${proto}://${host}`;
  const url = `${origin}/blog/${slug}`;
  const desc = description && description.trim().length > 0 ? description : firstSentence(content);
  const image = `${origin}/og-image.svg`;
  const safeTitle = (title && title.trim()) || "Blog Post";
  const safeDesc = (desc && desc.trim()) || "Read the latest article.";
  const safeDate = date && date.trim() ? `${date}T00:00:00.000Z` : undefined;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: safeTitle,
    description: safeDesc,
    ...(safeDate ? { datePublished: safeDate, dateModified: safeDate } : {}),
    author: { "@type": "Person", name: "Alexander Nicita" },
    publisher: { "@type": "Person", name: "Alexander Nicita" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <meta name="description" content="${escapeHtml(safeDesc)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(safeTitle)}" />
    <meta property="og:description" content="${escapeHtml(safeDesc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    ${safeDate ? `<meta property="article:published_time" content="${safeDate}" />` : ""}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(safeTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(safeDesc)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
  </head>
  <body>
    <article>
      <h1>${escapeHtml(safeTitle)}</h1>
      <p>${escapeHtml(safeDesc)}</p>
      <p><a href="${url}">Read article</a></p>
    </article>
  </body>
 </html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
