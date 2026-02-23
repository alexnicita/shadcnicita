import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const BLOG_PUBLISHED_DIR = path.join(ROOT, "src", "blog", "published");

function parseFrontmatter(markdown) {
  const fm = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(fm);
  if (!match) {
    return { title: "", description: "", date: "", body: markdown.trim() };
  }

  const [, raw, body] = match;
  const meta = {};
  raw.split("\n").forEach((line) => {
    const [k, ...v] = line.split(":");
    if (!k || v.length === 0) return;
    meta[k.trim()] = v.join(":").trim().replace(/^['\"]|['\"]$/g, "");
  });

  return {
    title: meta.title || "",
    description: meta.description || "",
    date: meta.date || "",
    body: body.trim(),
  };
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function detectSiteOrigin() {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const cnamePath = path.join(PUBLIC_DIR, "CNAME");
  if (fs.existsSync(cnamePath)) {
    const host = fs.readFileSync(cnamePath, "utf8").trim();
    if (host) return `https://${host}`;
  }

  return "https://nicita.cc";
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/`{3}[\s\S]*?`{3}/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const siteOrigin = detectSiteOrigin();
const nowIso = new Date().toISOString();

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: nowIso },
  { path: "/blog", changefreq: "weekly", priority: "0.9", lastmod: nowIso },
  { path: "/privacy", changefreq: "yearly", priority: "0.3", lastmod: nowIso },
];

const posts = [];
if (fs.existsSync(BLOG_PUBLISHED_DIR)) {
  for (const slug of fs.readdirSync(BLOG_PUBLISHED_DIR)) {
    const mdPath = path.join(BLOG_PUBLISHED_DIR, slug, "index.md");
    if (!fs.existsSync(mdPath)) continue;
    const raw = fs.readFileSync(mdPath, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed.title) continue;

    const dateIso = parsed.date
      ? `${parsed.date}T00:00:00.000Z`
      : nowIso;

    posts.push({
      slug,
      ...parsed,
      plainText: stripMarkdown(parsed.body),
      dateIso,
      url: `${siteOrigin}/blog/${slug}`,
    });
  }
}

posts.sort((a, b) => (a.dateIso < b.dateIso ? 1 : -1));

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  ...staticPages.map(
    (page) => `  <url>
    <loc>${xmlEscape(`${siteOrigin}${page.path}`)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  ),
  ...posts.map(
    (post) => `  <url>
    <loc>${xmlEscape(post.url)}</loc>
    <lastmod>${post.dateIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
  ),
].join("\n")}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteOrigin}/sitemap.xml
`;

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Alexander Nicita</title>
    <link>${xmlEscape(`${siteOrigin}/blog`)}</link>
    <description>Essays and notes by Alexander Nicita.</description>
    <lastBuildDate>${nowIso}</lastBuildDate>
${posts
  .map(
    (post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(post.url)}</link>
      <guid>${xmlEscape(post.url)}</guid>
      <pubDate>${new Date(post.dateIso).toUTCString()}</pubDate>
      <description>${xmlEscape(post.description || "")}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

const llmsTxt = `# ${siteOrigin.replace(/^https?:\/\//, "")}

> Primary sources for writing by Alexander Nicita.

- Blog index: ${siteOrigin}/blog
- RSS feed: ${siteOrigin}/rss.xml
- Sitemap: ${siteOrigin}/sitemap.xml
- LLM full corpus: ${siteOrigin}/llms-full.txt
- Structured discovery: ${siteOrigin}/discovery.json

## Posts
${posts
  .map((post) => `- ${post.title} (${post.date || "undated"}): ${post.url}`)
  .join("\n")}
`;

const llmsFullTxt = `# ${siteOrigin.replace(/^https?:\/\//, "")} - Full Corpus

> Canonical machine-readable corpus of published posts by Alexander Nicita.
> Updated: ${nowIso}

## Site
- Home: ${siteOrigin}/
- Blog: ${siteOrigin}/blog
- RSS: ${siteOrigin}/rss.xml
- Sitemap: ${siteOrigin}/sitemap.xml
- Index: ${siteOrigin}/llms.txt

## Documents
${posts
  .map(
    (post, index) => `### ${index + 1}. ${post.title}
URL: ${post.url}
Slug: ${post.slug}
Date: ${post.date || "undated"}
Description: ${post.description || ""}

${post.plainText}
`,
  )
  .join("\n")}
`;

const discoveryJson = {
  site: {
    name: "Alexander Nicita",
    url: siteOrigin,
    updatedAt: nowIso,
  },
  endpoints: {
    home: `${siteOrigin}/`,
    blog: `${siteOrigin}/blog`,
    sitemap: `${siteOrigin}/sitemap.xml`,
    rss: `${siteOrigin}/rss.xml`,
    llms: `${siteOrigin}/llms.txt`,
    llmsFull: `${siteOrigin}/llms-full.txt`,
  },
  posts: posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    url: post.url,
    date: post.date || null,
    dateIso: post.dateIso,
    description: post.description || "",
    wordCount: post.plainText.split(/\s+/).filter(Boolean).length,
  })),
};

fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemapXml);
fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robotsTxt);
fs.writeFileSync(path.join(PUBLIC_DIR, "rss.xml"), rssXml);
fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), llmsTxt);
fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), llmsFullTxt);
fs.writeFileSync(
  path.join(PUBLIC_DIR, "discovery.json"),
  JSON.stringify(discoveryJson, null, 2),
);

console.log(`Generated discovery assets for ${posts.length} published posts.`);
