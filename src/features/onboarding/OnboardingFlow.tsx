"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ImagePlus, LockKeyhole } from "lucide-react";

const identities = ["woman", "man", "nonbinary"];

export function OnboardingFlow() {
  const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const response = await fetch("/api/onboarding/complete", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setError(result.message || "Please check your profile details."); setPending(false); return; }
    router.push("/discover"); router.refresh();
  }
  return <form className="onboarding-form" onSubmit={submit}>
    <section className="form-section"><span>01</span><div><h2>The basics</h2><p>What should someone know when they first meet you?</p></div><div className="form-grid"><label>Display name<input name="displayName" minLength={2} maxLength={60} required /></label><label>City<input name="city" required /></label><label>Region<input name="region" defaultValue="Queensland" required /></label><label>Gender identity<input name="gender" list="gender-options" required /><datalist id="gender-options">{identities.map((value) => <option value={value} key={value} />)}</datalist></label><label>Pronouns <small>optional</small><input name="pronouns" /></label></div></section>
    <section className="form-section"><span>02</span><div><h2>Who you hope to meet</h2><p>These preferences stay private and shape discovery.</p></div><div className="choice-row">{identities.map((identity) => <label className="choice-check" key={identity}><input type="checkbox" name="interestedIn" value={identity} />{identity}</label>)}</div><div className="form-grid two"><label>Minimum age<input type="number" name="minimumAge" min={18} max={120} defaultValue={25} required /></label><label>Maximum age<input type="number" name="maximumAge" min={18} max={120} defaultValue={40} required /></label></div></section>
    <section className="form-section"><span>03</span><div><h2>A little more of you</h2><p>Specific details make it easier for someone to notice what matters.</p></div><label>Bio<textarea name="bio" minLength={40} maxLength={1200} rows={6} required /></label><div className="form-grid two"><label>Interests <small>comma separated</small><input name="interests" placeholder="Cooking, galleries, river walks" required /></label><label>Values <small>comma separated</small><input name="values" placeholder="Kindness, curiosity, community" required /></label></div></section>
    <section className="form-section"><span>04</span><div><h2>Add a photo</h2><p>A clear recent photo is required before your profile enters discovery.</p></div><label className="photo-drop"><ImagePlus size={25} /><strong>Choose profile photos</strong><small>JPG, PNG, WebP, or SVG. Up to six.</small><input type="file" name="photos" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple required /></label></section>
    <div className="onboarding-submit"><p><LockKeyhole size={15} /> Your birth date and dating preferences remain private.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={pending}>{pending ? "Publishing gently..." : "Enter discovery"}<ArrowRight size={17} /></button></div>
  </form>;
}
