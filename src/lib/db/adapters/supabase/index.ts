import { createClient } from '@supabase/supabase-js';
import type { Todo, TodoRepository } from '../../types';

type SupabaseRow = Todo;
type SupabaseResult<T> = Promise<{ data: T; error: Error | null }>;
type SupabaseClientLike = {
	from(table: 'todos'): {
		select(columns: string): { order(column: string, options: { ascending: boolean }): SupabaseResult<SupabaseRow[]> };
		insert(values: { title: string }): SupabaseResult<null>;
		update(values: { is_done: boolean }): { eq(column: string, value: string): SupabaseResult<null> };
		delete(): { eq(column: string, value: string): SupabaseResult<null> };
	};
};
export type SupabaseRepositoryConfig = {
	url?: string;
	anonKey?: string;
	client?: SupabaseClientLike;
};

type Database = {
	public: {
		Tables: {
			todos: {
				Row: Todo;
				Insert: { title: string; id?: string; is_done?: boolean; created_at?: string };
				Update: Partial<{ title: string; id: string; is_done: boolean; created_at: string }>;
				Relationships: [];
			};
		};
	};
};

function getConfig(): SupabaseRepositoryConfig {
	return { url: process.env.PUBLIC_SUPABASE_URL, anonKey: process.env.PUBLIC_SUPABASE_ANON_KEY };
}

export function createTodoRepository(config: SupabaseRepositoryConfig = {}): TodoRepository {
	const resolved = { ...getConfig(), ...config };
	if (!resolved.client) {
		if (!resolved.url || !resolved.anonKey) {
			throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
		}
		resolved.client = createClient<Database>(resolved.url, resolved.anonKey, {
			auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
		}) as unknown as SupabaseClientLike;
	}
	const client = resolved.client!;

	return {
		async list() {
			const { data, error } = await client.from('todos').select('*').order('created_at', { ascending: false });
			if (error) throw new Error('Could not list todos', { cause: error });
			return data;
		},
		async create(title) {
			const { error } = await client.from('todos').insert({ title });
			if (error) throw new Error('Could not create todo', { cause: error });
		},
		async toggle(id, isDone) {
			const { error } = await client.from('todos').update({ is_done: isDone }).eq('id', id);
			if (error) throw new Error('Could not update todo', { cause: error });
		},
		async remove(id) {
			const { error } = await client.from('todos').delete().eq('id', id);
			if (error) throw new Error('Could not delete todo', { cause: error });
		}
	};
}
