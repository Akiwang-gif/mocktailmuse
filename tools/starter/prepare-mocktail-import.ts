import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

type CategorySlug = "recipes" | "flavor-guides" | "lifestyle" | "collections" | "essentials" | "experiences";

const defaultSourceRoot = "E:/MocktailMuse-old-test/articles";
const defaultTargetRoot = "content/import/articles";

const categoryMap: Record<string, CategorySlug> = {
  "core-mocktail-recipes": "recipes",
  "mocktail-guides": "flavor-guides",
  "sober-curious-lifestyle": "lifestyle",
  "mocktail-gifts-shopping": "collections",
  "mocktail-faq": "essentials",
  "mocktail-fun-interactive": "experiences",
};

const tagMap: Record<CategorySlug, string[]> = {
  recipes: ["refreshing", "classic"],
  "flavor-guides": ["citrus", "classic"],
  lifestyle: ["healthy", "party-drinks"],
  collections: ["party-drinks", "classic"],
  essentials: ["classic", "healthy"],
  experiences: ["party-drinks", "refreshing"],
};

const featuredSlugs = new Set([
  "virgin-mojito",
  "simple-syrup-guide",
  "sober-curious-beginners-guide",
  "mocktail-gift-set-guide",
  "what-is-a-mocktail",
  "mocktail-flavor-personality-quiz",
]);

const knownHeadingTexts = new Set([
  "Lead",
  "Preparation details",
  "Ingredients",
  "Method",
  "Serving notes",
  "Make it your own",
  "Troubleshooting",
  "Common questions",
  "Why this recipe belongs in a regular rotation",
  "Small habits that improve every result",
  "Plan around the people at the table",
  "Keep the routine realistic",
  "What this guide covers",
  "Core principle",
  "A simple decision framework",
  "Use it in real life",
  "Common mistakes",
  "Questions readers ask",
  "A useful way to keep learning",
  "Sources:",
]);

function isHeadingBlock(block: string) {
  if (knownHeadingTexts.has(block)) return true;
  if (block.length > 80) return false;
  if (/[.!?]$/.test(block)) return false;
  if (/^https?:\/\//i.test(block)) return false;
  if (block.includes(" https://")) return false;
  return /^[A-Z0-9]/.test(block);
}

function argValue(name: string, fallback: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function ensureInsideWorkspace(targetRoot: string) {
  const workspace = process.cwd();
  const absoluteTarget = path.resolve(workspace, targetRoot);
  if (!absoluteTarget.toLowerCase().startsWith(workspace.toLowerCase())) {
    throw new Error(`Refusing to write outside workspace: ${absoluteTarget}`);
  }
  return absoluteTarget;
}

function listPublishFiles(root: string): string[] {
  const output: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) output.push(...listPublishFiles(absolute));
    if (entry.isFile() && entry.name.endsWith(".publish.txt")) output.push(absolute);
  }
  return output.sort();
}

function meta(lines: string[], key: string) {
  const prefix = `${key}:`;
  return lines.find((line) => line.startsWith(prefix))?.slice(prefix.length).trim() ?? "";
}

