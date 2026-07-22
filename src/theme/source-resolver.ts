import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { resolveSiteTheme } from "./resolver";

type ThemeSourceConfig = {
  frameworkRoot?: string;
};

export type ResolvedThemeSource = {
  themeName: string;
  version: string;
  libraryPath: string;
  absolutePath: string;
};

const defaultThemeSourceConfigPath = "theme.source.json";

export function resolveThemeSource(configPath = path.join(process.cwd(), defaultThemeSourceConfigPath)): ResolvedThemeSource {
  const theme = resolveSiteTheme();
  const sourceConfig = loadThemeSourceConfig(configPath);
  const sourceRoot = sourceConfig.frameworkRoot ? path.resolve(process.cwd(), sourceConfig.frameworkRoot) : process.cwd();
  const absolutePath = path.join(sourceRoot, theme.libraryPath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Theme source for "${theme.name}" was not found at ${absolutePath}.`);
  }

  return {
    themeName: theme.name,
    version: theme.version,
    libraryPath: theme.libraryPath,
    absolutePath,
  };
}

function loadThemeSourceConfig(configPath: string): ThemeSourceConfig {
  if (!existsSync(configPath)) {
    return {};
  }

  const raw = JSON.parse(readFileSync(configPath, "utf8")) as unknown;

  if (!isRecord(raw)) {
    throw new Error("theme.source.json must contain a JSON object.");
  }

  const { frameworkRoot } = raw;

  if (frameworkRoot !== undefined && (typeof frameworkRoot !== "string" || frameworkRoot.trim() === "")) {
    throw new Error("theme.source.json field frameworkRoot must be a non-empty string when provided.");
  }

  return {
    frameworkRoot,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
