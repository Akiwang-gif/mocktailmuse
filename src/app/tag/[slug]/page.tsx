import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageLayout } from "@contentforge/theme-homerio/layouts/CategoryPageLayout";
import { Pagination, PaginationSummary } from "@/components/public/pagination";
import { ARTICLE_PAGE_SIZE, getTagBySlug, listPaginatedArticlesByTag } from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
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
  const tag = await getTagBySlug(slug);
  const articles = await listPaginatedArticlesByTag(slug, parsePage(page), ARTICLE_PAGE_SIZE);
  const basePath = `/tag/${slug}`;

  return {
    ...(await buildSeoMetadata({
      title: tag ? `${tag.name} News` : "Tag",
      description: tag?.description,
      path: paginatedPath(basePath, articles.currentPage),
    })),
    other: paginationMetadata(basePath, articles.currentPage, articles.totalPages),
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const [articles, identity] = await Promise.all([
    listPaginatedArticlesByTag(slug, parsePage(page), ARTICLE_PAGE_SIZE),
    getSiteIdentitySettings(),
  ]);
  const props = adaptCategoryPageProps({
    articles,
    category: tag,
    eyebrow: "Tag",
    identity,
    pagination: (
      <>
        <PaginationSummary currentPage={articles.currentPage} pageSize={articles.pageSize} totalItems={articles.totalItems} />
        <Pagination basePath={`/tag/${slug}`} currentPage={articles.currentPage} totalPages={articles.totalPages} />
      </>
    ),
  });

  return <CategoryPageLayout {...props} />;
}
