import { NextResponse } from "next/server";
import { validateSignup } from "@/lib/auth/signup";
import { sessionCookie } from "@/lib/auth/session";
import { adminRequest } from "@/lib/pocketbase/admin";
import { pbRequest, PocketBaseError } from "@/lib/pocketbase/http";
import { getServerConfig } from "@/lib/config";
import type { AuthRecord, AuthResponse } from "@/lib/pocketbase/types";

export async function POST(request: Request) {
  const parsed = validateSignup(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Check your registration details." }, { status: 400 });
  try {
    await adminRequest<AuthRecord>("/api/collections/users/records", { method: "POST", body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password, passwordConfirm: parsed.data.passwordConfirm, birth_date: parsed.data.birthDate, role: "member", account_state: "active", onboarding_complete: false }) });
    const config = getServerConfig();
    const auth = await pbRequest<AuthResponse>("/api/collections/users/auth-with-password", { method: "POST", baseUrl: config.POCKETBASE_URL, body: JSON.stringify({ identity: parsed.data.email, password: parsed.data.password }) });
    const response = NextResponse.json({ onboardingComplete: false }); response.cookies.set(sessionCookie.name, auth.token, sessionCookie.options); return response;
  } catch (error) {
    const duplicate = error instanceof PocketBaseError && error.status === 400;
    return NextResponse.json({ message: duplicate ? "An account with that email may already exist." : "Registration is temporarily unavailable." }, { status: duplicate ? 409 : 500 });
  }
}
