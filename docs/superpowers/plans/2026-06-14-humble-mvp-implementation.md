# Humble MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, local-first compliment-led dating MVP with PocketBase authentication, profiles, discovery, compliments, matches, realtime chat, safety controls, and moderation.

**Architecture:** Next.js App Router pages consume typed domain services rather than raw PocketBase requests. Public profile records are separated from private account and preference records, while trusted multi-record mutations run through authenticated Next.js route handlers. A pinned local PocketBase runtime, idempotent schema setup, and deterministic seed script provide the default development environment; hosted PocketBase uses the same schema and environment contract.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, PocketBase, Zod, Lucide React, Vitest, Testing Library, Playwright, optional OpenNext Cloudflare adapter.

---

## File Map

### Project And Tooling

- `package.json`: scripts and dependencies.
- `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`: Next.js and TypeScript configuration.
- `vitest.config.ts`, `src/test/setup.ts`: unit/component test environment.
- `playwright.config.ts`, `tests/e2e/*.spec.ts`: browser-flow verification.
- `.env.example`, `.gitignore`: local and hosted configuration contract.
- `open-next.config.ts`, `wrangler.jsonc`: optional Cloudflare deployment.

### PocketBase Runtime

- `scripts/local-setup.mjs`: download pinned PocketBase, start it temporarily, and orchestrate schema plus seed.
- `scripts/start-pocketbase.mjs`: run the local PocketBase binary.
- `scripts/setup-pocketbase.mjs`: idempotently create collections, rules, and indexes.
- `scripts/seed-pocketbase.mjs`: deterministic adult demo data.
- `scripts/check-pocketbase.mjs`: verify collections and representative protected queries.
- `scripts/lib/pocketbase-admin.mjs`: environment loading, superuser authentication, and REST helpers.

### Shared Application Infrastructure

- `src/lib/config.ts`: validated environment configuration.
- `src/lib/pocketbase/types.ts`: raw and normalized record types.
- `src/lib/pocketbase/http.ts`: typed REST client and error normalization.
- `src/lib/pocketbase/client.ts`: browser auth and client reads.
- `src/lib/pocketbase/server.ts`: cookie-backed server reads.
- `src/lib/pocketbase/admin.ts`: server-only privileged operations.
- `src/lib/auth/session.ts`: session cookie serialization and guards.
- `src/lib/auth/guards.ts`: active, onboarded, and admin route guards.
- `src/lib/domain/*.ts`: domain schemas and pure functions.
- `src/lib/repositories/*.ts`: collection-specific reads and writes.
- `src/lib/services/*.ts`: multi-record workflows and policy enforcement.

### Interface

- `src/app/globals.css`: Warm Editorial design tokens and shared motion.
- `src/components/ui/*`: buttons, fields, cards, dialogs, badges, empty states, and skeletons.
- `src/components/layout/*`: public header/footer and authenticated app shell.
- `src/features/*`: feature-owned forms, cards, lists, and client state.
- `src/app/*`: route composition, loading states, and error boundaries.

---

### Task 1: Scaffold The Next.js Application And Test Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Test: `src/app/page.test.tsx`

- [ ] **Step 1: Create the package manifest and framework configuration**

Use Next.js 16, React 19, Tailwind 4, PocketBase, Zod, and Lucide. Add scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "local:setup": "node scripts/local-setup.mjs",
  "pb:start": "node scripts/start-pocketbase.mjs",
  "pb:setup": "node scripts/setup-pocketbase.mjs",
  "pb:seed": "node scripts/seed-pocketbase.mjs",
  "pb:check": "node scripts/check-pocketbase.mjs",
  "dev:all": "concurrently -k -n pocketbase,next -c green,cyan \"npm:pb:start\" \"npm:dev\""
}
```

- [ ] **Step 2: Write the failing landing-page smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

it("introduces compliment-first connection", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: /meet through what you appreciate/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /join humble/i })).toHaveAttribute("href", "/signup");
});
```

