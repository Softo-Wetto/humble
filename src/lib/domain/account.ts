import { z } from "zod";

export const accountStateSchema = z.enum([
  "active",
  "paused",
  "deactivated",
  "suspended",
  "pending_deletion",
]);

export type AccountState = z.infer<typeof accountStateSchema>;

export const privateAccountSchema = z.object({
  id: z.string(),
  email: z.email(),
  birthDate: z.iso.date(),
  role: z.enum(["member", "admin"]).default("member"),
  accountState: accountStateSchema.default("active"),
  onboardingComplete: z.boolean().default(false),
});

function parseBirthDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|[ T])/.exec(value);
  if (!match) throw new Error("Birth date must use YYYY-MM-DD format.");

  const [, year, month, day] = match;
  return { year: Number(year), month: Number(month), day: Number(day) };
}

export function calculateAge(birthDate: string, currentDate = new Date()) {
  const birth = parseBirthDate(birthDate);
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth() + 1;
  const currentDay = currentDate.getUTCDate();
  const birthdayOccurred =
    currentMonth > birth.month || (currentMonth === birth.month && currentDay >= birth.day);

  return currentYear - birth.year - (birthdayOccurred ? 0 : 1);
}

export function isAdult(birthDate: string, currentDate = new Date()) {
  return calculateAge(birthDate, currentDate) >= 18;
}
