import type React from "react";

export type ArticleListProps<TArticle> = {
  articles: readonly TArticle[];
  renderArticleCard: (
    article: TArticle,
    context: {
      index: number;
      variant: "standard" | "compact";
    },
  ) => React.ReactNode;
  emptyState?: React.ReactNode;
};

export function ArticleList<TArticle>({ articles, renderArticleCard, emptyState }: ArticleListProps<TArticle>) {
  if (articles.length === 0) {
    return <div className="empty-state">{emptyState ?? "No matching stories are available yet."}</div>;
  }

  return (
    <div className="article-list">
      {articles.map((article, index) =>
        renderArticleCard(article, {
          index,
          variant: "standard",
        }),
      )}
    </div>
  );
}
