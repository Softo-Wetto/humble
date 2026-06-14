import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth/guards";
import { listAdminRecords } from "@/lib/pocketbase/records";
import type { PocketBaseRecord } from "@/lib/pocketbase/types";
import type { ProfileRecord } from "@/lib/repositories/profiles";
import { AccountControls } from "@/features/settings/AccountControls";
type Hide=PocketBaseRecord&{viewer:string;hidden_user:string};
export default async function SettingsPage(){const user=await requireUser();const[hides,profiles]=await Promise.all([listAdminRecords<Hide>("discovery_hides",new URLSearchParams({page:"1",perPage:"200",filter:`viewer="${user.id}"`})),listAdminRecords<ProfileRecord>("profiles",new URLSearchParams({page:"1",perPage:"200"}))]);const byUser=new Map(profiles.items.map((profile)=>[profile.user,profile]));return <AppShell active="profile"><div className="app-page-header"><div><p className="eyebrow">Settings</p><h1>Your boundaries and account stay in your hands.</h1></div><p>Pause, return, or leave without punishment or retention pressure.</p></div><section className="settings-panel"><h2>Account visibility</h2><p>Current state: <strong>{user.account_state}</strong></p><AccountControls/></section><section className="settings-panel"><h2>Profiles marked “Not for me”</h2>{hides.items.length?<ul>{hides.items.map((hide)=><li key={hide.id}>{byUser.get(hide.hidden_user)?.display_name||"Hidden profile"}</li>)}</ul>:<p>No profiles are currently hidden.</p>}</section></AppShell>;}
