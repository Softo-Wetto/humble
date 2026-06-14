import { z } from "zod";
import { accountStateSchema } from "./account";

export const genderSchema = z.string().trim().min(1).max(80);

export const publicProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  displayName: z.string().trim().min(2).max(60),
  age: z.number().int().min(18).max(120),
  city: z.string().trim().min(1).max(80),
  region: z.string().trim().min(1).max(80),
  gender: genderSchema,
  pronouns: z.string().trim().max(50).optional().default(""),
  bio: z.string().trim().min(40).max(1200),
  interests: z.array(z.string().trim().min(1).max(50)).min(1).max(12),
  values: z.array(z.string().trim().min(1).max(50)).min(1).max(8),
  photos: z.array(z.string()).min(1).max(6),
  isPublished: z.boolean(),
  accountState: accountStateSchema,
});

export const preferencesSchema = z.object({
  userId: z.string(),
  interestedIn: z.array(genderSchema).min(1),
  minimumAge: z.number().int().min(18).max(120),
  maximumAge: z.number().int().min(18).max(120),
  regions: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
}).refine((value) => value.minimumAge <= value.maximumAge, {
  message: "Minimum age cannot exceed maximum age.",
  path: ["maximumAge"],
});

export type PublicProfile = z.infer<typeof publicProfileSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
