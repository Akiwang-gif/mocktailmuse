import { getThemeRegistryEntry } from "./registry";
import type { LoadedThemeRuntime, SiteThemeConfig, ThemeConfig, ThemeDefinition } from "./types";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const defaultThemeConfigPath = "site.theme.json";

export function getSiteThemeConfig(): SiteThemeConfig {
  const config = loadThemeConfig();

  return {
    theme: config.name,
    version: config.version,
  };
}

export function loadSiteTheme(): LoadedThemeRuntime {
  const config = getSiteThemeConfig();
  const theme = getThemeRegistryEntry(config.theme);

  if (!theme) {
    throw new Error(`Theme "${config.theme}" is not registered in src/theme/registry.ts.`);
  }

  if (theme.version !== config.version) {
    throw new Error(
      `Theme "${config.theme}" version mismatch: site.theme.json uses "${config.version}", but registry has "${theme.version}".`,
    );
  }

  return {
    config,
    theme,
  };
}

export function loadThemeDefinition(configPath = path.join(process.cwd(), defaultThemeConfigPath)): ThemeDefinition {
  const config = loadThemeConfig(configPath);
  const theme = getThemeRegistryEntry(config.name);

  if (!theme) {
    throw new Error(`Unknown ContentForge theme "${config.name}". Register it in src/theme/registry.ts before using it.`);
  }

  if (theme.version !== config.version) {
    throw new Error(`Theme version mismatch for "${config.name}": site.theme.json uses ${config.version}, but registry has ${theme.version}.`);
  }

  return theme;
}

export function loadThemeConfig(configPath = path.join(process.cwd(), defaultThemeConfigPath)): ThemeConfig {
  if (!existsSync(configPath)) {
    throw new Error(`Theme config not found at ${configPath}. Create site.theme.json for this Site Instance.`);
  }

  const raw = JSON.parse(readFileSync(configPath, "utf8")) as unknown;
  return parseThemeConfig(raw);
}

function parseThemeConfig(value: unknown): ThemeConfig {
  if (!isRecord(value)) {
    throw new Error("site.theme.json must contain a JSON object.");
  }

  const themeValue = value.name ?? value.theme;
  const { version } = value;

  if (typeof themeValue !== "string" || themeValue.trim() === "") {
    throw new Error("site.theme.json requires a non-empty string field: name.");
  }

  if (typeof version !== "string" || version.trim() === "") {
    throw new Error("site.theme.json requires a non-empty string field: version.");
  }

  return {
    name: themeValue,
    version,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
