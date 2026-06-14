import "server-only";
import { adminRequest } from "./admin";
import type { PocketBaseRecord } from "./types";

export type RecordPage<T> = { page: number; perPage: number; totalItems: number; totalPages: number; items: T[] };

export function escapeFilter(value: string) { return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

export async function listAdminRecords<T extends PocketBaseRecord>(collection: string, params = new URLSearchParams()) {
  return adminRequest<RecordPage<T>>(`/api/collections/${collection}/records?${params.toString()}`);
}

export async function findAdminRecord<T extends PocketBaseRecord>(collection: string, filter: string) {
  const params = new URLSearchParams({ page: "1", perPage: "1", filter });
  const page = await listAdminRecords<T>(collection, params);
  return page.items[0] || null;
}

export function createAdminRecord<T extends PocketBaseRecord>(collection: string, body: BodyInit) {
  return adminRequest<T>(`/api/collections/${collection}/records`, { method: "POST", body });
}

export function updateAdminRecord<T extends PocketBaseRecord>(collection: string, id: string, body: BodyInit) {
  return adminRequest<T>(`/api/collections/${collection}/records/${id}`, { method: "PATCH", body });
}