- [ ] **Step 3: Run the test and confirm the initial failure**

Run: `npm test -- src/app/page.test.tsx`

Expected: FAIL because the page and test harness are not implemented.

- [ ] **Step 4: Implement the root layout, metadata, tokens, and minimal landing page**

Use `next/font` with a serif display family and readable sans-serif body family. Define Warm Editorial CSS variables for oat, parchment, cocoa, clay, sage, borders, shadows, radii, focus rings, and reduced motion.

- [ ] **Step 5: Install dependencies and verify the harness**

Run: `npm install`

Run: `npm test -- src/app/page.test.tsx`

Expected: PASS.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 6: Commit the scaffold**

```bash
git add .
git commit -m "chore: scaffold Humble application"
```

### Task 2: Implement Domain Types, Validation, And Pure Policy Functions

**Files:**
- Create: `src/lib/domain/account.ts`
- Create: `src/lib/domain/profile.ts`
- Create: `src/lib/domain/discovery.ts`
- Create: `src/lib/domain/compliment.ts`
- Create: `src/lib/domain/match.ts`
- Create: `src/lib/domain/report.ts`
- Test: `src/lib/domain/account.test.ts`
- Test: `src/lib/domain/discovery.test.ts`
- Test: `src/lib/domain/compliment.test.ts`

- [ ] **Step 1: Write failing eligibility and age tests**

Cover the day before, day of, and day after an eighteenth birthday with an injected current date.

```ts
expect(calculateAge("2008-06-14", new Date("2026-06-14T00:00:00Z"))).toBe(18);
expect(isAdult("2008-06-15", new Date("2026-06-14T00:00:00Z"))).toBe(false);
```

- [ ] **Step 2: Write failing discovery-policy tests**

Test current-user exclusion, incomplete profiles, mutual gender preference, age ranges, blocks in both directions, and discovery hides.

- [ ] **Step 3: Write failing compliment-transition tests**

Allow only `pending -> accepted|ignored|reported|withdrawn`; reject every terminal-state transition.

- [ ] **Step 4: Run the domain tests and confirm failures**

Run: `npm test -- src/lib/domain`

Expected: FAIL because functions and schemas are absent.

- [ ] **Step 5: Implement Zod schemas and pure functions**

Export stable types for account state, public profile, private preferences, compliment, match, message, report, block, discovery hide, moderation action, and typing state. Keep time-dependent functions injectable and deterministic.

- [ ] **Step 6: Run domain verification**

Run: `npm test -- src/lib/domain`

Expected: PASS.

- [ ] **Step 7: Commit domain rules**

```bash
git add src/lib/domain
git commit -m "feat: add Humble domain policies"
```

### Task 3: Add The Local PocketBase Runtime, Schema, And Seed Data

**Files:**
- Create: `scripts/lib/env.mjs`
- Create: `scripts/lib/pocketbase-admin.mjs`
- Create: `scripts/local-setup.mjs`
- Create: `scripts/start-pocketbase.mjs`
- Create: `scripts/setup-pocketbase.mjs`
- Create: `scripts/seed-pocketbase.mjs`
- Create: `scripts/check-pocketbase.mjs`
- Modify: `.gitignore`
- Modify: `.env.example`
- Test: `scripts/tests/schema.test.mjs`

- [ ] **Step 1: Write the failing schema-definition test**

Assert that definitions include `users`, `profiles`, `preferences`, `compliments`, `matches`, `messages`, `reports`, `blocks`, `discovery_hides`, `moderation_actions`, and `typing_states`, plus required unique indexes.

- [ ] **Step 2: Run the schema test and confirm failure**

Run: `node --test scripts/tests/schema.test.mjs`

Expected: FAIL because schema definitions do not exist.

- [ ] **Step 3: Implement reusable PocketBase admin helpers**

Support `.env.local`, superuser auth for current and legacy PocketBase APIs, JSON/FormData requests, collection lookup, field merging, and idempotent collection upserts.

- [ ] **Step 4: Implement collection definitions and rules**

