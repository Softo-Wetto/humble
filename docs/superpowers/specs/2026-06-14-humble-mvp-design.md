# Humble MVP Design

## Product Summary

Humble is a wholesome, compliment-first dating application designed to reduce dating-app fatigue. It replaces swipe mechanics, scores, artificial scarcity, and pressure-driven engagement with complete profiles, sincere compliments, deliberate acceptance, and calm conversation.

The MVP must run fully against a local PocketBase instance while preserving the same application contract for a later hosted PocketBase deployment. The Next.js frontend remains platform-neutral, with optional Cloudflare deployment support.

## Product Principles

- No swipe-left or swipe-right interaction.
- No compliment paywalls, credits, quotas, or artificial limits.
- No streaks, countdowns, popularity scores, or urgency prompts.
- Prioritize safety, respect, accessibility, and user control.
- Encourage genuine attention without forcing reciprocal interaction.
- Use calm notification language and avoid manipulative retention patterns.

## Audience And Eligibility

Humble is strictly for adults aged 18 or older. Registration collects a private date of birth and rejects users under 18. The public profile displays a computed age, never the birth date.

Date of birth becomes immutable after onboarding. Corrections require an administrative support action and must be recorded in moderation history.

## Visual Direction

The approved direction is **Warm Editorial**:

- Soft oat and parchment backgrounds.
- Cocoa and warm charcoal typography.
- Clay and restrained sage accents.
- Editorial serif display headings paired with a highly readable sans-serif interface font.
- Generous whitespace, subtle borders, softly elevated cards, and restrained gradients.
- Calm transitions and short entrance animations that respect reduced-motion preferences.
- Premium visual quality influenced by Apple, Notion, Linear, and Airbnb without copying their layouts.

The interface must remain mobile-first, responsive, keyboard accessible, and usable at 200% zoom.

## Delivery Strategy

Implementation uses vertical slices. Each workflow is built end to end through UI, typed application services, PocketBase rules, and verification before moving to the next slice.

The slices are:

1. Project foundation, design system, and local PocketBase runtime.
2. Authentication, eligibility, and onboarding.
3. Profiles and discovery.
4. Compliments and inbox decisions.
5. Matches and chat.
6. Blocking, reporting, and unmatching.
7. Administration and moderation.
8. Deployment documentation and final hardening.

## Application Architecture

Humble uses Next.js App Router, TypeScript, Tailwind CSS, React, and PocketBase.

Feature areas are independently organized around marketing, authentication, onboarding, profiles, discovery, compliments, matches, chat, safety, and moderation. Shared infrastructure contains:

- Typed PocketBase request and record normalization utilities.
- Browser and server authentication handling.
- Domain repositories and services.
- Runtime validation and form schemas.
- Authorization and account-state guards.
- Realtime subscriptions with reconnect and polling fallback behavior.
- File URL and profile-photo helpers.
- Reusable interface primitives and application shells.

Server components perform initial reads where appropriate. Client components own forms, optimistic interactions, and realtime state. Raw PocketBase calls remain inside the data layer rather than being distributed across pages.

PocketBase collection rules are the primary authorization boundary. Route and UI guards improve usability but do not replace database rules.

## Local Development

The primary local workflow is:

```bash
npm install
npm run local:setup
npm run dev:all
```

`local:setup` must:

- Download a pinned PocketBase binary for the host operating system when absent.
- Create local runtime and data directories excluded from Git.
- Generate a development environment file from an example when absent.
- Start PocketBase long enough to provision the schema.
- Create or update the collections, fields, indexes, and access rules.
- Create a local administrator from development-only environment values.
- Seed realistic adult demo profiles, compliments, matches, messages, reports, and blocks.
- Be idempotent so rerunning it does not duplicate data.

`dev:all` starts PocketBase and Next.js together. The default API URL is `http://127.0.0.1:8090`.

The PocketBase binary, local data, generated credentials, and uploaded demo files must not be committed.

