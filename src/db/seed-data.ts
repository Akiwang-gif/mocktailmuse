import { siteConfig } from "@/config/site.config";
import { homepageConfig } from "@/config/homepage.config";

export type ArticleStatus = "draft" | "published" | "archived";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  enabled: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  enabled: boolean;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  bodyHtml: string;
  coverUrl: string;
  categoryId: number;
  tagIds: number[];
  status: ArticleStatus;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder?: number;
  viewCount: number;
  publishedAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface HomepageBlock {
  id: number;
  key: string;
  title: string;
  blockType: "lead" | "heat" | "category_shortcuts" | "feed" | "tags" | "topics" | "editor_picks";
  enabled: boolean;
  sortOrder: number;
  displayCount: number;
  config: Record<string, unknown>;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Mocktail Recipes",
    slug: "mocktail-recipes",
    description: "Creative alcohol-free drink recipes and step-by-step mocktail ideas.",
    sortOrder: 1,
    enabled: true,
    seoTitle: "Mocktail Recipes",
    seoDescription: "Creative alcohol-free drink recipes and step-by-step mocktail ideas.",
  },
  {
    id: 2,
    name: "Flavor Guides",
    slug: "flavor-guides",
    description: "Guides to balancing flavors, ingredients, sweetness, acidity, and aroma.",
    sortOrder: 2,
    enabled: true,
    seoTitle: "Flavor Guides",
    seoDescription: "Guides to balancing mocktail flavors, ingredients, sweetness, acidity, and aroma.",
  },
  {
    id: 3,
    name: "Featured Drinks",
    slug: "featured-drinks",
    description: "Curated drink collections and standout mocktail inspirations.",
    sortOrder: 3,
    enabled: true,
    seoTitle: "Featured Drinks",
    seoDescription: "Curated drink collections and standout mocktail inspirations.",
  },
  {
    id: 4,
    name: "Drink Collections",
    slug: "drink-collections",
    description: "Seasonal drinks, party ideas, and themed mocktail collections.",
    sortOrder: 4,
    enabled: true,
    seoTitle: "Drink Collections",
    seoDescription: "Seasonal drinks, party ideas, and themed alcohol-free drink collections.",
  },
];

export const tags: Tag[] = [
  { id: 1, name: "Refreshing", slug: "refreshing", description: "Bright, crisp, and cooling mocktail ideas.", sortOrder: 1, enabled: true },
  { id: 2, name: "Citrus", slug: "citrus", description: "Lemon, lime, grapefruit, orange, and other citrus-forward drinks.", sortOrder: 2, enabled: true },
  { id: 3, name: "Summer", slug: "summer", description: "Warm-weather drinks for patios, picnics, and sunny afternoons.", sortOrder: 3, enabled: true },
  { id: 4, name: "Party Drinks", slug: "party-drinks", description: "Batchable, festive, and crowd-friendly alcohol-free drinks.", sortOrder: 4, enabled: true },
  { id: 5, name: "Classic", slug: "classic", description: "Timeless mocktail formats and non-alcoholic classics.", sortOrder: 5, enabled: true },
  { id: 6, name: "Healthy", slug: "healthy", description: "Balanced drinks with fresh fruit, herbs, teas, and lighter sweetness.", sortOrder: 6, enabled: true },
];

