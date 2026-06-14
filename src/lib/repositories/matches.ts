import type { PocketBaseRecord } from "@/lib/pocketbase/types";
export type MatchRecord = PocketBaseRecord & { participant_one: string; participant_two: string; source_compliment: string; status: "active" | "unmatched" | "blocked" | "admin_closed"; ended_by?: string; end_reason?: string };