## Hosted Deployment

The frontend reads the PocketBase origin through environment configuration. No feature may assume a localhost URL.

For hosted deployment:

1. Provision PocketBase with persistent storage and HTTPS.
2. Run the schema setup script against the hosted API using superuser secrets.
3. Configure the frontend's public PocketBase URL and server-only administrative secrets.
4. Deploy standard Next.js to a compatible Node host or use the included optional Cloudflare adapter.
5. Configure CORS, file-size limits, backups, email delivery, and rate limiting for the production domain.

Production data seeding is opt-in and disabled by default.

## Navigation And Page Structure

Public routes:

- `/` landing page.
- `/login` login.
- `/signup` registration and eligibility confirmation.
- `/privacy`, `/terms`, and `/safety` product policies.

Authenticated routes:

- `/onboarding` guided profile setup.
- `/discover` eligible profile browsing.
- `/profile` current user profile and settings.
- `/profile/[id]` another user's complete profile.
- `/compliments` received and sent compliments.
- `/matches` active and ended matches.
- `/matches/[id]` realtime conversation.
- `/settings` preferences, visibility, account, and safety controls.

Administrative routes:

- `/admin` moderation overview.
- `/admin/reports` report queue.
- `/admin/users/[id]` user and moderation history.

Protected routes redirect unauthenticated visitors to login. Incomplete users are directed to onboarding. Suspended users can access only a suspension explanation, appeal guidance, logout, and account controls.

## Authentication And Account State

PocketBase password authentication powers signup, login, logout, and session refresh.

Registration requires:

- Email.
- Password and confirmation.
- Date of birth proving age 18 or older.
- Acceptance of terms, privacy policy, and community expectations.

Account states include active, paused, deactivated, suspended, and pending deletion. Profile visibility is separate from account state.

Users can pause discovery, deactivate their account, request deletion, and revoke their sessions. Deletion follows a documented retention window for safety records. Reports, moderation actions, and necessary evidence may be retained in restricted form where legally and operationally appropriate.

## Onboarding And Profiles

Onboarding is a focused multi-step flow that collects:

- Display name.
- Private date of birth and public computed age.
- City and region entered manually, without precise location tracking.
- Gender identity with a flexible custom option.
- Optional pronouns.
- Interested-in selections.
- Preferred age range.
- Bio.
- Interests.
- Values.
- One or more profile photos.

A profile enters discovery only when onboarding is complete, at least one photo exists, the account is active, and profile visibility is enabled.

Profile editing includes image ordering and removal. The MVP supports multiple PocketBase file uploads with file type, count, and size validation. The first image is the primary photo.

Private account fields and public profile fields are stored in separate collections because PocketBase rules authorize whole records rather than individual fields. Exact birth dates, email addresses, dating preferences, administrative notes, and moderation evidence are never stored in publicly readable profile records.

## Discovery

Discovery uses a card-based grid or single-column mobile list. It never uses swipe gestures as a decision mechanic.

Each card shows enough information to invite attention without reducing a person to a photo. Opening a card displays the full profile, values, interests, and compliment action.

Navigation is explicit. Desktop users browse a profile-card grid. Mobile users can move through focused profiles with labelled Previous and Next profile controls. Sending a compliment is the positive expression of interest and the recipient's acceptance creates the match.

Users can choose `Not for me` to privately hide a profile from their current discovery results. This does not notify or penalize the other person. Hidden discovery profiles are stored separately from blocks, can be reviewed in settings, and can be restored individually or reset in bulk.

Discovery filters include compatible identity preference, preferred age range, and optional city or region. Profiles are excluded when they are:

- The current user.
- Blocked in either direction.
- Suspended, paused, deactivated, or pending deletion.
- Incomplete or missing a photo.
- Outside mutual dating preferences.
- Privately hidden from discovery by the current user.

Pagination is explicit or progressively loaded without infinite-scroll pressure cues. Empty states explain how preferences affect results without encouraging users to loosen boundaries.

