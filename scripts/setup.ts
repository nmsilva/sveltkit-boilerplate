import { confirm, intro, outro, select } from '@clack/prompts';
import { applySetup, parseArgs, selectProvider } from './lib/setup';
import { providers } from './providers';

function defaultProviderId() {
	if (process.env.PUBLIC_SUPABASE_URL && process.env.PUBLIC_SUPABASE_ANON_KEY) return 'supabase';
	if (process.env.TURSO_DATABASE_URL) return 'turso';
	return 'memory';
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	let providerId = args.providerId;
	if (!providerId) {
		if (args.yes) providerId = defaultProviderId();
		else {
			const answer = await select({
				message: 'Choose a storage provider',
				options: providers.map((provider) => ({ value: provider.id, label: provider.label })),
				initialValue: defaultProviderId()
			});
			if (typeof answer !== 'string') return;
			providerId = answer;
		}
	}
	selectProvider(providerId);
	intro('Boilerplate setup');
	const overwriteEnv = !args.yes && !args.dryRun && await confirm({
		message: 'If .env exists, may setup replace it? (It is never replaced with --yes)',
		initialValue: false
	});
	await applySetup(process.cwd(), providerId, {
		yes: args.yes,
		dryRun: args.dryRun,
		noInstall: args.noInstall,
		overwriteEnv: overwriteEnv === true,
		log: (message) => console.log(message)
	});
	outro('Setup complete');
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
