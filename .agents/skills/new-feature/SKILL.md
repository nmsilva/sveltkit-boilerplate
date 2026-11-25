---
name: new-feature
description: Add a new feature (route, feature module and types) following this repo's architecture. Use when asked to add functionality beyond a small fix.
---

# Nova feature

Read `docs/architecture.md` and `docs/conventions.md` first.

1. Decide if it needs a spec (`docs/openspec.md`); if so use `write-spec` first.
2. Create `src/lib/features/<name>/` with `types.ts`, `index.ts`, and `components/` or `server/` as needed. Data access goes through a repository interface and adapter like `src/lib/db/types.ts` and `src/lib/db/adapters/`.
3. If it needs storage, add a migration with `new-supabase-migration` and keep the Turso schema (`src/lib/db/adapters/turso/schema.sql`) in sync.
4. Add the route under `src/routes/<path>/` (`+page.server.ts` with load/actions, `+page.svelte`). Keep it thin; model it on `src/routes/+page.server.ts`.
5. Build components with `new-svelte5-component`.
6. Add `*.test.ts` next to the logic (example: `src/lib/db/adapters/memory/index.test.ts`).
7. Verify: `bun run lint`, `bun run check`, `bun test`, `bun run build`.
