import { describe, expect, test } from 'bun:test';
import { createTodoRepository } from './index';
import type { Todo } from '../../types';

function fakeClient(initial: Todo[] = []) {
	const todos = [...initial];
	return {
		todos,
		from() {
			return {
				select() {
					return {
						order: async () => ({ data: [...todos].reverse(), error: null })
					};
				},
				insert: async ({ title }: { title: string }) => {
					todos.push({ id: 'supabase-id', title, is_done: false, created_at: '2026-01-01T00:00:00Z' });
					return { data: null, error: null };
				},
				update(values: { is_done: boolean }) {
					return { eq: async (_column: string, id: string) => {
						const todo = todos.find((item) => item.id === id);
						if (todo) todo.is_done = values.is_done;
						return { data: null, error: null };
					} };
				},
				delete() {
					return { eq: async (_column: string, id: string) => {
						const index = todos.findIndex((item) => item.id === id);
						if (index >= 0) todos.splice(index, 1);
						return { data: null, error: null };
					} };
				}
			};
		}
	};
}

describe('Supabase todo repository', () => {
	test('delegates CRUD operations to an injected client', async () => {
		const client = fakeClient();
		const repository = createTodoRepository({ client });
		await repository.create('write tests');
		const [todo] = await repository.list();
		await repository.toggle(todo.id, true);
		expect((await repository.list())[0].is_done).toBe(true);
		await repository.remove(todo.id);
		expect(await repository.list()).toEqual([]);
	});
});
