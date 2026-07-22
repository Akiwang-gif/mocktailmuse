import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import { normalizeSlash, printCheck, readJsoncFile, truncate } from "./cli-utils";
import { wranglerD1Execute, wranglerR2ObjectPut } from "./wrangler";

type WranglerConfig = {
  d1_databases?: Array<{ binding?: string; database_name?: string }>;
  r2_buckets?: Array<{ binding?: string; bucket_name?: string }>;
  vars?: Record<string, string>;
};

type ArticleFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  categorySlug: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  cover: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isFeatured: boolean;
  isPinned: boolean;
};

type ArticleCandidate = {
  folder: string;
  markdownPath: string;
  bodyMarkdown: string;
  frontmatter: ArticleFrontmatter;
  coverPath: string | null;
  inlineImages: string[];
};

type ImportStep = {
  label: string;
  kind: "read" | "validate" | "upload" | "d1";
  articleSlug?: string;
  sourcePath?: string;
  objectKey?: string;
};

type ImportPlan = {
  generatedAt: string;
  dryRun: boolean;
  sourceDir: string;
  databaseName: string;
  bucketName: string;
  r2PublicBaseUrl: string;
  articles: Array<{
    title: string;
    slug: string;
    status: string;
    categorySlug: string;
    tagSlugs: string[];
    coverObjectKey: string | null;
    inlineImageObjectKeys: string[];
  }>;
  rollback: Array<{
    slug: string;
    d1Sql: string;
    r2ObjectKeys: string[];
  }>;
};

type CliOptions = {
  sourceDir: string;
  planPath: string;
  execute: boolean;
  remote: boolean;
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = readJsoncFile<WranglerConfig>(path.join(process.cwd(), "wrangler.jsonc"));
  const databaseName = config.d1_databases?.find((database) => database.binding === "DB")?.database_name;
  const bucketName = config.r2_buckets?.find((bucket) => bucket.binding === "MEDIA_BUCKET")?.bucket_name;
  const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL || config.vars?.R2_PUBLIC_BASE_URL;

  if (!databaseName) throw new Error("Missing DB database_name in wrangler.jsonc.");
  if (!bucketName) throw new Error("Missing MEDIA_BUCKET bucket_name in wrangler.jsonc.");
  if (!r2PublicBaseUrl) throw new Error("Missing R2_PUBLIC_BASE_URL in environment or wrangler.jsonc vars.");

  const sourceDir = path.resolve(process.cwd(), options.sourceDir);
  const candidates = validateFolders(sourceDir);
  const articles = candidates.map(readAndValidateArticle);
  validateImages(articles);
  await validateD1(databaseName, options.remote, options.execute);

  const plan = generatePlan(options, sourceDir, databaseName, bucketName, r2PublicBaseUrl, articles);
  writePlan(options.planPath, plan);

  if (!options.execute) {
    printPlan(plan);
    printRollbackGuidance(plan);
    console.log("");
    console.log("Dry run complete. Re-run with `npm run import:articles -- --execute` after reviewing the plan.");
    return;
  }

  await executePlan(plan, articles, bucketName, databaseName, options.remote);
  printRollbackGuidance(plan);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    sourceDir: "content/import/articles",
    planPath: "data/article-import-plan.json",
    execute: false,
    remote: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--source" && next) {
      options.sourceDir = next;
      index += 1;
    } else if (arg === "--plan" && next) {
      options.planPath = next;
      index += 1;
    } else if (arg === "--execute") {
      options.execute = true;
    } else if (arg === "--dry-run") {
      options.execute = false;
    } else if (arg === "--remote") {
      options.remote = true;
    } else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log("Usage:");
  console.log("  npm run import:articles -- --source content/import/articles --dry-run");
  console.log("  npm run import:articles -- --source content/import/articles --execute --remote");
}

function validateFolders(sourceDir: string) {
  printCheck("PASS", "Pipeline", "Dry run -> Validate folders -> Validate markdown -> Validate images -> Validate D1 -> Generate import plan -> Execute");

  if (!existsSync(sourceDir)) {
    throw new Error(`Source folder does not exist: ${sourceDir}`);
  }

  const folders = readdirSync(sourceDir)
    .map((name) => path.join(sourceDir, name))
    .filter((folder) => statSync(folder).isDirectory());

  if (folders.length === 0) {
    throw new Error(`No article folders found in ${sourceDir}`);
  }

  for (const folder of folders) {
    const markdownPath = path.join(folder, "article.md");
    if (!existsSync(markdownPath)) {
      throw new Error(`Missing article.md in ${folder}`);
    }
  }

  printCheck("PASS", "Validate folders", `${folders.length} article folder(s) found.`);
  return folders;
}

