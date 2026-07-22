import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageLayout } from "@contentforge/theme-homerio/layouts/CategoryPageLayout";
import { Pagination, PaginationSummary } from "@/components/public/pagination";
import { ARTICLE_PAGE_SIZE, getCategoryBySlug, listPaginatedArticlesByCategory } from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { categoryDatabaseSlugCandidates, isPublicCategorySlug, publicCategoryMeta } from "@/lib/category-slugs";
import { buildSeoMetadata, paginatedPath, paginationMetadata } from "@/lib/seo";
import { adaptCategoryPageProps } from "@/theme/v3-page-adapter";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const resolved = await resolveCategoryRoute(slug, parsePage(page));
  const category = resolved.category ?? publicCategoryMeta(slug);
  const articles = resolved.articles;
  const basePath = `/category/${slug}`;
  const seoFields =
    category && "seoTitle" in category ? (category as { seoTitle?: string; seoDescription?: string }) : undefined;

  return {
    ...(await buildSeoMetadata({
      title: seoFields?.seoTitle ?? category?.name ?? "Category",
      description: seoFields?.seoDescription ?? category?.description,
      path: paginatedPath(basePath, articles.currentPage),
    })),
    other: paginationMetadata(basePath, articles.currentPage, articles.totalPages),
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parsePage(page);
  const resolved = await resolveCategoryRoute(slug, currentPage);
  const category = resolved.category ?? publicCategoryMeta(slug);

  if (!category) {
    notFound();
  }

  const [identity] = await Promise.all([getSiteIdentitySettings()]);
  const articles = resolved.articles;
  const props = adaptCategoryPageProps({
    articles,
    category,
    identity,
    pagination: (
      <>
        <PaginationSummary currentPage={articles.currentPage} pageSize={articles.pageSize} totalItems={articles.totalItems} />
        <Pagination basePath={`/category/${slug}`} currentPage={articles.currentPage} totalPages={articles.totalPages} />
      </>
    ),
  });

  return <CategoryPageLayout {...props} />;
}

async function resolveCategoryRoute(slug: string, page: number) {
  for (const candidate of categoryDatabaseSlugCandidates(slug)) {
    const category = await getCategoryBySlug(candidate);

    if (category) {
      return {
        category: publicCategoryMeta(slug) ?? category,
        databaseSlug: candidate,
        articles: await listPaginatedArticlesByCategory(candidate, page, ARTICLE_PAGE_SIZE),
      };
    }
  }

  if (isPublicCategorySlug(slug)) {
    return {
      category: publicCategoryMeta(slug),
      databaseSlug: slug,
      articles: await listPaginatedArticlesByCategory(slug, page, ARTICLE_PAGE_SIZE),
    };
  }

  return {
    category: null,
    databaseSlug: slug,
    articles: await listPaginatedArticlesByCategory(slug, page, ARTICLE_PAGE_SIZE),
  };
}
