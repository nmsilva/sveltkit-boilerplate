# SvelteKit + Supabase + Netlify Boilerplate

A small SvelteKit TODO application with Supabase persistence and Netlify deployment. Use it as a starting point for a full-stack web project.

## Quick start

Get the app running locally in about five minutes:

```bash
bun install
cp .env.example .env
bun run dev
```

Open the local URL printed by Vite. Before the TODO list can persist data, add your Supabase project values to `.env` and apply the database migration:

```bash
bun run db:link
bun run db:push
```

The `db:link` command reads `SUPABASE_PROJECT_REF` from your environment. Set it in `.env` before running the command, or export it in your shell. See [Environment variables](#environment-variables) for details.

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

Copy `.env.example` to `.env` and replace the placeholders with values from your Supabase project. In the Supabase dashboard, open **Project Settings > API** to find the project URL and publishable anon key.

| Variable | Required | Description |
| --- | --- | --- |
| `PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL, available under **Project Settings > API**. |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | The public anonymous key for your Supabase project, available under **Project Settings > API**. |
| `SUPABASE_PROJECT_REF` | For database commands | The project reference used by `bun run db:link`. It is the project identifier in your Supabase URL and dashboard. |

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

## Verification

Use these commands before sharing a change:

```bash
bun run check
bun run build
```

## Troubleshooting

### The app cannot connect to Supabase

Check that `.env` exists, the variable names are exact, and the values come from **Project Settings > API**. Restart `bun run dev` after changing environment variables.

### `bun run db:link` cannot find the project reference

Set `SUPABASE_PROJECT_REF` in `.env` or export it in your shell, then run the command again. Also make sure you have authenticated with the Supabase CLI.

### Database queries fail or the TODO list is empty

Run `bun run db:push` after linking the correct project. Confirm that the `todos` table exists in the Supabase Table Editor.

### Netlify builds fail

Confirm that the two `PUBLIC_SUPABASE_*` variables are configured for the deployment context, then retry the deploy. Run `bun run check` and `bun run build` locally to identify code or type errors first.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, branch conventions, and pull request expectations.

## License

This project is available under the [MIT License](LICENSE).
