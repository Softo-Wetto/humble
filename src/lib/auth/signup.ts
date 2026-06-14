import { z } from "zod";
import { isAdult } from "@/lib/domain/account";

export const signupSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(10, "Use at least 10 characters."),
  passwordConfirm: z.string(),
  birthDate: z.iso.date(),
  acceptedPolicies: z.literal(true, { error: "Accept the community expectations to continue." }),
}).refine((value) => value.password === value.passwordConfirm, { message: "Passwords do not match.", path: ["passwordConfirm"] });

export function validateSignup(input: unknown, currentDate = new Date()) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return parsed;
  if (!isAdult(parsed.data.birthDate, currentDate)) {
    return { success: false as const, error: new z.ZodError([{ code: "custom", path: ["birthDate"], message: "You must be 18 or older to join Humble." }]) };
  }
  return parsed;
}
