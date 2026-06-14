import { NextResponse } from "next/server";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { updateAdminRecord } from "@/lib/pocketbase/records";
import { getPreferencesByUser } from "@/lib/repositories/preferences";
import { getProfileByUser } from "@/lib/repositories/profiles";
import { profileUpdateSchema } from "@/lib/services/profile";

export async function PATCH(request: Request) {
  const user = await requireOnboardedUser();
  const parsed = profileUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Check your profile details." },
      { status: 400 },
    );
  }

  const [profile, preferences] = await Promise.all([
    getProfileByUser(user.id),
    getPreferencesByUser(user.id),
  ]);
  if (!profile || !preferences) {
    return NextResponse.json({ message: "Complete onboarding first." }, { status: 409 });
  }

  await Promise.all([
    updateAdminRecord(
      "profiles",
      profile.id,
      JSON.stringify({
        display_name: parsed.data.displayName,
        city: parsed.data.city,
        region: parsed.data.region,
        gender: parsed.data.gender,
        pronouns: parsed.data.pronouns,
        bio: parsed.data.bio,
        interests: parsed.data.interests,
        values: parsed.data.values,
      }),
    ),
    updateAdminRecord(
      "preferences",
      preferences.id,
      JSON.stringify({
        interested_in: parsed.data.interestedIn,
        minimum_age: parsed.data.minimumAge,
        maximum_age: parsed.data.maximumAge,
        regions: [parsed.data.region],
      }),
    ),
  ]);

  return NextResponse.json({ ok: true });
}
