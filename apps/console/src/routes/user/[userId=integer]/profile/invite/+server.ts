import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
	const { accept, orgId, inviteId } = await request.json();

	const resp = await req
		.user(locals.user)
		.post(`/org/${orgId}/user/invite/${inviteId}`, {
			accept
		});
	return json(resp);
};
