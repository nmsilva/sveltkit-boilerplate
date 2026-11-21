import { createTodoRepository as createMemoryRepository } from './adapters/memory';
import { createTodoRepository as createSupabaseRepository } from './adapters/supabase';
import { createTodoRepository as createTursoRepository } from './adapters/turso';
import type { TodoRepository } from './types';

export type ActiveProvider = 'supabase' | 'turso' | 'memory';

export function getActiveProvider(): ActiveProvider {
	if (process.env.PUBLIC_SUPABASE_URL && process.env.PUBLIC_SUPABASE_ANON_KEY)
		return 'supabase';
	if (process.env.TURSO_DATABASE_URL) return 'turso';
	return 'memory';
}

export function isDemoMode() {
	return getActiveProvider() === 'memory';
}

export function createTodoRepository(): TodoRepository {
	switch (getActiveProvider()) {
		case 'supabase':
			return createSupabaseRepository();
		case 'turso':
			return createTursoRepository();
		default:
			return createMemoryRepository();
	}
}
