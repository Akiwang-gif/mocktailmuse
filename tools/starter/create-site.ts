import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { projectRoot, runCommand, truncate } from "./cli-utils";

type LinkItem = {
  label: string;
  href: string;
};

type SlugItem = {
  name: string;
  slug: string;
};

type HomepageModule = {
  key: string;
  label: string;
  enabled: boolean;
};

type SiteManifest = {
  siteName: string;
  domain: string;
  productionUrl: string;
  tagline: string;
  description: string;
  contactEmail: string;
  supportEmail: string;
  legalEmail: string;
  teamName: string;
  editorialTeamName: string;
  operatorName: string;
  operatorCountry: string;
  legalStatus: string;
  packageName: string;
  githubRepo: string;
  cloudflareWorkerName: string;
  d1DatabaseName: string;
  d1DatabaseId: string;
  r2BucketName: string;
  themeName: string;
  brandColors: Record<string, string>;
  navigation: LinkItem[];
  categories: SlugItem[];
  tags: SlugItem[];
  homepageModules: HomepageModule[];
  defaultAuthor: string;
  rssEnabled: boolean;
  adsEnabled: boolean;
  adsensePublisherId: string;
};

type Options = {
  help: boolean;
  outputPath: string;
  yes: boolean;
};

const placeholderUuid = "00000000-0000-0000-0000-000000000000";
const defaultOutputPath = "starter.site.json";
const examplePath = path.join(projectRoot, "starter.site.example.json");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const defaults = readExampleManifest();
  const outputPath = path.resolve(projectRoot, options.outputPath);

  if (existsSync(outputPath)) {
    if (options.yes) {
      fail("Output exists", `${path.relative(projectRoot, outputPath)} already exists. --yes will not overwrite files.`);
      process.exit(1);
    }

    const overwrite = await confirmOverwrite(outputPath);
    if (!overwrite) {
      fail("Create site cancelled", "Existing manifest was not overwritten.");
      process.exit(1);
    }
  }

  const manifest = options.yes ? buildDefaultManifest(defaults) : await runWizard(defaults);
  writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  pass("Manifest written", path.relative(projectRoot, outputPath));

  await validateManifest(outputPath);
  printNextSteps();
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    help: false,
    outputPath: defaultOutputPath,
    yes: false,
  };

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--yes") {
      options.yes = true;
    } else if (arg.startsWith("--output=")) {
      const value = arg.slice("--output=".length).trim();
      if (!value) {
        fail("Argument", "--output requires a file path.");
        process.exit(1);
      }
      options.outputPath = value;
    } else {
      fail("Argument", `Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  return options;
}

function readExampleManifest(): SiteManifest {
  if (!existsSync(examplePath)) {
    fail("Example manifest", "starter.site.example.json is missing.");
    process.exit(1);
  }

  return JSON.parse(readFileSync(examplePath, "utf8")) as SiteManifest;
}

async function confirmOverwrite(outputPath: string) {
  if (!process.stdin.isTTY) return false;
  const reader = createInterface({ input, output });
  const answer = await reader.question(`${path.relative(projectRoot, outputPath)} already exists. Type OVERWRITE to replace it: `);
  reader.close();
  return answer === "OVERWRITE";
}

async function runWizard(defaults: SiteManifest): Promise<SiteManifest> {
  const reader = createInterface({ input, output });
  try {
    console.log("Starter Create Site Wizard");
    console.log("");
    console.log("Press Enter to accept the default shown in brackets.");
    console.log("");

    const siteName = await ask(reader, "Site name", defaults.siteName);
    const domain = await ask(reader, "Domain", defaults.domain);
    const productionUrl = await ask(reader, "Production URL", normalizeProductionUrl(domain, defaults.productionUrl));
    const packageName = await ask(reader, "Package name", slugify(siteName));
    const workerName = await ask(reader, "Cloudflare Worker name", packageName);
    const d1DatabaseName = await ask(reader, "D1 database name", workerName);
    const r2BucketName = await ask(reader, "R2 bucket name", workerName);
    const adsEnabled = await askBoolean(reader, "Ads enabled", defaults.adsEnabled);

    return {
      siteName,
      domain,
      productionUrl,
      tagline: await ask(reader, "Tagline", defaults.tagline),
      description: await ask(reader, "Description", defaults.description),
      contactEmail: await ask(reader, "Contact email", defaults.contactEmail),
      supportEmail: await ask(reader, "Support email", defaults.supportEmail),
      legalEmail: await ask(reader, "Legal email", defaults.legalEmail),
      teamName: await ask(reader, "Team name", `${siteName} Team`),
      editorialTeamName: await ask(reader, "Editorial team name", `${siteName} Editorial Team`),
      operatorName: await ask(reader, "Operator name", `${siteName} Team`),
      operatorCountry: await ask(reader, "Operator country", defaults.operatorCountry),
      legalStatus: await ask(reader, "Legal status", defaults.legalStatus),
      defaultAuthor: await ask(reader, "Default author", `${siteName} desk`),
      packageName,
      githubRepo: await ask(reader, "GitHub repo", defaults.githubRepo),
      cloudflareWorkerName: workerName,
      d1DatabaseName,
      d1DatabaseId: await ask(reader, "D1 database id", placeholderUuid),
      r2BucketName,
      themeName: await ask(reader, "Theme name", `${packageName}-default`),
      brandColors: defaults.brandColors,
      navigation: defaults.navigation,
      categories: parseSlugItems(await ask(reader, "Categories (Name:slug, Name:slug)", formatSlugItems(defaults.categories))),
      tags: parseSlugItems(await ask(reader, "Tags (Name:slug, Name:slug)", formatSlugItems(defaults.tags))),
      homepageModules: parseHomepageModules(
        await ask(reader, "Homepage modules (key:label:enabled, key:label:false)", formatHomepageModules(defaults.homepageModules)),
      ),
      rssEnabled: await askBoolean(reader, "RSS enabled", defaults.rssEnabled),
      adsEnabled,
      adsensePublisherId: adsEnabled ? await ask(reader, "AdSense publisher ID", defaults.adsensePublisherId) : "",
    };
  } finally {
    reader.close();
  }
}

function buildDefaultManifest(defaults: SiteManifest): SiteManifest {
  return {
    ...defaults,
    d1DatabaseId: defaults.d1DatabaseId || placeholderUuid,
    adsensePublisherId: defaults.adsEnabled ? defaults.adsensePublisherId : "",
  };
}

async function ask(reader: ReturnType<typeof createInterface>, label: string, defaultValue: string) {
  const answer = await reader.question(`${label} [${defaultValue}]: `);
  return answer.trim() || defaultValue;
}

async function askBoolean(reader: ReturnType<typeof createInterface>, label: string, defaultValue: boolean) {
  const defaultLabel = defaultValue ? "Y/n" : "y/N";
  const answer = (await reader.question(`${label} [${defaultLabel}]: `)).trim().toLowerCase();
  if (!answer) return defaultValue;
  return ["y", "yes", "true", "1"].includes(answer);
}

function normalizeProductionUrl(domain: string, fallback: string) {
  if (!domain.trim()) return fallback;
  return `https://${domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "content-site"
  );
}