Use separate restricted `users` and `preferences` collections and publicly readable eligible `profiles`. Add compound indexes for match pairs, block pairs, hide pairs, inboxes, message timelines, and report queues. Prevent clients from writing role, suspension, publication, and moderation fields through rules.

- [ ] **Step 5: Implement pinned binary download and startup**

Pin one PocketBase version in `scripts/local-setup.mjs`. Detect Windows, macOS, and Linux plus architecture, download the matching release archive, extract it under `.pocketbase/bin`, and keep data under `.pocketbase/data`.

- [ ] **Step 6: Implement deterministic seed data**

Create one admin, six visible adult profiles with inclusive preferences, one incomplete user, pending and accepted compliments, an active match with messages, a report, a block, and a discovery hide. Upsert by deterministic email or seed key.

- [ ] **Step 7: Run schema tests**

Run: `node --test scripts/tests/schema.test.mjs`

Expected: PASS.

- [ ] **Step 8: Exercise clean local setup**

Run: `npm run local:setup`

Expected: PocketBase binary installed, schema created, seed completed, and local credentials printed without exposing production secrets.

Run: `npm run pb:check`

Expected: all collection and representative rule checks pass.

- [ ] **Step 9: Commit local backend tooling**

```bash
git add scripts .env.example .gitignore package.json package-lock.json
git commit -m "feat: add local PocketBase environment"
```

### Task 4: Build PocketBase Clients, Cookie Sessions, And Authentication

**Files:**
- Create: `src/lib/config.ts`
- Create: `src/lib/pocketbase/types.ts`
- Create: `src/lib/pocketbase/http.ts`
- Create: `src/lib/pocketbase/client.ts`
- Create: `src/lib/pocketbase/server.ts`
- Create: `src/lib/pocketbase/admin.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/guards.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/signup/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/login/page.tsx`
- Create: `src/app/signup/page.tsx`
- Create: `src/features/auth/AuthForm.tsx`
- Test: `src/features/auth/AuthForm.test.tsx`
- Test: `src/app/api/auth/signup/route.test.ts`

- [ ] **Step 1: Write failing signup validation tests**

Test invalid email, weak password, mismatched confirmation, under-18 birth date, and missing policy acceptance.

- [ ] **Step 2: Run auth tests and confirm failures**

Run: `npm test -- src/features/auth src/app/api/auth`

Expected: FAIL because auth modules are absent.

- [ ] **Step 3: Implement typed HTTP and normalized errors**

Create a `PocketBaseError` carrying status and field errors. Never log tokens, passwords, email addresses, or birth dates.

- [ ] **Step 4: Implement secure cookie sessions**

Route handlers exchange credentials with PocketBase and write an HTTP-only, same-site cookie. Server utilities validate/refresh auth before protected reads. Logout expires the cookie.

- [ ] **Step 5: Implement signup and login pages**

Use accessible labels, inline errors, preserved non-secret input, password visibility controls, 18+ explanation, and Warm Editorial presentation.

- [ ] **Step 6: Verify authentication**

Run: `npm test -- src/features/auth src/app/api/auth`

Expected: PASS.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 7: Commit authentication**

```bash
git add src/lib src/app/api/auth src/app/login src/app/signup src/features/auth
git commit -m "feat: add PocketBase authentication"
```

### Task 5: Build Onboarding, Profile Editing, And Photo Management

**Files:**
- Create: `src/lib/repositories/profiles.ts`
- Create: `src/lib/repositories/preferences.ts`
- Create: `src/lib/services/onboarding.ts`
- Create: `src/app/onboarding/page.tsx`
- Create: `src/features/onboarding/OnboardingFlow.tsx`
- Create: `src/features/profile/ProfileForm.tsx`
- Create: `src/features/profile/PhotoManager.tsx`
- Create: `src/app/profile/page.tsx`
- Create: `src/app/profile/[id]/page.tsx`
- Create: `src/app/api/onboarding/complete/route.ts`
- Test: `src/lib/services/onboarding.test.ts`
- Test: `src/features/onboarding/OnboardingFlow.test.tsx`

