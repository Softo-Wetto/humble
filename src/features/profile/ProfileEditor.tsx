"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PreferenceRecord } from "@/lib/repositories/preferences";
import type { ProfileRecord } from "@/lib/repositories/profiles";

function commaList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileEditor({
  profile,
  preferences,
}: {
  profile: ProfileRecord;
  preferences: PreferenceRecord;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.get("displayName"),
        city: form.get("city"),
        region: form.get("region"),
        gender: form.get("gender"),
        pronouns: form.get("pronouns"),
        bio: form.get("bio"),
        interests: commaList(form.get("interests")),
        values: commaList(form.get("values")),
        interestedIn: commaList(form.get("interestedIn")),
        minimumAge: Number(form.get("minimumAge")),
        maximumAge: Number(form.get("maximumAge")),
      }),
    });
    const result = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setMessage(result.message || "Your changes could not be saved.");
      return;
    }
    setMessage("Profile updated.");
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="profile-owner-actions">
        <button className="button" onClick={() => setEditing(true)}>Edit profile</button>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <form className="profile-editor" onSubmit={submit}>
      <div className="form-grid">
        <label>Display name<input name="displayName" defaultValue={profile.display_name} required /></label>
        <label>City<input name="city" defaultValue={profile.city} required /></label>
        <label>Region<input name="region" defaultValue={profile.region} required /></label>
        <label>Gender identity<input name="gender" defaultValue={profile.gender} required /></label>
        <label>Pronouns<input name="pronouns" defaultValue={profile.pronouns} /></label>
      </div>
      <label>Bio<textarea name="bio" rows={6} defaultValue={profile.bio} required /></label>
      <div className="form-grid">
        <label>Interests<input name="interests" defaultValue={profile.interests.join(", ")} required /></label>
        <label>Values<input name="values" defaultValue={profile.values.join(", ")} required /></label>
        <label>Interested in<input name="interestedIn" defaultValue={preferences.interested_in.join(", ")} required /></label>
        <label>Minimum age<input name="minimumAge" type="number" min={18} max={120} defaultValue={preferences.minimum_age} required /></label>
        <label>Maximum age<input name="maximumAge" type="number" min={18} max={120} defaultValue={preferences.maximum_age} required /></label>
      </div>
      {message && <p className="form-error" role="status">{message}</p>}
      <div className="editor-actions">
        <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        <button className="button" disabled={pending}>{pending ? "Saving..." : "Save changes"}</button>
      </div>
    </form>
  );
}
