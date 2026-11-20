import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getProvider, providers, type Provider } from '../providers';

export type SetupOptions = {
	yes?: boolean;
	dryRun?: boolean;
	noInstall?: boolean;
	overwriteEnv?: boolean;
	run?: (command: string, args: string[]) => Promise<number>;
	confirm?: (message: string) => Promise<boolean>;
	log?: (message: string) => void;
};

export function parseArgs(args: string[]) {
	let providerId: string | undefined;
	let yes = false;
	let dryRun = false;
	let noInstall = false;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === '--provider') {
			providerId = args[++i];
			if (!providerId) throw new Error('--provider requires a provider id');
		} else if (arg === '--yes') yes = true;
		else if (arg === '--dry-run') dryRun = true;
		else if (arg === '--no-install') noInstall = true;
		else throw new Error(`Unknown option: ${arg}`);
	}
	return { providerId, yes, dryRun, noInstall };
}

export function selectProvider(id: string): Provider {
	const provider = getProvider(id);
	if (!provider) throw new Error(`Unknown provider "${id}". Choose one of: ${providers.map((p) => p.id).join(', ')}`);
	return provider;
}

function providerBlock(content: string, id: string): string | null {
	const pattern = new RegExp(`# >>> provider: ${id}\\n[\\s\\S]*?# <<< provider: ${id}\\n?`, 'm');
	return content.match(pattern)?.[0] ?? null;
}

export async function generateEnv(rootDir: string, id: string, existingIsProtected = true): Promise<string | null> {
	const existingPath = join(rootDir, '.env');
	if (existingIsProtected && existsSync(existingPath)) return null;
	const example = await readFile(join(rootDir, '.env.example'), 'utf8');
	const block = providerBlock(example, id);
	if (!block) throw new Error(`No environment section found for provider "${id}"`);
	const lines = block.split('\n').filter((line) => !line.startsWith('# >>>') && !line.startsWith('# <<<'));
	const env = lines.join('\n').replace(/\n+$/, '\n');
	await writeFile(existingPath, env);
	return env;
}

async function rewriteExample(rootDir: string, id: string): Promise<void> {
	const path = join(rootDir, '.env.example');
	const content = await readFile(path, 'utf8');
	const block = providerBlock(content, id);
	if (!block) throw new Error(`No environment section found for provider "${id}"`);
	const firstBlock = content.indexOf('# >>> provider:');
	const prefix = firstBlock >= 0 ? content.slice(0, firstBlock) : '';
	await writeFile(path, prefix + block);
}

async function updatePackage(rootDir: string, provider: Provider): Promise<void> {
	const path = join(rootDir, 'package.json');
	const packageJson = JSON.parse(await readFile(path, 'utf8')) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
		scripts?: Record<string, string>;
	};
	for (const dependency of provider.removeDependencies) {
		delete packageJson.dependencies?.[dependency];
		delete packageJson.devDependencies?.[dependency];
	}
	for (const name of provider.removeScripts) delete packageJson.scripts?.[name];
	await writeFile(path, `${JSON.stringify(packageJson, null, '\t')}\n`);
}

export async function applySetup(rootDir: string, id: string, options: SetupOptions = {}): Promise<string[]> {
	const provider = selectProvider(id);
	const log = options.log ?? (() => undefined);
	const dryRun = options.dryRun === true;
	const messages: string[] = [];
	const announce = (message: string) => {
		messages.push(message);
		log(message);
	};
	const chosenExists = existsSync(join(rootDir, provider.adapterDir));
	const otherProviders = providers.filter(
		(candidate) => candidate.id !== provider.id && (candidate.id !== 'memory' || provider.id === 'memory')
	);
	const otherExists = otherProviders.some((candidate) => existsSync(join(rootDir, candidate.adapterDir)));
	if (chosenExists && !otherExists) announce(`Setup already selected ${provider.label}; applying it again is safe.`);
	if (dryRun) {
		announce(`Would select ${provider.label}.`);
		announce(`Would remove ${[...new Set([...otherProviders.map((candidate) => candidate.adapterDir), ...provider.removePaths])].join(', ')}.`);
		announce('Would update package.json and .env.example.');
		if (!options.noInstall) announce('Would run bun install.');
		return messages;
	}

	await mkdir(join(rootDir, 'src/lib/db'), { recursive: true });
	const activeSource = provider.id === 'memory'
		? `export { createTodoRepository } from "./adapters/memory/index";\nexport const isDemoMode = true;\nexport const getActiveProvider = () => "memory" as const;\n`
		: `import { createTodoRepository as createMemoryRepository } from "./adapters/memory";\nimport { createTodoRepository as createProviderRepository } from "./adapters/${provider.id}";\n\nconst hasProviderCredentials = ${provider.id === 'supabase' ? 'Boolean(process.env.PUBLIC_SUPABASE_URL && process.env.PUBLIC_SUPABASE_ANON_KEY)' : 'Boolean(process.env.TURSO_DATABASE_URL)'};\nexport const isDemoMode = !hasProviderCredentials;\nexport const getActiveProvider = () => (hasProviderCredentials ? "${provider.id}" : "memory");\nexport function createTodoRepository() {\n\treturn hasProviderCredentials ? createProviderRepository() : createMemoryRepository();\n}\n`;
	await writeFile(join(rootDir, 'src/lib/db/active.ts'), activeSource);
	for (const path of [...new Set([...otherProviders.map((candidate) => candidate.adapterDir), ...provider.removePaths])]) {
		await rm(join(rootDir, path), { recursive: true, force: true });
	}
	await updatePackage(rootDir, provider);
	await rewriteExample(rootDir, provider.id);

	const envPath = join(rootDir, '.env');
	if (existsSync(envPath)) {
		if (options.overwriteEnv) await generateEnv(rootDir, provider.id, false);
		else announce('Existing .env preserved; it was not overwritten.');
	} else await generateEnv(rootDir, provider.id, false);

	announce(`${provider.label} selected.`);
	if (provider.id === 'turso') {
		const env = existsSync(envPath) ? await readFile(envPath, 'utf8') : '';
		const hasUrl = Boolean(process.env.TURSO_DATABASE_URL || /^TURSO_DATABASE_URL=.+$/m.test(env));
		if (hasUrl) {
			const run = options.run ?? (async (command, args) => Bun.spawn([command, ...args], { stdout: 'inherit', stderr: 'inherit' }).exited);
			await run('bun', ['src/lib/db/adapters/turso/migrate.ts']);
		} else announce(`Apply the schema with: ${provider.schemaSteps[0]}`);
	} else announce(`Apply the schema with: ${provider.schemaSteps.join(' then ')}`);
	if (!options.noInstall) {
		const run = options.run ?? (async (command, args) => Bun.spawn([command, ...args], { stdout: 'inherit', stderr: 'inherit' }).exited);
		await run('bun', ['install']);
	}
	return messages;
}
