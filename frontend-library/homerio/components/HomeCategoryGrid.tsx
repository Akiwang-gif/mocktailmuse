import type { CSSProperties, Key, ReactNode } from "react";

type HomeCategoryGridLayout = "portrait" | "landscape";

type HomeCategoryGridColumns = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

export type HomeCategoryGridProps<TItem> = {
  items: readonly TItem[];
  renderCard: (
    item: TItem,
    context: {
      index: number;
      layout: HomeCategoryGridLayout;
    },
  ) => ReactNode;
  getItemKey?: (item: TItem, index: number) => Key;
  getLayout?: (item: TItem, index: number) => HomeCategoryGridLayout;
  emptyState?: ReactNode;
  columns?: HomeCategoryGridColumns;
  className?: string;
};

type HomeCategoryGridStyle = CSSProperties & {
  "--home-category-grid-mobile-columns"?: number;
  "--home-category-grid-tablet-columns"?: number;
  "--home-category-grid-desktop-columns"?: number;
};

export function HomeCategoryGrid<TItem>({
  items,
  renderCard,
  getItemKey,
  getLayout,
  emptyState = null,
  columns,
  className = "home-category-grid",
}: HomeCategoryGridProps<TItem>) {
  if (items.length === 0) {
    return emptyState;
  }

  const style: HomeCategoryGridStyle | undefined = columns
    ? {
        "--home-category-grid-mobile-columns": columns.mobile,
        "--home-category-grid-tablet-columns": columns.tablet,
        "--home-category-grid-desktop-columns": columns.desktop,
      }
    : undefined;

  return (
    <div className={className} style={style}>
      {items.map((item, index) => {
        const layout = getLayout ? getLayout(item, index) : index < 4 ? "portrait" : "landscape";
        return renderCard(item, { index, layout });
      })}
    </div>
  );
}