function readAndValidateArticle(folder: string): ArticleCandidate {
  const markdownPath = path.join(folder, "article.md");
  const markdown = readFileSync(markdownPath, "utf8");
  const { rawFrontmatter, bodyMarkdown } = splitFrontmatter(markdown, markdownPath);
  const frontmatter = normalizeFrontmatter(parseFrontmatter(rawFrontmatter), markdownPath);
  const coverPath = resolveCoverPath(folder, frontmatter.cover);
  const inlineImages = extractInlineImages(bodyMarkdown)
    .map((imagePath) => path.resolve(folder, imagePath))
    .filter((imagePath, index, list) => list.indexOf(imagePath) === index);

  return {
    folder,
    markdownPath,
    bodyMarkdown,
    frontmatter,
    coverPath,
    inlineImages,
  };
}

function splitFrontmatter(markdown: string, markdownPath: string) {
  if (!markdown.startsWith("---")) {
    throw new Error(`${markdownPath} must start with frontmatter delimited by ---`);
  }

  const endIndex = markdown.indexOf("\n---", 3);
  if (endIndex === -1) {
    throw new Error(`${markdownPath} is missing closing frontmatter delimiter.`);
  }

  return {
    rawFrontmatter: markdown.slice(3, endIndex).trim(),
    bodyMarkdown: markdown.slice(endIndex + 4).trim(),
  };
}

function parseFrontmatter(raw: string) {
  const values = new Map<string, string>();

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    values.set(key, unquote(value));
  }

  return values;
}

function normalizeFrontmatter(values: Map<string, string>, markdownPath: string): ArticleFrontmatter {
  const required = ["title", "slug", "summary", "categorySlug"];
  for (const key of required) {
    if (!values.get(key)) throw new Error(`${markdownPath} is missing required frontmatter field: ${key}`);
  }

  const status = values.get("status") || "draft";
  if (!["draft", "published", "archived"].includes(status)) {
    throw new Error(`${markdownPath} has invalid status: ${status}`);
  }

  const slug = values.get("slug") || "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${markdownPath} has invalid slug: ${slug}`);
  }

  return {
    title: values.get("title") || "",
    slug,
    summary: values.get("summary") || "",
    categorySlug: values.get("categorySlug") || "",
    tags: parseList(values.get("tags")),
    status: status as ArticleFrontmatter["status"],
    publishedAt: values.get("publishedAt") || null,
    cover: values.get("cover") || null,
    seoTitle: values.get("seoTitle") || null,
    seoDescription: values.get("seoDescription") || null,
    isFeatured: parseBoolean(values.get("isFeatured")),
    isPinned: parseBoolean(values.get("isPinned")),
  };
}

function resolveCoverPath(folder: string, cover: string | null) {
  if (cover) return path.resolve(folder, cover);

  const found = readdirSync(folder).find((fileName) => fileName.toLowerCase().startsWith("cover.") && imageExtensions.has(path.extname(fileName).toLowerCase()));
  return found ? path.join(folder, found) : null;
}

function extractInlineImages(markdown: string) {
  const images: string[] = [];
  const imagePattern = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = imagePattern.exec(markdown)) !== null) {
    const imagePath = match[1]?.trim();
    if (!imagePath || /^https?:\/\//i.test(imagePath) || imagePath.startsWith("/")) continue;
    images.push(imagePath);
  }

  return images;
}

function validateImages(articles: ArticleCandidate[]) {
  for (const article of articles) {
    if (article.coverPath) validateImagePath(article.coverPath, article.markdownPath);
    for (const imagePath of article.inlineImages) validateImagePath(imagePath, article.markdownPath);
  }

  printCheck("PASS", "Validate images", "Cover and inline image references exist.");
}

function validateImagePath(imagePath: string, markdownPath: string) {
  if (!existsSync(imagePath)) throw new Error(`${markdownPath} references missing image: ${imagePath}`);
  if (!imageExtensions.has(path.extname(imagePath).toLowerCase())) throw new Error(`${markdownPath} references unsupported image type: ${imagePath}`);
}

async function validateD1(databaseName: string, remote: boolean, execute: boolean) {
  const args = ["--command", "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('articles','categories','tags','article_tags')"];
  if (remote) args.push("--remote");

  const result = await wranglerD1Execute(databaseName, args);
  if (result.code !== 0) {
    const detail = truncate(result.stderr || result.stdout || "D1 validation failed.");
    if (execute) throw new Error(detail);
    printCheck("WARNING", "Validate D1", detail);
    return;
  }

  printCheck("PASS", "Validate D1", "Required article tables are queryable.");
}

