import { createClient, type Client } from '@libsql/client';
import type { TodoRepository } from '../../types';

export type TursoRepositoryConfig = {
	url?: string;
	authToken?: string;
	client?: Client;
};

function getConfig(): TursoRepositoryConfig {
	return {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	};
}

export function createTodoRepository(
	config: TursoRepositoryConfig = {},
): TodoRepository {
	const resolved = { ...getConfig(), ...config };
	if (!resolved.client && !resolved.url) {
		throw new Error('Missing TURSO_DATABASE_URL');
	}
	const client =
		resolved.client ??
		createClient({
			url: resolved.url!,
			...(resolved.authToken ? { authToken: resolved.authToken } : {}),
		});

	return {
		async list() {
			try {
				const result = await client.execute(
					'SELECT id, title, is_done, created_at FROM todos ORDER BY created_at DESC, rowid DESC',
				);
				return result.rows.map((row) => ({
					id: String(row.id),
					title: String(row.title),
					is_done: Number(row.is_done) !== 0,
					created_at: String(row.created_at),
				}));
			} catch (error) {
				throw new Error('Could not list todos', { cause: error });
			}
		},
		async create(title) {
			try {
				await client.execute({
					sql: 'INSERT INTO todos (id, title) VALUES (?, ?)',
					args: [crypto.randomUUID(), title],
				});
			} catch (error) {
				throw new Error('Could not create todo', { cause: error });
			}
		},
		async toggle(id, isDone) {
			try {
				await client.execute({
					sql: 'UPDATE todos SET is_done = ? WHERE id = ?',
					args: [isDone ? 1 : 0, id],
				});
			} catch (error) {
				throw new Error('Could not update todo', { cause: error });
			}
		},
		async remove(id) {
			try {
				await client.execute({
					sql: 'DELETE FROM todos WHERE id = ?',
					args: [id],
				});
			} catch (error) {
				throw new Error('Could not delete todo', { cause: error });
			}
		},
	};
}
