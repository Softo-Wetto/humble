# Humble One-Command Local Startup Design

## Goal

Make `npm run dev` the single command for starting both the Next.js application and local PocketBase backend.

## Design

- `npm run dev` runs PocketBase and Next.js together through `concurrently`.
- `npm run dev:web` starts Next.js alone for tooling and focused frontend debugging.
- `npm run pb:start` remains the backend-only command.
- `npm run dev:all` remains as a compatibility alias to `npm run dev`.
- Playwright uses `dev:web` because its configuration already starts PocketBase separately.
- The README presents `npm run dev` as the normal local startup command.

## Verification

A Node test verifies the script contract. Runtime verification confirms the app responds on port 3000 and PocketBase responds on port 8090 from one `npm run dev` process.
