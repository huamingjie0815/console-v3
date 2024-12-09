import req from '$lib/utils/request.js';
import { error, json } from '@sveltejs/kit';

export const PUT = async ({ locals, params, request }) => {
	const { permissions } = await request.json();
	if (permissions) {
		const orgId = params.org;
		const userId = params.userId
		console.log(permissions)
		const resp = await req.user(locals.user).put(`/org/${orgId}/user/${userId}/denyPermissions`, {
			permissions
		});
		return json(resp)
	}
	return error(400, '参数不正确');
};
