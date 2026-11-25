# AGENTS.md

Single source of truth for coding agents (Claude Code, pi, opencode, Codex, ...). `CLAUDE.md` only imports this file. Details live in [`docs/`](docs/); keep this file short.

## Stack and commands

SvelteKit 2, Svelte 5, TypeScript, Bun, Netlify adapter. Persistence is swappable (Supabase, Turso, memory) behind `src/lib/db`.

```bash
bun install          # install dependencies
bun run dev          # dev server
bun run check        # svelte-kit sync + svelte-check (types)
bun run lint         # ESLint
bun run format:check # Prettier (use `bun run format` to fix)
bun test             # unit tests (bun test)
bun run build        # production build
bun run test:e2e     # Playwright (needs `bunx playwright install chromium`)
bun run db:new <name> # new Supabase migration (db:link / db:push need SUPABASE_PROJECT_REF)
```

Before handing work over run `bun run lint`, `bun run format:check`, `bun run check`, `bun test` and `bun run build` (see [docs/testing.md](docs/testing.md)).

## Layout and where new code goes

- `src/routes/`: thin routes only (load, form actions, markup). No data access or business logic here.
- `src/lib/db/`: data access. `types.ts` (domain types and `TodoRepository`), `active.ts` (provider selection), `adapters/<provider>/`.
- `src/lib/components/`: shared Svelte components.
- `src/lib/features/<name>/` (create on first use): code of a feature (components, server logic, types). See [docs/architecture.md](docs/architecture.md).
- `supabase/migrations/`: SQL migrations. `scripts/`: setup CLI. `e2e/`: Playwright tests.
- `docs/`: detailed rules. `openspec/`: optional specs. `.agents/skills/`: agent skills (`.claude/skills` links to it).

## Rules

- Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`, snippets, `onclick`). No `export let`, `$:`, stores for local state, `on:` directives or slots. See [docs/conventions.md](docs/conventions.md).
- TypeScript everywhere, no `any`; keep types next to the code that owns them.
- Supabase (and any database) is accessed only through `src/lib/db/` adapters, never from routes or components. Never import server-only code in client code.
- Migrations: [docs/database.md](docs/database.md). Add new files in `supabase/migrations/`; never edit an applied migration.
- Do not change existing behaviour without being asked; keep changes focused and small.

## Do not

- Commit secrets or touch `.env` (only `.env.example` is tracked). `PUBLIC_*` variables reach the browser.
- Edit or delete existing migrations, push to `main`, or add dependencies without a reason stated in the PR.
- Edit generated output (`.svelte-kit/`, `build/`, `.netlify/`).
- Run `bun run setup` on this repo: it deletes the unchosen provider's files.
- Invent commands: only use scripts that exist in `package.json`.

## Git and PRs

Branch from `main` as `feature/...`, `fix/...` or `agente/...`. Use Conventional Commits for commits and PR titles (see `CONTRIBUTING.md`) and the PR template.

## OpenSpec (optional)

Use [OpenSpec](docs/openspec.md) for large changes or changes that alter behaviour (new feature, data model change, API change). Skip it for small fixes, refactors and doc tweaks.

## Skills

In `.agents/skills/`: `new-feature`, `new-supabase-migration`, `new-svelte5-component`, `write-spec`, `review-pr`.
