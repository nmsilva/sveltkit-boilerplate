# Architecture and scaling

## Today

A single TODO page. `src/routes/+page.server.ts` validates input and calls `createTodoRepository()` from `$lib/db`; `src/routes/+page.svelte` renders it with components from `src/lib/components/`. The provider (Supabase, Turso or memory) is chosen at runtime by `src/lib/db/active.ts`; each adapter in `src/lib/db/adapters/<provider>/` implements `TodoRepository` from `src/lib/db/types.ts`.

## Growing the project: feature folders

Group code by feature, not by file type, once the app has more than the TODO page:

```text
src/lib/features/<name>/
  components/   # Svelte components used only by this feature
  server/       # server-only logic and data access (never imported by client code)
  types.ts      # domain types
  index.ts      # public API of the feature
```

Rules:

- Routes stay thin: parse the request, call the feature, return data or `fail()`/`redirect()`. A route folder holds only `+page*`, `+layout*`, `+server.ts` and tiny route-specific parts.
- Shared UI that is not feature specific stays in `src/lib/components/`.
- Features import from other features only through their `index.ts`.
- Server code lives in `server/` folders or in `*.server.ts` files (SvelteKit blocks them from the client). Anything under `$lib/server/` is also server-only.
- Existing TODO code may stay where it is; move it into `src/lib/features/todos/` only when asked.

## Data and Supabase types

- Data access goes through a repository interface in `types.ts` plus one adapter per provider, as in `src/lib/db`. Routes and components never call `@supabase/supabase-js` directly.
- Domain types mirror the tables (see `Todo` in `src/lib/db/types.ts` and `supabase/migrations/0001_create_todos.sql`). Update the type in the same change as the migration.
- Generated Supabase types are not set up in this repo. If you add them (`supabase gen types`), commit the generated file in the feature's `types` area and document the command in `package.json`.

## Client/server separation

- Environment variables: `PUBLIC_*` may reach the browser; everything else is server-only.
- Mutations use SvelteKit form actions (see `src/routes/+page.server.ts`), which keep working without JavaScript.
- Validate all input on the server, even if the client also validates.
