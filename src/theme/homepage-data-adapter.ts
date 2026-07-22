import type { ArticleView } from "@/db/repositories/content";
import type { Category } from "@/db/seed-data";

import type { HomepageThemeArticle, HomepageThemeCategory } from "./homepage-renderer";

export function adaptHomepageArticle(article: ArticleView): HomepageThemeArticle {
  return {
    id: article.id,
    title: article.title,
    href: `/news/${article.slug}`,
    summary: article.summary,
    image: article.coverUrl
      ? {
          src: article.coverUrl,
          alt: article.title,
        }
      : undefined,
    category: {
      label: article.category.name,
      href: `/category/${article.category.slug}`,
    },
    date: article.publishedAt
      ? {
          label: formatArticleDate(article.publishedAt),
          dateTime: article.publishedAt,
        }
      : undefined,
    author: "Mocktail Muse Editorial Team",
  };
}

export function adaptHomepageCategory(category: Category): HomepageThemeCategory {
  return {
    id: category.id,
    title: category.name,
    href: `/category/${category.slug}`,
    description: category.description,
  };
}

function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
