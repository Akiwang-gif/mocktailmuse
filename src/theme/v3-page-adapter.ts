import { createElement, type ReactNode } from "react";
import { EditorialArticleCard } from "@contentforge/theme-homerio/components/EditorialArticleCard";
import { ArticleHero } from "@contentforge/theme-homerio/sections/ArticleHero";
import { FooterShell, type FooterShellProps } from "@contentforge/theme-homerio/shell/FooterShell";
import { HeaderShell, type HeaderShellProps } from "@contentforge/theme-homerio/shell/HeaderShell";
import type { SearchPanelShellProps } from "@contentforge/theme-homerio/shell/SearchPanelShell";
import { SidebarShell, type SidebarShellProps } from "@contentforge/theme-homerio/shell/SidebarShell";
import type { ArchivePageLayoutProps } from "@contentforge/theme-homerio/layouts/ArchivePageLayout";
import type { ArticlePageLayoutProps } from "@contentforge/theme-homerio/layouts/ArticlePageLayout";
import type { CategoryPageLayoutProps } from "@contentforge/theme-homerio/layouts/CategoryPageLayout";
import type { SearchPageLayoutProps } from "@contentforge/theme-homerio/layouts/SearchPageLayout";
import type { StaticPageLayoutProps } from "@contentforge/theme-homerio/layouts/StaticPageLayout";
import { homepageConfig } from "@/config/homepage.config";
import { seoConfig } from "@/config/seo.config";
import { siteConfig } from "@/config/site.config";
import type { ArticleView, PaginatedArticles } from "@/db/repositories/content";
import type { Category, Tag } from "@/db/seed-data";
import { publicCategoryHref } from "@/lib/category-slugs";
import { defaultSiteIdentitySettings, type SiteIdentitySettings } from "@/lib/site-identity";

type ThemeImage = {
  src: string;
  alt: string;
};

type ThemeLink = {
  label: string;
  href: string;
};

export type ThemePageArticle = {
  title: string;
  href: string;
  excerpt: string;
  image: ThemeImage;
  category: ThemeLink;
  date?: {
    label: string;
    dateTime: string;
  };
  readingTime: string;
  author: string;
};

export type StaticPageSectionInput = {
  title?: ReactNode;
  body?: readonly ReactNode[];
  items?: readonly ReactNode[];
};

type ShellAdapterOptions = {
  categories?: readonly Category[];
  identity?: SiteIdentitySettings;
};

type CategoryPageTaxonomy = {
  name: string;
  slug: string;
  description: string;
};

const articlePlaceholderImage: ThemeImage = {
  src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  alt: "Mocktail Muse article placeholder image",
};

const categoryImagePlaceholders: Record<string, ThemeImage> = {
  "mocktail-recipes": {
    src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
    alt: "Refreshing mocktail with citrus, herbs, and ice",
  },
  "flavor-guides": {
    src: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
    alt: "Citrus fruit and fresh herbs prepared for drink mixing",
  },
  "featured-drinks": {
    src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
    alt: "Styled alcohol-free drink with fruit garnish",
  },
  "drink-collections": {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
    alt: "Party drinks arranged on a bar with colorful garnishes",
  },
};

const fallbackCategoryImage: ThemeImage = {
  src: "https://images.unsplash.com/photo-1605270012917-bf157c5a9541?auto=format&fit=crop&w=1200&q=80",
  alt: "Alcohol-free drinks with fresh fruit and herbs",
};

const footerImage: ThemeImage = {
  src: "/images/mocktail/footer/footer-still-life.jpg",
  alt: "Premium alcohol-free drink ingredients in the Mocktail Muse blue editorial style",
};

export function createHeaderShellProps(): HeaderShellProps {
  const navigation = siteConfig.navigation.primary;

  return {
    logo: createLogoProps(),
    primaryNavigation: navigation.slice(0, 4),
    moreNavigation: navigation.slice(4),
    utilityLinks: siteConfig.navigation.footerSite.filter((item) => item.href !== "/").slice(0, 2),
    searchHref: "/search",
    searchLabel: "Search",
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
  };
}

export function createFooterShellProps({
  categories = [],
  identity = defaultSiteIdentitySettings,
}: ShellAdapterOptions = {}): FooterShellProps {
  return {
    logo: createFooterLogoProps(),
    description: identity.siteDescription,
    contactLink: {
      label: "Contact",
      href: "/contact",
    },
    categoryLinks: categories.map((category) => ({
      label: category.name,
      href: categoryHref(category),
    })),
    companyLinks: siteConfig.navigation.footerSite,
    legalLinks: siteConfig.navigation.legal,
    footerImage,
    copyright: `Copyright ${siteConfig.brand.copyrightYear} ${identity.siteName}. All Rights Reserved.`,
    legalIdentity: [`Operated by ${identity.operatorName}`, identity.operatorCountry, `Legal Status: ${identity.legalStatus}`],
  };
}

