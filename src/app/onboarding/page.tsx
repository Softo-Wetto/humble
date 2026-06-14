import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { OnboardingFlow } from "@/features/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  await requireUser();
  return <main className="onboarding-page"><header className="onboarding-header page-shell"><Link className="wordmark" href="/">humble<span>.</span></Link><p>Build your profile at your own pace.</p></header><div className="onboarding-intro page-shell"><p className="eyebrow">Your whole self, not a sales pitch</p><h1>Make it easier for the right person to notice you.</h1><p>Humble profiles are designed to be read. Share enough texture for a sincere compliment to begin.</p></div><div className="page-shell"><OnboardingFlow /></div></main>;
}
