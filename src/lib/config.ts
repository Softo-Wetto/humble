import { z } from "zod";

export const publicConfig = z.object({
  NEXT_PUBLIC_POCKETBASE_URL: z.url().default("http://127.0.0.1:8090"),
}).parse({ NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL });

export function getServerConfig() {
  return z.object({
    POCKETBASE_URL: z.url().default(publicConfig.NEXT_PUBLIC_POCKETBASE_URL),
    POCKETBASE_SUPERUSER_EMAIL: z.email(),
    POCKETBASE_SUPERUSER_PASSWORD: z.string().min(10),
  }).parse({
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    POCKETBASE_SUPERUSER_EMAIL: process.env.POCKETBASE_SUPERUSER_EMAIL,
    POCKETBASE_SUPERUSER_PASSWORD: process.env.POCKETBASE_SUPERUSER_PASSWORD,
  });
}
