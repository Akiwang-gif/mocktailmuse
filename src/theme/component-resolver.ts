import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

import { resolveThemeSource } from "./source-resolver";

type ThemeComponentType = "server-component" | "client-component";

type ThemeComponentMetadata = {
  file: string;
  export: string;
  type: ThemeComponentType;
};

type ThemeJson = {
  package?: string;
  components?: {
    registry?: Record<string, ThemeComponentMetadata>;
  };
};

type ThemeComponentModule = Record<string, unknown>;

type ThemeComponentAdapter = {
  file: string;
  exportName: string;
  type: ThemeComponentType;
  packageImport: string;
  importModule: () => Promise<ThemeComponentModule>;
};

export type ResolvedThemeComponent = ComponentType<Record<string, unknown>>;

const componentAdapters: Record<string, Record<string, ThemeComponentAdapter>> = {
  homerio: {
    articleCard: {
      file: "components/EditorialArticleCard.tsx",
      exportName: "EditorialArticleCard",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/EditorialArticleCard.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/EditorialArticleCard"),
    },
    categoryCard: {
      file: "components/HomeCategoryCard.tsx",
      exportName: "HomeCategoryCard",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/HomeCategoryCard.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/HomeCategoryCard"),
    },
    featuredGrid: {
      file: "components/FeaturedGrid.tsx",
      exportName: "FeaturedGrid",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/FeaturedGrid.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/FeaturedGrid"),
    },
    latestArticlesGrid: {
      file: "components/LatestArticlesGrid.tsx",
      exportName: "LatestArticlesGrid",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/LatestArticlesGrid.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/LatestArticlesGrid"),
    },
    categoryGrid: {
      file: "components/HomeCategoryGrid.tsx",
      exportName: "HomeCategoryGrid",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/HomeCategoryGrid.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/HomeCategoryGrid"),
    },
    footerAccordionSection: {
      file: "components/FooterAccordionSection.tsx",
      exportName: "FooterAccordionSection",
      type: "client-component",
      packageImport: "@contentforge/theme-homerio/components/FooterAccordionSection.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/FooterAccordionSection"),
    },
    homeSectionHeading: {
      file: "components/HomeSectionHeading.tsx",
      exportName: "HomeSectionHeading",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/HomeSectionHeading.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/HomeSectionHeading"),
    },
    pagination: {
      file: "components/Pagination.tsx",
      exportName: "Pagination",
      type: "server-component",
      packageImport: "@contentforge/theme-homerio/components/Pagination.tsx",
      importModule: () => import("@contentforge/theme-homerio/components/Pagination"),
    },
  },
};

export async function resolveThemeComponent(componentKey: string): Promise<ResolvedThemeComponent> {
  const themeSource = resolveThemeSource();
  const themeKey = themeSource.themeName.toLowerCase();
  const themeJson = readThemeJson(themeSource.absolutePath);
  const metadata = readComponentMetadata(themeJson, componentKey);
  const adapter = componentAdapters[themeKey]?.[componentKey];

  if (!adapter) {
    throw new Error(`Theme component "${componentKey}" is not registered for theme "${themeSource.themeName}".`);
  }

  validateAdapter(themeSource.themeName, componentKey, metadata, adapter);

  const module = await importThemeComponentModule(themeJson, metadata, adapter);
  const component = module[metadata.export];

  if (typeof component !== "function") {
    throw new Error(`Theme component "${componentKey}" export "${metadata.export}" was not found or is not a React component.`);
  }

  return component as ResolvedThemeComponent;
}

function readThemeJson(themeSourcePath: string): ThemeJson {
  const themeJsonPath = path.join(themeSourcePath, "theme.json");

  if (!existsSync(themeJsonPath)) {
    throw new Error(`Theme manifest not found at ${themeJsonPath}.`);
  }

  return JSON.parse(readFileSync(themeJsonPath, "utf8")) as ThemeJson;
}

function readComponentMetadata(themeJson: ThemeJson, componentKey: string): ThemeComponentMetadata {
  const metadata = themeJson.components?.registry?.[componentKey];

  if (!metadata) {
    throw new Error(`Theme manifest does not define component "${componentKey}".`);
  }

  return metadata;
}

function validateAdapter(themeName: string, componentKey: string, metadata: ThemeComponentMetadata, adapter: ThemeComponentAdapter) {
  if (metadata.file !== adapter.file || metadata.export !== adapter.exportName || metadata.type !== adapter.type) {
    throw new Error(`Theme component "${componentKey}" metadata does not match the ${themeName} adapter registry.`);
  }
}

async function importThemeComponentModule(themeJson: ThemeJson, metadata: ThemeComponentMetadata, adapter: ThemeComponentAdapter): Promise<ThemeComponentModule> {
  if (!themeJson.package) {
    throw new Error("Theme manifest is missing package. Add package to theme.json before resolving theme components.");
  }

  const manifestPackageImport = `${themeJson.package}/${metadata.file}`;
  if (manifestPackageImport !== adapter.packageImport) {
    throw new Error(`Theme component package import mismatch: manifest uses ${manifestPackageImport}, adapter uses ${adapter.packageImport}.`);
  }

  return adapter.importModule();
}
