import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile(new URL("../../package.json", import.meta.url), "utf8"));

test("one dev command starts the frontend and PocketBase", () => {
  assert.equal(packageJson.scripts["dev:web"], "next dev");
  assert.match(packageJson.scripts.dev, /npm:pb:start/);
  assert.match(packageJson.scripts.dev, /npm:dev:web/);
  assert.equal(packageJson.scripts["dev:all"], "npm run dev");
});
