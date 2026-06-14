import { NextResponse } from "next/server";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { getSessionToken } from "@/lib/auth/session";
import { publicConfig } from "@/lib/config";
export async function GET() { await requireOnboardedUser(); return NextResponse.json({ token: await getSessionToken(), url: publicConfig.NEXT_PUBLIC_POCKETBASE_URL }); }