function generatePlan(options: CliOptions, sourceDir: string, databaseName: string, bucketName: string, r2PublicBaseUrl: string, articles: ArticleCandidate[]): ImportPlan {
  const plan: ImportPlan = {
    generatedAt: new Date().toISOString(),
    dryRun: !options.execute,
    sourceDir,
    databaseName,
    bucketName,
    r2PublicBaseUrl,
    articles: articles.map((article) => {
      const coverObjectKey = article.coverPath ? objectKey(article.frontmatter.slug, article.coverPath, "cover") : null;
      const inlineImageObjectKeys = article.inlineImages.map((imagePath) => objectKey(article.frontmatter.slug, imagePath, "images"));

      return {
        title: article.frontmatter.title,
        slug: article.frontmatter.slug,
        status: article.frontmatter.status,
        categorySlug: article.frontmatter.categorySlug,
        tagSlugs: article.frontmatter.tags,
        coverObjectKey,
        inlineImageObjectKeys,
      };
    }),
    rollback: [],
  };

  plan.rollback = plan.articles.map((article) => ({
    slug: article.slug,
    d1Sql: `DELETE FROM article_tags WHERE article_id IN (SELECT id FROM articles WHERE slug = '${sqlString(article.slug)}'); DELETE FROM articles WHERE slug = '${sqlString(article.slug)}';`,
    r2ObjectKeys: [article.coverObjectKey, ...article.inlineImageObjectKeys].filter((key): key is string => Boolean(key)),
  }));

  printCheck("PASS", "Generate import plan", `${plan.articles.length} article(s), ${plan.rollback.reduce((count, entry) => count + entry.r2ObjectKeys.length, 0)} R2 object(s).`);
  return plan;
}

