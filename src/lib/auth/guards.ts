import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken } from "./session";
import { serverRequest } from "@/lib/pocketbase/server";
import type { AuthResponse } from "@/lib/pocketbase/types";

export async function requireUser() {
  if (!(await getSessionToken())) redirect("/login");
  try { return (await serverRequest<AuthResponse>("/api/collections/users/auth-refresh", { method: "POST" })).record; }
  catch { redirect("/login"); }
}
export async function requireOnboardedUser() {
  const user = await requireUser();
  if (!user.onboarding_complete) redirect("/onboarding");
  if (user.account_state === "suspended") redirect("/settings?state=suspended");
  return user;
}
export async function requireAdmin() { const user = await requireUser(); if (user.role !== "admin") redirect("/discover"); return user; }
