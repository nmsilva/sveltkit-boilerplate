<script lang="ts">
	import { enhance } from '$app/forms';
	let { filter, error }: { filter: string; error?: string } = $props();
	let input: HTMLInputElement;
	let originalTitle = '';

</script>

<form
	method="POST"
	action={`?/create&filter=${encodeURIComponent(filter)}`}
	class="todo-form"
	data-testid="todo-form"
	use:enhance={() => {
		originalTitle = input.value;
		input.value = '';

		return async ({ result, update }) => {
			if (result.type === 'failure') input.value = originalTitle;
			await update();
			if (result.type === 'success') input.focus();
		};
	}}
>
	<label for="todo-input">New todo</label>
	<div class="input-row">
		<input
			bind:this={input}
			id="todo-input"
			name="title"
			type="text"
			maxlength="120"
			placeholder="What needs doing?"
			required
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? 'todo-error' : undefined}
			data-testid="todo-input"
		/>
		<input type="hidden" name="filter" value={filter} />
		<button type="submit" data-testid="todo-submit">Add todo</button>
	</div>
	{#if error}
		<p id="todo-error" class="error" role="alert" data-testid="todo-error">{error}</p>
	{/if}
</form>

<style>
	.todo-form {
		margin-top: 1.5rem;
	}

	.todo-form label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 650;
	}

	.input-row {
		display: flex;
		gap: 0.5rem;
	}

	input[type='text'] {
		min-width: 0;
		flex: 1;
		padding: 0.7rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background: var(--surface);
		color: var(--text);
		font: inherit;
	}

	button {
		padding: 0.65rem 0.9rem;
		border: 0;
		border-radius: 0.5rem;
		background: var(--accent);
		color: var(--accent-text);
		font: inherit;
		font-weight: 650;
		cursor: pointer;
	}

	.error {
		margin: 0.5rem 0 0;
		color: var(--error);
	}

	@media (max-width: 420px) {
		.input-row {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
