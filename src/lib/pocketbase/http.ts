import { publicConfig } from "@/lib/config";

export class PocketBaseError extends Error {
  constructor(message: string, readonly status: number, readonly fields: Record<string, { message?: string }> = {}) {
    super(message);
  }
}

export async function pbRequest<T>(path: string, options: RequestInit & { token?: string; baseUrl?: string } = {}) {
  const { token, baseUrl = publicConfig.NEXT_PUBLIC_POCKETBASE_URL, ...requestOptions } = options;
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...requestOptions,
    headers: {
      ...(requestOptions.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...requestOptions.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new PocketBaseError(body.message || "PocketBase request failed.", response.status, body.data || {});
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
