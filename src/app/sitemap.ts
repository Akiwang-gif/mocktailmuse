import type { MetadataRoute } from "next";
import { listCategories, listPublishedArticles, listTags } from "@/db/repositories/content";
import { publicCategoryMetaBySlug } from "@/lib/category-slugs";
import { canonicalUrl } from "@/lib/seo";

const staticPages = [
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/editorial-policy",
  "/affiliate-disclosure",
  "/dmca-copyright",
  "/recipe-disclaimer",
  "/accessibility-statement",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tags] = await Promise.all([listPublishedArticles(), listTags()]);
  const publicCategorySlugs = Object.keys(publicCategoryMetaBySlug);

  return [
    {
      url: canonicalUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: canonicalUrl("/news"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...staticPages.map((path) => ({
      url: canonicalUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...articles.map((article) => ({
      url: canonicalUrl(`/news/${article.slug}`),
      lastModified: article.updatedAt || article.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...publicCategorySlugs.map((slug) => ({
      url: canonicalUrl(`/category/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tags.map((tag) => ({
      url: canonicalUrl(`/tag/${tag.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
