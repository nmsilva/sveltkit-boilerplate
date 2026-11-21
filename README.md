# SvelteKit + Supabase/Turso + Netlify Boilerplate

A small SvelteKit TODO application with swappable persistence (Supabase, Turso, or an in-memory demo provider) and Netlify deployment. Use it as a starting point for a full-stack web project.

## Quick start

Get the app running locally in about five minutes:

```bash
bun install
bun run setup   # pick a provider, or use memory for a zero-configuration demo
bun run dev
```

Open the local URL printed by Vite. If no database credentials are configured, the app automatically uses the memory provider. Before the TODO list can persist data, add your Supabase project values to `.env` and apply the database migration:

```bash
bun run db:link
bun run db:push
```

The `db:link` command reads `SUPABASE_PROJECT_REF` from your shell environment (it is not read from `.env`). Run it as `SUPABASE_PROJECT_REF=<your-project-ref> bun run db:link`, or export the variable first. See [Environment variables](#environment-variables) for details.

## Choose a storage provider (`bun run setup`)

The app talks to a small `TodoRepository` interface (`src/lib/db`), with one adapter per provider in `src/lib/db/adapters/<provider>`. Supported providers are **Supabase**, **Turso (libSQL)**, and **Memory (demo)**.

```bash
bun install
bun run setup                              # interactive prompts
bun run setup --provider turso --yes       # non-interactive
bun run setup --provider memory --yes      # zero-configuration demo
```

Flags: `--provider <supabase|turso|memory>`, `--yes` (no prompts, never overwrites an existing `.env`), `--dry-run` (print what would change), `--no-install` (skip `bun install`). If no provider is specified, setup defaults to memory when no database credentials are present.

The command keeps only the chosen adapter, removes the other adapter and the dependencies and scripts it does not use, writes `src/lib/db/active.ts`, generates `.env` from `.env.example` (only the chosen provider's variables) and prints or runs the schema step:

- **Turso**: set `TURSO_DATABASE_URL` (and `TURSO_AUTH_TOKEN` for remote databases; a local `file:` URL such as `file:local.db` needs no token). If the URL is set when you run setup, the schema is applied automatically; otherwise run `bun src/lib/db/adapters/turso/migrate.ts`.
- **Supabase**: run `SUPABASE_PROJECT_REF=<ref> bun run db:link` and `bun run db:push`.

`.env` is git-ignored. Setup is destructive for the unchosen provider's files, so run it once on a fresh clone and commit the result.

## Connect a database

The memory provider keeps data in the server process and resets when the process restarts. It is useful for trying the app without credentials, but it is not a production datastore. In serverless deployments, memory is local to each function instance, so data is not shared between instances. Choose Supabase or Turso with `bun run setup` when you need durable, shared data.

### Adding a new adapter

1. Create `src/lib/db/adapters/<provider>/index.ts` exporting `createTodoRepository(): TodoRepository` (see `src/lib/db/types.ts`), plus its schema or migration and tests.
2. Add a `# >>> provider: <id>` ... `# <<< provider: <id>` section with its variables to `.env.example`.
3. Add an entry to `scripts/providers.ts` (adapter directory, dependencies, paths and scripts to remove when it is not chosen, schema steps). Also add the new provider's adapter directory and dependencies to the other providers' removal lists.
4. Run `bun test`.

## Use this template

[![Use this template](https://img.shields.io/badge/GitHub-Use%20this%20template-2ea44f?logo=github)](https://github.com/nmsilva/sveltkit-boilerplate/generate)

1. Select **Use this template** on GitHub.
2. Name your new repository and create it.
3. Clone your repository and run the [quick start](#quick-start).
4. Create a Supabase project and configure the environment variables.

## Prerequisites

- [Bun](https://bun.sh/) 1.2 or later
- A [Supabase](https://supabase.com/) project
- A [Netlify](https://www.netlify.com/) account for deployment
- The Supabase CLI for database commands ([installation guide](https://supabase.com/docs/guides/cli))

## Environment variables

Copy `.env.example` to `.env` and replace the placeholders with values from your Supabase project. In the Supabase dashboard, open **Project Settings > API** to find the project URL and publishable anon key. You can also leave database variables empty: the app then runs in memory demo mode.

| Variable | Required | Description |
| --- | --- | --- |
| `PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL, available under **Project Settings > API**. |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | The public anonymous key for your Supabase project, available under **Project Settings > API**. |
| `SUPABASE_PROJECT_REF` | For `bun run db:link` | The project reference (the `<ref>` in `https://<ref>.supabase.co`). Set it in your shell, not in `.env`: `SUPABASE_PROJECT_REF=<ref> bun run db:link`. |

`PUBLIC_` variables are exposed to the browser. Do not put service-role keys, passwords, or other secrets in them. Never commit `.env`.

## Database

The initial migration is in `supabase/migrations/0001_create_todos.sql`. Link the local repository to your Supabase project, push migrations, and create future migrations with:

```bash
bun run db:link
bun run db:push
bun run db:new <migration_name>
```

After creating a migration, edit the generated file and run `bun run db:push` to apply it.

## Deploy to Netlify

1. Push your repository to GitHub.
2. In Netlify, choose **Add new site > Import an existing project** and select the repository.
3. Use `bun run build` as the build command. The included `netlify.toml` already configures this and pins the Bun version.
4. In the Netlify site settings, add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` under **Environment variables**.
5. Deploy the site.

Run database migrations separately with the Supabase CLI. Netlify deployment does not automatically run `bun run db:push`.

## UI test selectors

The TODO page exposes stable selectors for browser and integration tests:

| Selector | Element |
| --- | --- |
| `todo-form` | New todo form |
| `todo-input` | New todo title input |
| `todo-submit` | Add todo button |
| `todo-error` | Create validation error |
| `todo-list` | Todo list |
| `todo-item` | Individual todo item |
| `todo-checkbox` | Todo completion checkbox |
| `todo-delete` | Todo delete/confirmation button |
| `filter-all` | All filter link |
| `filter-active` | Active filter link |
| `filter-completed` | Completed filter link |
| `todo-count` | Active todo count |
| `clear-completed` | Clear completed button |
| `empty-state` | Empty list message |
| `demo-notice` | In-memory demo notice |

Delete uses a two-click confirmation when JavaScript is enabled. Without JavaScript, the regular form submission deletes immediately so the action remains usable.

## Verification

Use these commands before sharing a change:

```bash
bun run check
bun run build
bun test
```

## Troubleshooting

### The app cannot connect to Supabase

Check that `.env` exists, the variable names are exact, and the values come from **Project Settings > API**. Restart `bun run dev` after changing environment variables.

### `bun run db:link` cannot find the project reference

Export `SUPABASE_PROJECT_REF` in your shell (or prefix the command with it); `.env` is not read by this script. Then run the command again. Also make sure you have authenticated with the Supabase CLI.

### Database queries fail or the TODO list is empty

Run `bun run db:push` after linking the correct project. Confirm that the `todos` table exists in the Supabase Table Editor.

### Netlify builds fail

Confirm that the two `PUBLIC_SUPABASE_*` variables are configured for the deployment context, then retry the deploy. Run `bun run check` and `bun run build` locally to identify code or type errors first.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, branch conventions, and pull request expectations.

## License

This project is available under the [MIT License](LICENSE).
