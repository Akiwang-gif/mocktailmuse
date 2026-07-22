import {
  articles as seedArticles,
  siteSettings,
  type Article,
  type Category,
  type HomepageBlock,
  type Tag,
} from "@/db/seed-data";
import { getCloudflareDb } from "@/db/repositories/cloudflare-env";
import { listD1Articles, listD1Categories, listD1HomepageBlocks, listD1Tags } from "@/db/repositories/d1-admin-content";
import {
  listLocalDeletedArticleIdsSync,
  listLocalArticleOrdersSync,
  listLocalArticlesSync,
  listLocalCategoriesSync,
  listLocalHomepageBlocksSync,
  listLocalTagsSync,
} from "@/db/repositories/local-admin-content";

export interface ArticleView extends Article {
  category: Category;
  tags: Tag[];
  sortOrder: number;
}

export interface AdminArticleFilters {
  q?: string;
  status?: Article["status"] | "all";
  category?: string;
}

export const ARTICLE_PAGE_SIZE = 10;

export interface PaginatedArticles {
  currentPage: number;
  items: ArticleView[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface ContentSnapshot {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  homepageBlocks: HomepageBlock[];
}

async function getSnapshot(): Promise<ContentSnapshot> {
  const db = await getCloudflareDb();
  if (db) {
    const [articles, categories, tags, homepageBlocks] = await Promise.all([
      listD1Articles(db),
      listD1Categories(db),
      listD1Tags(db),
      listD1HomepageBlocks(db),
    ]);
    return { articles, categories, tags, homepageBlocks };
  }

  const orderMap = new Map(listLocalArticleOrdersSync().map((order) => [order.articleId, order.sortOrder]));
  const deletedArticleIds = new Set(listLocalDeletedArticleIdsSync());
  return {
    articles: [...listLocalArticlesSync(), ...seedArticles.filter((article) => !deletedArticleIds.has(article.id))].map((article) => ({
      ...article,
      sortOrder: orderMap.get(article.id) ?? article.sortOrder ?? article.id,
    })),
    categories: listLocalCategoriesSync(),
    tags: listLocalTagsSync(),
    homepageBlocks: listLocalHomepageBlocksSync(),
  };
}

function publishedArticles(snapshot: ContentSnapshot) {
  return snapshot.articles
    .filter((article) => article.status === "published")
    .sort((a, b) => {
      const aOrder = a.sortOrder;
      const bOrder = b.sortOrder;
      if (typeof aOrder === "number" || typeof bOrder === "number") {
        return (aOrder ?? Number.MAX_SAFE_INTEGER) - (bOrder ?? Number.MAX_SAFE_INTEGER);
      }
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

function newestPublishedArticles(snapshot: ContentSnapshot) {
  return snapshot.articles
    .filter((article) => article.status === "published")
    .toSorted((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}

function toArticleView(article: Article, snapshot: ContentSnapshot): ArticleView {
  const categoryMap = new Map(snapshot.categories.map((category) => [category.id, category]));
  const tagMap = new Map(snapshot.tags.map((tag) => [tag.id, tag]));
  const category = categoryMap.get(article.categoryId);

  if (!category) {
    throw new Error(`Missing category for article ${article.id}`);
  }

  return {
    ...article,
    sortOrder: article.sortOrder ?? article.id,
    category,
    tags: article.tagIds.map((tagId) => tagMap.get(tagId)).filter((tag): tag is Tag => Boolean(tag)),
  };
}

function paginateArticleItems(articles: Article[], snapshot: ContentSnapshot, page: number, pageSize = ARTICLE_PAGE_SIZE): PaginatedArticles {
  const totalItems = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    currentPage,
    items: articles.slice(start, start + pageSize).map((article) => toArticleView(article, snapshot)),
    pageSize,
    totalItems,
    totalPages,
  };
}

export function getSiteSettings() {
  return siteSettings;
}

export async function listCategories() {
  const snapshot = await getSnapshot();
  return snapshot.categories.filter((category) => category.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listAdminCategories() {
  const snapshot = await getSnapshot();
  return snapshot.categories.toSorted((a, b) => a.sortOrder - b.sortOrder);
}

export async function listTags() {
  const snapshot = await getSnapshot();
  return snapshot.tags.filter((tag) => tag.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listAdminTags() {
  const snapshot = await getSnapshot();
  return snapshot.tags.toSorted((a, b) => a.sortOrder - b.sortOrder);
}

export async function listHomepageBlocks(): Promise<HomepageBlock[]> {
  const snapshot = await getSnapshot();
  return snapshot.homepageBlocks.filter((block) => block.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listAdminHomepageBlocks(): Promise<HomepageBlock[]> {
  const snapshot = await getSnapshot();
  return snapshot.homepageBlocks.toSorted((a, b) => a.sortOrder - b.sortOrder);
}

export async function listPublishedArticles(limit?: number): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  const items = publishedArticles(snapshot).map((article) => toArticleView(article, snapshot));
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function listPaginatedPublishedArticles(page: number, pageSize = ARTICLE_PAGE_SIZE): Promise<PaginatedArticles> {
  const snapshot = await getSnapshot();
  return paginateArticleItems(newestPublishedArticles(snapshot), snapshot, page, pageSize);
}

export async function listLatestPublishedArticles(limit?: number): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  const items = newestPublishedArticles(snapshot).map((article) => toArticleView(article, snapshot));
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function listHomepageArticlesByCategory(slug: string, limit?: number): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  const category = snapshot.categories.find((item) => item.slug === slug && item.enabled);
  if (!category) return [];
  const items = newestPublishedArticles(snapshot)
    .filter((article) => article.categoryId === category.id)
    .map((article) => toArticleView(article, snapshot));
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function listAdminArticles(): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  return snapshot.articles
    .map((article) => toArticleView(article, snapshot))
    .sort((a, b) => a.sortOrder - b.sortOrder || new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}

export async function listFilteredAdminArticles(filters: AdminArticleFilters): Promise<ArticleView[]> {
  const q = filters.q?.trim().toLowerCase() ?? "";
  const status = filters.status && filters.status !== "all" ? filters.status : null;
  const category = filters.category && filters.category !== "all" ? filters.category : null;
  const articles = await listAdminArticles();

  return articles.filter((article) => {
    if (status && article.status !== status) return false;
    if (category && article.category.slug !== category) return false;
    if (!q) return true;

    const haystack = [
      article.title,
      article.slug,
      article.summary,
      article.category.name,
      article.category.slug,
      ...article.tags.map((tag) => tag.name),
      ...article.tags.map((tag) => tag.slug),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export async function getFeaturedArticle(): Promise<ArticleView | null> {
  const snapshot = await getSnapshot();
  const items = newestPublishedArticles(snapshot);
  const featured = items.find((article) => article.isFeatured) ?? items[0];
  return featured ? toArticleView(featured, snapshot) : null;
}

export async function listHeatArticles(limit = 5): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  return publishedArticles(snapshot)
    .toSorted((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
    .map((article) => toArticleView(article, snapshot));
}

export async function listEditorPicks(limit = 3): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  return publishedArticles(snapshot)
    .filter((article) => article.isPinned || article.isFeatured)
    .slice(0, limit)
    .map((article) => toArticleView(article, snapshot));
}

export async function getArticleBySlug(slug: string): Promise<ArticleView | null> {
  const snapshot = await getSnapshot();
  const article = publishedArticles(snapshot).find((item) => item.slug === slug);
  return article ? toArticleView(article, snapshot) : null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const snapshot = await getSnapshot();
  return snapshot.categories.find((category) => category.slug === slug && category.enabled) ?? null;
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const snapshot = await getSnapshot();
  return snapshot.tags.find((tag) => tag.slug === slug && tag.enabled) ?? null;
}

export async function listArticlesByCategory(slug: string): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  const category = snapshot.categories.find((item) => item.slug === slug && item.enabled);
  if (!category) return [];
  return publishedArticles(snapshot)
    .filter((article) => article.categoryId === category.id)
    .map((article) => toArticleView(article, snapshot));
}

export async function listPaginatedArticlesByCategory(slug: string, page: number, pageSize = ARTICLE_PAGE_SIZE): Promise<PaginatedArticles> {
  const snapshot = await getSnapshot();
  const category = snapshot.categories.find((item) => item.slug === slug && item.enabled);
  if (!category) return paginateArticleItems([], snapshot, page, pageSize);
  return paginateArticleItems(
    newestPublishedArticles(snapshot).filter((article) => article.categoryId === category.id),
    snapshot,
    page,
    pageSize,
  );
}

export async function listArticlesByTag(slug: string): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  const tag = snapshot.tags.find((item) => item.slug === slug && item.enabled);
  if (!tag) return [];
  return publishedArticles(snapshot)
    .filter((article) => article.tagIds.includes(tag.id))
    .map((article) => toArticleView(article, snapshot));
}

export async function listPaginatedArticlesByTag(slug: string, page: number, pageSize = ARTICLE_PAGE_SIZE): Promise<PaginatedArticles> {
  const snapshot = await getSnapshot();
  const tag = snapshot.tags.find((item) => item.slug === slug && item.enabled);
  if (!tag) return paginateArticleItems([], snapshot, page, pageSize);
  return paginateArticleItems(
    newestPublishedArticles(snapshot).filter((article) => article.tagIds.includes(tag.id)),
    snapshot,
    page,
    pageSize,
  );
}

export async function searchArticles(query: string): Promise<ArticleView[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return listPublishedArticles();

  const snapshot = await getSnapshot();
  return publishedArticles(snapshot)
    .filter((article) => {
      const view = toArticleView(article, snapshot);
      const haystack = [
        view.title,
        view.summary,
        view.category.name,
        ...view.tags.map((tag) => tag.name),
        ...view.tags.map((tag) => tag.slug),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    })
    .map((article) => toArticleView(article, snapshot));
}

export async function getRelatedArticles(article: ArticleView, limit = 4): Promise<ArticleView[]> {
  const snapshot = await getSnapshot();
  const tagSet = new Set(article.tagIds);

  return publishedArticles(snapshot)
    .filter((item) => item.id !== article.id)
    .map((item) => ({
      item,
      categoryMatch: item.categoryId === article.categoryId,
      publishedTime: new Date(item.publishedAt || 0).getTime(),
      tagMatches: item.tagIds.reduce((sum, tagId) => sum + (tagSet.has(tagId) ? 1 : 0), 0),
    }))
    .toSorted((a, b) => {
      const aRank = a.categoryMatch ? 0 : a.tagMatches > 0 ? 1 : 2;
      const bRank = b.categoryMatch ? 0 : b.tagMatches > 0 ? 1 : 2;
      return aRank - bRank || b.tagMatches - a.tagMatches || b.publishedTime - a.publishedTime;
    })
    .slice(0, limit)
    .map(({ item }) => toArticleView(item, snapshot));
}
