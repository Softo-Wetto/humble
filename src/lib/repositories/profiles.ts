import type { PocketBaseRecord } from "@/lib/pocketbase/types";
import { escapeFilter, findAdminRecord } from "@/lib/pocketbase/records";

export type ProfileRecord = PocketBaseRecord & {
  user: string; display_name: string; age: number; city: string; region: string; gender: string;
  pronouns: string; bio: string; interests: string[]; values: string[]; photos: string[];
  is_published: boolean; moderation_visible: boolean;
};

export function getProfileByUser(userId: string) {
  return findAdminRecord<ProfileRecord>("profiles", `user="${escapeFilter(userId)}"`);
}
