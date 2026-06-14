import { z } from "zod";

export const reportCategorySchema = z.enum([
  "harassment",
  "hate_or_discrimination",
  "sexual_content",
  "impersonation",
  "scam",
  "underage_concern",
  "safety_concern",
  "other",
]);

export const reportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  targetUserId: z.string(),
  targetType: z.enum(["user", "compliment", "message"]),
  targetRecordId: z.string().optional(),
  category: reportCategorySchema,
  detail: z.string().trim().max(2000).default(""),
  evidenceSnapshot: z.record(z.string(), z.unknown()),
  status: z.enum(["open", "reviewing", "resolved", "dismissed"]),
});
