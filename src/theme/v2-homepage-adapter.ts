import { createElement } from "react";
import { FooterShell, type FooterShellProps } from "@contentforge/theme-homerio/shell/FooterShell";
import { HeaderShell, type HeaderShellProps } from "@contentforge/theme-homerio/shell/HeaderShell";
import type { HomepageLayoutProps } from "@contentforge/theme-homerio/layouts/HomepageLayout";
import type { HomeHeroProps } from "@contentforge/theme-homerio/sections/HomeHero";
import type { NewsletterBlockProps } from "@contentforge/theme-homerio/sections/NewsletterBlock";
import { homepageConfig } from "@/config/homepage.config";
import { siteConfig } from "@/config/site.config";
import type { ArticleView } from "@/db/repositories/content";
import type { Category } from "@/db/seed-data";
import { defaultSiteIdentitySettings, type SiteIdentitySettings } from "@/lib/site-identity";

type ThemeImage = {
  src: string;
  alt: string;
};

type ThemeLink = {
  label: string;
  href: string;
};

type CategoryDisplayMeta = {
  title: string;
  slug: string;
};

export type HomepageArticleV2 = {
  title: string;
  href: string;
  excerpt?: string;
  image: ThemeImage;
  category: ThemeLink;
  date?: {
    label: string;
    dateTime: string;
  };
  readingTime: string;
  author: string;
};

export type HomepageCategoryV2 = {
  title: string;
  href: string;
  description: string;
  image: ThemeImage;
};

export type HomerioHomepageV2Props = Omit<
  HomepageLayoutProps<HomepageArticleV2, HomepageCategoryV2>,
  "renderArticleCard" | "renderCategoryCard"
>;

const heroImage: ThemeImage = {
  src: "/images/mocktail/hero/hero-main.jpg",
  alt: "Premium blue mocktail with ice, blueberries, citrus, and soft studio lighting",
};

const articlePlaceholderImage: ThemeImage = {
  src: "/images/mocktail/placeholders/article-placeholder.jpg",
  alt: "Styled alcohol-free drink with ice and fresh garnish",
};

const categoryImagePlaceholders: Record<string, ThemeImage> = {
  "mocktail-recipes": {
    src: "/images/mocktail/categories/recipes.jpg",
    alt: "Refreshing mocktail recipe with fruit, herbs, and ice",
  },
  recipes: {
    src: "/images/mocktail/categories/recipes.jpg",
    alt: "Refreshing mocktail recipe with fruit, herbs, and ice",
  },
  "flavor-guides": {
    src: "/images/mocktail/categories/flavor-guides.jpg",
    alt: "Fresh citrus, herbs, and aromatics for alcohol-free drink mixing",
  },
  "featured-drinks": {
    src: "/images/mocktail/categories/collections.jpg",
    alt: "Curated mocktail collection arranged for entertaining",
  },
  "drink-collections": {
    src: "/images/mocktail/categories/collections.jpg",
    alt: "Curated mocktail collection arranged for entertaining",
  },
  collections: {
    src: "/images/mocktail/categories/collections.jpg",
    alt: "Curated mocktail collection arranged for entertaining",
  },
  lifestyle: {
    src: "/images/mocktail/categories/lifestyle.jpg",
    alt: "Alcohol-free lifestyle drinks and entertaining ideas",
  },
  essentials: {
    src: "/images/mocktail/categories/essentials-v2.jpg",
    alt: "Essential mocktail guidance with glassware and ingredients",
  },
  experiences: {
    src: "/images/mocktail/categories/experiences-v2.jpg",
    alt: "Interactive mocktail experiences and drink inspiration",
  },
};

const categoryDisplayBySlug: Record<string, CategoryDisplayMeta> = {
  "mocktail-recipes": {
    title: "Recipes",
    slug: "recipes",
  },
  recipes: {
    title: "Recipes",
    slug: "recipes",
  },
  "mocktail-guides": {
    title: "Flavor Guides",
    slug: "flavor-guides",
  },
  "flavor-guides": {
    title: "Flavor Guides",
    slug: "flavor-guides",
  },
  "mocktail-gifts-shopping": {
    title: "Collections",
    slug: "collections",
  },
  "mocktail-gifts-and-shopping": {
    title: "Collections",
    slug: "collections",
  },
  "drink-collections": {
    title: "Collections",
    slug: "collections",
  },
  "featured-drinks": {
    title: "Collections",
    slug: "collections",
  },
  collections: {
    title: "Collections",
    slug: "collections",
  },
  "sober-curious-lifestyle": {
    title: "Lifestyle",
    slug: "lifestyle",
  },
  lifestyle: {
    title: "Lifestyle",
    slug: "lifestyle",
  },
  "mocktail-faq": {
    title: "Essentials",
    slug: "essentials",
  },
  essentials: {
    title: "Essentials",
    slug: "essentials",
  },
  "mocktail-fun-interactive": {
    title: "Experiences",
    slug: "experiences",
  },
  experiences: {
    title: "Experiences",
    slug: "experiences",
  },
};

