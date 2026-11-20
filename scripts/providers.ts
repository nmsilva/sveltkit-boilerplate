export type ProviderId = 'supabase' | 'turso' | 'memory';

export type Provider = {
	id: ProviderId;
	label: string;
	adapterDir: string;
	removeDependencies: string[];
	removePaths: string[];
	removeScripts: string[];
	env: string[];
	schemaSteps: string[];
};

export const providers: Provider[] = [
	{
		id: 'supabase',
		label: 'Supabase',
		adapterDir: 'src/lib/db/adapters/supabase',
		removeDependencies: ['@libsql/client'],
		removePaths: ['src/lib/db/adapters/turso'],
		removeScripts: [],
		env: ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY'],
		schemaSteps: ['SUPABASE_PROJECT_REF=<ref> bun run db:link', 'bun run db:push']
	},
	{
		id: 'turso',
		label: 'Turso',
		adapterDir: 'src/lib/db/adapters/turso',
		removeDependencies: ['@supabase/supabase-js'],
		removePaths: ['src/lib/db/adapters/supabase', 'supabase'],
		removeScripts: ['db:link', 'db:push', 'db:new'],
		env: ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'],
		schemaSteps: ['bun src/lib/db/adapters/turso/migrate.ts']
	},
	{
		id: 'memory',
		label: 'Memory (demo)',
		adapterDir: 'src/lib/db/adapters/memory',
		removeDependencies: ['@supabase/supabase-js', '@libsql/client'],
		removePaths: ['src/lib/db/adapters/supabase', 'src/lib/db/adapters/turso', 'supabase'],
		removeScripts: ['db:link', 'db:push', 'db:new'],
		env: [],
		schemaSteps: ['No database setup is required.']
	}
];

export function getProvider(id: string): Provider | undefined {
	return providers.find((provider) => provider.id === id);
}
