<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import Filters from '$lib/components/Filters.svelte';
	import TodoForm from '$lib/components/TodoForm.svelte';
	import TodoList from '$lib/components/TodoList.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>TODO — A simple todo app</title>
	<meta name="description" content="A simple todo app" />
</svelte:head>

<main>
	<header>
		<p class="eyebrow">A little progress every day</p>
		<h1>TODO</h1>
		<p class="subtitle">A simple todo app</p>
	</header>

	{#if data.demo}
		<p class="demo-notice" data-testid="demo-notice">
			Demo mode — data is kept in memory and resets on restart.
			<a
				href="https://github.com/nmsilva/sveltkit-boilerplate#connect-a-database"
				target="_blank"
				rel="noreferrer"
			>
				Connect a database
			</a>
		</p>
	{/if}

	<TodoForm filter={data.filter} error={form?.createError} />

	{#if data.loadError}
		<p class="error" role="alert">{data.loadError}</p>
	{/if}

	<section class="list-heading" aria-label="Todo summary">
		<Filters filter={data.filter} />
		<div class="summary-row">
			<p class="count" data-testid="todo-count">{data.activeCount} left</p>
			<form
				method="POST"
				action={`?/clearCompleted&filter=${encodeURIComponent(data.filter)}`}
			>
				<input type="hidden" name="filter" value={data.filter} />
				<button type="submit" class="clear" data-testid="clear-completed">
					Clear completed
				</button>
			</form>
		</div>
	</section>

	<TodoList todos={data.todos} filter={data.filter} />
</main>

<style>
	:global(:root) {
		--page: #f6f7fb;
		--surface: #ffffff;
		--text: #202534;
		--muted: #687084;
		--border: #dfe3ec;
		--accent: #6658d3;
		--accent-text: #ffffff;
		--error: #b42318;
		--error-soft: #fff0ee;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: var(--page);
		color: var(--text);
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	:global(:focus-visible) {
		outline: 3px solid #f5a524;
		outline-offset: 2px;
	}

	main {
		width: min(100% - 2rem, 42rem);
		min-width: 0;
		margin: 0 auto;
		padding: 3rem 0 4rem;
	}

	header {
		margin-bottom: 1.5rem;
	}

	.eyebrow {
		margin: 0 0 0.4rem;
		color: var(--accent);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 8vw, 3rem);
		letter-spacing: -0.06em;
	}

	.subtitle {
		margin: 0.25rem 0 0;
		color: var(--muted);
	}

	.demo-notice {
		padding: 0.75rem 0.9rem;
		margin: 1rem 0;
		border: 1px solid #e9bd62;
		border-radius: 0.6rem;
		background: #fff8e7;
		color: #704d00;
		font-size: 0.9rem;
	}

	.demo-notice a {
		color: inherit;
		font-weight: 650;
	}

	.list-heading {
		margin-top: 1.5rem;
	}

	.summary-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.8rem;
	}

	.count {
		margin: 0;
		color: var(--muted);
		font-size: 0.95rem;
	}

	.clear {
		padding: 0.35rem 0;
		border: 0;
		background: transparent;
		color: var(--accent);
		cursor: pointer;
		font-weight: 650;
	}

	.clear:hover {
		text-decoration: underline;
	}

	.error {
		color: var(--error);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--page: #151821;
			--surface: #202531;
			--text: #f1f3f8;
			--muted: #aab2c3;
			--border: #363e4f;
			--accent: #a69af7;
			--accent-text: #19152f;
			--error: #ffb4ab;
			--error-soft: #392022;
		}

		.demo-notice {
			border-color: #8d6a2b;
			background: #302812;
			color: #f7d98b;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*),
		:global(*::before),
		:global(*::after) {
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}
</style>
