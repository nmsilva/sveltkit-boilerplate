# Code conventions

## Svelte 5

- State: `let x = $state(...)`; derived: `$derived(...)` or `$derived.by(...)`; effects: `$effect` only for side effects (never to compute values).
- Props: `let { title, onsave }: Props = $props();` with a `type Props`. No `export let`.
- Events are attributes (`onclick={...}`), not `on:click`. Content goes through snippets and `{@render children()}`, not `<slot>`.
- Callback props replace `createEventDispatcher`.
- Shared reactive state across components: a `.svelte.ts` module exporting runes-based state, not legacy stores.
- Example: `src/lib/components/TodoItem.svelte`, `src/routes/+layout.svelte`.

## TypeScript

- Strict mode is on (`tsconfig.json`). No `any`; prefer `unknown` plus narrowing. Use `import type` for types.
- Use `$lib/...` aliases for code under `src/lib`.
- Name types in `PascalCase`, files in `kebab-case` (components in `PascalCase.svelte`), tests as `*.test.ts` next to the code.

## Style

- Prettier and ESLint are authoritative: run `bun run format` and `bun run lint`.
- Write code, comments and commit messages in English. Keep user-facing strings consistent with the existing UI.
- Forms use progressive enhancement; keep the `data-testid` selectors listed in the README intact.
