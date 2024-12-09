
import type { IUserList } from '$lib/types/base.js';
import req from '$lib/utils/request.js';
import { error, json } from '@sveltejs/kit';

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

export const PUT = async ({ locals, params, request }) => {
	const { users } = await request.json();
	if (users) {
		const orgId = params.org;
		const key = params.key
		const resp = await req.user(locals.user).put(`/org/${orgId}/role/${key}/user`, {
			users
		});
		return json(resp)
	}
	return error(400, '参数不正确');
};