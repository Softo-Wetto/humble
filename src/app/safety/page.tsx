import { PolicyPage } from "@/components/layout/PolicyPage";

export default function SafetyPage() {
  return <PolicyPage eyebrow="Safety by design" title="Boundaries are part of the product, not an afterthought." introduction="Humble gives members calm, direct controls without notifying or shaming the other person. For immediate danger, contact local emergency services rather than relying on an in-app report." sections={[
    { title: "Block privately", paragraphs: ["Blocking removes both people from each other's discovery results, closes active matches, hides pending compliments, and prevents new contact. The blocked person is not told who blocked them."] },
    { title: "Report with context", paragraphs: ["You can report a profile, compliment, or message. Reports include a category, optional explanation, and a restricted evidence snapshot for moderators.", "Use the underage concern and safety concern categories whenever someone's eligibility or immediate wellbeing may be at risk."] },
    { title: "Leave without pressure", paragraphs: ["Unmatching closes the conversation for both people with neutral language. There are no reply timers, streaks, or penalties for taking time away.", "You can pause discovery, deactivate your account, or request deletion from settings."] },
  ]} />;
}
