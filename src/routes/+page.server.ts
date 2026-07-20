import { createSupabaseClient } from '$lib/supabase/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const TITLE_MAX_LENGTH = 120;
const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value: string) {
	return UUID_REGEX.test(value);
}

export const load: PageServerLoad = async () => {
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from('todos')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		return {
			todos: [],
			loadError: 'Could not load todos right now. Please try again.'
		};
	}

	return {
		todos: data,
		loadError: null
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();

		if (!title) {
			return fail(400, {
				createError: 'Title is required.'
			});
		}

		if (title.length > TITLE_MAX_LENGTH) {
			return fail(400, {
				createError: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`
			});
		}

		const supabase = createSupabaseClient();
		const { error } = await supabase.from('todos').insert({ title });

		if (error) {
			return fail(500, {
				createError: 'Could not create todo right now. Please try again.'
			});
		}

		return {
			createSuccess: true
		};
	},

	toggle: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const nextStateRaw = String(formData.get('next_state') ?? '');

		if (!isValidUuid(id)) {
			return fail(400, {
				itemError: 'Invalid todo id.'
			});
		}

		if (nextStateRaw !== 'true' && nextStateRaw !== 'false') {
			return fail(400, {
				itemError: 'Invalid todo state.'
			});
		}

		const nextState = nextStateRaw === 'true';
		const supabase = createSupabaseClient();
		const { error } = await supabase.from('todos').update({ is_done: nextState }).eq('id', id);

		if (error) {
			return fail(500, {
				itemError: 'Could not update todo right now. Please try again.'
			});
		}

		return {
			itemSuccess: true
		};
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		if (!isValidUuid(id)) {
			return fail(400, {
				itemError: 'Invalid todo id.'
			});
		}

		const supabase = createSupabaseClient();
		const { error } = await supabase.from('todos').delete().eq('id', id);

		if (error) {
			return fail(500, {
				itemError: 'Could not delete todo right now. Please try again.'
			});
		}

		return {
			itemSuccess: true
		};
	}
};