function frontmatterString(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function normalizeParagraph(lines: string[]) {
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

function bodyBlocks(lines: string[]) {
  const leadIndex = lines.findIndex((line) => line.trim() === "Lead");
  const contentLines = leadIndex >= 0 ? lines.slice(leadIndex) : lines;
  const blocks: string[] = [];
  let current: string[] = [];

  for (const line of contentLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("Image:")) continue;
    if (!trimmed) {
      if (current.length > 0) {
        blocks.push(normalizeParagraph(current));
        current = [];
      }
      continue;
    }
    current.push(trimmed);
  }

  if (current.length > 0) blocks.push(normalizeParagraph(current));
  return blocks;
}

function summaryFromBlocks(blocks: string[]) {
  const leadIndex = blocks.indexOf("Lead");
  const summary = leadIndex >= 0 ? blocks[leadIndex + 1] : blocks.find((block) => !isHeadingBlock(block));
  if (!summary) return "";
  return summary.length > 220 ? `${summary.slice(0, 217).trimEnd()}...` : summary;
}

function markdownFromBlocks(blocks: string[], title: string, inlineImageName: string) {
  const markdownBlocks = blocks.flatMap((block) => {
    if (!isHeadingBlock(block)) return [block];
    if (block === "Lead") return [];
    return [`### ${block}`];
  });

  const insertAt = Math.max(2, Math.floor(markdownBlocks.length / 2));
  markdownBlocks.splice(insertAt, 0, `![${title} process](images/${inlineImageName})`);
  return markdownBlocks;
}

function categoryFromBatch(batchName: string): CategorySlug {
  const normalized = batchName.replace(/-\d{4}-\d{2}-\d{2}$/, "");
  const category = categoryMap[normalized];
  if (!category) throw new Error(`No category mapping for folder: ${batchName}`);
  return category;
}

function prepare() {
  const sourceRoot = path.resolve(argValue("--source", defaultSourceRoot));
  const targetRoot = ensureInsideWorkspace(argValue("--target", defaultTargetRoot));

  if (!existsSync(sourceRoot)) throw new Error(`Source folder does not exist: ${sourceRoot}`);
  if (existsSync(targetRoot)) rmSync(targetRoot, { recursive: true, force: true });
  mkdirSync(targetRoot, { recursive: true });

  const files = listPublishFiles(sourceRoot);
  if (files.length === 0) throw new Error(`No .publish.txt files found in ${sourceRoot}`);

  for (const file of files) {
    const articleDir = path.dirname(file);
    const batchDir = path.basename(path.dirname(articleDir));
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    const title = meta(lines, "Title");
    const slug = meta(lines, "Slug");
    const date = meta(lines, "Date");
    const categorySlug = categoryFromBatch(batchDir);
    if (!title || !slug || !date) throw new Error(`Missing Title, Slug, or Date in ${file}`);

    const imagesDir = path.join(articleDir, "images");
    const imageNames = readdirSync(imagesDir).sort();
    const coverName = imageNames.find((name) => /-cover\./.test(name));
    const inlineName = imageNames.find((name) => /-steps\./.test(name));
    if (!coverName || !inlineName) throw new Error(`Missing cover or steps image in ${imagesDir}`);

    const blocks = bodyBlocks(lines);
    const summary = summaryFromBlocks(blocks);
    const markdownBlocks = markdownFromBlocks(blocks, title, inlineName);
    const targetArticleDir = path.join(targetRoot, slug);
    const targetImagesDir = path.join(targetArticleDir, "images");
    mkdirSync(targetImagesDir, { recursive: true });

    copyFileSync(path.join(imagesDir, coverName), path.join(targetImagesDir, coverName));
    copyFileSync(path.join(imagesDir, inlineName), path.join(targetImagesDir, inlineName));

    const tags = tagMap[categorySlug].map((tag) => `"${tag}"`).join(", ");
    const isFeatured = featuredSlugs.has(slug);
    const frontmatter = [
      "---",
      `title: ${frontmatterString(title)}`,
      `slug: ${slug}`,
      `summary: ${frontmatterString(summary)}`,
      `categorySlug: ${categorySlug}`,
      `tags: [${tags}]`,
      "status: published",
      `publishedAt: ${date}T00:00:00.000Z`,
      `cover: images/${coverName}`,
      `seoTitle: ${frontmatterString(title)}`,
      `seoDescription: ${frontmatterString(summary)}`,
      `isFeatured: ${isFeatured ? "true" : "false"}`,
      `isPinned: ${isFeatured ? "true" : "false"}`,
      "---",
    ].join("\n");
    const articleMarkdown = `${frontmatter}\n\n${markdownBlocks.join("\n\n")}\n`;

    writeFileSync(path.join(targetArticleDir, "article.md"), articleMarkdown, "utf8");
  }

  console.log(`Prepared ${files.length} article import folder(s) in ${targetRoot}`);
}

prepare();
