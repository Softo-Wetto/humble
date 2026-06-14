import "server-only";
import { getServerConfig } from "@/lib/config";
import { pbRequest } from "./http";
import type { AuthResponse } from "./types";

export async function getAdminToken() {
  const config = getServerConfig();
  const auth = await pbRequest<AuthResponse>("/api/collections/_superusers/auth-with-password", {
    method: "POST",
    baseUrl: config.POCKETBASE_URL,
    body: JSON.stringify({ identity: config.POCKETBASE_SUPERUSER_EMAIL, password: config.POCKETBASE_SUPERUSER_PASSWORD }),
  });
  return auth.token;
}

export async function adminRequest<T>(path: string, options: RequestInit = {}) {
  const config = getServerConfig();
  return pbRequest<T>(path, { ...options, baseUrl: config.POCKETBASE_URL, token: await getAdminToken() });
}
