"use client";
import { useState } from "react";
import type { ComplimentRecord } from "@/lib/repositories/compliments";
type Item = ComplimentRecord & { personName: string };
export function ComplimentInbox({ initialItems }: { initialItems: Item[] }) { const [items, setItems] = useState(initialItems); async function decide(id: string, decision: "accepted"|"ignored"|"reported") { const response = await fetch(`/api/compliments/${id}/decision`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision, category: decision === "reported" ? "other" : undefined }) }); if (response.ok) setItems((current) => current.filter((item) => item.id !== id)); }
  if (!items.length) return <div className="kind-empty small"><h2>A quiet inbox.</h2><p>New compliments will appear here without urgency or expiry.</p></div>;
  return <div className="compliment-list">{items.map((item) => <article key={item.id}><p className="eyebrow">From {item.personName}</p><blockquote>&quot;{item.body}&quot;</blockquote><div><button className="button" onClick={() => decide(item.id,"accepted")}>Accept and match</button><button onClick={() => decide(item.id,"ignored")}>Ignore privately</button><button onClick={() => decide(item.id,"reported")}>Report</button></div></article>)}</div>;
}
