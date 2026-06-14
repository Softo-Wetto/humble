import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { normalizeParticipantPair } from "@/lib/domain/match";
import { createAdminRecord, escapeFilter, findAdminRecord, updateAdminRecord } from "@/lib/pocketbase/records";
import type { ComplimentRecord } from "@/lib/repositories/compliments";
import type { MatchRecord } from "@/lib/repositories/matches";
import { validateComplimentDecision } from "@/lib/services/compliments";

const schema = z.object({ decision: z.enum(["accepted", "ignored", "reported"]), category: z.string().optional(), detail: z.string().max(2000).optional() });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireOnboardedUser(); const { id } = await params; const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Choose a valid response." }, { status: 400 });
  const compliment = await findAdminRecord<ComplimentRecord>("compliments", `id="${escapeFilter(id)}"`); if (!compliment) return NextResponse.json({ message: "Compliment not found." }, { status: 404 });
  const policy = validateComplimentDecision(user.id, { recipientId: compliment.recipient, status: compliment.status }, parsed.data.decision); if (!policy.success) return NextResponse.json({ message: policy.message }, { status: 403 });
  let match: MatchRecord | null = null;
  if (parsed.data.decision === "accepted") { const [one, two] = normalizeParticipantPair(compliment.sender, compliment.recipient); match = await findAdminRecord<MatchRecord>("matches", `participant_one="${one}" && participant_two="${two}"`); if (!match) match = await createAdminRecord<MatchRecord>("matches", JSON.stringify({ participant_one: one, participant_two: two, source_compliment: compliment.id, status: "active" })); }
  if (parsed.data.decision === "reported") await createAdminRecord("reports", JSON.stringify({ reporter: user.id, target_user: compliment.sender, target_type: "compliment", target_record: compliment.id, category: parsed.data.category || "other", detail: parsed.data.detail || "", evidence_snapshot: { body: compliment.body, sender: compliment.sender, recipient: compliment.recipient, created: compliment.created }, status: "open" }));
  await updateAdminRecord("compliments", compliment.id, JSON.stringify({ status: parsed.data.decision, decided_at: new Date().toISOString() }));
  return NextResponse.json({ ok: true, matchId: match?.id });
}
