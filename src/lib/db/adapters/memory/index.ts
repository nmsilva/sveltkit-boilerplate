import type { Todo, TodoRepository } from '../../types';

const todos: Todo[] = [
	{
		id: 'demo-1',
		title: 'Welcome to the TODO boilerplate',
		is_done: false,
		created_at: '2026-01-03T00:00:00.000Z',
	},
	{
		id: 'demo-2',
		title: 'Connect a database when you are ready',
		is_done: false,
		created_at: '2026-01-02T00:00:00.000Z',
	},
	{
		id: 'demo-3',
		title: 'Try adding your first todo',
		is_done: false,
		created_at: '2026-01-01T00:00:00.000Z',
	},
];

export function createTodoRepository(): TodoRepository {
	return {
		async list() {
			return [...todos].sort((a, b) =>
				b.created_at.localeCompare(a.created_at),
			);
		},
		async create(title) {
			todos.push({
				id: crypto.randomUUID(),
				title,
				is_done: false,
				created_at: new Date().toISOString(),
			});
		},
		async toggle(id, isDone) {
			const todo = todos.find((item) => item.id === id);
			if (todo) todo.is_done = isDone;
		},
		async remove(id) {
			const index = todos.findIndex((item) => item.id === id);
			if (index >= 0) todos.splice(index, 1);
		},
	};
}
