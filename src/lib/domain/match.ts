import { z } from "zod";

export const matchStatusSchema = z.enum(["active", "unmatched", "blocked", "admin_closed"]);

export const matchSchema = z.object({
  id: z.string(),
  participantOneId: z.string(),
  participantTwoId: z.string(),
  sourceComplimentId: z.string(),
  status: matchStatusSchema,
  createdAt: z.iso.datetime(),
});

export const messageSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  senderId: z.string(),
  body: z.string().trim().min(1).max(2000),
  readAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

export function normalizeParticipantPair(firstId: string, secondId: string) {
  return [firstId, secondId].sort((left, right) => left.localeCompare(right)) as [string, string];
}
