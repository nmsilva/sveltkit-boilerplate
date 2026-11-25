# OpenSpec (optional)

[OpenSpec](https://github.com/Fission-AI/OpenSpec) keeps change proposals and specs in `openspec/` so humans and agents agree on what to build before coding.

**Use it** for large changes or changes that alter behaviour (new feature, data model or API change). **Skip it** for small fixes, refactors, dependency bumps and docs.

## Layout

```text
openspec/
  config.yaml        # schema and project context for agents
  specs/             # current specs, one folder per capability
  changes/           # open changes: proposal, design, tasks, spec deltas
  changes/archive/   # finished changes
```

It was created with `bunx @fission-ai/openspec init --tools none`. The CLI is not a project dependency; run it with `bunx @fission-ai/openspec <command>` (or install it globally).

## Flow

1. **Propose**: create `openspec/changes/<change-name>/` with `proposal.md` (why, what, impact), `tasks.md` (checklist), optional `design.md`, and spec deltas under `specs/<capability>/spec.md`. Use the `escrever-spec` skill. Check with `openspec validate <change-name>` and list with `openspec list`.
2. **Apply**: implement the tasks in order, ticking them in `tasks.md`, following [conventions](conventions.md) and [testing](testing.md).
3. **Archive**: after merge run `openspec archive <change-name>`; it moves the change to `changes/archive/` and updates `specs/`.

Run `bunx @fission-ai/openspec --help` for the commands available in your version.
