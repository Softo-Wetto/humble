import { authenticateSuperuser, getCollection, request } from "./lib/pocketbase-admin.mjs";
import { collectionOrder } from "./schema-definitions.mjs";

async function main() {
  const health = await request("/api/health");
  if (!health?.code || health.code !== 200) throw new Error("PocketBase health check failed.");
  const token = await authenticateSuperuser();
  for (const name of collectionOrder) {
    const collection = await getCollection(token, name);
    if (!collection) throw new Error(`Missing collection: ${name}`);
  }
  console.log(`PocketBase check passed for ${collectionOrder.length} Humble collections.`);
}

main().catch((error) => { console.error(error.message); process.exit(1); });
