import type React from "react";
import { CategoryShowcaseSection } from "../sections/CategoryShowcaseSection";
import { FeaturedArticlesSection } from "../sections/FeaturedArticlesSection";
import { HomeHero, type HomeHeroProps } from "../sections/HomeHero";
import { LatestArticlesSection } from "../sections/LatestArticlesSection";
import { NewsletterBlock, type NewsletterBlockProps } from "../sections/NewsletterBlock";

export type HomepageLayoutProps<TArticle, TCategory> = {
  hero: HomeHeroProps;
  categories: readonly TCategory[];
  featuredArticles: readonly TArticle[];
  latestArticles: readonly TArticle[];
  categoryShowcase: {
    title: React.ReactNode;
    deck?: React.ReactNode;
  };
  featuredSection: {
    title: React.ReactNode;
    deck?: React.ReactNode;
  };
  latestSection: {
    id?: string;
    title: React.ReactNode;
    deck?: React.ReactNode;
    href?: string;
    linkLabel?: React.ReactNode;
  };
  newsletter?: NewsletterBlockProps;
  footer?: React.ReactNode;
  renderArticleCard: (
    article: TArticle,
    context: {
      index: number;
      variant: "feature" | "standard" | "compact";
      priorityImage: boolean;
    },
  ) => React.ReactNode;
  renderCategoryCard: (
    category: TCategory,
    context: {
      index: number;
      layout: "portrait" | "landscape";
    },
  ) => React.ReactNode;
};

export function HomepageLayout<TArticle, TCategory>({
  hero,
  categories,
  featuredArticles,
  latestArticles,
  categoryShowcase,
  featuredSection,
  latestSection,
  newsletter,
  footer,
  renderArticleCard,
  renderCategoryCard,
}: HomepageLayoutProps<TArticle, TCategory>) {
  return (
    <main className="site-shell">
      <HomeHero {...hero} />

      <div className="container newspaper-home">
        <CategoryShowcaseSection
          title={categoryShowcase.title}
          deck={categoryShowcase.deck}
          categories={categories}
          renderCategoryCard={renderCategoryCard}
        />

        <FeaturedArticlesSection
          title={featuredSection.title}
          deck={featuredSection.deck}
          articles={featuredArticles}
          renderArticleCard={renderArticleCard}
        />

        <LatestArticlesSection
          id={latestSection.id}
          title={latestSection.title}
          deck={latestSection.deck}
          href={latestSection.href}
          linkLabel={latestSection.linkLabel}
          articles={latestArticles}
          renderArticleCard={renderArticleCard}
        />

        {newsletter ? <NewsletterBlock {...newsletter} /> : null}
      </div>

      {footer}
    </main>
  );
}
