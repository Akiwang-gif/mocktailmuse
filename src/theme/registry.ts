import type { ThemeRegistryEntry } from "./types";

export const themeRegistry = {
  homerio: {
    name: "homerio",
    theme: "homerio",
    version: "homerio-theme-v1",
    type: "frontend-theme",
    displayName: "Homerio",
    libraryPath: "frontend-library/homerio",
    capabilities: ["homepage", "components"],
    description: "Homepage presentation theme prepared for future frontend-library/homerio loading.",
  },
} as const satisfies Record<string, ThemeRegistryEntry>;

export type RegisteredThemeName = keyof typeof themeRegistry;

export function getThemeRegistryEntry(theme: string): ThemeRegistryEntry | null {
  return Object.prototype.hasOwnProperty.call(themeRegistry, theme)
    ? themeRegistry[theme as RegisteredThemeName]
    : null;
}

export function isRegisteredTheme(theme: string): theme is RegisteredThemeName {
  return getThemeRegistryEntry(theme) !== null;
}