- [ ] **Step 1: Write failing profile-completion tests**

Require display name, adult age, location, gender identity, at least one interested-in choice, valid age range, bio, values, interests, and one photo.

- [ ] **Step 2: Run onboarding tests and confirm failure**

Run: `npm test -- src/lib/services/onboarding.test.ts src/features/onboarding`

Expected: FAIL.

- [ ] **Step 3: Implement repositories and trusted completion endpoint**

The endpoint validates the user record, creates or updates private preferences and public profile, computes age, uploads photos, and only then marks onboarding complete and publishes the profile.

- [ ] **Step 4: Implement the guided onboarding UI**

Use short steps for basics, identity, preferences, personality, and photos. Preserve local progress between steps and announce validation errors to assistive technology.

- [ ] **Step 5: Implement profile pages and photo ordering**

Allow owners to edit permitted profile fields, add/remove/reorder photos, pause discovery, and preview the public profile. Public pages never display private preferences or birth dates.

- [ ] **Step 6: Verify onboarding and profile behavior**

Run: `npm test -- src/lib/services/onboarding.test.ts src/features/onboarding`

Expected: PASS.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 7: Commit onboarding**

```bash
git add src/lib/repositories src/lib/services/onboarding.ts src/app/onboarding src/app/profile src/app/api/onboarding src/features/onboarding src/features/profile
git commit -m "feat: add onboarding and profiles"
```

### Task 6: Build Discovery And Private Profile Hiding

**Files:**
- Create: `src/lib/repositories/discovery.ts`
- Create: `src/lib/services/discovery.ts`
- Create: `src/app/discover/page.tsx`
- Create: `src/features/discovery/ProfileCard.tsx`
- Create: `src/features/discovery/DiscoveryBrowser.tsx`
- Create: `src/features/discovery/DiscoveryFilters.tsx`
- Create: `src/app/api/discovery/hide/route.ts`
- Create: `src/app/settings/hidden-profiles/page.tsx`
- Test: `src/lib/services/discovery.test.ts`
- Test: `src/features/discovery/DiscoveryBrowser.test.tsx`

- [ ] **Step 1: Write failing discovery-query tests**

Assert mutual preferences, age ranges, visibility, current-user exclusion, blocks, and discovery hides. Assert deterministic pagination ordering.

- [ ] **Step 2: Write failing interaction tests**

Desktop renders a card grid. Mobile controls have accessible Previous and Next profile labels. `Not for me` removes the profile without invoking block behavior.

- [ ] **Step 3: Run discovery tests and confirm failure**

Run: `npm test -- src/lib/services/discovery.test.ts src/features/discovery`

Expected: FAIL.

- [ ] **Step 4: Implement discovery repository and policy service**

Fetch a bounded candidate page, apply mutual private-preference checks server-side, remove block/hide pairs, and return only public profile fields.

- [ ] **Step 5: Implement responsive discovery UI**

Use grid browsing at wider breakpoints and a focused card with explicit navigation on mobile. Include View profile, Send a compliment, and Not for me actions. Do not bind horizontal swipe gestures.

- [ ] **Step 6: Implement hidden-profile settings**

List hidden profiles, restore one, or reset all after confirmation.

- [ ] **Step 7: Verify discovery**

Run: `npm test -- src/lib/services/discovery.test.ts src/features/discovery`

Expected: PASS.

- [ ] **Step 8: Commit discovery**

```bash
git add src/lib/repositories/discovery.ts src/lib/services/discovery.ts src/app/discover src/app/settings/hidden-profiles src/app/api/discovery src/features/discovery
git commit -m "feat: add considerate profile discovery"
```

### Task 7: Build Compliments, Inbox Decisions, And Match Creation

