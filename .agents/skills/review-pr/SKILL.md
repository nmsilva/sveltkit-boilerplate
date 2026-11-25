---
name: review-pr
description: Review a pull request or diff against this repo's rules with a checklist. Use before marking a PR ready.
---

# Rever PR

Read the full diff (`git diff main...HEAD`) and check:

- [ ] Scope: focused, no unrelated files, matches the PR description and any OpenSpec change.
- [ ] Svelte 5 runes only; no `any`; types updated (`docs/conventions.md`).
- [ ] Routes thin; data access only via `src/lib/db/` or a feature module; no server code in client code.
- [ ] Migrations: new file only, existing ones untouched; types, adapters and Turso schema updated (`docs/database.md`).
- [ ] No secrets, no `.env`, no `PUBLIC_` variable holding a secret; dependencies justified.
- [ ] Tests added or updated; `data-testid` selectors kept.
- [ ] `bun run lint`, `bun run format:check`, `bun run check`, `bun test`, `bun run build` pass.
- [ ] Docs updated if behaviour or setup changed; PR title is a Conventional Commit.

Report findings by severity (high, medium, low) with file and line.
