import type { PocketBaseRecord } from "@/lib/pocketbase/types";
import type { ComplimentStatus } from "@/lib/domain/compliment";
export type ComplimentRecord = PocketBaseRecord & { sender: string; recipient: string; body: string; status: ComplimentStatus; request_key: string; decided_at?: string };
