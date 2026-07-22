import { existsSync } from "node:fs";
import path from "node:path";

import { projectRoot, runCommand, type CommandResult, type RunCommandOptions } from "./cli-utils";

export type WranglerCommand = {
  command: string;
  argsPrefix: string[];
  source: "local" | "global";
};

export type WranglerJsonRecord = Record<string, unknown>;

export function resolveWranglerCommand(cwd = projectRoot): WranglerCommand {
  const localScript = path.join(cwd, "node_modules", "wrangler", "bin", "wrangler.js");

  if (existsSync(localScript)) {
    return {
      command: process.execPath,
      argsPrefix: [localScript],
      source: "local",
    };
  }

  return {
    command: process.platform === "win32" ? "wrangler.cmd" : "wrangler",
    argsPrefix: [],
    source: "global",
  };
}

export function runWrangler(args: string[], options: RunCommandOptions = {}): Promise<CommandResult> {
  const wrangler = resolveWranglerCommand(options.cwd ?? projectRoot);
  return runCommand(wrangler.command, [...wrangler.argsPrefix, ...args], options);
}

export function wranglerWhoami() {
  return runWrangler(["whoami"]);
}

export function wranglerD1Execute(databaseName: string, args: string[]) {
  return runWrangler(["d1", "execute", databaseName, ...args]);
}

export function wranglerR2ObjectPut(bucketName: string, objectKey: string, filePath: string, remote = false) {
  const args = ["r2", "object", "put", `${bucketName}/${objectKey}`, "--file", filePath];
  if (remote) args.push("--remote");
  return runWrangler(args);
}

export async function wranglerD1ListJson() {
  const result = await runWrangler(["d1", "list", "--json"]);
  return parseWranglerJsonArray(result);
}

export async function wranglerR2BucketListJson() {
  const result = await runWrangler(["r2", "bucket", "list"]);
  if (result.code !== 0) {
    throw new Error(result.stderr || result.stdout || "Wrangler command failed.");
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.match(/^name:\s+(.+)$/)?.[1]?.trim())
    .filter((name): name is string => Boolean(name))
    .map((name) => ({ name }));
}

function parseWranglerJsonArray(result: CommandResult): WranglerJsonRecord[] {
  if (result.code !== 0) {
    throw new Error(result.stderr || result.stdout || "Wrangler command failed.");
  }

  const parsed = JSON.parse(result.stdout || "[]") as unknown;
  if (Array.isArray(parsed)) return parsed.filter(isRecord);
  if (isRecord(parsed) && Array.isArray(parsed.result)) return parsed.result.filter(isRecord);
  return [];
}

function isRecord(value: unknown): value is WranglerJsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
