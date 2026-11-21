import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applySetup, generateEnv, parseArgs, selectProvider } from './setup';

let root = '';

beforeEach(async () => {
	root = await mkdtemp(join(tmpdir(), 'boilerplate-setup-'));
	await mkdir(join(root, 'src/lib/db/adapters/supabase'), { recursive: true });
	await mkdir(join(root, 'src/lib/db/adapters/turso'), { recursive: true });
	await mkdir(join(root, 'supabase/migrations'), { recursive: true });
	await writeFile(join(root, 'src/lib/db/active.ts'), 'old\n');
	await writeFile(
		join(root, 'src/lib/db/adapters/supabase/index.ts'),
		'supabase',
	);
	await writeFile(join(root, 'src/lib/db/adapters/turso/index.ts'), 'turso');
	await writeFile(
		join(root, '.env.example'),
		'# intro\n# >>> provider: supabase\n# Supabase URL\nPUBLIC_SUPABASE_URL=\nPUBLIC_SUPABASE_ANON_KEY=\n# <<< provider: supabase\n# >>> provider: turso\n# Turso URL\nTURSO_DATABASE_URL=\nTURSO_AUTH_TOKEN=\n# <<< provider: turso\n# >>> provider: memory\n# Memory provider\n# <<< provider: memory\n',
	);
	await writeFile(
		join(root, 'package.json'),
		JSON.stringify({
			name: 'fixture',
			scripts: {
				setup: 'bun scripts/setup.ts',
				'db:push': 'supabase db push',
				test: 'bun test',
			},
			dependencies: {
				'@supabase/supabase-js': '1',
				'@libsql/client': '1',
				keep: '1',
			},
		}),
	);
});

afterEach(async () => rm(root, { recursive: true, force: true }));

test('selects a provider from flags and rejects invalid flags', () => {
	expect(parseArgs(['--provider', 'memory', '--yes'])).toMatchObject({
		providerId: 'memory',
		yes: true,
	});
	expect(parseArgs(['--provider', 'turso', '--yes'])).toMatchObject({
		providerId: 'turso',
		yes: true,
	});
	expect(() => parseArgs(['--wat'])).toThrow('Unknown option');
	expect(() => selectProvider('missing')).toThrow('Unknown provider');
});

test('writes the active adapter and removes the unselected files and package entries', async () => {
	await applySetup(root, 'turso', {
		yes: true,
		noInstall: true,
		run: async () => 0,
	});
	expect(await readFile(join(root, 'src/lib/db/active.ts'), 'utf8')).toBe(
		'import { createTodoRepository as createMemoryRepository } from "./adapters/memory";\nimport { createTodoRepository as createProviderRepository } from "./adapters/turso";\n\nconst hasProviderCredentials = () => Boolean(process.env.TURSO_DATABASE_URL);\nexport const isDemoMode = () => !hasProviderCredentials();\nexport const getActiveProvider = () => (hasProviderCredentials() ? "turso" : "memory");\nexport function createTodoRepository() {\n\treturn hasProviderCredentials() ? createProviderRepository() : createMemoryRepository();\n}\n',
	);
	expect(
		await Bun.file(
			join(root, 'src/lib/db/adapters/supabase/index.ts'),
		).exists(),
	).toBe(false);
	expect(await Bun.file(join(root, 'supabase')).exists()).toBe(false);
	const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
	expect(pkg.dependencies).toEqual({ '@libsql/client': '1', keep: '1' });
	expect(pkg.scripts['db:push']).toBeUndefined();
	expect(pkg.scripts.setup).toBe('bun scripts/setup.ts');
});

test('generates a provider env and never overwrites an existing env', async () => {
	const first = await generateEnv(root, 'supabase', false);
	expect(first).toContain('PUBLIC_SUPABASE_URL=');
	expect(first).not.toContain('TURSO_DATABASE_URL');
	await writeFile(join(root, '.env'), 'KEEP=me\n');
	const result = await generateEnv(root, 'supabase', true);
	expect(result).toBeNull();
	expect(await readFile(join(root, '.env'), 'utf8')).toBe('KEEP=me\n');
});

test('supports selecting the memory provider without database files or dependencies', async () => {
	await applySetup(root, 'memory', { yes: true, noInstall: true });
	expect(await readFile(join(root, 'src/lib/db/active.ts'), 'utf8')).toBe(
		'export { createTodoRepository } from "./adapters/memory/index";\nexport const isDemoMode = () => true;\nexport const getActiveProvider = () => "memory" as const;\n',
	);
	expect(
		await Bun.file(
			join(root, 'src/lib/db/adapters/supabase/index.ts'),
		).exists(),
	).toBe(false);
	expect(
		await Bun.file(join(root, 'src/lib/db/adapters/turso/index.ts')).exists(),
	).toBe(false);
	const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
	expect(pkg.dependencies).toEqual({ keep: '1' });
});

test('dry-run does not change files', async () => {
	const before = await readFile(join(root, 'package.json'), 'utf8');
	await applySetup(root, 'turso', { dryRun: true, yes: true, noInstall: true });
	expect(await readFile(join(root, 'package.json'), 'utf8')).toBe(before);
});
