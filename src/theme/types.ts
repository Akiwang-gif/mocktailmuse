export type SiteThemeConfig = {
  theme: string;
  version: string;
};

export type ThemeConfig = {
  name: string;
  version: string;
};

export type ThemeDefinition = {
  name: string;
  theme: string;
  version: string;
  type: "frontend-theme";
  displayName: string;
  libraryPath: string;
  capabilities: readonly string[];
  description?: string;
};

export type ThemeComponentRegistry = Record<string, boolean>;

export type ThemeRegistry = Record<string, ThemeDefinition>;

export type ThemeRegistryEntry = ThemeDefinition;

export type LoadedThemeRuntime = {
  config: SiteThemeConfig;
  theme: ThemeRegistryEntry;
};
