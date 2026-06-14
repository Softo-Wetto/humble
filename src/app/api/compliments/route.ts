import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { complimentBodySchema } from "@/lib/domain/compliment";
import { createAdminRecord, escapeFilter, findAdminRecord } from "@/lib/pocketbase/records";
import { getProfileByUser } from "@/lib/repositories/profiles";
import type { PocketBaseRecord } from "@/lib/pocketbase/types";

const schema = z.object({ recipientId: z.string().min(1), body: complimentBodySchema });
export async function POST(request: Request) {
  const user = await requireOnboardedUser(); const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.recipientId === user.id) return NextResponse.json({ message: parsed.success ? "You cannot compliment yourself." : parsed.error.issues[0]?.message }, { status: 400 });
  const profile = await getProfileByUser(parsed.data.recipientId); if (!profile?.is_published || !profile.moderation_visible) return NextResponse.json({ message: "That profile is not available." }, { status: 404 });
  const block = await findAdminRecord<PocketBaseRecord>("blocks", `(blocker="${escapeFilter(user.id)}" && blocked="${escapeFilter(parsed.data.recipientId)}") || (blocker="${escapeFilter(parsed.data.recipientId)}" && blocked="${escapeFilter(user.id)}")`);
  if (block) return NextResponse.json({ message: "This connection is unavailable." }, { status: 403 });
  const compliment = await createAdminRecord("compliments", JSON.stringify({ sender: user.id, recipient: parsed.data.recipientId, body: parsed.data.body, status: "pending", request_key: randomUUID() }));
  return NextResponse.json({ compliment }, { status: 201 });
}
