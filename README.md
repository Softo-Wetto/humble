# Humble

Humble is a compliment-first dating application designed around deliberate profiles, sincere introductions, calm conversations, and strong safety controls. It does not use swipe decisions, compliment credits, artificial limits, streaks, or urgency loops.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- PocketBase authentication, records, files, and realtime subscriptions
- Vitest and Testing Library
- Playwright for local browser-flow verification

## Local Setup

Use Node.js 22.12+ LTS or Node.js 24+. Node.js 23 is not supported by the current test dependencies.

```powershell
npm install
npm run local:setup
npm run test:e2e:install
npm run dev
```

Open `http://localhost:3000`. The local PocketBase API and dashboard run at `http://127.0.0.1:8090` and `http://127.0.0.1:8090/_/`.

`npm run local:setup` is idempotent. It downloads PocketBase `v0.39.3` for the current operating system, creates the schema, and seeds adult demo accounts.

### Local Accounts

All seeded member accounts use this password:

```text
HumbleLocal123!
```

Member emails include:

```text
maya@humble.local
theo@humble.local
imani@humble.local
alex@humble.local
sam@humble.local
nina@humble.local
```

The seeded moderation account is:

```text
admin-member@humble.local
```

PocketBase superuser credentials are defined in `.env.local` and are intended only for the local machine. Change them before exposing PocketBase beyond localhost.

## Useful Commands

```powershell
npm run dev          # PocketBase and Next.js together
npm run dev:web      # Next.js only
npm run pb:start     # PocketBase only
npm run dev:all      # Compatibility alias for npm run dev
npm run local:setup  # Install/update schema and seed data
npm run pb:check     # Verify a running PocketBase instance
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Data Boundaries

PocketBase record rules are the primary authorization boundary.

- `users` contains private birth date, role, onboarding, and account state.
- `preferences` contains private dating and age preferences.
- `profiles` contains only public presentation fields.
- Trusted Next.js route handlers own multi-record actions such as accepting compliments, blocking, reporting, and moderation.
- Reports snapshot evidence so later edits cannot remove moderation context.
- Blocking and reporting do not reveal the actor to the target user.

Local PocketBase files and data live under `.pocketbase/` and are ignored by Git.

## Hosted PocketBase

1. Provision PocketBase `v0.39.3` or a tested compatible version with HTTPS and persistent storage.
2. Configure `POCKETBASE_URL`, `NEXT_PUBLIC_POCKETBASE_URL`, `POCKETBASE_SUPERUSER_EMAIL`, and `POCKETBASE_SUPERUSER_PASSWORD` in the deployment environment.
3. Run `npm run pb:setup` against the hosted API.
4. Do not run `npm run pb:seed` in production unless demo data is explicitly required.
5. Configure the PocketBase allowed origins for the deployed frontend.
6. Back up `pb_data` and uploaded files, and test restoration regularly.

The frontend uses standard Next.js APIs and can deploy to a compatible Node host.

### Optional Cloudflare Workers Deployment

OpenNext configuration is included, but Cloudflare is not required for local development or a standard Node deployment.

1. Create a Cloudflare Worker and set the public and server PocketBase URLs plus `HUMBLE_SESSION_SECRET` as Worker secrets or variables.
2. Keep PocketBase on a separate HTTPS host with persistent storage and its superuser credentials available only to trusted server code.
3. Run `npm run preview` to build and test in the local Workers runtime.
4. Run `npm run deploy` to build and deploy, or `npm run upload` to upload a version without promoting it.
5. Run `npm run cf:typegen` after adding Cloudflare bindings.

The checked-in `wrangler.jsonc` uses the required Node.js compatibility flags. Add R2 or other bindings only when the application begins using them.

## Production Checklist

- Replace all local superuser credentials.
- Configure PocketBase HTTPS and allowed origins.
- Configure outbound email for verification and account recovery.
- Add infrastructure-level rate limiting for auth, compliments, messages, and reports.
- Configure file size limits, malware scanning, backups, and retention.
- Review privacy, terms, safety, and deletion-retention language with qualified counsel.
- Run every verification command against the deployment candidate.

## Deliberate MVP Exclusions

The first release does not include video profiles, voice notes, social login, push notifications, precise distance tracking, algorithmic popularity ranking, subscriptions, payments, or native mobile applications.
