import { canTransitionCompliment, type ComplimentStatus } from "@/lib/domain/compliment";

export function validateComplimentDecision(
  actorId: string,
  compliment: { recipientId: string; status: ComplimentStatus },
  decision: Exclude<ComplimentStatus, "pending" | "withdrawn">,
) {
  if (actorId !== compliment.recipientId) return { success: false as const, message: "Only the recipient can decide this compliment." };
  if (!canTransitionCompliment(compliment.status, decision)) return { success: false as const, message: "This compliment has already been decided." };
  return { success: true as const };
}
