# One-Command Local Startup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `npm run dev` start both Humble services while preserving focused service commands.

**Architecture:** Use the existing `concurrently` dependency as the process supervisor. Keep Playwright on a frontend-only script because it owns its PocketBase test process.

**Tech Stack:** npm scripts, concurrently, Node test runner, Playwright, Next.js, PocketBase

---

### Task 1: Define And Implement The Startup Contract

**Files:**
- Create: `scripts/tests/startup-scripts.test.mjs`
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Modify: `README.md`

- [ ] **Step 1: Add a failing package-script test**

Assert that `dev` supervises `pb:start` and `dev:web`, `dev:web` runs `next dev`, and `dev:all` aliases `dev`.

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test scripts/tests/startup-scripts.test.mjs`

- [ ] **Step 3: Update scripts and Playwright**

Set `dev` to the combined command, add `dev:web`, alias `dev:all`, and point Playwright's Next.js web server at `dev:web`.

- [ ] **Step 4: Update startup documentation**

Make `npm run dev` the documented normal command and retain backend/frontend-only commands as troubleshooting tools.

- [ ] **Step 5: Verify scripts and live startup**

Run the script test, unit tests, lint, and typecheck. Start `npm run dev`, then verify HTTP responses from ports 3000 and 8090 before stopping the process tree.
