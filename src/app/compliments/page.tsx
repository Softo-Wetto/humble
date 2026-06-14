import { AppShell } from "@/components/layout/AppShell";
import { requireOnboardedUser } from "@/lib/auth/guards";
import { listAdminRecords, findAdminRecord, escapeFilter } from "@/lib/pocketbase/records";
import type { ComplimentRecord } from "@/lib/repositories/compliments";
import type { ProfileRecord } from "@/lib/repositories/profiles";
import { ComplimentComposer } from "@/features/compliments/ComplimentComposer";
import { ComplimentInbox } from "@/features/compliments/ComplimentInbox";

export default async function ComplimentsPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) { const user = await requireOnboardedUser(); const { to } = await searchParams; const profilesPage = await listAdminRecords<ProfileRecord>("profiles", new URLSearchParams({ page: "1", perPage: "200" })); const profileByUser = new Map(profilesPage.items.map((profile) => [profile.user, profile]));
  if (to) { const recipient = await findAdminRecord<ProfileRecord>("profiles", `user="${escapeFilter(to)}" && is_published=true`); if (recipient) return <AppShell active="compliments"><div className="centered-panel"><ComplimentComposer recipientId={recipient.user} recipientName={recipient.display_name} /></div></AppShell>; }
  const [received, sent] = await Promise.all([listAdminRecords<ComplimentRecord>("compliments", new URLSearchParams({ page: "1", perPage: "100", sort: "-created", filter: `recipient="${user.id}" && status="pending"` })), listAdminRecords<ComplimentRecord>("compliments", new URLSearchParams({ page: "1", perPage: "100", sort: "-created", filter: `sender="${user.id}"` }))]);
  return <AppShell active="compliments"><div className="app-page-header"><div><p className="eyebrow">Compliments</p><h1>Thoughtful words, held without pressure.</h1></div><p>Accept when something feels worth exploring. Ignoring stays private.</p></div><section className="inbox-section"><h2>Received</h2><ComplimentInbox initialItems={received.items.map((item) => ({ ...item, personName: profileByUser.get(item.sender)?.display_name || "Someone" }))} /></section><section className="sent-section"><h2>Sent</h2>{sent.items.length ? <div className="sent-list">{sent.items.map((item) => <article key={item.id}><p>To {profileByUser.get(item.recipient)?.display_name || "Someone"}</p><blockquote>“{item.body}”</blockquote><span>{item.status}</span></article>)}</div> : <p className="muted-copy">Compliments you send will appear here.</p>}</section></AppShell>;
}
