# Contributing

Thank you for helping improve this boilerplate.

## Setup

1. Create a repository from the template and clone it.
2. Install dependencies:

   ```bash
   bun install
   ```

3. Copy `.env.example` to `.env` and configure your Supabase project.
4. Start the development server:

   ```bash
   bun run dev
   ```

If your change needs database updates, export `SUPABASE_PROJECT_REF` in your shell and use `bun run db:link`, `bun run db:push`, and `bun run db:new <migration_name>` as appropriate.

## Branches

Create a focused branch from the latest default branch. Use a short, descriptive name such as `feature/add-filter` or `fix/empty-title`.

## Before opening a pull request

Run both checks locally:

```bash
bun run check
bun run build
```

Review the diff, update documentation when behavior or setup changes, and include a concise description of what changed and how it was tested.

## Commit style

Use simple, imperative commit messages that describe one focused change, for example:

- `Add template setup instructions`
- `Fix empty todo validation`
- `Update deployment documentation`

Keep commits small and avoid unrelated changes.
