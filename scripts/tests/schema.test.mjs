import assert from "node:assert/strict";
import test from "node:test";
import { collectionOrder, createDefinitions } from "../schema-definitions.mjs";

test("defines every Humble collection in dependency order", () => {
  assert.deepEqual(collectionOrder, [
    "users",
    "profiles",
    "preferences",
    "compliments",
    "matches",
    "messages",
    "reports",
    "blocks",
    "discovery_hides",
    "moderation_actions",
    "typing_states",
  ]);
});

test("defines unique relationship safeguards", () => {
  const ids = Object.fromEntries(collectionOrder.map((name) => [name, `${name}_id`]));
  const definitions = createDefinitions(ids);
  const byName = new Map(definitions.map((definition) => [definition.name, definition]));

  assert.ok(byName.get("matches").indexes.some((index) => index.includes("participant_one, participant_two")));
  assert.ok(byName.get("blocks").indexes.some((index) => index.includes("blocker, blocked")));
  assert.ok(byName.get("discovery_hides").indexes.some((index) => index.includes("viewer, hidden_user")));
});

test("keeps private collections owner or admin restricted", () => {
  const ids = Object.fromEntries(collectionOrder.map((name) => [name, `${name}_id`]));
  const definitions = createDefinitions(ids);
  const byName = new Map(definitions.map((definition) => [definition.name, definition]));

  assert.match(byName.get("users").listRule, /@request\.auth\.id = id/);
  assert.match(byName.get("preferences").viewRule, /@request\.auth\.id = user/);
  assert.equal(byName.get("moderation_actions").listRule, '@request.auth.role = "admin"');
});

test("adds created and updated timestamps to every collection", () => {
  const ids = Object.fromEntries(collectionOrder.map((name) => [name, `${name}_id`]));
  for (const definition of createDefinitions(ids)) {
    const names = definition.fields.map((field) => field.name);
    assert.ok(names.includes("created"), `${definition.name} is missing created`);
    assert.ok(names.includes("updated"), `${definition.name} is missing updated`);
  }
});
