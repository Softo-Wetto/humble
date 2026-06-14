import type { PocketBaseRecord } from "@/lib/pocketbase/types";
export type MessageRecord = PocketBaseRecord & { match: string; sender: string; body: string; read_at: string; hidden_at: string; hidden_reason: string };
export type TypingRecord = PocketBaseRecord & { match: string; user: string; expires_at: string };
