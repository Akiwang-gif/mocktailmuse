import type React from "react";
import { FeaturedGrid } from "../components/FeaturedGrid";
import { HomeSectionHeading } from "../components/HomeSectionHeading";

export type FeaturedArticlesSectionProps<TArticle> = {
  title: React.ReactNode;
  deck?: React.ReactNode;
  articles: readonly TArticle[];
  renderArticleCard: (
    article: TArticle,
    context: {
      index: number;
      variant: "feature" | "standard" | "compact";
      priorityImage: boolean;
    },
  ) => React.ReactNode;
};

export function FeaturedArticlesSection<TArticle>({
  title,
  deck,
  articles,
  renderArticleCard,
}: FeaturedArticlesSectionProps<TArticle>) {
  return (
    <section className="home-editorial-section featured-articles-section">
      <HomeSectionHeading title={title} deck={deck} />
      <FeaturedGrid items={articles} renderCard={renderArticleCard} />
    </section>
  );
}