**Files:**
- Create: `src/lib/repositories/compliments.ts`
- Create: `src/lib/repositories/matches.ts`
- Create: `src/lib/services/compliments.ts`
- Create: `src/app/compliments/page.tsx`
- Create: `src/features/compliments/ComplimentComposer.tsx`
- Create: `src/features/compliments/ComplimentInbox.tsx`
- Create: `src/app/api/compliments/route.ts`
- Create: `src/app/api/compliments/[id]/decision/route.ts`
- Test: `src/lib/services/compliments.test.ts`
- Test: `src/features/compliments/ComplimentInbox.test.tsx`

- [ ] **Step 1: Write failing service tests**

Cover body validation, blocked/ineligible recipient rejection, duplicate submission keys, recipient-only decisions, private ignore behavior, report snapshots, and duplicate-match prevention.

- [ ] **Step 2: Run compliment tests and confirm failure**

Run: `npm test -- src/lib/services/compliments.test.ts src/features/compliments`

Expected: FAIL.

- [ ] **Step 3: Implement compliment creation and decision services**

Use authenticated route handlers. Acceptance must create or reuse the normalized participant match before marking the compliment accepted. Report decisions create immutable evidence and hide the compliment from the active inbox.

- [ ] **Step 4: Implement compliment composer and inbox**

Composer includes recipient context, custom text, character guidance, and no quota messaging. Inbox exposes Accept, Ignore, and Report with confirmations suited to each action.

- [ ] **Step 5: Verify compliment workflows**

Run: `npm test -- src/lib/services/compliments.test.ts src/features/compliments`

Expected: PASS.

Run: `npm run pb:check`

Expected: participant and recipient rule checks pass.

- [ ] **Step 6: Commit compliments**

```bash
git add src/lib/repositories/compliments.ts src/lib/repositories/matches.ts src/lib/services/compliments.ts src/app/compliments src/app/api/compliments src/features/compliments
git commit -m "feat: add compliments and matching"
```

### Task 8: Build Matches, Realtime Chat, Typing, And Read State

**Files:**
- Create: `src/lib/repositories/messages.ts`
- Create: `src/lib/services/chat.ts`
- Create: `src/lib/pocketbase/realtime.ts`
- Create: `src/app/matches/page.tsx`
- Create: `src/app/matches/[id]/page.tsx`
- Create: `src/features/chat/Conversation.tsx`
- Create: `src/features/chat/MessageComposer.tsx`
- Create: `src/features/chat/TypingIndicator.tsx`
- Create: `src/app/api/matches/[id]/messages/route.ts`
- Create: `src/app/api/matches/[id]/read/route.ts`
- Create: `src/app/api/matches/[id]/typing/route.ts`
- Test: `src/lib/services/chat.test.ts`
- Test: `src/features/chat/Conversation.test.tsx`

- [ ] **Step 1: Write failing chat authorization tests**

Reject nonparticipants, inactive matches, blocked pairs, blank messages, oversized messages, and forged sender IDs. Verify read timestamps and unread counts.

- [ ] **Step 2: Write failing realtime UI tests**

Test incoming message insertion, reconnect indicator, polling fallback, expiring typing state, and reduced-motion behavior.

- [ ] **Step 3: Run chat tests and confirm failure**

Run: `npm test -- src/lib/services/chat.test.ts src/features/chat`

Expected: FAIL.

- [ ] **Step 4: Implement chat services and endpoints**

Authorize every action against the match participants. Write server-derived sender IDs. Update read timestamps in batches. Upsert typing state with a short expiration.

- [ ] **Step 5: Implement match list and conversation UI**

Show active and ended matches, calm unread badges, message timeline, composer, typing indicator, read state, reconnect state, and empty conversation guidance.

- [ ] **Step 6: Verify chat**

Run: `npm test -- src/lib/services/chat.test.ts src/features/chat`

Expected: PASS.

- [ ] **Step 7: Commit chat**

```bash
git add src/lib/repositories/messages.ts src/lib/services/chat.ts src/lib/pocketbase/realtime.ts src/app/matches src/app/api/matches src/features/chat
git commit -m "feat: add realtime match chat"
```

### Task 9: Add Blocking, Reporting, Unmatching, And Account Controls

