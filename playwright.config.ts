import { defineConfig } from '@playwright/test';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applySchema } from './src/lib/db/adapters/turso/migrate';

const backend = process.env.E2E_BACKEND ?? 'memory';
if (backend !== 'memory' && backend !== 'turso-file') {
	throw new Error(`Unsupported E2E_BACKEND: ${backend}`);
}

if (backend === 'turso-file') {
	const directory = await mkdtemp(join(tmpdir(), 'sveltekit-e2e-'));
	const databaseUrl = `file:${join(directory, 'todos.db')}`;
	delete process.env.PUBLIC_SUPABASE_URL;
	delete process.env.PUBLIC_SUPABASE_ANON_KEY;
	process.env.TURSO_DATABASE_URL = databaseUrl;
	delete process.env.TURSO_AUTH_TOKEN;
	await applySchema(databaseUrl);
} else {
	delete process.env.PUBLIC_SUPABASE_URL;
	delete process.env.PUBLIC_SUPABASE_ANON_KEY;
	delete process.env.TURSO_DATABASE_URL;
	delete process.env.TURSO_AUTH_TOKEN;
}

export default defineConfig({
	testDir: './e2e',
	fullyParallel: false,
	workers: 1,
	retries: process.env.CI ? 2 : 0,
	reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'bun run build && bun run preview',
		url: 'http://localhost:4173',
		reuseExistingServer: false,
		timeout: 120_000
	}
});
