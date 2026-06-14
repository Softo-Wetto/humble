import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guards";
import { calculateAge } from "@/lib/domain/account";
import { onboardingSchema } from "@/lib/services/onboarding";
import { createAdminRecord, updateAdminRecord } from "@/lib/pocketbase/records";
import { getProfileByUser } from "@/lib/repositories/profiles";
import { getPreferencesByUser } from "@/lib/repositories/preferences";
import type { AuthRecord } from "@/lib/pocketbase/types";

function stringList(form: FormData, name: string) {
  return String(form.get(name) || "").split(",").map((item) => item.trim()).filter(Boolean);
}

export async function POST(request: Request) {
  const user = await requireUser();
  const form = await request.formData();
  const photos = form.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  const parsed = onboardingSchema.safeParse({
    displayName: form.get("displayName"), city: form.get("city"), region: form.get("region"), gender: form.get("gender"), pronouns: form.get("pronouns") || "",
    interestedIn: form.getAll("interestedIn").map(String), minimumAge: Number(form.get("minimumAge")), maximumAge: Number(form.get("maximumAge")),
    bio: form.get("bio"), interests: stringList(form, "interests"), values: stringList(form, "values"), photoCount: photos.length,
  });
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Complete each profile section." }, { status: 400 });

  const profileForm = new FormData();
  Object.entries({ user: user.id, display_name: parsed.data.displayName, age: String(calculateAge(user.birth_date)), city: parsed.data.city, region: parsed.data.region, gender: parsed.data.gender, pronouns: parsed.data.pronouns, bio: parsed.data.bio, interests: JSON.stringify(parsed.data.interests), values: JSON.stringify(parsed.data.values), is_published: "true", moderation_visible: "true" }).forEach(([key, value]) => profileForm.append(key, value));
  photos.forEach((photo) => profileForm.append("photos", photo));
  const existingProfile = await getProfileByUser(user.id);
  if (existingProfile) await updateAdminRecord("profiles", existingProfile.id, profileForm); else await createAdminRecord("profiles", profileForm);

  const preferences = { user: user.id, interested_in: parsed.data.interestedIn, minimum_age: parsed.data.minimumAge, maximum_age: parsed.data.maximumAge, regions: [parsed.data.region] };
  const existingPreferences = await getPreferencesByUser(user.id);
  if (existingPreferences) await updateAdminRecord("preferences", existingPreferences.id, JSON.stringify(preferences)); else await createAdminRecord("preferences", JSON.stringify(preferences));
  await updateAdminRecord<AuthRecord>("users", user.id, JSON.stringify({ onboarding_complete: true }));
  return NextResponse.json({ ok: true });
}
