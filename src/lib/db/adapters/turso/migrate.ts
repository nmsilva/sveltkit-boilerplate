import { createClient } from '@libsql/client';
import { readFile } from 'node:fs/promises';

export async function applySchema(
	url: string,
	authToken?: string,
): Promise<void> {
	const client = createClient({ url, ...(authToken ? { authToken } : {}) });
	try {
		const schema = await readFile(
			new URL('./schema.sql', import.meta.url),
			'utf8',
		);
		await client.executeMultiple(schema);
	} finally {
		client.close();
	}
}

if (import.meta.main) {
	const url = process.env.TURSO_DATABASE_URL;
	if (!url) {
		throw new Error('Missing TURSO_DATABASE_URL');
	}
	await applySchema(url, process.env.TURSO_AUTH_TOKEN);
}