export const articles: Article[] = [
  {
    id: 1,
    title: "Cucumber Lime Cooler for Hot Afternoons",
    slug: "cucumber-lime-cooler-hot-afternoons",
    summary: "A crisp alcohol-free cooler built with cucumber, lime, mint, and sparkling water.",
    bodyHtml:
      "<p>This cucumber lime cooler is designed for days when you want something bright, clean, and easy to build. Muddle cucumber with fresh lime juice and mint, then shake it with a little honey syrup before topping with chilled sparkling water.</p><p>Serve it over plenty of ice and finish with a cucumber ribbon. The result is refreshing without becoming too sweet, making it a reliable mocktail recipe for lunches, cookouts, and slow summer afternoons.</p>",
    coverUrl: "",
    categoryId: 1,
    tagIds: [1, 2, 3],
    status: "published",
    isFeatured: true,
    isPinned: true,
    viewCount: 18420,
    publishedAt: "2026-06-29T10:00:00.000Z",
    seoTitle: "Cucumber Lime Cooler Mocktail Recipe",
    seoDescription: "Make a refreshing cucumber lime cooler with mint, honey syrup, and sparkling water.",
  },
  {
    id: 2,
    title: "How to Balance Sweetness and Citrus in Mocktails",
    slug: "balance-sweetness-citrus-mocktails",
    summary: "A practical flavor guide for adjusting sugar, acidity, dilution, and aroma in alcohol-free drinks.",
    bodyHtml:
      "<p>Great mocktails need balance because there is no spirit to carry bitterness, body, or heat. Start by pairing one bright acid, such as lemon or lime, with a measured sweetener like simple syrup, honey syrup, or agave.</p><blockquote>Taste after dilution, not before. Ice and bubbles can soften both sweetness and acidity.</blockquote><p>If the drink feels flat, add a pinch of salt or a fragrant garnish. If it feels sharp, lengthen it with tea, soda water, or chilled juice rather than adding sugar immediately.</p>",
    coverUrl: "",
    categoryId: 2,
    tagIds: [2, 6],
    status: "published",
    isFeatured: false,
    isPinned: true,
    viewCount: 15105,
    publishedAt: "2026-06-28T09:30:00.000Z",
    seoTitle: "How to Balance Sweetness and Citrus in Mocktails",
    seoDescription: "Learn how to balance sweetness, acidity, dilution, and aroma in alcohol-free drinks.",
  },
  {
    id: 3,
    title: "Three Alcohol-Free Classics Every Home Bar Needs",
    slug: "three-alcohol-free-classics-home-bar",
    summary: "A starter set of classic mocktail formats for building dependable drinks without alcohol.",
    bodyHtml:
      "<p>A strong alcohol-free home bar starts with repeatable formats. A citrus spritz, a ginger highball, and a non-alcoholic sour can cover most occasions while teaching the basics of bubbles, spice, texture, and acidity.</p><p>Keep fresh citrus, good tonic or soda, ginger beer, tea concentrates, and one or two syrups on hand. From there, you can adjust each classic with herbs, bitters-style aromatics, or seasonal fruit.</p>",
    coverUrl: "",
    categoryId: 3,
    tagIds: [1, 5],
    status: "published",
    isFeatured: false,
    isPinned: false,
    viewCount: 12680,
    publishedAt: "2026-06-27T13:10:00.000Z",
    seoTitle: "Three Alcohol-Free Classic Mocktails",
    seoDescription: "Build a better alcohol-free home bar with three classic mocktail formats.",
  },
  {
    id: 4,
    title: "Sparkling Berry Punch for Easy Party Drinks",
    slug: "sparkling-berry-punch-party-drinks",
    summary: "A colorful batch mocktail with berries, citrus, tea, and sparkling water for gatherings.",
    bodyHtml:
      "<p>Party drinks should be easy to pour, easy to scale, and good-looking in a pitcher. This sparkling berry punch combines muddled berries, lemon juice, chilled hibiscus tea, and a light syrup base.</p><p>Mix the fruit, citrus, tea, and syrup ahead of time, then add sparkling water right before serving. Garnish each glass with berries and a lemon wheel so the drink feels composed without slowing down the host.</p>",
    coverUrl: "",
    categoryId: 4,
    tagIds: [3, 4],
    status: "published",
    isFeatured: false,
    isPinned: false,
    viewCount: 11290,
    publishedAt: "2026-06-26T08:00:00.000Z",
    seoTitle: "Sparkling Berry Punch Party Mocktail",
    seoDescription: "Make a colorful alcohol-free berry punch for parties, gatherings, and summer events.",
  },
  {
    id: 5,
    title: "Flavor Guide: Herbs That Make Citrus Drinks Pop",
    slug: "herbs-that-make-citrus-drinks-pop",
    summary: "Use mint, basil, rosemary, and thyme to add aroma and structure to citrus mocktails.",
    bodyHtml:
      "<p>Herbs can make a simple citrus mocktail feel complete. Mint brings lift, basil adds a soft savory note, rosemary gives piney structure, and thyme works well with grapefruit or honey.</p><ul><li>Clap delicate herbs before garnishing to release aroma.</li><li>Steep woody herbs into syrup for stronger flavor.</li><li>Pair one herb with one citrus first, then add complexity.</li></ul>",
    coverUrl: "",
    categoryId: 2,
    tagIds: [2, 6],
    status: "published",
    isFeatured: false,
    isPinned: false,
    viewCount: 8730,
    publishedAt: "2026-06-25T16:20:00.000Z",
    seoTitle: "Best Herbs for Citrus Mocktails",
    seoDescription: "A flavor guide to using mint, basil, rosemary, and thyme in citrus mocktails.",
  },
  {
    id: 6,
    title: "Watermelon Mint Spritz for Summer Brunch",
    slug: "watermelon-mint-spritz-summer-brunch",
    summary: "A light, healthy mocktail with watermelon juice, mint, lime, and bubbles.",
    bodyHtml:
      "<p>This watermelon mint spritz keeps brunch drinks light while still feeling festive. Blend fresh watermelon, strain the juice, then shake it with lime and mint before topping with sparkling water.</p><p>For a cleaner finish, chill the watermelon juice before mixing and avoid over-sweetening. Ripe watermelon usually brings enough natural sugar, so a small splash of syrup is only needed when the fruit is mild.</p>",
    coverUrl: "",
    categoryId: 1,
    tagIds: [1, 3, 6],
    status: "published",
    isFeatured: false,
    isPinned: false,
    viewCount: 7425,
    publishedAt: "2026-06-24T11:45:00.000Z",
    seoTitle: "Watermelon Mint Spritz Mocktail",
    seoDescription: "Make a light summer mocktail with watermelon juice, mint, lime, and sparkling water.",
  },
];

