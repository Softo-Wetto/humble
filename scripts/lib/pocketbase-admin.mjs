import { loadLocalEnvironment } from "./env.mjs";

loadLocalEnvironment();

export const baseUrl = (process.env.POCKETBASE_URL || "http://127.0.0.1:8090").replace(/\/$/, "");

export async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let detail = `${options.method || "GET"} ${path} failed (${response.status})`;
    try {
      const body = await response.json();
      detail = `${body.message || detail}${body.data ? `\n${JSON.stringify(body.data)}` : ""}`;
    } catch {}
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function authenticateSuperuser() {
  const identity = process.env.POCKETBASE_SUPERUSER_EMAIL;
  const password = process.env.POCKETBASE_SUPERUSER_PASSWORD;
  if (!identity || !password) throw new Error("Missing PocketBase superuser credentials.");

  const auth = await request("/api/collections/_superusers/auth-with-password", {
    method: "POST",
    body: JSON.stringify({ identity, password }),
  });
  return auth.token;
}

export async function getCollection(token, name) {
  try {
    return await request(`/api/collections/${name}`, { token });
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

function mergeFields(existing = [], desired = []) {
  const byName = new Map(existing.map((field) => [field.name, field]));
  for (const field of desired) {
    const current = byName.get(field.name);
    byName.set(field.name, {
      ...(current || {}),
      ...field,
      ...(current?.id ? { id: current.id } : {}),
      system: current?.system ?? false,
    });
  }
  return [...byName.values()];
}

export async function upsertCollection(token, definition) {
  const existing = await getCollection(token, definition.name);
  if (!existing) {
    await request("/api/collections", { method: "POST", token, body: JSON.stringify(definition) });
    return getCollection(token, definition.name);
  }

  await request(`/api/collections/${existing.id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ ...definition, fields: mergeFields(existing.fields, definition.fields) }),
  });
  return getCollection(token, definition.name);
}

export async function findFirst(token, collection, filter) {
  const params = new URLSearchParams({ page: "1", perPage: "1", filter });
  const result = await request(`/api/collections/${collection}/records?${params}`, { token });
  return result.items[0] || null;
}
