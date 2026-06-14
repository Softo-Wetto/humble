"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = new FormData(event.currentTarget); const payload: Record<string, FormDataEntryValue | boolean> = Object.fromEntries(form.entries());
    if (mode === "signup") payload.acceptedPolicies = form.get("acceptedPolicies") === "on";
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setError(result.message || "We could not complete that request."); setPending(false); return; }
    router.push(mode === "signup" || !result.onboardingComplete ? "/onboarding" : "/discover"); router.refresh();
  }
  return <form className="auth-form" onSubmit={submit}>
    <div className="field-group"><label htmlFor={`${mode}-email`}>Email</label><input id={`${mode}-email`} name="email" type="email" autoComplete="email" required /></div>
    <div className="field-group"><label htmlFor={`${mode}-password`}>Password</label><div className="password-field"><input id={`${mode}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={10} required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
    {mode === "signup" && <><div className="field-group"><label htmlFor="signup-password-confirm">Confirm password</label><input id="signup-password-confirm" name="passwordConfirm" type={showPassword ? "text" : "password"} minLength={10} required /></div><div className="field-group"><label htmlFor="birth-date">Date of birth</label><input id="birth-date" name="birthDate" type="date" required /><p className="field-note">You must be 18 or older. Your exact birth date stays private.</p></div><label className="check-field"><input name="acceptedPolicies" type="checkbox" required /><span>I agree to Humble&apos;s terms, privacy policy, and community expectations.</span></label></>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button auth-submit" disabled={pending} type="submit">{pending ? "One moment..." : mode === "login" ? "Log in" : "Create my profile"}{!pending && <ArrowRight size={17} />}</button>
    <p className="auth-switch">{mode === "login" ? "New to Humble?" : "Already have an account?"} <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Join with care" : "Log in"}</Link></p>
  </form>;
}
