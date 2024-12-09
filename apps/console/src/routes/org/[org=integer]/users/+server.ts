
import type { IUserList } from '$lib/types/base.js';
import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ params, locals, url }) => {
	const pageSize = url.searchParams.get('pageSize');
	const page = url.searchParams.get('page');

	const orgId = params.org;
	const resp = await req.user(locals.user).get<IUserList>(`/org/${orgId}/user`, {
		PageSize: pageSize,
		Page: page
	});
	return json(resp);
};
