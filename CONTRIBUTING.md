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

Run all CI checks locally:

```bash
bun run lint
bun run format:check
bun run check
bun test
bun run build
```

Use `bun run format` to format files before checking them.

Run the end-to-end tests without credentials by installing Chromium and selecting a backend:

```bash
bunx playwright install chromium
bun run test:e2e                         # memory backend by default
E2E_BACKEND=memory bun run test:e2e
E2E_BACKEND=turso-file bun run test:e2e
E2E_BACKEND=turso-file bun run test:e2e:ui
```

The Turso file backend creates a temporary database and applies `src/lib/db/adapters/turso/schema.sql` before the preview server starts.

Review the diff, update documentation when behavior or setup changes, and include a concise description of what changed and how it was tested.

## Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for commits and pull request titles. The title check accepts a type such as `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, or `perf`, optionally followed by a scope, a colon, and a short description:

```text
feat(auth): add password reset
fix: handle an empty todo title
```

Use `!` after the type or scope for a breaking change, or explain it with a `BREAKING CHANGE:` footer. Keep commits small, focused, and written in English.

## Repository automation

The repository uses GitHub Actions and Dependabot for routine maintenance:

- **Release Please** opens a release pull request containing the changes for `CHANGELOG.md`. Merging that release pull request creates the version tag and GitHub Release.
- **Dependabot** checks the Bun dependencies and GitHub Actions weekly. Minor and patch updates are grouped per ecosystem and eligible Dependabot pull requests are automatically merged with squash after required checks pass. Major updates remain for manual review. Dependabot titles use the `chore(deps)` and `ci(deps)` prefixes so they pass the title check.
- **Stale** marks issues and pull requests stale after 60 days of inactivity and closes them 14 days later. Items labeled `pinned`, `security`, or `keep-open` are exempt.
- **Labeler** applies labels based on changed files, including `docs`, `ci`, `dependencies`, `frontend`, `database`, `scripts`, and `tests`.
- Pull request titles are validated as Conventional Commits.

The following GitHub settings must be enabled manually; this repository does not change settings:

- **Settings > General > Allow auto-merge**.
- A branch protection rule or ruleset on `main` requiring the status checks that exist once CI is added, plus the `pr-title` check. Require pull request review as desired.
- **Actions > General > Workflow permissions > Allow GitHub Actions to create and approve pull requests**, which is needed by Release Please.
- Optionally create the `pinned`, `security`, `dependencies`, and labeler labels (`docs`, `ci`, `frontend`, `database`, `scripts`, and `tests`).

Once a CI workflow exists, require `bun run check`, `bun run build`, and `bun test` as status checks.
