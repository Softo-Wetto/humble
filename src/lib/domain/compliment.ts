import { z } from "zod";

export const complimentStatusSchema = z.enum([
  "pending",
  "accepted",
  "ignored",
  "reported",
  "withdrawn",
]);

export const complimentBodySchema = z.string().trim().min(12).max(500);

export const complimentSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  recipientId: z.string(),
  body: complimentBodySchema,
  status: complimentStatusSchema,
  matchId: z.string().optional(),
  createdAt: z.iso.datetime(),
});

export type ComplimentStatus = z.infer<typeof complimentStatusSchema>;

const pendingTransitions = new Set<ComplimentStatus>([
  "accepted",
  "ignored",
  "reported",
  "withdrawn",
]);

export function canTransitionCompliment(from: ComplimentStatus, to: ComplimentStatus) {
  return from === "pending" && pendingTransitions.has(to);
}
