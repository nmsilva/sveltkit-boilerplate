export type Todo = {
	id: string;
	title: string;
	is_done: boolean;
	created_at: string;
};

export interface TodoRepository {
	list(): Promise<Todo[]>;
	create(title: string): Promise<void>;
	toggle(id: string, isDone: boolean): Promise<void>;
	remove(id: string): Promise<void>;
}
