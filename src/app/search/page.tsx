import type { Metadata } from "next";
import { SearchPageLayout } from "@contentforge/theme-homerio/layouts/SearchPageLayout";
import { seoConfig } from "@/config/seo.config";
import { searchArticles } from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { buildStaticSeoMetadata } from "@/lib/seo";
import { adaptSearchPageProps } from "@/theme/v3-page-adapter";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticSeoMetadata({
    title: seoConfig.search.title,
    description: seoConfig.search.description,
    path: "/search",
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const [articles, identity] = await Promise.all([searchArticles(q), getSiteIdentitySettings()]);
  const props = adaptSearchPageProps({
    articles,
    identity,
    query: q,
  });

  return <SearchPageLayout {...props} />;
}
