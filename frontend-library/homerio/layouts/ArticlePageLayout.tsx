import type React from "react";
import { ArticleList } from "../components/ArticleList";
import { SearchPanelShell, type SearchPanelShellProps } from "../shell/SearchPanelShell";
import { GlobalPageShell } from "./GlobalPageShell";

export type ArticlePageLayoutProps<TArticle> = {
  header: React.ReactNode;
  footer: React.ReactNode;
  searchPanel?: SearchPanelShellProps;
  breadcrumb?: React.ReactNode;
  articleHero: React.ReactNode;
  articleBody: React.ReactNode;
  relatedArticles?: readonly TArticle[];
  renderRelatedArticleCard: (
    article: TArticle,
    context: {
      index: number;
      variant: "standard" | "compact";
    },
  ) => React.ReactNode;
};

export function ArticlePageLayout<TArticle>({
  header,
  footer,
  searchPanel,
  breadcrumb,
  articleHero,
  articleBody,
  relatedArticles,
  renderRelatedArticleCard,
}: ArticlePageLayoutProps<TArticle>) {
  return (
    <GlobalPageShell header={header} footer={footer}>
      {searchPanel ? <SearchPanelShell {...searchPanel} /> : null}

      <div className="container">
        {breadcrumb}
        <article className="article-page">
          {articleHero}
          {articleBody}
        </article>

        {relatedArticles && relatedArticles.length > 0 ? (
          <section className="related-articles">
            <ArticleList articles={relatedArticles} renderArticleCard={renderRelatedArticleCard} />
          </section>
        ) : null}
      </div>
    </GlobalPageShell>
  );
}
