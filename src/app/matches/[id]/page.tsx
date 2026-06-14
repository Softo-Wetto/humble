import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { escapeFilter, findAdminRecord, listAdminRecords } from "@/lib/pocketbase/records";
import type { MatchRecord } from "@/lib/repositories/matches";
import type { MessageRecord } from "@/lib/repositories/messages";
import type { ProfileRecord } from "@/lib/repositories/profiles";
import { Conversation } from "@/features/chat/Conversation";
import { SafetyActions } from "@/features/safety/SafetyActions";
export default async function MatchPage({params}:{params:Promise<{id:string}>}){const user=await requireOnboardedUser();const{id}=await params;const match=await findAdminRecord<MatchRecord>("matches",`id="${escapeFilter(id)}"`);if(!match||(match.participant_one!==user.id&&match.participant_two!==user.id))notFound();const otherId=match.participant_one===user.id?match.participant_two:match.participant_one;const[other,messages]=await Promise.all([findAdminRecord<ProfileRecord>("profiles",`user="${otherId}"`),listAdminRecords<MessageRecord>("messages",new URLSearchParams({page:"1",perPage:"200",sort:"created",filter:`match="${id}" && hidden_at=""`}))]);return <AppShell active="matches"><SafetyActions targetUserId={otherId} matchId={id}/><Conversation matchId={id} currentUserId={user.id} otherName={other?.display_name||"Your match"} initialMessages={messages.items}/></AppShell>;}
