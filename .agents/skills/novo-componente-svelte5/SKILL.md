---
name: novo-componente-svelte5
description: Create a Svelte 5 component with runes (props, state, snippets, event attributes). Use when adding or changing UI components.
---

# Novo componente Svelte 5

Read `docs/conventions.md`. Examples: `src/lib/components/TodoItem.svelte`, `TodoForm.svelte`, `TodoList.svelte`.

1. Place it in `src/lib/components/` (shared) or `src/lib/features/<name>/components/` (feature-only), named `PascalCase.svelte`.
2. Use `<script lang="ts">`, `type Props` and `let { ... }: Props = $props();`.
3. Use `$state`, `$derived`, events as attributes (`onclick`), callback props, snippets (`{@render ...}`). Never `export let`, `$:`, `on:` or `<slot>`.
4. Forms: use SvelteKit actions with `use:enhance` as progressive enhancement; keep or add `data-testid` attributes.
5. Verify: `bun run lint`, `bun run format:check`, `bun run check`, `bun run build`.
