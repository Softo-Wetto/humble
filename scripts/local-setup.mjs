import { chmodSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { arch, platform } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureLocalEnv, loadLocalEnvironment } from "./lib/env.mjs";

const VERSION = "0.39.3";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtime = resolve(root, ".pocketbase");
const binDir = resolve(runtime, "bin");
const dataDir = resolve(runtime, "data");
const executable = resolve(binDir, platform() === "win32" ? "pocketbase.exe" : "pocketbase");

function assetName() {
  const os = { win32: "windows", darwin: "darwin", linux: "linux" }[platform()];
  const cpu = { x64: "amd64", arm64: "arm64" }[arch()];
  if (!os || !cpu) throw new Error(`Unsupported local platform: ${platform()} ${arch()}`);
  return `pocketbase_${VERSION}_${os}_${cpu}.zip`;
}

async function installBinary() {
  if (existsSync(executable)) return;
  mkdirSync(binDir, { recursive: true });
  const archive = resolve(runtime, assetName());
  const response = await fetch(`https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/${assetName()}`);
  if (!response.ok) throw new Error(`PocketBase download failed (${response.status}).`);
  await BunlessWrite(archive, new Uint8Array(await response.arrayBuffer()));
  const extracted = spawnSync("tar", ["-xf", archive, "-C", binDir], { stdio: "inherit" });
  if (extracted.status !== 0) throw new Error("Unable to extract PocketBase archive. Ensure tar is available.");
  rmSync(archive, { force: true });
  if (platform() !== "win32") chmodSync(executable, 0o755);
}

async function BunlessWrite(path, bytes) {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path, bytes);
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:8090/api/health");
      if (response.ok) return;
    } catch {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }
  throw new Error("PocketBase did not become healthy.");
}

async function main() {
  process.chdir(root);
  ensureLocalEnv();
  loadLocalEnvironment();
  await installBinary();
  mkdirSync(dataDir, { recursive: true });

  const email = process.env.POCKETBASE_SUPERUSER_EMAIL;
  const password = process.env.POCKETBASE_SUPERUSER_PASSWORD;
  if (!email || !password) throw new Error("Set local PocketBase superuser credentials in .env.local.");
  const upsert = spawnSync(executable, ["superuser", "upsert", email, password, "--dir", dataDir], { stdio: "inherit" });
  if (upsert.status !== 0) throw new Error("Unable to provision the local PocketBase superuser.");

  const server = spawn(executable, ["serve", "--dir", dataDir, "--http", "127.0.0.1:8090"], { stdio: "ignore" });
  try {
    await waitForHealth();
    const { setupSchema } = await import("./setup-pocketbase.mjs");
    await setupSchema();
    const { seedPocketBase } = await import("./seed-pocketbase.mjs");
    await seedPocketBase();
    console.log("Humble is ready locally. Run npm run dev:all.");
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
