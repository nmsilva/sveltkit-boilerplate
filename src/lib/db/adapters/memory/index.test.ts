import { describe, expect, test } from 'bun:test';
import { createTodoRepository } from './index';

describe('memory todo repository', () => {
	test('starts with demo todos and shares state between repositories', async () => {
		const first = createTodoRepository();
		const initial = await first.list();
		expect(initial).toHaveLength(3);

		await first.create('persist in memory');
		const second = createTodoRepository();
		expect((await second.list()).some((todo) => todo.title === 'persist in memory')).toBe(true);

		const created = (await second.list()).find((todo) => todo.title === 'persist in memory');
		if (!created) throw new Error('Expected demo todo to be created');
		await second.remove(created.id);
	});

	test('toggles and removes todos through the repository interface', async () => {
		const repository = createTodoRepository();
		await repository.create('change me');
		const todo = (await repository.list()).find((item) => item.title === 'change me');
		if (!todo) throw new Error('Expected todo to be created');

		await repository.toggle(todo.id, true);
		expect((await repository.list()).find((item) => item.id === todo.id)?.is_done).toBe(true);
		await repository.remove(todo.id);
		expect((await repository.list()).some((item) => item.id === todo.id)).toBe(false);
	});
});
