---
name: write-spec
description: Write an OpenSpec change proposal (proposal, tasks, spec deltas) for large or behaviour-changing work.
---

# Escrever spec

Read `docs/openspec.md`. Only for large changes or changes that alter behaviour.

1. Pick a kebab-case change name and create `openspec/changes/<change-name>/`.
2. `proposal.md`: why, what changes, impact (code areas such as `src/routes/`, `src/lib/db/`, `supabase/migrations/`), and what is out of scope.
3. `tasks.md`: small checklist items (`- [ ] ...`) in implementation order, including tests and docs.
4. `specs/<capability>/spec.md`: requirements as ADDED/MODIFIED/REMOVED deltas, each with at least one scenario. Look at `openspec/specs/` for existing capabilities.
5. Add `design.md` only if there are real trade-offs.
6. Validate: `bunx @fission-ai/openspec validate <change-name>`. Do not implement before the proposal is agreed.
