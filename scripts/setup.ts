import { confirm, intro, outro, select } from '@clack/prompts';
import { applySetup, parseArgs, selectProvider } from './lib/setup';
import { providers } from './providers';

async function main() {
	const args = parseArgs(process.argv.slice(2));
	let providerId = args.providerId;
	if (!providerId) {
		if (args.yes) throw new Error('--yes requires --provider <id> (non-interactive mode)');
		const answer = await select({
			message: 'Choose a storage provider',
			options: providers.map((provider) => ({ value: provider.id, label: provider.label }))
		});
		if (typeof answer !== 'string') return;
		providerId = answer;
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
