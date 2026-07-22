import type React from "react";
import { ArticleList } from "../components/ArticleList";
import {
  SearchPanelShell,
  type SearchPanelShellProps,
} from "../shell/SearchPanelShell";
import { GlobalPageShell } from "./GlobalPageShell";

export type ArchivePageLayoutProps<TArticle> = {
  header: React.ReactNode;
  footer: React.ReactNode;
  searchPanel?: SearchPanelShellProps;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
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

export function ArchivePageLayout<TArticle>({
  header,
  footer,
  searchPanel,
  title,
  eyebrow,
  articles,
  sidebar,
  pagination,
  renderArticleCard,
}: ArchivePageLayoutProps<TArticle>) {
  return (
    <GlobalPageShell header={header} footer={footer}>
      {searchPanel ? <SearchPanelShell {...searchPanel} /> : null}

      <div className="container content-grid">
        <section className="category-results">
          <div className="section-title" style={{ marginTop: 0 }}>
            <div>
              {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
              <h1>{title}</h1>
            </div>
          </div>

          <ArticleList articles={articles} renderArticleCard={renderArticleCard} />
          {pagination}
        </section>

        {sidebar}
      </div>
    </GlobalPageShell>
  );
}
