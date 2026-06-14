import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equals = trimmed.indexOf("=");
    if (equals < 1) continue;
    const key = trimmed.slice(0, equals).trim().replace(/^\$env:/, "");
    const value = trimmed.slice(equals + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    process.env[key] ??= value;
  }
}

export function loadLocalEnvironment() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");
}

export function ensureLocalEnv() {
  const localPath = resolve(process.cwd(), ".env.local");
  if (existsSync(localPath)) return;
  const example = readFileSync(resolve(process.cwd(), ".env.example"), "utf8");
  writeFileSync(localPath, example, "utf8");
}
