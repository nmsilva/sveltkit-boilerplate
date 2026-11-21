import { expect, test } from '@playwright/test';

function uniqueTitle(label: string) {
	return `${label} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function addTodo(page: import('@playwright/test').Page, title: string) {
	await page.getByTestId('todo-input').fill(title);
	await page.getByTestId('todo-submit').click();
	await expect(
		page.getByTestId('todo-item').filter({ hasText: title }),
	).toBeVisible();
}

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('creates and deletes a todo', async ({ page }) => {
	const title = uniqueTitle('Create');
	await addTodo(page, title);

	const item = page.getByTestId('todo-item').filter({ hasText: title });
	await item.getByTestId('todo-delete').click();
	await item.getByTestId('todo-delete').click();
	await expect(item).toHaveCount(0);
});

test('toggles completion and filters todos', async ({ page }) => {
	const activeTitle = uniqueTitle('Active');
	const completedTitle = uniqueTitle('Completed');
	await addTodo(page, activeTitle);
	await addTodo(page, completedTitle);

	const completedItem = page
		.getByTestId('todo-item')
		.filter({ hasText: completedTitle });
	await completedItem.getByTestId('todo-checkbox').check();
	await expect(completedItem.getByTestId('todo-checkbox')).toBeChecked();

	await page.getByTestId('filter-active').click();
	await expect(
		page.getByTestId('todo-item').filter({ hasText: activeTitle }),
	).toBeVisible();
	await expect(
		page.getByTestId('todo-item').filter({ hasText: completedTitle }),
	).toHaveCount(0);

	await page.getByTestId('filter-completed').click();
	await expect(
		page.getByTestId('todo-item').filter({ hasText: completedTitle }),
	).toBeVisible();
	await expect(
		page.getByTestId('todo-item').filter({ hasText: activeTitle }),
	).toHaveCount(0);
});

test('clears completed todos without removing active todos', async ({
	page,
}) => {
	const activeTitle = uniqueTitle('Keep');
	const completedTitle = uniqueTitle('Clear');
	await addTodo(page, activeTitle);
	await addTodo(page, completedTitle);

	const completedItem = page
		.getByTestId('todo-item')
		.filter({ hasText: completedTitle });
	await completedItem.getByTestId('todo-checkbox').check();
	await page.getByTestId('clear-completed').click();

	await expect(
		page.getByTestId('todo-item').filter({ hasText: completedTitle }),
	).toHaveCount(0);
	await expect(
		page.getByTestId('todo-item').filter({ hasText: activeTitle }),
	).toBeVisible();
});

test('shows the demo notice for the memory backend', async ({ page }) => {
	if (process.env.E2E_BACKEND === 'turso-file') test.skip();
	await expect(page.getByTestId('demo-notice')).toContainText('Demo mode');
});

test('requires a title', async ({ page }) => {
	const input = page.getByTestId('todo-input');
	await expect(input).toHaveJSProperty('required', true);
	expect(
		await input.evaluate(
			(element) => !(element as HTMLInputElement).checkValidity(),
		),
	).toBe(true);
});

test('rejects titles longer than 120 characters', async ({ page }) => {
	const input = page.getByTestId('todo-input');
	await input.evaluate((element) => {
		element.removeAttribute('maxlength');
		element.value = 'x'.repeat(121);
		element.form?.requestSubmit();
	});
	await expect(page.getByTestId('todo-error')).toHaveText(
		'Title must be 120 characters or fewer.',
	);
});
