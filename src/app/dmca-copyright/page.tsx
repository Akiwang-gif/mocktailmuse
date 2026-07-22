import type { Metadata } from "next";
import { StaticPageLayout } from "@contentforge/theme-homerio/layouts/StaticPageLayout";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { getResolvedLegalConfig } from "@/lib/legal-settings";
import { adaptStaticPageProps } from "@/theme/v3-page-adapter";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getResolvedLegalConfig();
  return {
    title: pages.dmca.metadataTitle,
    description: pages.dmca.metadataDescription,
  };
}

export default async function DmcaCopyrightPage() {
  const [{ pages }, identity] = await Promise.all([getResolvedLegalConfig(), getSiteIdentitySettings()]);
  const page = pages.dmca;
  const props = adaptStaticPageProps({
    eyebrow: page.eyebrow,
    identity,
    intro: page.intro,
    sections: page.sections,
    title: page.title,
  });

  return <StaticPageLayout {...props} />;
}
