import { PolicyPage } from "@/components/layout/PolicyPage";

export default function TermsPage() {
  return <PolicyPage eyebrow="Community agreement" title="Use Humble with honesty, care, and respect." introduction="These product terms summarize the expected behavior of the Humble MVP. They are not a substitute for reviewed production legal terms." sections={[
    { title: "Adults only", paragraphs: ["You must be at least 18 years old to create or use a Humble account. Providing a false date of birth may lead to account suspension or closure."] },
    { title: "Respectful participation", paragraphs: ["Do not harass, threaten, discriminate against, impersonate, scam, or pressure another member. Compliments and messages must be your own respectful words.", "Ignoring a compliment, ending a match, pausing discovery, or blocking someone are private choices that must be respected."] },
    { title: "Moderation", paragraphs: ["Humble may hide content, restrict features, suspend accounts, or close accounts when necessary for safety or community integrity. Administrative actions are recorded for accountability."] },
  ]} />;
}