## Compliments

Users send custom text compliments from a full profile. Compliments have sensible minimum and maximum lengths and reject blank or malformed text. There is no payment, credit, quota, or artificial daily cap.

Compliment states are pending, accepted, ignored, reported, and withdrawn. A recipient can accept, ignore, or report a pending compliment.

- Accepting atomically updates the compliment and creates one active match.
- Ignoring is private and does not notify the sender.
- Reporting creates a report, snapshots the compliment content, and removes it from the recipient's active inbox.
- Sending to a blocked, suspended, or ineligible account is rejected.

Sent and received views use indexed queries and clear status labels. Duplicate rapid submissions are prevented through disabled form state and server-side idempotency checks.

## Matches And Chat

A match contains a normalized pair of participant IDs and a unique index that prevents duplicate pairs. It records the source compliment and state: active, unmatched, blocked, or administratively closed.

Only active match participants can view or send messages. Chat includes:

- PocketBase realtime message delivery.
- Reconnect behavior and a lightweight polling fallback.
- Typing indicators backed by expiring state.
- Read timestamps and per-conversation unread counts.
- Message reporting.
- Calm status and error feedback.

Messages are plain text in the MVP, with length limits and safe rendering. Realtime typing records expire automatically and are not retained as conversation history.

Unmatching closes the conversation for both users and prevents new messages. Existing records remain hidden from participants where appropriate but available to authorized moderation review. The other user receives a neutral conversation-ended state, not a punitive notification.

## Blocking And Reporting

Blocking immediately:

- Removes both users from each other's discovery results.
- Hides pending compliments between them.
- Closes active matches and prevents messages.
- Prevents new compliments, matches, and conversations.

The blocked user is not notified who blocked them.

Reports can target a user, compliment, or message. Reports include a category, optional detail, subject references, status, timestamps, and an immutable evidence snapshot. Report categories include harassment, hate or discrimination, sexual content, impersonation, scam, underage concern, safety concern, and other.

Submitting a report never exposes the reporter to the reported user.

## Moderation

Administrative access is based on a server-managed role that ordinary users cannot update.

Admins can:

- Review and filter open reports.
- Inspect restricted user and content context.
- Hide or restore profile content and messages.
- Warn, suspend, unsuspend, or close an account.
- Resolve or dismiss reports with private notes.
- Correct a verified date-of-birth error.

Every moderation mutation creates an immutable `moderation_actions` record containing the administrator, action, target, reason, previous state, resulting state, and timestamp.

Sensitive administrative notes and evidence are available only to admins. Destructive moderation operations require confirmation and explain their impact.

## PocketBase Collections

### `users` (auth)

Contains authentication fields plus private date of birth, role, onboarding state, account state, deletion state, and suspension metadata. Records are readable only by their owner and admins. Rules restrict updates and prevent users from changing role, birth date after onboarding, or moderation state.

### `profiles`

Contains the publicly presentable user relation, display name, computed age, city/region, gender identity, optional pronouns, bio, interests, values, photos, publication state, and moderation visibility. Discovery reads only published records. The owner can edit allowed profile fields, while publication eligibility and moderation visibility are controlled by trusted server logic and admins.

### `preferences`

Contains the owner, interested-in selections, preferred age range, and discovery region preferences. Records are readable only by their owner and admins. Trusted discovery queries use these values without exposing them on another user's public profile.

### `compliments`

Contains sender, recipient, body, state, decision timestamp, and optional resulting match. Indexed by recipient/state/created and sender/created.

### `matches`

Contains normalized participant pair, source compliment, state, ended-by user, end reason, and timestamps. A unique compound index prevents duplicate participant pairs.

### `messages`

Contains match, sender, body, read timestamp, hidden timestamp, and timestamps. Indexed by match/created and match/read state.

### `reports`

Contains reporter, target type and references, category, detail, evidence snapshot, status, assigned admin, resolution, and timestamps. Indexed by status/created and target user.