function parseSlugItems(value: string): SlugItem[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [nameRaw, slugRaw] = item.split(":").map((part) => part.trim());
      const name = nameRaw || "Untitled";
      return { name, slug: slugRaw || slugify(name) };
    });
}

function formatSlugItems(items: SlugItem[]) {
  return items.map((item) => `${item.name}:${item.slug}`).join(", ");
}

function parseHomepageModules(value: string): HomepageModule[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [keyRaw, labelRaw, enabledRaw] = item.split(":").map((part) => part.trim());
      return {
        key: keyRaw || slugify(labelRaw || "module"),
        label: labelRaw || keyRaw || "Module",
        enabled: enabledRaw ? ["true", "yes", "y", "1", "enabled"].includes(enabledRaw.toLowerCase()) : true,
      };
    });
}

function formatHomepageModules(items: HomepageModule[]) {
  return items.map((item) => `${item.key}:${item.label}:${String(item.enabled)}`).join(", ");
}

async function validateManifest(outputPath: string) {
  console.log("");
  console.log("Validating generated manifest...");
  const relativeOutputPath = path.relative(projectRoot, outputPath);
  const result = await runNpmScript("manifest:check", [`--file=${relativeOutputPath}`]);
  const combined = `${result.stdout}${result.stderr ? `\n${result.stderr}` : ""}`.trim();
  if (combined) console.log(combined);

  if (result.code !== 0) {
    fail("manifest:check", truncate(combined || "Validation failed."));
    process.exit(1);
  }
}

async function runNpmScript(script: string, args: string[] = []) {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath && existsSync(npmExecPath)) {
    return runCommand(process.execPath, [npmExecPath, "run", script, "--", ...args]);
  }
  return runCommand(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script, "--", ...args]);
}

function printNextSteps() {
  console.log("");
  console.log("Next steps:");
  console.log("  npm run manifest:apply");
  console.log("  npm run doctor");
  console.log("  npm run d1:init");
  console.log("  npm run preflight");
  console.log("  npm run publish");
}

function printHelp() {
  console.log("Usage:");
  console.log("  npm run create-site");
  console.log("  npm run create-site -- --output=starter.site.json");
  console.log("  npm run create-site -- --yes --output=starter.site.generated.json");
  console.log("");
  console.log("Options:");
  console.log("  --help              Show this help.");
  console.log("  --yes               Use safe defaults non-interactively. Does not overwrite existing files.");
  console.log("  --output=<path>     Output manifest path. Default: starter.site.json.");
  console.log("");
  console.log("The wizard writes a manifest only. It does not run manifest:apply or deploy.");
}

function pass(label: string, detail: string) {
  console.log(`✓ PASS ${label} - ${detail}`);
}

function fail(label: string, detail: string) {
  console.log(`✗ FAIL ${label} - ${detail}`);
}

main().catch((error: unknown) => {
  fail("Create-site crashed", error instanceof Error ? error.message : "Unknown error.");
  process.exitCode = 1;
});
