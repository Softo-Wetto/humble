import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { updateAdminRecord } from "@/lib/pocketbase/records";
const schema=z.object({state:z.enum(["active","paused","deactivated","pending_deletion"])});
export async function POST(request:Request){const user=await requireUser();const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({message:"Invalid account state."},{status:400});await updateAdminRecord("users",user.id,JSON.stringify({account_state:parsed.data.state,deletion_requested_at:parsed.data.state==="pending_deletion"?new Date().toISOString():""}));return NextResponse.json({ok:true});}