export function adaptCategoryPageProps({
  articles,
  categories = [],
  category,
  eyebrow = "Category",
  identity = defaultSiteIdentitySettings,
  pagination,
  searchQuery,
  sidebar,
}: {
  articles: PaginatedArticles | readonly ArticleView[];
  categories?: readonly Category[];
  category: CategoryPageTaxonomy;
  eyebrow?: ReactNode;
  identity?: SiteIdentitySettings;
  pagination?: ReactNode;
  searchQuery?: string;
  sidebar?: ReactNode;
}): CategoryPageLayoutProps<ThemePageArticle> {
  const items = articleItems(articles);
  const totalItems = articleTotal(articles);

  return {
    ...createPageShellProps({ categories, identity }),
    hero: {
      eyebrow,
      title: category.name,
      description: category.description,
      countLabel: articleCountLabel(totalItems),
      image: categoryImage(category),
    },
    searchPanel: createSearchPanelProps(searchQuery),
    articles: items.map((article) => adaptArticleCardProps(article, identity)),
    sidebar: sidebar ?? createSidebar(categories, items),
    pagination,
    renderArticleCard: renderThemeArticleCard,
  };
}

export function adaptArticlePageProps({
  article,
  categories = [],
  identity = defaultSiteIdentitySettings,
  relatedArticles = [],
  searchQuery,
}: {
  article: ArticleView;
  categories?: readonly Category[];
  identity?: SiteIdentitySettings;
  relatedArticles?: readonly ArticleView[];
  searchQuery?: string;
}): ArticlePageLayoutProps<ThemePageArticle> {
  return {
    ...createPageShellProps({ categories, identity }),
    searchPanel: createSearchPanelProps(searchQuery),
    breadcrumb: createBreadcrumb(article),
    articleHero: createArticleHero(article, identity),
    articleBody: createElement("div", {
      className: "article-body",
      dangerouslySetInnerHTML: { __html: article.bodyHtml },
    }),
    relatedArticles: relatedArticles.map((item) => adaptArticleCardProps(item, identity)),
    renderRelatedArticleCard: renderThemeArticleCard,
  };
}

export function adaptSearchPageProps({
  articles,
  categories = [],
  emptyState,
  identity = defaultSiteIdentitySettings,
  pagination,
  query = "",
  sidebar,
}: {
  articles: readonly ArticleView[];
  categories?: readonly Category[];
  emptyState?: ReactNode;
  identity?: SiteIdentitySettings;
  pagination?: ReactNode;
  query?: string;
  sidebar?: ReactNode;
}): SearchPageLayoutProps<ThemePageArticle> {
  const normalizedQuery = query.trim();

  return {
    ...createPageShellProps({ categories, identity }),
    searchPanel: createSearchPanelProps(normalizedQuery),
    eyebrow: seoConfig.search.eyebrow,
    title: normalizedQuery ? `${seoConfig.search.eyebrow}: ${normalizedQuery}` : seoConfig.search.title,
    resultCountLabel: `${articles.length} results`,
    articles: articles.map((article) => adaptArticleCardProps(article, identity)),
    sidebar: sidebar ?? createSidebar(categories, articles),
    pagination,
    emptyState: emptyState ?? siteConfig.content.searchEmptyText,
    renderArticleCard: renderThemeArticleCard,
  };
}

export function adaptArchivePageProps({
  articles,
  categories = [],
  eyebrow = "Archive",
  identity = defaultSiteIdentitySettings,
  pagination,
  searchQuery,
  sidebar,
  title,
}: {
  articles: PaginatedArticles | readonly ArticleView[];
  categories?: readonly Category[];
  eyebrow?: ReactNode;
  identity?: SiteIdentitySettings;
  pagination?: ReactNode;
  searchQuery?: string;
  sidebar?: ReactNode;
  title: ReactNode;
}): ArchivePageLayoutProps<ThemePageArticle> {
  const items = articleItems(articles);

  return {
    ...createPageShellProps({ categories, identity }),
    searchPanel: createSearchPanelProps(searchQuery),
    eyebrow,
    title,
    articles: items.map((article) => adaptArticleCardProps(article, identity)),
    sidebar: sidebar ?? createSidebar(categories, items),
    pagination,
    renderArticleCard: renderThemeArticleCard,
  };
}

export function adaptStaticPageProps({
  categories = [],
  eyebrow,
  identity = defaultSiteIdentitySettings,
  intro,
  sections,
  title,
}: {
  categories?: readonly Category[];
  eyebrow?: ReactNode;
  identity?: SiteIdentitySettings;
  intro?: ReactNode;
  sections: readonly StaticPageSectionInput[];
  title: ReactNode;
}): StaticPageLayoutProps {
  return {
    ...createPageShellProps({ categories, identity }),
    eyebrow,
    title,
    intro,
    sections,
  };
}

