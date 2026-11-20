import { afterEach, describe, expect, test } from 'bun:test';
import { getActiveProvider, isDemoMode } from './active';

const original = {
	url: process.env.PUBLIC_SUPABASE_URL,
	key: process.env.PUBLIC_SUPABASE_ANON_KEY,
	turso: process.env.TURSO_DATABASE_URL
};

afterEach(() => {
	for (const [name, value] of Object.entries({
		PUBLIC_SUPABASE_URL: original.url,
		PUBLIC_SUPABASE_ANON_KEY: original.key,
		TURSO_DATABASE_URL: original.turso
	})) {
		if (value === undefined) delete process.env[name];
		else process.env[name] = value;
	}
});

describe('active todo provider', () => {
	test('uses memory when database credentials are missing', () => {
		delete process.env.PUBLIC_SUPABASE_URL;
		delete process.env.PUBLIC_SUPABASE_ANON_KEY;
		delete process.env.TURSO_DATABASE_URL;
		expect(getActiveProvider()).toBe('memory');
		expect(isDemoMode()).toBe(true);
	});

	test('uses Supabase when both Supabase credentials are present', () => {
		process.env.PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
		process.env.PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
		delete process.env.TURSO_DATABASE_URL;
		expect(getActiveProvider()).toBe('supabase');
		expect(isDemoMode()).toBe(false);
	});

	test('uses Turso when its database URL is present', () => {
		delete process.env.PUBLIC_SUPABASE_URL;
		delete process.env.PUBLIC_SUPABASE_ANON_KEY;
		process.env.TURSO_DATABASE_URL = 'libsql://example.turso.io';
		expect(getActiveProvider()).toBe('turso');
	});
});