const categoryDisplayByName: Record<string, CategoryDisplayMeta> = {
  "mocktail recipes": categoryDisplayBySlug["mocktail-recipes"],
  "mocktail guides": categoryDisplayBySlug["mocktail-guides"],
  "mocktail gifts & shopping": categoryDisplayBySlug["mocktail-gifts-shopping"],
  "mocktail gifts and shopping": categoryDisplayBySlug["mocktail-gifts-shopping"],
  "sober curious lifestyle": categoryDisplayBySlug["sober-curious-lifestyle"],
  "mocktail faq": categoryDisplayBySlug["mocktail-faq"],
  "mocktail fun interactive": categoryDisplayBySlug["mocktail-fun-interactive"],
};

const categoryDescriptionBySlug: Record<string, string> = {
  recipes: "Creative alcohol-free drink recipes and step-by-step mocktail ideas.",
  "flavor-guides": "Guides to balancing flavors, sweetness, acidity, aroma, and ingredients.",
  collections: "Seasonal drinks, party ideas, and themed mocktail collections.",
  lifestyle: "Modern alcohol-free living, entertaining rituals, and sober curious inspiration.",
  essentials: "Helpful answers, glassware basics, tools, and mocktail technique essentials.",
  experiences: "Interactive drink inspiration, playful ideas, and memorable mocktail moments.",
};

const fallbackCategoryImage: ThemeImage = {
  src: "/images/mocktail/placeholders/category-placeholder.jpg",
  alt: "Alcohol-free drink category with fresh fruit and herbs",
};

const footerImage: ThemeImage = {
  src: "/images/mocktail/footer/footer-still-life.jpg",
  alt: "Premium alcohol-free drink ingredients in the Mocktail Muse blue editorial style",
};

export function adaptHomepageArticleV2(article: ArticleView): HomepageArticleV2 {
  const category = resolveCategoryDisplay(article.category);

  return {
    title: article.title,
    href: `/news/${article.slug}`,
    excerpt: article.summary,
    image: article.coverUrl
      ? {
          src: article.coverUrl,
          alt: article.title,
        }
      : {
          ...articlePlaceholderImage,
          alt: `${article.title} placeholder image`,
        },
    category: {
      label: category.title,
      href: `/category/${category.slug}`,
    },
    date: article.publishedAt
      ? {
          label: formatArticleDate(article.publishedAt),
          dateTime: article.publishedAt,
        }
      : undefined,
    readingTime: estimateReadingTime(article.bodyHtml),
    author: siteConfig.brand.byline,
  };
}

export function adaptHomepageCategoryV2(category: Category): HomepageCategoryV2 {
  const display = resolveCategoryDisplay(category);

  return {
    title: display.title,
    href: `/category/${display.slug}`,
    description: category.description,
    image: categoryImagePlaceholders[category.slug] ?? categoryImagePlaceholders[display.slug] ?? {
      ...fallbackCategoryImage,
      alt: `${display.title} mocktail category`,
    },
  };
}

export function createHomepageHeroProps(identity: SiteIdentitySettings = defaultSiteIdentitySettings): HomeHeroProps {
  return {
    image: heroImage,
    label: identity.siteName,
    title: "Fresh, vibrant & unforgettable.",
    subtitle: "Elevated alcohol-free drinks for every occasion.",
    cta: {
      label: "DISCOVER RECIPES",
      href: "#latest-articles",
    },
    header: createElement(HeaderShell, createHeaderShellProps()),
  };
}

export function createHeaderShellProps(): HeaderShellProps {
  const navigation = siteConfig.navigation.primary;

  return {
    logo: createLogoProps(),
    primaryNavigation: navigation,
    moreNavigation: [],
    utilityLinks: siteConfig.navigation.footerSite.filter((item) => item.href !== "/").slice(0, 2),
    searchHref: "/search",
    searchLabel: "Search",
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
  };
}

export function createFooterShellProps(
  categories: readonly (Category | HomepageCategoryV2)[] = [],
  identity: SiteIdentitySettings = defaultSiteIdentitySettings,
): FooterShellProps {
  return {
    logo: createFooterLogoProps(),
    description: identity.siteDescription,
    contactLink: {
      label: "Contact",
      href: "/contact",
    },
    categoryLinks: categories.map(categoryFooterLink),
    companyLinks: siteConfig.navigation.footerSite,
    legalLinks: siteConfig.navigation.legal,
    footerImage,
    copyright: `Copyright ${siteConfig.brand.copyrightYear} ${identity.siteName}. All Rights Reserved.`,
    legalIdentity: [`Operated by ${identity.operatorName}`, identity.operatorCountry, `Legal Status: ${identity.legalStatus}`],
  };
}

