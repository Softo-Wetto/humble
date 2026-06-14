import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();return <div className="admin-frame"><header><Link className="wordmark" href="/admin">humble<span>.</span> <small>moderation</small></Link><nav><Link href="/admin">Overview</Link><Link href="/admin/reports">Reports</Link><Link href="/discover">Return to app</Link></nav></header><main>{children}</main></div>;}
