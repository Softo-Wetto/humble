import type { PocketBaseRecord } from "@/lib/pocketbase/types";
export type ReportRecord=PocketBaseRecord&{reporter:string;target_user:string;target_type:"user"|"compliment"|"message";target_record:string;category:string;detail:string;evidence_snapshot:Record<string,unknown>;status:"open"|"reviewing"|"resolved"|"dismissed";resolution:string};
export type ModerationActionRecord=PocketBaseRecord&{administrator:string;target_user:string;action:string;target_type:string;target_record:string;reason:string;before_state:Record<string,unknown>;after_state:Record<string,unknown>};
