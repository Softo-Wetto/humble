import type { PocketBaseRecord } from "@/lib/pocketbase/types";
import { escapeFilter, findAdminRecord } from "@/lib/pocketbase/records";

export type PreferenceRecord = PocketBaseRecord & { user: string; interested_in: string[]; minimum_age: number; maximum_age: number; regions: string[] };
export function getPreferencesByUser(userId: string) { return findAdminRecord<PreferenceRecord>("preferences", `user="${escapeFilter(userId)}"`); }
