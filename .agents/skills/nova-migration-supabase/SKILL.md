---
name: nova-migration-supabase
description: Create a Supabase migration and update the matching types and adapter. Use for any database schema change.
---

# Nova migration Supabase

Read `docs/database.md` first.

1. Run `bun run db:new <snake_case_name>`. It creates a file in `supabase/migrations/` (needs the Supabase CLI). If the CLI is unavailable, create the file by hand following the existing numbering/naming and say so in the PR.
2. Write idempotent SQL like `supabase/migrations/0001_create_todos.sql`. Never edit existing migrations.
3. Update the types (`src/lib/db/types.ts`), the adapter (`src/lib/db/adapters/supabase/index.ts`), the Turso schema and the tests accordingly.
4. Do not run `bun run db:push` or `db:link` unless asked; no secrets or `.env` changes.
5. Verify: `bun run check`, `bun test`, `bun run build`.
