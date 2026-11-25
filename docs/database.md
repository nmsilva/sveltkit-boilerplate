# Database and migrations

The Supabase schema lives in `supabase/migrations/` (today `0001_create_todos.sql`). Application code reaches the database only through `src/lib/db/` (see [architecture](architecture.md)); the Supabase adapter is `src/lib/db/adapters/supabase/index.ts`.

## Rules

- Create migrations with `bun run db:new <snake_case_name>` (wraps `supabase migration new`), then edit the generated SQL file.
- Never edit, rename or delete a migration that was already applied or merged. Fix mistakes with a new migration.
- One purpose per migration; write idempotent SQL where practical (`if not exists`), as in `0001_create_todos.sql`.
- Update the matching TypeScript types and adapter in the same PR as the migration.
- Applying: `SUPABASE_PROJECT_REF=<ref> bun run db:link`, then `bun run db:push`. Agents must not run `db:push` against a real project without being asked.
- Never write secrets, keys or project refs into migrations or docs. Do not touch `.env`; use `.env.example` for new variable names.
- The Turso schema (`src/lib/db/adapters/turso/schema.sql`) is separate; keep it in sync if the model changes.