function adaptArticleCardProps(article: ArticleView, identity: SiteIdentitySettings): ThemePageArticle {
  return {
    title: article.title,
    href: articleHref(article),
    excerpt: article.summary,
    image: articleImage(article),
    category: {
      label: article.category.name,
      href: categoryHref(article.category),
    },
    date: article.publishedAt
      ? {
          label: formatDate(article.publishedAt),
          dateTime: article.publishedAt,
        }
      : undefined,
    readingTime: estimateReadingTime(article.bodyHtml),
    author: identity.defaultAuthor,
  };
}

function createArticleHero(article: ArticleView, identity: SiteIdentitySettings): ReactNode {
  return createElement(ArticleHero, {
    title: article.title,
    summary: article.summary,
    category: {
      label: article.category.name,
      href: categoryHref(article.category),
    },
    image: articleImage(article),
    meta: [formatDate(article.publishedAt), estimateReadingTime(article.bodyHtml), identity.defaultAuthor, formatViews(article.viewCount)],
    tags: article.tags.map(tagLink),
  });
}

function createBreadcrumb(article: ArticleView): ReactNode {
  return createElement(
    "nav",
    { className: "article-breadcrumb", "aria-label": "Breadcrumb" },
    createElement(
      "ol",
      null,
      createElement("li", null, createElement("a", { href: "/" }, "Home")),
      createElement("li", null, createElement("a", { href: categoryHref(article.category) }, article.category.name)),
      createElement("li", { "aria-current": "page" }, article.title),
    ),
  );
}

function createSidebar(categories: readonly Category[], articles: readonly ArticleView[]): ReactNode {
  if (categories.length === 0 && articles.length === 0) {
    return undefined;
  }

  const tags = uniqueTags(articles).slice(0, 10).map(tagLink);
  const editorPicks = articles.slice(0, 5).map((article) => ({
    title: article.title,
    href: articleHref(article),
    meta: article.category.name,
  }));

  const props: SidebarShellProps = {
    tags:
      tags.length > 0
        ? tags
        : categories.slice(0, 10).map((category) => ({
            label: category.name,
            href: categoryHref(category),
          })),
    editorPicks,
    labels: {
      popularTags: "Popular Tags",
      editorPicks: "Editor Picks",
    },
  };

  return createElement(SidebarShell, props);
}

function createPageShellProps(options: ShellAdapterOptions) {
  return {
    header: createElement(HeaderShell, createHeaderShellProps()),
    footer: createElement(FooterShell, createFooterShellProps(options)),
  };
}

function createSearchPanelProps(query = ""): SearchPanelShellProps {
  return {
    action: "/search",
    query,
    placeholder: siteConfig.content.searchPlaceholder,
    buttonLabel: "Search",
  };
}

function renderThemeArticleCard(
  article: ThemePageArticle,
  context: {
    index: number;
    variant: "standard" | "compact";
  },
): ReactNode {
  return createElement(EditorialArticleCard, {
    title: article.title,
    href: article.href,
    excerpt: context.variant === "compact" ? undefined : article.excerpt,
    image: article.image,
    category: article.category,
    date: article.date,
    readingTime: article.readingTime,
    author: context.variant === "compact" ? undefined : article.author,
    variant: context.variant,
  });
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

function articleItems(articles: PaginatedArticles | readonly ArticleView[]): readonly ArticleView[] {
  return "items" in articles ? articles.items : articles;
}

function articleTotal(articles: PaginatedArticles | readonly ArticleView[]): number {
  return "totalItems" in articles ? articles.totalItems : articles.length;
}

function articleHref(article: ArticleView): string {
  return `/news/${article.slug}`;
}

function categoryHref(category: Category): string {
  return publicCategoryHref(category.slug);
}

function tagHref(tag: Tag): string {
  return `/tag/${tag.slug}`;
}

function tagLink(tag: Tag): ThemeLink {
  return {
    label: tag.name,
    href: tagHref(tag),
  };
}

function articleImage(article: ArticleView): ThemeImage {
  if (article.coverUrl) {
    return {
      src: article.coverUrl,
      alt: article.title,
    };
  }

  return {
    ...articlePlaceholderImage,
    alt: `${article.title} placeholder image`,
  };
}

function categoryImage(category: CategoryPageTaxonomy): ThemeImage {
  return (
    categoryImagePlaceholders[category.slug] ?? {
      ...fallbackCategoryImage,
      alt: `${category.name} mocktail category`,
    }
  );
}

function uniqueTags(articles: readonly ArticleView[]): Tag[] {
  const tags = new Map<string, Tag>();

  for (const article of articles) {
    for (const tag of article.tags) {
      tags.set(tag.slug, tag);
    }
  }

  return [...tags.values()];
}

function articleCountLabel(totalItems: number): string {
  return `${totalItems} ${totalItems === 1 ? "article" : "articles"}`;
}

function formatDate(value: string): string {
  if (!value) return "Unpublished";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatViews(value: number): string {
  if (value >= 10000) {
    return `${(value / 1000).toFixed(1)}K reads`;
  }

  return `${value.toLocaleString("en-US")} reads`;
}

function estimateReadingTime(bodyHtml: string): string {
  const text = bodyHtml
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}
