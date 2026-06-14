import { NextResponse } from "next/server";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { createAdminRecord, escapeFilter, findAdminRecord, updateAdminRecord } from "@/lib/pocketbase/records";
import type { MatchRecord } from "@/lib/repositories/matches";
import type { TypingRecord } from "@/lib/repositories/messages";
export async function POST(_request:Request,{params}:{params:Promise<{id:string}>}){const user=await requireOnboardedUser();const{id}=await params;const match=await findAdminRecord<MatchRecord>("matches",`id="${escapeFilter(id)}" && status="active"`);if(!match||(match.participant_one!==user.id&&match.participant_two!==user.id))return NextResponse.json({message:"Match not found."},{status:404});const existing=await findAdminRecord<TypingRecord>("typing_states",`match="${id}" && user="${user.id}"`);const body=JSON.stringify({match:id,user:user.id,expires_at:new Date(Date.now()+5000).toISOString()});if(existing)await updateAdminRecord("typing_states",existing.id,body);else await createAdminRecord("typing_states",body);return NextResponse.json({ok:true});}
