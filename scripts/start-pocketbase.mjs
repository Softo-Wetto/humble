import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const executable = resolve(".pocketbase", "bin", process.platform === "win32" ? "pocketbase.exe" : "pocketbase");
if (!existsSync(executable)) {
  console.error("PocketBase is not installed. Run npm run local:setup first.");
  process.exit(1);
}

const child = spawn(executable, ["serve", "--dir", resolve(".pocketbase", "data"), "--http", "127.0.0.1:8090"], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
