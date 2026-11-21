<script lang="ts">
	import type { Todo } from '$lib/db/types';
	import TodoItem from './TodoItem.svelte';

	let { todos, filter }: { todos: Todo[]; filter: string } = $props();

	const emptyMessages: Record<string, string> = {
		all: 'No todos yet. Add your first item above.',
		active: 'You have no active todos. Nice work!',
		completed: 'No completed todos yet.'
	};
</script>

{#if todos.length === 0}
	<p class="empty" data-testid="empty-state">{emptyMessages[filter] ?? emptyMessages.all}</p>
{:else}
	<ul data-testid="todo-list" aria-label="Todo list">
		{#each todos as todo (todo.id)}
			<TodoItem {todo} {filter} />
		{/each}
	</ul>
{/if}

<style>
	ul {
		display: grid;
		gap: 0.55rem;
		padding: 0;
		margin: 1rem 0 0;
		list-style: none;
	}

	.empty {
		padding: 2rem 1rem;
		margin: 1rem 0 0;
		border: 1px dashed var(--border);
		border-radius: 0.7rem;
		color: var(--muted);
		text-align: center;
	}
</style>
