import { AppShell } from "@/components/layout/AppShell";
import { HiddenProfilesList } from "@/features/settings/HiddenProfilesList";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { listAdminRecords } from "@/lib/pocketbase/records";
import type { PocketBaseRecord } from "@/lib/pocketbase/types";
import type { ProfileRecord } from "@/lib/repositories/profiles";

type HideRecord = PocketBaseRecord & { viewer: string; hidden_user: string };

export default async function HiddenProfilesPage() {
  const user = await requireOnboardedUser();
  const [hides, profiles] = await Promise.all([
    listAdminRecords<HideRecord>("discovery_hides", new URLSearchParams({
      page: "1", perPage: "200", filter: `viewer="${user.id}"`,
    })),
    listAdminRecords<ProfileRecord>("profiles", new URLSearchParams({ page: "1", perPage: "200" })),
  ]);
  const names = new Map(profiles.items.map((profile) => [profile.user, profile.display_name]));

  return (
    <AppShell active="profile">
      <div className="app-page-header">
        <div><p className="eyebrow">Private discovery choices</p><h1>Profiles marked &quot;Not for me.&quot;</h1></div>
        <p>Restoring a profile only returns it to your eligible discovery pool. Nobody is notified.</p>
      </div>
      <HiddenProfilesList initialProfiles={hides.items.map((hide) => ({
        userId: hide.hidden_user,
        name: names.get(hide.hidden_user) || "Hidden profile",
      }))} />
    </AppShell>
  );
}
