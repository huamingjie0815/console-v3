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

export const POST = async ({ locals, params, request }) => {
	const { key, name, description } = await request.json()
	if (!key || !name) {
		return error(400, '参数不正确')
	}
	const orgId = params.org;
	const resp = await req.user(locals.user).post<IRoleList>(`/org/${orgId}/role`, {
		key,
		name,
		description
	});
	return json(resp);
};
