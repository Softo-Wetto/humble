import { NextResponse } from "next/server";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { escapeFilter, findAdminRecord, listAdminRecords, updateAdminRecord } from "@/lib/pocketbase/records";
import type { MatchRecord } from "@/lib/repositories/matches";
import type { MessageRecord } from "@/lib/repositories/messages";
export async function POST(_request: Request,{params}:{params:Promise<{id:string}>}){const user=await requireOnboardedUser();const{id}=await params;const match=await findAdminRecord<MatchRecord>("matches",`id="${escapeFilter(id)}"`);if(!match||(match.participant_one!==user.id&&match.participant_two!==user.id))return NextResponse.json({message:"Match not found."},{status:404});const page=await listAdminRecords<MessageRecord>("messages",new URLSearchParams({page:"1",perPage:"200",filter:`match="${id}" && sender!="${user.id}" && read_at=""`}));const readAt=new Date().toISOString();await Promise.all(page.items.map((message)=>updateAdminRecord("messages",message.id,JSON.stringify({read_at:readAt}))));return NextResponse.json({ok:true,readAt});}
