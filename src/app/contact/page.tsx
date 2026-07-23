import type { Metadata } from "next";
import { StaticPageLayout } from "@contentforge/theme-homerio/layouts/StaticPageLayout";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { getResolvedLegalConfig } from "@/lib/legal-settings";
import { buildStaticSeoMetadata } from "@/lib/seo";
import { adaptStaticPageProps } from "@/theme/v3-page-adapter";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getResolvedLegalConfig();
  return buildStaticSeoMetadata({
    title: pages.contact.metadataTitle,
    description: pages.contact.metadataDescription,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [{ identity, pages }, siteIdentity] = await Promise.all([getResolvedLegalConfig(), getSiteIdentitySettings()]);
  const page = pages.contact;
  const props = adaptStaticPageProps({
    eyebrow: page.eyebrow,
    identity: siteIdentity,
    intro: page.intro,
    title: page.title,
    sections: [
      ...page.contactPanels.map((label) => {
        const email = emailForPanel(label, identity);

        return {
          title: label,
          body: [
            <a href={`mailto:${email}`} key={email}>
              {email}
            </a>,
          ],
        };
      }),
      {
        body: [page.responseTime, page.operatorLine],
      },
    ],
  });

  return <StaticPageLayout {...props} />;
}

function emailForPanel(label: string, identity: { contactEmail: string; legalEmail: string; supportEmail: string }) {
  const normalized = label.toLowerCase();
  if (normalized.includes("privacy") || normalized.includes("copyright") || normalized.includes("dmca")) return identity.legalEmail;
  if (normalized.includes("support") || normalized.includes("help")) return identity.supportEmail;
  return identity.contactEmail;
}
