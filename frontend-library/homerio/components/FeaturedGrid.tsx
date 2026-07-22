import type { ReactNode } from "react";

type FeaturedGridCardContext = {
  index: number;
  variant: "feature" | "compact";
  priorityImage: boolean;
};

export type FeaturedGridProps<TItem> = {
  items: readonly TItem[];
  renderCard: (item: TItem, context: FeaturedGridCardContext) => ReactNode;
  emptyState?: ReactNode;
  maxItems?: number;
  className?: string;
  secondaryClassName?: string;
};

export function FeaturedGrid<TItem>({
  items,
  renderCard,
  emptyState = null,
  maxItems = 3,
  className = "featured-grid",
  secondaryClassName = "featured-secondary-stack",
}: FeaturedGridProps<TItem>) {
  if (items.length === 0) {
    return emptyState;
  }

  const [primary, ...secondary] = items.slice(0, maxItems);

  return (
    <div className={className}>
      {renderCard(primary, { index: 0, variant: "feature", priorityImage: true })}
      {secondary.length > 0 ? (
        <div className={secondaryClassName}>
          {secondary.map((item, index) => renderCard(item, { index: index + 1, variant: "compact", priorityImage: true }))}
        </div>
      ) : null}
    </div>
  );
}
