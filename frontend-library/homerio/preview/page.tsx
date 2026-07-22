import { EditorialArticleCard } from "../components/EditorialArticleCard";
import { HomeCategoryCard } from "../components/HomeCategoryCard";
import { HomepageLayout } from "../layouts/HomepageLayout";
import { FooterShell } from "../shell/FooterShell";
import { HeaderShell } from "../shell/HeaderShell";
import {
  previewArticles,
  previewCategories,
  previewFooter,
  previewHeader,
  previewHero,
  previewNewsletter,
} from "./preview-data";
import "../styles/index.css";

export default function HomerioThemePreviewPage() {
  return (
    <>
      <HomepageLayout
        hero={{
          ...previewHero,
          header: <HeaderShell {...previewHeader} />,
        }}
        categories={previewCategories}
        featuredArticles={previewArticles.slice(0, 3)}
        latestArticles={previewArticles}
        categoryShowcase={{
          title: "Explore your home",
          deck: "Room-by-room ideas, practical fixes, and calm inspiration for everyday living.",
        }}
        featuredSection={{
          title: "Featured stories",
          deck: "A few useful reads chosen for a calmer, more comfortable home.",
        }}
        latestSection={{
          id: "latest-articles",
          title: "Latest articles",
          deck: "Fresh guides, ideas, and reviews from the Homerio editorial desk.",
          href: "#latest-articles",
          linkLabel: "View all",
        }}
        newsletter={previewNewsletter}
        renderArticleCard={(article, context) => (
          <EditorialArticleCard
            title={article.title}
            href={article.href}
            excerpt={context.variant === "compact" ? undefined : article.excerpt}
            image={article.image}
            category={article.category}
            date={article.date}
            readingTime={article.readingTime}
            author={context.variant === "feature" ? "ContentForge Editorial" : undefined}
            variant={context.variant}
          />
        )}
        renderCategoryCard={(category, context) => (
          <HomeCategoryCard title={category.title} href={category.href} description={category.description} image={category.image} layout={context.layout} />
        )}
      />
      <FooterShell {...previewFooter} />
    </>
  );
}
