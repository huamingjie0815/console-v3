import type { IPermission } from '$lib/types/base.js';
import req from '$lib/utils/request.js';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ params, locals }) => {
	const orgId = params.org;
	const resp = await req.user(locals.user).get<IPermission[]>(`/org/${orgId}/permissions`);
	return json(resp);
};

export const PUT = async ({ locals, params, request }) => {
	const { permissions } = await request.json();
	if (permissions) {
		const orgId = params.org;
		const key = params.key
		const resp = await req.user(locals.user).put(`/org/${orgId}/role/${key}/permission`, {
			permissions
		});
		return json(resp)
	}
	return error(400, '参数不正确');
};