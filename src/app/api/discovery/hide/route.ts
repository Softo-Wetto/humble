import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { createAdminRecord, escapeFilter, findAdminRecord } from "@/lib/pocketbase/records";
import type { PocketBaseRecord } from "@/lib/pocketbase/types";
const schema = z.object({ hiddenUserId: z.string().min(1) });
export async function POST(request: Request) { const user = await requireOnboardedUser(); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success || parsed.data.hiddenUserId === user.id) return NextResponse.json({ message: "Invalid profile." }, { status: 400 }); const existing = await findAdminRecord<PocketBaseRecord>("discovery_hides", `viewer="${escapeFilter(user.id)}" && hidden_user="${escapeFilter(parsed.data.hiddenUserId)}"`); if (!existing) await createAdminRecord("discovery_hides", JSON.stringify({ viewer: user.id, hidden_user: parsed.data.hiddenUserId })); return NextResponse.json({ ok: true }); }
