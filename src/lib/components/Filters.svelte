<script lang="ts">
	let { filter }: { filter: string } = $props();

	const filters = [
		{ key: 'all', label: 'All', testId: 'filter-all' },
		{ key: 'active', label: 'Active', testId: 'filter-active' },
		{ key: 'completed', label: 'Completed', testId: 'filter-completed' },
	];
</script>

<nav class="filters" aria-label="Filter todos">
	{#each filters as item}
		<a
			href={item.key === 'all' ? '/' : `/?filter=${item.key}`}
			aria-current={filter === item.key ? 'page' : undefined}
			class:current={filter === item.key}
			data-testid={item.testId}
		>
			{item.label}
		</a>
	{/each}
</nav>

<style>
	.filters {
		display: flex;
		gap: 0.25rem;
		margin-top: 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	a {
		padding: 0.55rem 0.7rem;
		border-bottom: 2px solid transparent;
		color: var(--muted);
		text-decoration: none;
	}

	a:hover,
	a.current {
		border-bottom-color: var(--accent);
		color: var(--text);
	}
</style>
