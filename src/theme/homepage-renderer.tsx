import type { Key, ReactNode } from "react";

import { loadHomepageThemeComponents } from "./homepage-adapter";

export type HomepageThemeImage = {
  src: string;
  alt: string;
};

export type HomepageThemeCategory = {
  id?: Key;
  title: ReactNode;
  href: string;
  description?: ReactNode;
  image?: HomepageThemeImage;
};

export type HomepageThemeArticle = {
  id?: Key;
  title: ReactNode;
  href: string;
  summary?: ReactNode;
  excerpt?: ReactNode;
  image?: HomepageThemeImage;
  category?: {
    label: string;
    href?: string;
  };
  date?: {
    label: string;
    dateTime?: string;
  };
  readingTime?: string;
  author?: ReactNode;
};

export type HomepageThemeRendererLabels = {
  featuredTitle?: ReactNode;
  featuredDeck?: ReactNode;
  latestTitle?: ReactNode;
  latestDeck?: ReactNode;
  categoriesTitle?: ReactNode;
  categoriesDeck?: ReactNode;
};

export type HomepageThemeRendererProps = {
  featuredArticle?: HomepageThemeArticle | null;
  latestArticles?: readonly HomepageThemeArticle[];
  categories?: readonly HomepageThemeCategory[];
  featuredLists?: readonly HomepageThemeArticle[];
  labels?: HomepageThemeRendererLabels;
};

export async function HomepageThemeRenderer({
  featuredArticle,
  latestArticles = [],
  categories = [],
  featuredLists = [],
  labels,
}: HomepageThemeRendererProps) {
  const components = await loadHomepageThemeComponents();
  const ArticleCard = components.articleCard;
  const CategoryCard = components.categoryCard;
  const FeaturedGrid = components.featuredGrid;
  const LatestArticlesGrid = components.latestArticlesGrid;
  const CategoryGrid = components.categoryGrid;
  const SectionHeading = components.homeSectionHeading;

  const featuredItems = [featuredArticle, ...featuredLists].filter(isArticle);
  const categoryItems = categories.filter(hasCategoryImage);

  return (
    <main className="theme-homepage-renderer" data-theme-renderer="homepage">
      <section className="theme-homepage-section theme-homepage-featured">
        <SectionHeading
          title={labels?.featuredTitle ?? "Featured"}
          deck={labels?.featuredDeck ?? "Highlighted stories selected for the homepage."}
        />
        <FeaturedGrid
          items={featuredItems}
          emptyState={<p className="theme-homepage-empty">No featured articles available yet.</p>}
          renderCard={(article: HomepageThemeArticle, context: { variant: "feature" | "compact" }) => (
            <ArticleCard {...articleCardProps(article)} variant={context.variant} />
          )}
        />
      </section>

      <section className="theme-homepage-section theme-homepage-categories">
        <SectionHeading
          title={labels?.categoriesTitle ?? "Categories"}
          deck={labels?.categoriesDeck ?? "Browse homepage categories."}
        />
        <CategoryGrid
          items={categoryItems}
          emptyState={<p className="theme-homepage-empty">No categories available yet.</p>}
          getItemKey={categoryKey}
          renderCard={(category: HomepageThemeCategory, context: { layout: "portrait" | "landscape" }) => (
            <CategoryCard
              title={category.title}
              href={category.href}
              description={category.description}
              image={category.image}
              layout={context.layout}
            />
          )}
        />
      </section>

      <section className="theme-homepage-section theme-homepage-latest">
        <SectionHeading
          title={labels?.latestTitle ?? "Latest"}
          deck={labels?.latestDeck ?? "Recent articles from the publishing workflow."}
        />
        <LatestArticlesGrid
          items={latestArticles}
          emptyState={<p className="theme-homepage-empty">No latest articles available yet.</p>}
          getItemKey={articleKey}
          renderCard={(article: HomepageThemeArticle) => <ArticleCard {...articleCardProps(article)} />}
        />
      </section>
    </main>
  );
}

function articleCardProps(article: HomepageThemeArticle) {
  return {
    title: article.title,
    href: article.href,
    excerpt: article.excerpt ?? article.summary,
    image: article.image,
    category: article.category,
    date: article.date,
    readingTime: article.readingTime,
    author: article.author,
  };
}

function isArticle(value: HomepageThemeArticle | null | undefined): value is HomepageThemeArticle {
  return Boolean(value);
}

function hasCategoryImage(category: HomepageThemeCategory): category is HomepageThemeCategory & { image: HomepageThemeImage } {
  return Boolean(category.image);
}

function articleKey(article: HomepageThemeArticle, index: number): Key {
  return article.id ?? article.href ?? index;
}

function categoryKey(category: HomepageThemeCategory, index: number): Key {
  return category.id ?? category.href ?? index;
}
