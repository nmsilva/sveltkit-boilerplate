import { createTodoRepository } from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const TITLE_MAX_LENGTH = 120;

function isValidTodoId(value: string) {
	return value.trim().length > 0 && value.length <= 200;
}

export const load: PageServerLoad = async () => {
	try {
		const repository = createTodoRepository();
		return { todos: await repository.list(), loadError: null };
	} catch {
		return { todos: [], loadError: 'Could not load todos right now. Please try again.' };
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
		return { createSuccess: true };
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
		return { itemSuccess: true };
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
		return { itemSuccess: true };
	}
};
