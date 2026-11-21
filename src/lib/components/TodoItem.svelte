<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Todo } from '$lib/db/types';

	let { todo, filter }: { todo: Todo; filter: string } = $props();
	const initialDone = todo.is_done;
	let isDone = $state(initialDone);
	let deleted = $state(false);
	let confirming = $state(false);
	let error = $state('');
	let toggleForm = $state<HTMLFormElement>();
	let deleteForm = $state<HTMLFormElement>();
	let checkbox = $state<HTMLInputElement>();
	let confirmationTimer: ReturnType<typeof setTimeout>;

	function askToDelete(event: MouseEvent) {
		if (!confirming) {
			event.preventDefault();
			confirming = true;
			clearTimeout(confirmationTimer);
			confirmationTimer = setTimeout(() => (confirming = false), 4000);
		}
	}
</script>

{#if !deleted}
	<li class="todo-item" data-testid="todo-item">
		<form
			bind:this={toggleForm}
			method="POST"
			action={`?/toggle&filter=${encodeURIComponent(filter)}`}
			use:enhance={() => {
				const previous = isDone;
				error = '';
				return async ({ result, update }) => {
					if (result.type === 'failure') {
						isDone = previous;
						if (checkbox) checkbox.checked = previous;
						error = (result.data as { itemError?: string } | null)?.itemError ?? 'Could not update todo right now.';
					}
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={todo.id} />
			<input type="hidden" name="next_state" value={isDone ? 'true' : 'false'} />
			<input type="hidden" name="filter" value={filter} />
			<input
				bind:this={checkbox}
				class="checkbox"
				type="checkbox"
				id={`todo-${todo.id}`}
				checked={isDone}
				aria-label={`Mark ${todo.title} as ${isDone ? 'active' : 'completed'}`}
				data-testid="todo-checkbox"
				onchange={() => {
					isDone = checkbox?.checked ?? false;
					toggleForm?.requestSubmit();
				}}
			/>
			<label class:done={isDone} for={`todo-${todo.id}`}>{todo.title}</label>
		</form>

		<form
			bind:this={deleteForm}
			method="POST"
			action={`?/delete&filter=${encodeURIComponent(filter)}`}
			class="delete-form"
			use:enhance={() => {
				const wasDeleted = deleted;
				deleted = true;
				error = '';
				return async ({ result, update }) => {
					if (result.type === 'failure') {
						deleted = wasDeleted;
						error = (result.data as { itemError?: string } | null)?.itemError ?? 'Could not delete todo right now.';
					}
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={todo.id} />
			<input type="hidden" name="filter" value={filter} />
			<button
				type="submit"
				class:confirming
				class="delete"
				aria-label={confirming ? `Confirm deleting ${todo.title}` : `Delete ${todo.title}`}
				onclick={askToDelete}
				data-testid="todo-delete"
			>
				{#if confirming}
					Confirm?
				{:else}
					<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
						<path d="M4 7h16m-10 4v6m4-6v6M9 7V5h6v2m-9 0 1 13h8l1-13" />
					</svg>
				{/if}
			</button>
		</form>
		{#if error}<p class="item-error" role="alert">{error}</p>{/if}
	</li>
{/if}

<style>
	.todo-item {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.8rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: var(--surface);
	}

	.todo-item form:first-child {
		display: flex;
		align-items: center;
		min-width: 0;
		gap: 0.7rem;
	}

	label {
		overflow-wrap: anywhere;
	}

	.done {
		color: var(--muted);
		text-decoration: line-through;
	}

	.checkbox {
		width: 1.2rem;
		height: 1.2rem;
		margin: 0;
		accent-color: var(--accent);
		cursor: pointer;
		flex: 0 0 auto;
	}

	.delete-form {
		display: flex;
	}

	.delete {
		display: grid;
		min-width: 2.25rem;
		min-height: 2.25rem;
		place-items: center;
		padding: 0.45rem;
		border: 1px solid transparent;
		border-radius: 0.45rem;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		font: inherit;
	}

	.delete:hover,
	.delete.confirming {
		border-color: var(--error);
		background: var(--error-soft);
		color: var(--error);
	}

	.delete svg {
		width: 1.15rem;
		height: 1.15rem;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}

	.item-error {
		grid-column: 1 / -1;
		margin: 0;
		color: var(--error);
		font-size: 0.9rem;
	}
</style>
