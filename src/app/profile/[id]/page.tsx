import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { findAdminRecord, escapeFilter } from "@/lib/pocketbase/records";
import type { ProfileRecord } from "@/lib/repositories/profiles";
import { profilePhotoUrl } from "@/features/discovery/ProfileCard";
import { SafetyActions } from "@/features/safety/SafetyActions";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireOnboardedUser(); const { id } = await params; const profile = await findAdminRecord<ProfileRecord>("profiles", `user="${escapeFilter(id)}" && is_published=true && moderation_visible=true`); if (!profile) notFound();
  return <AppShell active="discover"><article className="full-profile"><div className="full-profile-photo" style={{ backgroundImage: `url(${profilePhotoUrl(profile)})` }} /><div className="full-profile-copy"><p className="eyebrow">{profile.city}, {profile.region}</p><h1>{profile.display_name}, {profile.age}</h1>{profile.pronouns && <p className="pronouns">{profile.pronouns}</p>}<p className="profile-bio">{profile.bio}</p><section><h2>What matters to {profile.display_name}</h2><div className="profile-tags large">{profile.values.map((value) => <span key={value}>{value}</span>)}</div></section><section><h2>Things they enjoy</h2><div className="profile-tags large">{profile.interests.map((value) => <span key={value}>{value}</span>)}</div></section><a className="button" href={`/compliments?to=${profile.user}`}>Send a compliment</a><SafetyActions targetUserId={profile.user}/></div></article></AppShell>;
}
