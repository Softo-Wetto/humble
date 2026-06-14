import type { PocketBaseRecord } from "@/lib/pocketbase/types";
import { listAdminRecords } from "@/lib/pocketbase/records";
import type { ProfileRecord } from "./profiles";
import type { PreferenceRecord } from "./preferences";

type BlockRecord = PocketBaseRecord & { blocker: string; blocked: string };
type HideRecord = PocketBaseRecord & { viewer: string; hidden_user: string };

export async function getDiscoverySource(userId: string) {
  const [profiles, preferences, blocks, hides] = await Promise.all([
    listAdminRecords<ProfileRecord>("profiles", new URLSearchParams({ page: "1", perPage: "100", sort: "-updated" })),
    listAdminRecords<PreferenceRecord>("preferences", new URLSearchParams({ page: "1", perPage: "200" })),
    listAdminRecords<BlockRecord>("blocks", new URLSearchParams({ page: "1", perPage: "200", filter: `blocker="${userId}" || blocked="${userId}"` })),
    listAdminRecords<HideRecord>("discovery_hides", new URLSearchParams({ page: "1", perPage: "200", filter: `viewer="${userId}"` })),
  ]);
  return { profiles: profiles.items, preferences: preferences.items, blocks: blocks.items, hides: hides.items };
}