### `blocks`

Contains blocker, blocked user, optional reason, and timestamp. A unique index prevents duplicate block pairs.

### `discovery_hides`

Contains the viewer and privately hidden profile owner. A unique index prevents duplicate pairs. Records are visible only to the viewer and admins, have no effect on the hidden person's account, and can be deleted to restore discovery visibility.

### `moderation_actions`

Contains administrator, action, target references, reason, before/after snapshots, and timestamp. Only admins can list or create records.

### `typing_states`

Contains match, user, and expiration timestamp. Participants can access records only for their active matches. Expired records are periodically cleaned up.

## Authorization Rules

Rules must enforce these invariants:

- Public reads are served from `profiles` and expose only eligible visible records.
- `users` and `preferences` records are readable only by their owner and admins.
- Users can update only permitted fields on their own user, profile, and preference records.
- Roles, suspension state, private moderation fields, and date-of-birth corrections require admin authority.
- Compliments are visible only to sender, recipient, and admins.
- Only recipients can decide a pending compliment.
- Matches and messages are visible only to participants and admins.
- Only active match participants can create messages or typing state.
- Block records are visible only to the blocker and admins.
- Discovery-hide records are visible and mutable only by the viewer and admins.
- Reports are visible to their reporter and admins, with restricted administrative fields omitted from reporter-facing reads.
- Moderation actions are admin-only.

Business operations that require atomic multi-record changes, such as accepting a compliment or blocking an active match, use trusted server-side endpoints or PocketBase hooks rather than independent client writes.

## Error Handling And Resilience

Every page defines loading, empty, unavailable, permission-denied, and unexpected-error states. Errors use supportive language and preserve user input where safe.

Network mutations provide pending state and prevent duplicate submission. Optimistic UI is limited to reversible actions such as marking a local view state. Match creation, blocking, reporting, and moderation wait for server confirmation.

Realtime failures display a subtle reconnecting state and fall back to periodic refresh. The application remains usable for non-realtime navigation when subscriptions are unavailable.

## Accessibility And Privacy

- Semantic headings, landmarks, labels, and form errors.
- Full keyboard navigation and visible focus treatment.
- WCAG AA color contrast.
- Reduced-motion support.
- Meaningful image alternatives and guidance for profile-photo descriptions.
- No precise geolocation in the MVP.
- Private account and preference fields stored outside the publicly readable `profiles` collection.
- Secure, same-site authentication cookie handling where supported.
- Logs avoid message bodies, birth dates, tokens, passwords, and report evidence.

## Testing And Verification

Automated tests cover:

- Age calculation and 18+ eligibility boundaries.
- Profile completion and discovery eligibility.
- Mutual preference filtering.
- Block exclusions in both directions.
- Hiding and restoring discovery profiles without creating blocks.
- Compliment state transitions.
- Atomic compliment acceptance and duplicate-match prevention.
- Match membership and message authorization.
- Read-state and unread-count logic.
- Unmatching and blocking effects.
- Report evidence snapshots.
- Admin-role and suspension guards.
- Local setup idempotency and seed assumptions where practical.

Key browser flows cover signup, onboarding, discovery, compliment acceptance, matching, chat, reporting, blocking, and moderation.

Completion requires passing:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run pb:check
```

The local setup must also be exercised from a clean runtime directory before the MVP is considered ready.

## Initial MVP Boundaries

The initial implementation excludes video profiles, voice notes, social login, push notifications, email campaigns, precise distance calculations, algorithmic ranking, subscriptions, payments, and native mobile applications.

The architecture may accommodate those features later, but the MVP must not add speculative abstractions for them.

## Success Criteria

The MVP is successful when a new local developer can run the documented setup, create or use seeded adult accounts, complete a profile, discover eligible people, send and accept a compliment, form a match, exchange realtime messages, use safety controls, and moderate a report without manual database editing.

The resulting experience should feel calm, respectful, polished, and deliberately unlike a swipe-driven dating product.
