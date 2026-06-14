"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProfileRecord } from "@/lib/repositories/profiles";
import { ProfileCard } from "./ProfileCard";

export function DiscoveryBrowser({ initialProfiles }: { initialProfiles: ProfileRecord[] }) {
  const [profiles, setProfiles] = useState(initialProfiles); const [index, setIndex] = useState(0);
  async function hide(userId: string) { const response = await fetch("/api/discovery/hide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hiddenUserId: userId }) }); if (response.ok) { setProfiles((items) => items.filter((item) => item.user !== userId)); setIndex((value) => Math.max(0, Math.min(value, profiles.length - 2))); } }
  if (!profiles.length) return <div className="kind-empty"><h2>You&apos;re all caught up for now.</h2><p>Your boundaries stay intact. New profiles that fit your preferences will appear here.</p></div>;
  return <><div className="discovery-grid">{profiles.map((profile) => <ProfileCard profile={profile} onHide={hide} key={profile.id} />)}</div><div className="mobile-discovery"><ProfileCard profile={profiles[index]} onHide={hide} /><div className="profile-pager"><button disabled={index === 0} onClick={() => setIndex((value) => value - 1)}><ChevronLeft size={18} /> Previous profile</button><span>{index + 1} of {profiles.length}</span><button disabled={index === profiles.length - 1} onClick={() => setIndex((value) => value + 1)}>Next profile <ChevronRight size={18} /></button></div></div></>;
}
