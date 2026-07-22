import { siteConfig } from "@/config/site.config";

export const seoConfig = {
  news: {
    title: "Latest Recipes",
    description: "Browse creative mocktail recipes, drink ideas, flavor guides, and beverage inspiration.",
  },
  search: {
    title: "Search Recipes",
    eyebrow: "Search",
    description: "Search mocktail recipes, ingredients, flavors, and drink ideas.",
  },
  defaults: {
    title: siteConfig.defaultSeoTitle,
    description: siteConfig.defaultSeoDescription,
    shareTitle: siteConfig.social.defaultShareTitle,
    shareDescription: siteConfig.social.defaultShareDescription,
    twitterCard: siteConfig.social.twitterCard,
  },
} as const;
