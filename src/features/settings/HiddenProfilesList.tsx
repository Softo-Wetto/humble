"use client";

import { useState } from "react";

type HiddenProfile = { userId: string; name: string };

export function HiddenProfilesList({ initialProfiles }: { initialProfiles: HiddenProfile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);

  async function restore(userId: string) {
    const response = await fetch("/api/discovery/hide", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hiddenUserId: userId }),
    });
    if (response.ok) setProfiles((items) => items.filter((item) => item.userId !== userId));
  }

  if (!profiles.length) {
    return <div className="kind-empty small"><h2>No hidden profiles.</h2><p>Profiles you privately pass on can be restored here.</p></div>;
  }

  return (
    <div className="hidden-profile-list">
      {profiles.map((profile) => (
        <article key={profile.userId}>
          <div><span>{profile.name[0] || "H"}</span><strong>{profile.name}</strong></div>
          <button onClick={() => restore(profile.userId)}>Restore to discovery</button>
        </article>
      ))}
    </div>
  );
}
