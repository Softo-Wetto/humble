import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerConfig } from "@/lib/config";
import { sessionCookie } from "@/lib/auth/session";
import { pbRequest } from "@/lib/pocketbase/http";
import type { AuthResponse } from "@/lib/pocketbase/types";
const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });
export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Enter your email and password." }, { status: 400 });
  try { const config = getServerConfig(); const auth = await pbRequest<AuthResponse>("/api/collections/users/auth-with-password", { method: "POST", baseUrl: config.POCKETBASE_URL, body: JSON.stringify({ identity: parsed.data.email, password: parsed.data.password }) }); const response = NextResponse.json({ onboardingComplete: auth.record.onboarding_complete }); response.cookies.set(sessionCookie.name, auth.token, sessionCookie.options); return response; }
  catch { return NextResponse.json({ message: "That email and password did not match." }, { status: 401 }); }
}
