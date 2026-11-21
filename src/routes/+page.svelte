<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<main>
	<header>
		<h1>TODO Boilerplate</h1>
		<p>SvelteKit + Supabase + Netlify</p>
	</header>

	{#if data.demo}
		<p class="demo-notice">
			Demo mode — data is kept in memory and resets on restart
			<a href="https://github.com/nmsilva/sveltkit-boilerplate#connect-a-database" target="_blank" rel="noreferrer">Connect a database</a>
		</p>
	{/if}

	<form method="POST" action="?/create" class="create-form">
		<label for="title">New todo</label>
		<div>
			<input
				id="title"
				name="title"
				type="text"
				maxlength="120"
				placeholder="Write a task..."
				required
			/>
			<button type="submit">Add</button>
		</div>
	</form>

	{#if data.loadError}
		<p class="error">{data.loadError}</p>
	{/if}

	{#if form?.createError}
		<p class="error">{form.createError}</p>
	{/if}

	{#if form?.itemError}
		<p class="error">{form.itemError}</p>
	{/if}

	{#if !data.todos.length}
		<p class="empty">No todos yet. Add your first item above.</p>
	{:else}
		<ul>
			{#each data.todos as todo (todo.id)}
				<li>
					<form method="POST" action="?/toggle" class="inline-form">
						<input type="hidden" name="id" value={todo.id} />
						<input type="hidden" name="next_state" value={todo.is_done ? 'false' : 'true'} />
						<button type="submit" class="toggle" aria-label="Toggle todo status">
							{todo.is_done ? '✅' : '⬜️'}
						</button>
					</form>

					<span class:done={todo.is_done}>{todo.title}</span>

					<form method="POST" action="?/delete" class="inline-form">
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit" class="danger" aria-label="Delete todo">Delete</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #0f172a;
		color: #e2e8f0;
	}

	main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem 1rem 3rem;
	}

	header {
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
		font-size: 1.8rem;
	}

	header p {
		margin: 0.25rem 0 0;
		color: #94a3b8;
	}

	.create-form label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.create-form div {
		display: flex;
		gap: 0.5rem;
	}

	input[type='text'] {
		flex: 1;
		padding: 0.65rem 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid #334155;
		background: #111827;
		color: #e2e8f0;
	}

	button {
		padding: 0.6rem 0.85rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
		background: #22c55e;
		color: #052e16;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 0.5rem;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: #111827;
		border: 1px solid #1f2937;
		border-radius: 0.75rem;
	}

	.inline-form {
		display: contents;
	}

	.toggle {
		padding: 0.3rem 0.45rem;
		background: transparent;
		font-size: 1.1rem;
	}

	span {
		flex: 1;
	}

	.done {
		text-decoration: line-through;
		color: #94a3b8;
	}

	.danger {
		background: #ef4444;
		color: #fff;
	}

	.empty {
		margin-top: 1rem;
		color: #94a3b8;
	}

	.error {
		margin-top: 0.75rem;
		color: #fca5a5;
	}

	.demo-notice {
		margin: 1rem 0;
		padding: 0.75rem;
		border: 1px solid #854d0e;
		border-radius: 0.5rem;
		background: #422006;
		color: #fde68a;
	}

	.demo-notice a {
		color: #fef3c7;
	}
</style>
