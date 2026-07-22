import { siteConfig } from "@/config/site.config";

export const homepageConfig = {
  seoTitle: siteConfig.defaultSeoTitle,
  seoDescription: siteConfig.defaultSeoDescription,
  hiddenTitle: siteConfig.defaultSeoTitle,
  labels: {
    leadStory: "Featured Drink",
    genreGuides: "Flavor Guides",
    featuredLists: "Featured Drinks",
    categoryIndex: "Drink Categories",
    latestNews: "Latest Recipes",
    popularRecommendations: "Popular Recipes",
    viewAll: "View All",
    leadStoryEmpty: "No featured drink available yet.",
    noGenreGuides: "No flavor guides available yet.",
    noFeaturedLists: "No featured drinks available yet.",
    noPublishedArticles: "No recipes published yet.",
    noPopularRecommendations: "No popular recipes are available yet.",
    popularRecommendationsDeck: "Reader favorites, seasonal drinks, and creative mocktail ideas",
  },
  categorySlugs: {
    genreGuides: "flavor-guides",
    featuredLists: "collections",
    popularRecommendations: "recipes",
  },
  categoryDisplaySlugs: {
    primary: ["recipes", "flavor-guides", "collections", "lifestyle", "essentials", "experiences"],
  },
  limits: {
    featuredLists: 4,
    genreGuides: 3,
    latestNews: 5,
    popularRecommendations: 4,
  },
} as const;
