import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { profilePhotoUrl } from "@/features/discovery/ProfileCard";
import { ProfileEditor } from "@/features/profile/ProfileEditor";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { getPreferencesByUser } from "@/lib/repositories/preferences";
import { getProfileByUser } from "@/lib/repositories/profiles";

export default async function ProfilePage() {
  const user = await requireOnboardedUser();
  const [profile, preferences] = await Promise.all([
    getProfileByUser(user.id),
    getPreferencesByUser(user.id),
  ]);
  if (!profile || !preferences) return null;

  return (
    <AppShell active="profile">
      <article className="full-profile owner-profile">
        <div className="full-profile-photo" style={{ backgroundImage: `url(${profilePhotoUrl(profile)})` }} />
        <div className="full-profile-copy">
          <p className="eyebrow">Your public profile</p>
          <h1>{profile.display_name}, {profile.age}</h1>
          <p className="pronouns">{profile.city}, {profile.region}{profile.pronouns ? ` | ${profile.pronouns}` : ""}</p>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-tags large">
            {[...profile.values, ...profile.interests].map((item) => <span key={item}>{item}</span>)}
          </div>
          <ProfileEditor profile={profile} preferences={preferences} />
          <div className="profile-settings-links">
            <Link href="/settings">Account and safety settings</Link>
            <Link href="/settings/hidden-profiles">Review hidden profiles</Link>
          </div>
        </div>
      </article>
    </AppShell>
  );
}