export const homepageBlocks: HomepageBlock[] = [
  { id: 1, key: "lead", title: homepageConfig.labels.leadStory, blockType: "lead", enabled: true, sortOrder: 1, displayCount: 1, config: {} },
  { id: 2, key: "heat", title: homepageConfig.labels.featuredLists, blockType: "heat", enabled: true, sortOrder: 2, displayCount: 4, config: {} },
  {
    id: 3,
    key: "category-shortcuts",
    title: homepageConfig.labels.categoryIndex,
    blockType: "category_shortcuts",
    enabled: true,
    sortOrder: 3,
    displayCount: 4,
    config: {},
  },
  {
    id: 4,
    key: "feed",
    title: homepageConfig.labels.popularRecommendations,
    blockType: "feed",
    enabled: true,
    sortOrder: 4,
    displayCount: 4,
    config: {},
  },
  { id: 5, key: "tags", title: homepageConfig.labels.genreGuides, blockType: "tags", enabled: true, sortOrder: 5, displayCount: 3, config: {} },
  {
    id: 6,
    key: "editor-picks",
    title: homepageConfig.labels.latestNews,
    blockType: "editor_picks",
    enabled: true,
    sortOrder: 6,
    displayCount: 4,
    config: {},
  },
];

export const siteSettings = {
  siteName: siteConfig.name,
  siteDescription: siteConfig.description,
  tagline: siteConfig.tagline,
  defaultSeoTitle: siteConfig.defaultSeoTitle,
  defaultSeoDescription: siteConfig.defaultSeoDescription,
  contactEmail: siteConfig.contactEmail,
  supportEmail: siteConfig.supportEmail,
  legalEmail: siteConfig.legalEmail,
  teamName: siteConfig.teamName,
  editorialTeamName: siteConfig.editorialTeamName,
  operatorName: siteConfig.operator.name,
  operatorCountry: siteConfig.operator.country,
  legalStatus: siteConfig.operator.legalStatus,
  defaultAuthor: siteConfig.brand.byline,
};
