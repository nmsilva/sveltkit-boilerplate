import { createTodoRepository, isDemoMode } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const TITLE_MAX_LENGTH = 120;
type TodoFilter = 'all' | 'active' | 'completed';

function getFilter(value: string | null): TodoFilter {
	return value === 'active' || value === 'completed' ? value : 'all';
}

function isValidTodoId(value: string) {
	return value.trim().length > 0 && value.length <= 200;
}

function redirectToFilter(formData: FormData): never {
	const filter = getFilter(String(formData.get('filter') ?? null));
	throw redirect(303, filter === 'all' ? '/' : `/?filter=${filter}`);
}

export const load: PageServerLoad = async ({ url }) => {
	const filter = getFilter(url.searchParams.get('filter'));
	try {
		const repository = createTodoRepository();
		const allTodos = await repository.list();
		const todos = filter === 'active'
			? allTodos.filter((todo) => !todo.is_done)
			: filter === 'completed'
				? allTodos.filter((todo) => todo.is_done)
				: allTodos;
		return {
			todos,
			activeCount: allTodos.filter((todo) => !todo.is_done).length,
			filter,
			loadError: null,
			demo: isDemoMode()
		};
	} catch {
		return { todos: [], activeCount: 0, filter, loadError: 'Could not load todos right now. Please try again.', demo: isDemoMode() };
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();

		if (!title) return fail(400, { createError: 'Title is required.' });
		if (title.length > TITLE_MAX_LENGTH) {
			return fail(400, { createError: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.` });
		}

		try {
			await createTodoRepository().create(title);
		} catch {
			return fail(500, { createError: 'Could not create todo right now. Please try again.' });
		}
		return redirectToFilter(formData);
	},

	toggle: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const nextStateRaw = String(formData.get('next_state') ?? '');

		if (!isValidTodoId(id)) return fail(400, { itemError: 'Invalid todo id.' });
		if (nextStateRaw !== 'true' && nextStateRaw !== 'false') {
			return fail(400, { itemError: 'Invalid todo state.' });
		}

		try {
			await createTodoRepository().toggle(id, nextStateRaw === 'true');
		} catch {
			return fail(500, { itemError: 'Could not update todo right now. Please try again.' });
		}
		return redirectToFilter(formData);
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		if (!isValidTodoId(id)) return fail(400, { itemError: 'Invalid todo id.' });
		try {
			await createTodoRepository().remove(id);
		} catch {
			return fail(500, { itemError: 'Could not delete todo right now. Please try again.' });
		}
		return redirectToFilter(formData);
	},

	clearCompleted: async ({ request }) => {
		const formData = await request.formData();
		try {
			const repository = createTodoRepository();
			const todos = await repository.list();
			for (const todo of todos) {
				if (todo.is_done) await repository.remove(todo.id);
			}
		} catch {
			return fail(500, { itemError: 'Could not clear completed todos right now. Please try again.' });
		}
		return redirectToFilter(formData);
	}
};
