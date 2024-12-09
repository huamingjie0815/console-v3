import type { IRoleList } from '$lib/types/base.js';
import req from '$lib/utils/request.js';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ params, locals, url }) => {
	const pageSize = url.searchParams.get('pageSize');
	const page = url.searchParams.get('page');

	const orgId = params.org;
	const resp = await req.user(locals.user).get<IRoleList>(`/org/${orgId}/role`, {
		PageSize: pageSize,
		Page: page,
		ignoreTypes: ['member']
	});
	return json(resp);
};

export const PUT = async ({ locals, params, request }) => {
	const { roleKeys } = await request.json();
	if (roleKeys) {
		const orgId = params.org;
		const userId = params.userId;
		const resp = await req.user(locals.user).put(`/org/${orgId}/user/${userId}/roles`, {
			roleKeys
		});
		return json(resp);
	}
	return error(400, '参数不正确');
};
