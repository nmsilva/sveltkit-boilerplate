export type Todo = {
	id: string;
	title: string;
	is_done: boolean;
	created_at: string;
};

export type Database = {
	public: {
		Tables: {
			todos: {
				Row: Todo;
				Insert: {
					id?: string;
					title: string;
					is_done?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					is_done?: boolean;
					created_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};
