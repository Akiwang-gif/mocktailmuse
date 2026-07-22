import type { Metadata } from "next";
import { ArchivePageLayout } from "@contentforge/theme-homerio/layouts/ArchivePageLayout";
import { Pagination, PaginationSummary } from "@/components/public/pagination";
import { homepageConfig } from "@/config/homepage.config";
import { seoConfig } from "@/config/seo.config";
import { ARTICLE_PAGE_SIZE, listPaginatedPublishedArticles } from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { buildSeoMetadata, paginatedPath, paginationMetadata } from "@/lib/seo";
import { adaptArchivePageProps } from "@/theme/v3-page-adapter";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const articles = await listPaginatedPublishedArticles(parsePage(page), ARTICLE_PAGE_SIZE);

  return {
    ...(await buildSeoMetadata({
      title: seoConfig.news.title,
      description: seoConfig.news.description,
      path: paginatedPath("/news", articles.currentPage),
    })),
    other: paginationMetadata("/news", articles.currentPage, articles.totalPages),
  };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const [articles, identity] = await Promise.all([
    listPaginatedPublishedArticles(parsePage(page), ARTICLE_PAGE_SIZE),
    getSiteIdentitySettings(),
  ]);
  const props = adaptArchivePageProps({
    articles,
    identity,
    title: seoConfig.news.title || homepageConfig.labels.latestNews,
    pagination: (
      <>
        <PaginationSummary currentPage={articles.currentPage} pageSize={articles.pageSize} totalItems={articles.totalItems} />
        <Pagination basePath="/news" currentPage={articles.currentPage} totalPages={articles.totalPages} />
      </>
    ),
  });

  return <ArchivePageLayout {...props} />;
}