**Files:**
- Create: `src/lib/repositories/safety.ts`
- Create: `src/lib/services/safety.ts`
- Create: `src/features/safety/ReportDialog.tsx`
- Create: `src/features/safety/BlockDialog.tsx`
- Create: `src/features/safety/UnmatchDialog.tsx`
- Create: `src/app/api/safety/report/route.ts`
- Create: `src/app/api/safety/block/route.ts`
- Create: `src/app/api/matches/[id]/unmatch/route.ts`
- Create: `src/app/settings/page.tsx`
- Test: `src/lib/services/safety.test.ts`

- [ ] **Step 1: Write failing safety workflow tests**

Verify block pair uniqueness, immediate match closure, pending compliment hiding, message prevention, private reporter identity, evidence snapshots, and neutral unmatch state.

- [ ] **Step 2: Run safety tests and confirm failure**

Run: `npm test -- src/lib/services/safety.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement trusted safety workflows**

Perform ordered, idempotent updates through authenticated handlers. Never expose block ownership or reporter identity to the target. Preserve restricted evidence for moderation.

- [ ] **Step 4: Implement dialogs and account controls**

Add report entry points to profiles, compliments, and messages. Add block and unmatch confirmations. Settings support pause, deactivate, deletion request, session logout, and hidden-profile management.

- [ ] **Step 5: Verify safety**

Run: `npm test -- src/lib/services/safety.test.ts`

Expected: PASS.

Run: `npm run pb:check`

Expected: blocked users cannot create compliments or messages.

- [ ] **Step 6: Commit safety**

```bash
git add src/lib/repositories/safety.ts src/lib/services/safety.ts src/features/safety src/app/api/safety src/app/api/matches src/app/settings
git commit -m "feat: add relationship safety controls"
```

### Task 10: Build The Admin Moderation Console

**Files:**
- Create: `src/lib/repositories/moderation.ts`
- Create: `src/lib/services/moderation.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/reports/page.tsx`
- Create: `src/app/admin/users/[id]/page.tsx`
- Create: `src/features/admin/ReportQueue.tsx`
- Create: `src/features/admin/ModerationActionForm.tsx`
- Create: `src/app/api/admin/reports/[id]/route.ts`
- Create: `src/app/api/admin/users/[id]/action/route.ts`
- Test: `src/lib/services/moderation.test.ts`

- [ ] **Step 1: Write failing admin authorization and audit tests**

Reject nonadmins. Verify report resolution, content hide/restore, warning, suspension, unsuspension, account closure, date-of-birth correction, and immutable before/after audit records.

- [ ] **Step 2: Run moderation tests and confirm failure**

Run: `npm test -- src/lib/services/moderation.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement admin repositories and services**

Use server-only admin credentials after verifying the authenticated user's role. Every mutation writes a moderation action containing actor, target, reason, previous state, resulting state, and timestamp.

- [ ] **Step 4: Implement moderation pages**

Provide queue filters, report detail, evidence display, user history, confirmed actions, private notes, and clear action consequences. Never render admin links for ordinary users.

- [ ] **Step 5: Verify moderation**

