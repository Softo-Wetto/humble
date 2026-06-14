import { NextResponse } from "next/server";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { escapeFilter, findAdminRecord, updateAdminRecord } from "@/lib/pocketbase/records";
import type { MatchRecord } from "@/lib/repositories/matches";
export async function POST(_request:Request,{params}:{params:Promise<{id:string}>}){const user=await requireOnboardedUser();const{id}=await params;const match=await findAdminRecord<MatchRecord>("matches",`id="${escapeFilter(id)}"`);if(!match||(match.participant_one!==user.id&&match.participant_two!==user.id))return NextResponse.json({message:"Match not found."},{status:404});if(match.status==="active")await updateAdminRecord("matches",id,JSON.stringify({status:"unmatched",ended_by:user.id,end_reason:"unmatched",ended_at:new Date().toISOString()}));return NextResponse.json({ok:true});}
