import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    displayName: z.string().trim().min(2).max(60),
    city: z.string().trim().min(1).max(80),
    region: z.string().trim().min(1).max(80),
    gender: z.string().trim().min(1).max(80),
    pronouns: z.string().trim().max(50).default(""),
    bio: z.string().trim().min(40).max(1200),
    interests: z.array(z.string().trim().min(1).max(50)).min(1).max(12),
    values: z.array(z.string().trim().min(1).max(50)).min(1).max(8),
    interestedIn: z.array(z.string().trim().min(1).max(80)).min(1),
    minimumAge: z.number().int().min(18).max(120),
    maximumAge: z.number().int().min(18).max(120),
  })
  .refine((value) => value.minimumAge <= value.maximumAge, {
    path: ["maximumAge"],
    message: "Maximum age must be at least the minimum age.",
  });
