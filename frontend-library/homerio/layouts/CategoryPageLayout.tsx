import type React from "react";
import Image from "next/image";
import { ArticleList } from "../components/ArticleList";
import { GlobalPageShell } from "./GlobalPageShell";
import type { ThemeImage } from "../media/media-types";
import { SearchPanelShell, type SearchPanelShellProps } from "../shell/SearchPanelShell";

export type CategoryPageLayoutProps<TArticle> = {
  header: React.ReactNode;
  footer: React.ReactNode;
  hero: {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    countLabel?: React.ReactNode;
    image?: ThemeImage;
  };
  searchPanel?: SearchPanelShellProps;
  articles: readonly TArticle[];
  sidebar?: React.ReactNode;
  pagination?: React.ReactNode;
  renderArticleCard: (
    article: TArticle,
    context: {
      index: number;
      variant: "standard" | "compact";
    },
  ) => React.ReactNode;
};

export function CategoryPageLayout<TArticle>({
  header,
  footer,
  hero,
  searchPanel,
  articles,
  sidebar,
  pagination,
  renderArticleCard,
}: CategoryPageLayoutProps<TArticle>) {
  return (
    <GlobalPageShell header={header} footer={footer}>
      <section className="category-hero">
        <div className="container category-hero-inner">
          <div className="category-hero-copy">
            {hero.eyebrow ? <span className="eyebrow">{hero.eyebrow}</span> : null}
            <h1>{hero.title}</h1>
            {hero.description ? <p>{hero.description}</p> : null}
            {hero.countLabel ? <em>{hero.countLabel}</em> : null}
          </div>
          {hero.image ? (
            <div className="category-hero-media">
              <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(max-width: 900px) 100vw, 46vw" />
            </div>
          ) : null}
        </div>
      </section>

      {searchPanel ? <SearchPanelShell {...searchPanel} /> : null}

      <div className="container content-grid category-layout">
        <section className="category-results">
          {pagination}
          <ArticleList articles={articles} renderArticleCard={renderArticleCard} />
        </section>
        {sidebar}
      </div>
    </GlobalPageShell>
  );
}