function writePlan(planPath: string, plan: ImportPlan) {
  const absolutePath = path.resolve(process.cwd(), planPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  printCheck("PASS", "Write import plan", absolutePath);
}

function printPlan(plan: ImportPlan) {
  console.log("");
  console.log("Import plan:");
  for (const article of plan.articles) {
    console.log(`- ${article.slug}: ${article.title}`);
  }
}

async function executePlan(plan: ImportPlan, articles: ArticleCandidate[], bucketName: string, databaseName: string, remote: boolean) {
  const steps = buildExecutionSteps(articles);
  let current = 0;

  for (const step of steps) {
    current += 1;
    console.log(`[${current}/${steps.length}] ${step.label}`);

    if (step.kind === "upload" && step.sourcePath && step.objectKey) {
      const upload = await wranglerR2ObjectPut(bucketName, step.objectKey, step.sourcePath, remote);
      if (upload.code !== 0) throw new Error(upload.stderr || upload.stdout || `Failed to upload ${step.objectKey}`);
    }

    if (step.kind === "d1" && step.articleSlug) {
      const article = articles.find((candidate) => candidate.frontmatter.slug === step.articleSlug);
      if (!article) throw new Error(`Article not found for D1 import: ${step.articleSlug}`);

      const sql = buildArticleSql(article, plan.r2PublicBaseUrl);
      const args = ["--command", sql];
      if (remote) args.push("--remote");

      const result = await wranglerD1Execute(databaseName, args);
      if (result.code !== 0) throw new Error(result.stderr || result.stdout || `Failed to import ${step.articleSlug}`);
    }
  }

  printCheck("PASS", "Execute import plan", `${articles.length} article(s) imported.`);
}

function buildExecutionSteps(articles: ArticleCandidate[]): ImportStep[] {
  const steps: ImportStep[] = [];

  for (const article of articles) {
    steps.push({ kind: "read", label: `Reading article ${article.frontmatter.slug}...`, articleSlug: article.frontmatter.slug });
    steps.push({ kind: "validate", label: `Validating article ${article.frontmatter.slug}...`, articleSlug: article.frontmatter.slug });

    if (article.coverPath) {
      steps.push({
        kind: "upload",
        label: `Uploading cover for ${article.frontmatter.slug}...`,
        articleSlug: article.frontmatter.slug,
        sourcePath: article.coverPath,
        objectKey: objectKey(article.frontmatter.slug, article.coverPath, "cover"),
      });
    }

    for (const imagePath of article.inlineImages) {
      steps.push({
        kind: "upload",
        label: `Uploading inline image for ${article.frontmatter.slug}...`,
        articleSlug: article.frontmatter.slug,
        sourcePath: imagePath,
        objectKey: objectKey(article.frontmatter.slug, imagePath, "images"),
      });
    }

    steps.push({ kind: "d1", label: `Writing article ${article.frontmatter.slug} to D1...`, articleSlug: article.frontmatter.slug });
  }

  return steps;
}

function buildArticleSql(article: ArticleCandidate, r2PublicBaseUrl: string) {
  const now = new Date().toISOString();
  const mediaBaseUrl = "/media";
  const coverUrl = article.coverPath ? `${mediaBaseUrl}/${objectKey(article.frontmatter.slug, article.coverPath, "cover")}` : "";
  const bodyHtml = markdownToHtml(article.bodyMarkdown, article.frontmatter.slug, mediaBaseUrl);
  const publishedAt = article.frontmatter.status === "published" ? article.frontmatter.publishedAt || now : null;
  const tagValues = article.frontmatter.tags.map((tag) => `'${sqlString(tag)}'`).join(",");

  return [
    `INSERT INTO articles (title, slug, summary, body_html, cover_url, category_id, status, is_featured, is_pinned, sort_order, view_count, published_at, created_at, updated_at, seo_title, seo_description)`,
    `SELECT '${sqlString(article.frontmatter.title)}', '${sqlString(article.frontmatter.slug)}', '${sqlString(article.frontmatter.summary)}', '${sqlString(bodyHtml)}', '${sqlString(coverUrl)}', categories.id, '${article.frontmatter.status}', ${article.frontmatter.isFeatured ? 1 : 0}, ${article.frontmatter.isPinned ? 1 : 0}, COALESCE((SELECT MAX(sort_order) FROM articles), 0) + 1, 0, ${publishedAt ? `'${sqlString(publishedAt)}'` : "NULL"}, '${now}', '${now}', ${nullableSql(article.frontmatter.seoTitle)}, ${nullableSql(article.frontmatter.seoDescription)}`,
    `FROM categories WHERE categories.slug = '${sqlString(article.frontmatter.categorySlug)}' AND NOT EXISTS (SELECT 1 FROM articles WHERE slug = '${sqlString(article.frontmatter.slug)}');`,
    tagValues ? `INSERT OR IGNORE INTO article_tags (article_id, tag_id) SELECT articles.id, tags.id FROM articles JOIN tags ON tags.slug IN (${tagValues}) WHERE articles.slug = '${sqlString(article.frontmatter.slug)}';` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function markdownToHtml(markdown: string, slug: string, r2PublicBaseUrl: string) {
  return markdown
    .split(/\r?\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        const alt = escapeHtml(imageMatch[1] || "");
        const source = imageMatch[2] || "";
        const src = /^https?:\/\//i.test(source) || source.startsWith("/") ? source : `${r2PublicBaseUrl.replace(/\/$/, "")}/${objectKey(slug, source, "images")}`;
        return `<figure><img src="${escapeHtml(src)}" alt="${alt}" /></figure>`;
      }

      if (block.startsWith("### ")) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1>${escapeHtml(block.slice(2))}</h1>`;
      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}

function printRollbackGuidance(plan: ImportPlan) {
  console.log("");
  console.log("Rollback guidance:");
  console.log("If the import stops halfway, review data/article-import-plan.json first.");
  console.log("For D1 cleanup, run the d1Sql statements listed under rollback for affected slugs.");
  console.log("For R2 cleanup, delete the object keys listed under rollback.r2ObjectKeys.");
  console.log(`Example D1 target: ${plan.databaseName}`);
  console.log(`Example R2 bucket: ${plan.bucketName}`);
}

function objectKey(slug: string, filePath: string, group: "cover" | "images") {
  const fileName = path.basename(filePath);
  return normalizeSlash(path.posix.join("articles", slug, group, fileName));
}

function parseList(value: string | undefined) {
  if (!value) return [];
  return value
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((item) => unquote(item.trim()))
    .filter(Boolean);
}

function parseBoolean(value: string | undefined) {
  return value === "true" || value === "1" || value === "yes";
}

function unquote(value: string) {
  return value.replace(/^['"]/, "").replace(/['"]$/, "");
}

function sqlString(value: string) {
  return value.replace(/'/g, "''");
}

function nullableSql(value: string | null) {
  return value ? `'${sqlString(value)}'` : "NULL";
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown import error.";
  printCheck("FAIL", "Article import", message);
  console.log("");
  console.log("Recovery:");
  console.log("- If no D1 write happened, fix the validation error and run the dry run again.");
  console.log("- If R2 uploads completed but D1 failed, delete uploaded object keys from data/article-import-plan.json.");
  console.log("- If D1 wrote an article and later steps failed, run the rollback SQL from data/article-import-plan.json for the affected slug.");
  process.exitCode = 1;
});
