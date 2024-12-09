import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ locals, params }) => {
	const orgId = params.org;
	const userId = params.userId;
	const resp = await req.user(locals.user).del(`/org/${orgId}/user/${userId}`);
	return json(resp);
};