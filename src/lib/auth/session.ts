import "server-only";
import { cookies } from "next/headers";
export const sessionCookie = {
  name: "humble_session",
  options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 },
};
export async function getSessionToken() { return (await cookies()).get(sessionCookie.name)?.value; }
