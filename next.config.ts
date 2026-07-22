import type { NextConfig } from "next";
import path from "node:path";

const frameworkHomerioThemePath = path.resolve(process.cwd(), "../content-site-starter/frontend-library/homerio");
const turbopackRoot = path.resolve(process.cwd(), "..");
const frameworkHomerioThemeRelativePath = "./content-site-starter/frontend-library/homerio";
const frameworkHomerioTurbopackAliases = {
  "@framework-theme/homerio/components/EditorialArticleCard": `${frameworkHomerioThemeRelativePath}/components/EditorialArticleCard.tsx`,
  "@framework-theme/homerio/components/HomeCategoryCard": `${frameworkHomerioThemeRelativePath}/components/HomeCategoryCard.tsx`,
  "@framework-theme/homerio/components/FeaturedGrid": `${frameworkHomerioThemeRelativePath}/components/FeaturedGrid.tsx`,
  "@framework-theme/homerio/components/LatestArticlesGrid": `${frameworkHomerioThemeRelativePath}/components/LatestArticlesGrid.tsx`,
  "@framework-theme/homerio/components/HomeCategoryGrid": `${frameworkHomerioThemeRelativePath}/components/HomeCategoryGrid.tsx`,
  "@framework-theme/homerio/components/FooterAccordionSection": `${frameworkHomerioThemeRelativePath}/components/FooterAccordionSection.tsx`,
  "@framework-theme/homerio/components/HomeSectionHeading": `${frameworkHomerioThemeRelativePath}/components/HomeSectionHeading.tsx`,
  "@framework-theme/homerio/components/Pagination": `${frameworkHomerioThemeRelativePath}/components/Pagination.tsx`,
};
const frameworkHomerioWebpackAliases = {
  "@framework-theme/homerio/components/EditorialArticleCard": path.join(frameworkHomerioThemePath, "components/EditorialArticleCard.tsx"),
  "@framework-theme/homerio/components/HomeCategoryCard": path.join(frameworkHomerioThemePath, "components/HomeCategoryCard.tsx"),
  "@framework-theme/homerio/components/FeaturedGrid": path.join(frameworkHomerioThemePath, "components/FeaturedGrid.tsx"),
  "@framework-theme/homerio/components/LatestArticlesGrid": path.join(frameworkHomerioThemePath, "components/LatestArticlesGrid.tsx"),
  "@framework-theme/homerio/components/HomeCategoryGrid": path.join(frameworkHomerioThemePath, "components/HomeCategoryGrid.tsx"),
  "@framework-theme/homerio/components/FooterAccordionSection": path.join(frameworkHomerioThemePath, "components/FooterAccordionSection.tsx"),
  "@framework-theme/homerio/components/HomeSectionHeading": path.join(frameworkHomerioThemePath, "components/HomeSectionHeading.tsx"),
  "@framework-theme/homerio/components/Pagination": path.join(frameworkHomerioThemePath, "components/Pagination.tsx"),
};

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: turbopackRoot,
    resolveAlias: frameworkHomerioTurbopackAliases,
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...frameworkHomerioWebpackAliases,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
