import { redirect } from '@sveltejs/kit';

export const load = async ({ untrack, url }) => {
	if (untrack(() => url.pathname === '/')) {
		throw redirect(307, `/org`);
	}
};
