import { env } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function getSupabaseEnv() {
	const url = env.PUBLIC_SUPABASE_URL;
	const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
	}

	return { url, anonKey };
}

export function createSupabaseClient() {
	const { url, anonKey } = getSupabaseEnv();

	return createClient<Database>(url, anonKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
			detectSessionInUrl: false
		}
	});
}
