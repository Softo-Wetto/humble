import { authenticateSuperuser, upsertCollection } from "./lib/pocketbase-admin.mjs";
import { collectionOrder, createDefinitions } from "./schema-definitions.mjs";

export async function setupSchema() {
  const token = await authenticateSuperuser();
  const ids = {};

  for (const name of collectionOrder) {
    const definition = createDefinitions(ids).find((entry) => entry.name === name);
    const collection = await upsertCollection(token, definition);
    ids[name] = collection.id;
    console.log(`${collection.created === collection.updated ? "Created" : "Updated"} ${name}`);
  }

  return ids;
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  setupSchema().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
