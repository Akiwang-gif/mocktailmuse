import type React from "react";
import { HomeCategoryGrid } from "../components/HomeCategoryGrid";
import { HomeSectionHeading } from "../components/HomeSectionHeading";

export type CategoryShowcaseSectionProps<TCategory> = {
  title: React.ReactNode;
  deck?: React.ReactNode;
  categories: readonly TCategory[];
  renderCategoryCard: (
    category: TCategory,
    context: {
      index: number;
      layout: "portrait" | "landscape";
    },
  ) => React.ReactNode;
};

export function CategoryShowcaseSection<TCategory>({
  title,
  deck,
  categories,
  renderCategoryCard,
}: CategoryShowcaseSectionProps<TCategory>) {
  return (
    <section className="category-showcase">
      <HomeSectionHeading title={title} deck={deck} />
      <HomeCategoryGrid items={categories} renderCard={renderCategoryCard} />
    </section>
  );
}
