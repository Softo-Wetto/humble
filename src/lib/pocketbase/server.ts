import "server-only";
import { pbRequest } from "./http";
import { getSessionToken } from "@/lib/auth/session";
export async function serverRequest<T>(path: string, options: RequestInit = {}) {
  return pbRequest<T>(path, { ...options, token: await getSessionToken() });
}
