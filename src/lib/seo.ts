import { useEffect } from "react";

interface SeoConfig {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "Alexander Nicita";
const DEFAULT_IMAGE_PATH = "/og-image.svg";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
): void {
  let tag = document.head.querySelector(
    `meta[${attribute}="${key}"]`,
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  let tag = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export function useSeo(config: SeoConfig): void {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${config.path}`;
    const imageUrl = `${origin}${DEFAULT_IMAGE_PATH}`;
    const fullTitle = `${config.title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta("name", "description", config.description);
    upsertLink("canonical", canonicalUrl);

    upsertMeta("property", "og:type", config.type ?? "website");
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:title", config.title);
    upsertMeta("property", "og:description", config.description);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:site_name", SITE_NAME);

    if (config.publishedTime) {
      upsertMeta("property", "article:published_time", config.publishedTime);
    }

    if (config.modifiedTime) {
      upsertMeta("property", "article:modified_time", config.modifiedTime);
    }

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:url", canonicalUrl);
    upsertMeta("name", "twitter:title", config.title);
    upsertMeta("name", "twitter:description", config.description);
    upsertMeta("name", "twitter:image", imageUrl);

    const jsonLdId = "jsonld-primary";
    const existing = document.getElementById(jsonLdId);
    if (existing) {
      existing.remove();
    }

    if (config.jsonLd) {
      const script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(config.jsonLd);
      document.head.appendChild(script);
    }
  }, [config]);
}
