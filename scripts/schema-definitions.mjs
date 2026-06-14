export const collectionOrder = [
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
];

const admin = '@request.auth.role = "admin"';
const ownerOrAdmin = (field) => `@request.auth.id = ${field} || ${admin}`;

const text = (name, options = {}) => ({ name, type: "text", required: false, ...options });
const bool = (name, options = {}) => ({ name, type: "bool", required: false, ...options });
const number = (name, options = {}) => ({ name, type: "number", required: false, ...options });
const date = (name, options = {}) => ({ name, type: "date", required: false, ...options });
const createdAt = { name: "created", type: "autodate", onCreate: true, onUpdate: false };
const updatedAt = { name: "updated", type: "autodate", onCreate: true, onUpdate: true };
const json = (name, options = {}) => ({ name, type: "json", required: false, maxSize: 2000000, ...options });
const select = (name, values, options = {}) => ({
  name,
  type: "select",
  values,
  maxSelect: 1,
  required: false,
  ...options,
});
const relation = (name, collectionId, options = {}) => ({
  name,
  type: "relation",
  collectionId,
  cascadeDelete: false,
  minSelect: 0,
  maxSelect: 1,
  required: false,
  ...options,
});
const file = (name, options = {}) => ({
  name,
  type: "file",
  maxSelect: 1,
  maxSize: 8 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  protected: false,
  thumbs: ["320x420", "640x840"],
  required: false,
  ...options,
});

