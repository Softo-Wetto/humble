"use client";
import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
export function ComplimentComposer({ recipientId, recipientName }: { recipientId: string; recipientName: string }) {
  const [body, setBody] = useState(""); const [state, setState] = useState<"idle"|"sending"|"sent">("idle"); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setState("sending"); setError(""); const response = await fetch("/api/compliments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipientId, body }) }); const result = await response.json().catch(() => ({})); if (!response.ok) { setError(result.message || "Your compliment could not be sent."); setState("idle"); return; } setState("sent"); }
  if (state === "sent") return <div className="compliment-sent"><h2>Sent with care.</h2><p>{recipientName} can choose to respond in their own time.</p></div>;
  return <form className="compliment-composer" onSubmit={submit}><p className="eyebrow">A thoughtful beginning</p><h2>What genuinely stood out about {recipientName}?</h2><p>Be specific, kind, and yourself. There are no credits or daily limits.</p><textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={12} maxLength={500} rows={5} placeholder={`I appreciated how you...`} required /><div><span>{body.length}/500</span><button className="button" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Send compliment"}<Send size={16} /></button></div>{error && <p className="form-error" role="alert">{error}</p>}</form>;
}
