import { AppShell } from "@/components/layout/AppShell";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { getDiscoverySource } from "@/lib/repositories/discovery";
import { getProfileByUser } from "@/lib/repositories/profiles";
import { getPreferencesByUser } from "@/lib/repositories/preferences";
import { filterDiscoveryCandidates } from "@/lib/services/discovery";
import { DiscoveryBrowser } from "@/features/discovery/DiscoveryBrowser";

export default async function DiscoverPage() {
  const user = await requireOnboardedUser(); const ownProfile = await getProfileByUser(user.id); const ownPreferences = await getPreferencesByUser(user.id);
  if (!ownProfile || !ownPreferences) return null;
  const source = await getDiscoverySource(user.id); const preferencesByUser = new Map(source.preferences.map((item) => [item.user, item]));
  const candidates = source.profiles.flatMap((profile) => { const preference = preferencesByUser.get(profile.user); if (!preference) return []; return [{ userId: profile.user, age: profile.age, gender: profile.gender, interestedIn: preference.interested_in, minimumAge: preference.minimum_age, maximumAge: preference.maximum_age, isPublished: profile.is_published, hasPhoto: profile.photos.length > 0, accountState: "active" as const, updatedAt: profile.updated }]; });
  const allowed = new Set(filterDiscoveryCandidates({ userId: user.id, age: ownProfile.age, gender: ownProfile.gender, interestedIn: ownPreferences.interested_in, minimumAge: ownPreferences.minimum_age, maximumAge: ownPreferences.maximum_age }, candidates, { blockedIds: source.blocks.map((block) => block.blocker === user.id ? block.blocked : block.blocker), hiddenIds: source.hides.map((hide) => hide.hidden_user) }).map((item) => item.userId));
  return <AppShell active="discover"><div className="app-page-header"><div><p className="eyebrow">Discover with attention</p><h1>Who would you like to know a little better?</h1></div><p>Read at your own pace. A compliment is the only way to express interest.</p></div><DiscoveryBrowser initialProfiles={source.profiles.filter((profile) => allowed.has(profile.user))} /></AppShell>;
}