Run: `npm test -- src/lib/services/moderation.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit moderation**

```bash
git add src/lib/repositories/moderation.ts src/lib/services/moderation.ts src/app/admin src/app/api/admin src/features/admin
git commit -m "feat: add moderation console"
```

### Task 11: Finish Marketing, Shared Shells, Policies, And Responsive Polish

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/layout/PublicHeader.tsx`
- Create: `src/components/layout/PublicFooter.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/ui/*`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/safety/page.tsx`
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Test: `src/components/layout/AppShell.test.tsx`

- [ ] **Step 1: Write failing shell accessibility tests**

Test landmarks, current navigation state, skip link, keyboard-visible menu, logout action, and mobile navigation labels.

- [ ] **Step 2: Run shell tests and confirm failure**

Run: `npm test -- src/components/layout`

Expected: FAIL.

- [ ] **Step 3: Build reusable UI primitives and shells**

Create typed variants for button, field, textarea, select, checkbox, card, badge, dialog, tabs, empty state, alert, avatar, skeleton, and status dot. Keep animation subtle and disable it under reduced motion.

- [ ] **Step 4: Finish the landing and policy pages**

Landing sections explain the compliment-first model, product principles, safety approach, and calls to action using real product copy. Policy pages clearly document age eligibility, reporting, privacy, and respectful behavior.

- [ ] **Step 5: Verify responsive and accessible presentation**

Run: `npm test -- src/components/layout src/app/page.test.tsx`

Expected: PASS.

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 6: Commit interface polish**

```bash
git add src/components src/app/page.tsx src/app/globals.css src/app/privacy src/app/terms src/app/safety src/app/loading.tsx src/app/error.tsx src/app/not-found.tsx
git commit -m "feat: complete Humble interface system"
```

### Task 12: Add End-To-End Tests, Deployment Configuration, And Documentation

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/auth-onboarding.spec.ts`
- Create: `tests/e2e/compliment-match-chat.spec.ts`
- Create: `tests/e2e/safety-moderation.spec.ts`
- Create: `open-next.config.ts`
- Create: `wrangler.jsonc`
- Create: `public/_headers`
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write browser tests for core flows**

Use seeded accounts to test login, onboarding publication, discovery navigation, Not for me restoration, sending and accepting a compliment, chat, reporting, blocking, unmatching, and report resolution by an admin.

- [ ] **Step 2: Run browser tests and fix only observed failures**

Run: `npm run dev:all`

In another shell run: `npm run test:e2e`

Expected: all core-flow tests pass.

- [ ] **Step 3: Add optional Cloudflare deployment configuration**

Keep `npm run build` as standard Next.js. Add separate `preview`, `deploy`, and `cf:typegen` scripts using OpenNext. Document that Cloudflare support is optional.

- [ ] **Step 4: Write complete local and hosted setup documentation**

Document prerequisites, commands, seeded credentials, environment variables, schema deployment, PocketBase persistence/backups, optional Cloudflare deployment, security notes, and troubleshooting.

- [ ] **Step 5: Run the complete verification suite**

Run: `npm run lint`

Run: `npm run typecheck`

Run: `npm test`

Run: `npm run build`

Run: `npm run pb:check`

Run: `npm run test:e2e`

Expected: every command exits successfully.

- [ ] **Step 6: Confirm clean setup idempotency**

Move the existing `.pocketbase` runtime aside, run `npm run local:setup` twice, and verify the second run updates rather than duplicates seed records. Restore the prior runtime only if needed for retained local work.

- [ ] **Step 7: Commit deployment and verification assets**

```bash
git add README.md package.json package-lock.json playwright.config.ts tests open-next.config.ts wrangler.jsonc public/_headers
git commit -m "docs: add deployment and end-to-end verification"
```

### Task 13: Final Review And Release Readiness

**Files:**
- Modify only files required by observed review findings.

- [ ] **Step 1: Review every design requirement against the implementation**

Confirm landing, auth, profiles, discovery, compliments, inbox, matches, chat, safety, moderation, local PocketBase, deployment portability, responsive design, and prohibited engagement mechanics.

- [ ] **Step 2: Inspect the production diff and repository status**

Run: `git status --short`

Run: `git diff --check`

Run: `git log --oneline --decorate -15`

Expected: no unintended files, no whitespace errors, and focused commits.

- [ ] **Step 3: Run final verification from fresh processes**

Run: `npm run lint && npm run typecheck && npm test && npm run build && npm run pb:check`

Expected: exit code 0.

- [ ] **Step 4: Record known MVP exclusions**

Ensure the README names video, voice, social login, push notifications, precise distance, algorithmic ranking, payments, and native apps as deliberate exclusions rather than missing work.

- [ ] **Step 5: Commit final review fixes**

```bash
git add .
git commit -m "chore: prepare Humble MVP for local use"
```
