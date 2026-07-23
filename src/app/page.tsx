import type { Metadata } from "next";
import { EditorialArticleCard } from "@contentforge/theme-homerio/components/EditorialArticleCard";
import { HomeCategoryCard } from "@contentforge/theme-homerio/components/HomeCategoryCard";
import { HomepageLayout } from "@contentforge/theme-homerio/layouts/HomepageLayout";
import type { HomepageLayoutProps } from "@contentforge/theme-homerio/layouts/HomepageLayout";
import { homepageConfig } from "@/config/homepage.config";
import {
  getFeaturedArticle,
  listCategories,
  listHomepageArticlesByCategory,
  listLatestPublishedArticles,
  listHomepageBlocks,
} from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import type { HomepageBlock } from "@/db/seed-data";
import { buildSeoMetadata } from "@/lib/seo";
import {
  adaptHomepageArticleV2,
  adaptHomepageCategoryV2,
  type HomepageArticleV2,
  type HomepageCategoryV2,
  createHomepageLayoutPropsV2,
} from "@/theme/v2-homepage-adapter";

export async function generateMetadata(): Promise<Metadata> {
  const featured = await getFeaturedArticle();

  return await buildSeoMetadata({
    title: homepageConfig.seoTitle,
    description: homepageConfig.seoDescription,
    path: "/",
    image: featured?.coverUrl,
  });
}

function moduleLimit(block: HomepageBlock | null, fallback: number, max: number) {
  return Math.min(Math.max(0, block?.displayCount ?? fallback), max);
}

export default async function HomePage() {
  const blocks = await listHomepageBlocks();
  const blockMap = new Map(blocks.map((block) => [block.key, block]));
  const getBlock = (key: string): HomepageBlock | null => blockMap.get(key) ?? null;
  const leadBlock = getBlock("lead");
  const featuredListsBlock = getBlock("heat");
  const genreGuidesBlock = getBlock("tags");
  const categoryBlock = getBlock("category-shortcuts");
  const popularRecommendationsBlock = getBlock("feed");
  const latestNewsBlock = getBlock("editor-picks");
  const genreGuidesLimit = moduleLimit(genreGuidesBlock, homepageConfig.limits.genreGuides, homepageConfig.limits.genreGuides);
  const featuredListsLimit = moduleLimit(featuredListsBlock, homepageConfig.limits.featuredLists, homepageConfig.limits.featuredLists);
  const latestNewsLimit = homepageConfig.limits.latestNews;
  const popularRecommendationsLimit = moduleLimit(
    popularRecommendationsBlock,
    homepageConfig.limits.popularRecommendations,
    homepageConfig.limits.popularRecommendations,
  );
  const [featured, genreGuidesArticles, featuredListsArticles, latestNewsArticles, popularRecommendationArticles, categories, identity] =
    await Promise.all([
    getFeaturedArticle(),
    listHomepageArticlesByCategory(homepageConfig.categorySlugs.genreGuides, genreGuidesLimit + 1),
    listHomepageArticlesByCategory(homepageConfig.categorySlugs.featuredLists, featuredListsLimit + 1),
    listLatestPublishedArticles(latestNewsLimit + 1),
    listHomepageArticlesByCategory(homepageConfig.categorySlugs.popularRecommendations, popularRecommendationsLimit + 1),
    listCategories(),
    getSiteIdentitySettings(),
  ]);
  const genreGuidesPreview = genreGuidesArticles.slice(0, genreGuidesLimit);
  const featuredListsPreview = featuredListsArticles.slice(0, featuredListsLimit);
  const latestNewsPreview = latestNewsArticles.slice(0, latestNewsLimit);
  const popularRecommendationsPreview = popularRecommendationArticles.slice(0, popularRecommendationsLimit);
  const categoryPreview = categoryBlock ? categories : [];
  const featuredArticleItems = [
    ...(leadBlock && featured ? [featured] : []),
    ...(featuredListsBlock ? featuredListsPreview : []),
    ...(genreGuidesBlock ? genreGuidesPreview : []),
  ].slice(0, Math.max(featuredListsLimit, 1));
  const latestArticleItems = [
    ...(latestNewsBlock ? latestNewsPreview : []),
    ...(popularRecommendationsBlock ? popularRecommendationsPreview : []),
  ].slice(0, latestNewsLimit);
  const homepageProps: HomepageLayoutProps<HomepageArticleV2, HomepageCategoryV2> = {
    ...createHomepageLayoutPropsV2({
      identity,
      categories: categoryPreview.map(adaptHomepageCategoryV2),
      featuredArticles: featuredArticleItems.map(adaptHomepageArticleV2),
      latestArticles: latestArticleItems.map(adaptHomepageArticleV2),
    }),
    renderArticleCard: (article, context) => (
      <EditorialArticleCard
        title={article.title}
        titleLevel="h3"
        href={article.href}
        excerpt={context.variant === "compact" ? undefined : article.excerpt}
        image={article.image}
        category={article.category}
        date={article.date}
        readingTime={article.readingTime}
        author={context.variant === "feature" ? article.author : undefined}
        variant={context.variant}
      />
    ),
    renderCategoryCard: (category, context) => (
      <HomeCategoryCard
        title={category.title}
        href={category.href}
        description={category.description}
        image={category.image}
        layout={context.layout}
      />
    ),
  };

  return <HomepageLayout {...homepageProps} />;
}