export function createDefinitions(ids) {
  const users = {
    name: "users",
    type: "auth",
    listRule: '@request.auth.id = id || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = id || @request.auth.role = "admin"',
    createRule: null,
    updateRule:
      '@request.auth.id = id && @request.body.role:changed = false && @request.body.account_state:changed = false && @request.body.birth_date:changed = false && @request.body.onboarding_complete:changed = false || @request.auth.role = "admin"',
    deleteRule: null,
    indexes: ["CREATE INDEX idx_users_account_state ON users (account_state)"],
    fields: [
      date("birth_date", { required: true }),
      select("role", ["member", "admin"]),
      select("account_state", ["active", "paused", "deactivated", "suspended", "pending_deletion"]),
      bool("onboarding_complete"),
      date("deletion_requested_at"),
      text("suspension_reason", { max: 1000 }),
      text("seed_key", { max: 80 }),
    ],
    passwordAuth: { enabled: true, identityFields: ["email"] },
  };

  const profiles = {
    name: "profiles",
    type: "base",
    listRule: 'is_published = true && moderation_visible = true && user.account_state = "active"',
    viewRule: 'is_published = true && moderation_visible = true && user.account_state = "active" || @request.auth.id = user || @request.auth.role = "admin"',
    createRule: null,
    updateRule:
      '@request.auth.id = user && @request.body.user:changed = false && @request.body.age:changed = false && @request.body.is_published:changed = false && @request.body.moderation_visible:changed = false || @request.auth.role = "admin"',
    deleteRule: admin,
    indexes: [
      "CREATE UNIQUE INDEX idx_profiles_user ON profiles (user)",
      "CREATE INDEX idx_profiles_discovery ON profiles (is_published, moderation_visible, age, region)",
    ],
    fields: [
      relation("user", ids.users, { required: true, cascadeDelete: true }),
      text("display_name", { required: true, max: 60 }),
      number("age", { required: true, min: 18, max: 120, onlyInt: true }),
      text("city", { required: true, max: 80 }),
      text("region", { required: true, max: 80 }),
      text("gender", { required: true, max: 80 }),
      text("pronouns", { max: 50 }),
      text("bio", { required: true, min: 40, max: 1200 }),
      json("interests", { required: true }),
      json("values", { required: true }),
      file("photos", { maxSelect: 6, required: true }),
      bool("is_published"),
      bool("moderation_visible"),
      text("seed_key", { max: 80 }),
    ],
  };

  const preferences = {
    name: "preferences",
    type: "base",
    listRule: ownerOrAdmin("user"),
    viewRule: ownerOrAdmin("user"),
    createRule: null,
    updateRule: '@request.auth.id = user && @request.body.user:changed = false || @request.auth.role = "admin"',
    deleteRule: admin,
    indexes: ["CREATE UNIQUE INDEX idx_preferences_user ON preferences (user)"],
    fields: [
      relation("user", ids.users, { required: true, cascadeDelete: true }),
      json("interested_in", { required: true }),
      number("minimum_age", { required: true, min: 18, max: 120, onlyInt: true }),
      number("maximum_age", { required: true, min: 18, max: 120, onlyInt: true }),
      json("regions"),
    ],
  };

  const compliments = {
    name: "compliments",
    type: "base",
    listRule: '@request.auth.id = sender || @request.auth.id = recipient || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = sender || @request.auth.id = recipient || @request.auth.role = "admin"',
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_compliments_inbox ON compliments (recipient, status, created)",
      "CREATE INDEX idx_compliments_sent ON compliments (sender, created)",
      "CREATE UNIQUE INDEX idx_compliments_request ON compliments (request_key) WHERE request_key != ''",
    ],
    fields: [
      relation("sender", ids.users, { required: true, cascadeDelete: true }),
      relation("recipient", ids.users, { required: true, cascadeDelete: true }),
      text("body", { required: true, min: 12, max: 500 }),
      select("status", ["pending", "accepted", "ignored", "reported", "withdrawn"], { required: true }),
      text("request_key", { max: 100 }),
      date("decided_at"),
    ],
  };

  const matches = {
    name: "matches",
    type: "base",
    listRule: '@request.auth.id = participant_one || @request.auth.id = participant_two || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = participant_one || @request.auth.id = participant_two || @request.auth.role = "admin"',
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE UNIQUE INDEX idx_matches_pair ON matches (participant_one, participant_two)",
      "CREATE INDEX idx_matches_active_one ON matches (participant_one, status, updated)",
      "CREATE INDEX idx_matches_active_two ON matches (participant_two, status, updated)",
    ],
    fields: [
      relation("participant_one", ids.users, { required: true, cascadeDelete: true }),
      relation("participant_two", ids.users, { required: true, cascadeDelete: true }),
      relation("source_compliment", ids.compliments),
      select("status", ["active", "unmatched", "blocked", "admin_closed"], { required: true }),
      relation("ended_by", ids.users),
      text("end_reason", { max: 500 }),
      date("ended_at"),
    ],
  };

  const messages = {
    name: "messages",
    type: "base",
    listRule: '@request.auth.id = match.participant_one || @request.auth.id = match.participant_two || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = match.participant_one || @request.auth.id = match.participant_two || @request.auth.role = "admin"',
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_messages_timeline ON messages (match, created)",
      "CREATE INDEX idx_messages_unread ON messages (match, read_at)",
    ],
    fields: [
      relation("match", ids.matches, { required: true, cascadeDelete: true }),
      relation("sender", ids.users, { required: true, cascadeDelete: true }),
      text("body", { required: true, min: 1, max: 2000 }),
      date("read_at"),
      date("hidden_at"),
      text("hidden_reason", { max: 500 }),
    ],
  };

  const reports = {
    name: "reports",
    type: "base",
    listRule: '@request.auth.id = reporter || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = reporter || @request.auth.role = "admin"',
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_reports_queue ON reports (status, created)",
      "CREATE INDEX idx_reports_target ON reports (target_user, created)",
    ],
    fields: [
      relation("reporter", ids.users, { required: true, cascadeDelete: true }),
      relation("target_user", ids.users, { required: true, cascadeDelete: true }),
      select("target_type", ["user", "compliment", "message"], { required: true }),
      text("target_record", { max: 30 }),
      select("category", ["harassment", "hate_or_discrimination", "sexual_content", "impersonation", "scam", "underage_concern", "safety_concern", "other"], { required: true }),
      text("detail", { max: 2000 }),
      json("evidence_snapshot", { required: true }),
      select("status", ["open", "reviewing", "resolved", "dismissed"], { required: true }),
      relation("assigned_admin", ids.users),
      text("resolution", { max: 2000 }),
    ],
  };

  const blocks = {
    name: "blocks",
    type: "base",
    listRule: ownerOrAdmin("blocker"),
    viewRule: ownerOrAdmin("blocker"),
    createRule: null,
    updateRule: null,
    deleteRule: ownerOrAdmin("blocker"),
    indexes: ["CREATE UNIQUE INDEX idx_blocks_pair ON blocks (blocker, blocked)"],
    fields: [
      relation("blocker", ids.users, { required: true, cascadeDelete: true }),
      relation("blocked", ids.users, { required: true, cascadeDelete: true }),
      text("reason", { max: 500 }),
    ],
  };

  const discoveryHides = {
    name: "discovery_hides",
    type: "base",
    listRule: ownerOrAdmin("viewer"),
    viewRule: ownerOrAdmin("viewer"),
    createRule: null,
    updateRule: null,
    deleteRule: ownerOrAdmin("viewer"),
    indexes: ["CREATE UNIQUE INDEX idx_discovery_hides_pair ON discovery_hides (viewer, hidden_user)"],
    fields: [
      relation("viewer", ids.users, { required: true, cascadeDelete: true }),
      relation("hidden_user", ids.users, { required: true, cascadeDelete: true }),
    ],
  };

  const moderationActions = {
    name: "moderation_actions",
    type: "base",
    listRule: admin,
    viewRule: admin,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: ["CREATE INDEX idx_moderation_target ON moderation_actions (target_user, created)"],
    fields: [
      relation("administrator", ids.users, { required: true }),
      relation("target_user", ids.users, { required: true, cascadeDelete: true }),
      text("action", { required: true, max: 80 }),
      text("target_type", { required: true, max: 40 }),
      text("target_record", { max: 30 }),
      text("reason", { required: true, max: 2000 }),
      json("before_state"),
      json("after_state"),
    ],
  };

  const typingStates = {
    name: "typing_states",
    type: "base",
    listRule: '@request.auth.id = match.participant_one || @request.auth.id = match.participant_two || @request.auth.role = "admin"',
    viewRule: '@request.auth.id = match.participant_one || @request.auth.id = match.participant_two || @request.auth.role = "admin"',
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: ["CREATE UNIQUE INDEX idx_typing_match_user ON typing_states (match, user)"],
    fields: [
      relation("match", ids.matches, { required: true, cascadeDelete: true }),
      relation("user", ids.users, { required: true, cascadeDelete: true }),
      date("expires_at", { required: true }),
    ],
  };

  return [users, profiles, preferences, compliments, matches, messages, reports, blocks, discoveryHides, moderationActions, typingStates].map(
    (definition) => ({ ...definition, fields: [...definition.fields, createdAt, updatedAt] }),
  );
}
