import { PolicyPage } from "@/components/layout/PolicyPage";

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Privacy in plain language" title="Your private details are not profile content." introduction="Humble separates public profile information from private account and preference records. This page describes the product's intended privacy behavior for the local MVP and should receive legal review before a public launch." sections={[
    { title: "What stays private", paragraphs: ["Your email address, exact date of birth, dating preferences, account state, blocks, reports, and moderation information are not included in public profile records.", "Humble uses your date of birth to verify that you are at least 18 and to calculate the age shown on your profile."] },
    { title: "What other members see", paragraphs: ["Published profiles may show your display name, age, city or region, gender identity, optional pronouns, bio, interests, values, and uploaded photos.", "You can pause discovery or deactivate your account without being penalized by engagement mechanics."] },
    { title: "Safety records", paragraphs: ["Reports preserve a restricted snapshot of relevant content so later edits cannot remove moderation context. Reporter identity is not shown to the reported person.", "Deletion requests may retain limited safety and audit records for a documented retention period where necessary to protect users and operate the service."] },
  ]} />;
}