export function createNewsletterProps(identity: SiteIdentitySettings = defaultSiteIdentitySettings): NewsletterBlockProps {
  return {
    title: "Sunshine in your inbox. Join the Muse Club.",
    description: `A refined note from ${identity.siteName} with seasonal recipes, flavor ideas, and alcohol-free entertaining inspiration.`,
    inputPlaceholder: "Your email",
    buttonLabel: "Subscribe",
    disabled: true,
  };
}

export function createHomepageLayoutPropsV2({
  identity = defaultSiteIdentitySettings,
  categories,
  featuredArticles,
  latestArticles,
}: {
  identity?: SiteIdentitySettings;
  categories: readonly HomepageCategoryV2[];
  featuredArticles: readonly HomepageArticleV2[];
  latestArticles: readonly HomepageArticleV2[];
}): HomerioHomepageV2Props {
  const homepageCategories = sortHomepageCategories(categories);

  return {
    hero: createHomepageHeroProps(identity),
    categories: homepageCategories,
    featuredArticles: featuredArticles.slice(0, 1),
    latestArticles: latestArticles.slice(0, 3),
    categoryShowcase: {
      title: homepageConfig.labels.categoryIndex,
      deck: "Browse alcohol-free drinks by flavor direction, ingredient mood, and occasion.",
    },
    featuredSection: {
      title: homepageConfig.labels.featuredLists,
      deck: "Curated drinks with clean ingredients, balanced flavor, and a polished finish.",
    },
    latestSection: {
      id: "latest-articles",
      title: homepageConfig.labels.latestNews,
      deck: homepageConfig.labels.popularRecommendationsDeck,
      href: "/news",
      linkLabel: homepageConfig.labels.viewAll,
    },
    newsletter: createNewsletterProps(identity),
    footer: createElement(FooterShell, createFooterShellProps(categories, identity)),
  };
}

function createLogoProps() {
  return {
    prefix: siteConfig.brand.logoPrefix,
    suffix: siteConfig.brand.logoSuffix,
    href: "/",
  };
}

function createFooterLogoProps() {
  return {
    suffix: createElement("img", {
      src: "/brand/mocktailmuse-mark.png",
      alt: "Mocktail Muse",
      className: "brand-logo-mark",
    }),
    href: "/",
  };
}

function categoryFooterLink(category: Category | HomepageCategoryV2): ThemeLink {
  if ("href" in category) {
    return {
      label: category.title,
      href: category.href,
    };
  }

  const display = resolveCategoryDisplay(category);

  return {
    label: display.title,
    href: `/category/${display.slug}`,
  };
}

function resolveCategoryDisplay(category: Pick<Category, "name" | "slug">): CategoryDisplayMeta {
  return (
    categoryDisplayBySlug[category.slug] ??
    categoryDisplayByName[category.name.toLowerCase()] ?? {
      title: category.name,
      slug: category.slug,
    }
  );
}

function sortHomepageCategories(categories: readonly HomepageCategoryV2[]): HomepageCategoryV2[] {
  const categoriesBySlug = new Map<string, HomepageCategoryV2>();

  for (const category of categories) {
    const slug = slugFromCategoryHref(category.href);

    if (!categoriesBySlug.has(slug)) {
      categoriesBySlug.set(slug, category);
    }
  }

  const homepageCategories = homepageConfig.categoryDisplaySlugs.primary.map(
    (slug) => categoriesBySlug.get(slug) ?? createConfiguredHomepageCategory(slug),
  );
  const configuredSlugs = new Set<string>(homepageConfig.categoryDisplaySlugs.primary);
  const remainingCategories = categories.filter((category) => !configuredSlugs.has(slugFromCategoryHref(category.href)));

  return [...homepageCategories, ...remainingCategories];
}

function slugFromCategoryHref(href: string): string {
  return href.split("/").filter(Boolean).at(-1) ?? href;
}

function createConfiguredHomepageCategory(slug: string): HomepageCategoryV2 {
  const display = categoryDisplayBySlug[slug] ?? {
    title: slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
      .join(" "),
    slug,
  };

  return {
    title: display.title,
    href: `/category/${display.slug}`,
    description: categoryDescriptionBySlug[display.slug] ?? "Premium alcohol-free drink inspiration from Mocktail Muse.",
    image: categoryImagePlaceholders[display.slug] ?? {
      ...fallbackCategoryImage,
      alt: `${display.title} mocktail category`,
    },
  };
}

function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function estimateReadingTime(bodyHtml: string): string {
  const text = bodyHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  return `${minutes} min read`;
}
