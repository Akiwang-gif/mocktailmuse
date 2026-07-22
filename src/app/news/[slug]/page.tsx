import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePageLayout } from "@contentforge/theme-homerio/layouts/ArticlePageLayout";
import { getArticleBySlug, getRelatedArticles } from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { normalizeArticleBodyHtml } from "@/lib/article-body";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildSeoMetadata } from "@/lib/seo";
import { adaptArticlePageProps } from "@/theme/v3-page-adapter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article, identity] = await Promise.all([getArticleBySlug(slug), getSiteIdentitySettings()]);

  if (!article) {
    return {
      title: "News story not found",
    };
  }

  return {
    ...(await buildSeoMetadata({
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.summary,
      path: `/news/${article.slug}`,
      image: article.coverUrl,
      article: {
        authors: [identity.defaultAuthor],
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
      },
    })),
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [related, identity] = await Promise.all([getRelatedArticles(article), getSiteIdentitySettings()]);
  const articleJsonLd = await buildArticleJsonLd(article);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(article);
  const articleBodyHtml = normalizeArticleBodyHtml(article.bodyHtml);
  const props = adaptArticlePageProps({
    article: {
      ...article,
      bodyHtml: articleBodyHtml,
    },
    identity,
    relatedArticles: related,
  });

  return (
    <ArticlePageLayout
      {...props}
      articleBody={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          {props.articleBody}
        </>
      }
    />
  );
}
