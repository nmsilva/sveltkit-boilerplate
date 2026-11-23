import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { createClient, type Client } from '@libsql/client';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applySchema } from './migrate';
import { createTodoRepository } from './index';

let client: Client;
let directory: string;

beforeAll(async () => {
	directory = await mkdtemp(join(tmpdir(), 'todos-'));
	const url = `file:${join(directory, 'todos.db')}`;
	client = createClient({ url });
	await applySchema(url);
});

afterAll(async () => {
	client.close();
	await rm(directory, { recursive: true, force: true });
});

describe('Turso todo repository', () => {
	test('creates and lists todos newest first', async () => {
		const repository = createTodoRepository({ client });
		await repository.create('first');
		await repository.create('second');

		expect((await repository.list()).map((todo) => todo.title)).toEqual([
			'second',
			'first',
		]);
	});

	test('toggles and removes a todo', async () => {
		const repository = createTodoRepository({ client });
		const before = await repository.list();
		await repository.toggle(before[0].id, true);
		expect((await repository.list())[0].is_done).toBe(true);
		await repository.remove(before[0].id);
		expect(
			(await repository.list()).some((todo) => todo.id === before[0].id),
		).toBe(false);
	});
});
