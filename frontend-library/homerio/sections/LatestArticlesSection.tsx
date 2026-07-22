import type React from "react";
import { HomeSectionHeading } from "../components/HomeSectionHeading";
import { LatestArticlesGrid } from "../components/LatestArticlesGrid";

export type LatestArticlesSectionProps<TArticle> = {
  id?: string;
  title: React.ReactNode;
  deck?: React.ReactNode;
  href?: string;
  linkLabel?: React.ReactNode;
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

export function LatestArticlesSection<TArticle>({
  id,
  title,
  deck,
  href,
  linkLabel,
  articles,
  renderArticleCard,
}: LatestArticlesSectionProps<TArticle>) {
  return (
    <section className="home-editorial-section latest-articles-section" id={id}>
      <HomeSectionHeading title={title} deck={deck} href={href} linkLabel={linkLabel} />
      <LatestArticlesGrid
        items={articles}
        renderCard={(article, context) =>
          renderArticleCard(article, {
            index: context.index,
            variant: "standard",
            priorityImage: false,
          })
        }
      />
    </section>
  );
}
