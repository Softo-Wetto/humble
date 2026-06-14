import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminRecord, escapeFilter, findAdminRecord, updateAdminRecord } from "@/lib/pocketbase/records";
import type { ReportRecord } from "@/lib/repositories/moderation";
import { buildModerationAudit } from "@/lib/services/moderation";
const schema=z.object({status:z.enum(["reviewing","resolved","dismissed"]),resolution:z.string().trim().min(3).max(2000)});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdmin();const{id}=await params;const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({message:"Invalid report decision."},{status:400});const report=await findAdminRecord<ReportRecord>("reports",`id="${escapeFilter(id)}"`);if(!report)return NextResponse.json({message:"Report not found."},{status:404});await updateAdminRecord("reports",id,JSON.stringify({status:parsed.data.status,resolution:parsed.data.resolution,assigned_admin:admin.id}));await createAdminRecord("moderation_actions",JSON.stringify(buildModerationAudit({administratorId:admin.id,targetUserId:report.target_user,action:`report_${parsed.data.status}`,reason:parsed.data.resolution,targetType:"report",targetRecord:report.id,beforeState:{status:report.status},afterState:{status:parsed.data.status}})));return NextResponse.json({ok:true});}
