import type { CSSProperties, Key, ReactNode } from "react";

type LatestArticlesGridColumns = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

export type LatestArticlesGridProps<TItem> = {
  items: readonly TItem[];
  renderCard: (
    item: TItem,
    context: {
      index: number;
    },
  ) => ReactNode;
  getItemKey?: (item: TItem, index: number) => Key;
  emptyState?: ReactNode;
  columns?: LatestArticlesGridColumns;
  className?: string;
};

type LatestArticlesGridStyle = CSSProperties & {
  "--latest-articles-grid-mobile-columns"?: number;
  "--latest-articles-grid-tablet-columns"?: number;
  "--latest-articles-grid-desktop-columns"?: number;
};

export function LatestArticlesGrid<TItem>({
  items,
  renderCard,
  getItemKey,
  emptyState = null,
  columns,
  className = "latest-articles-grid",
}: LatestArticlesGridProps<TItem>) {
  if (items.length === 0) {
    return emptyState;
  }

  const style: LatestArticlesGridStyle | undefined = columns
    ? {
        "--latest-articles-grid-mobile-columns": columns.mobile,
        "--latest-articles-grid-tablet-columns": columns.tablet,
        "--latest-articles-grid-desktop-columns": columns.desktop,
      }
    : undefined;

  return (
    <div className={className} style={style}>
      {items.map((item, index) => renderCard(item, { index }))}
    </div>
  );
}
