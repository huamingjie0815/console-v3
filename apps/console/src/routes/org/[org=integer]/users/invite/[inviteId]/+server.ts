import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals, params, request }) => {
	const { accept } = await request.json();
	const orgId = params.org;
	const inviteId = params.inviteId;

	const resp = await req
		.user(locals.user)
		.post(`/org/${orgId}/user/invite/${inviteId}`, {
			accept
		});
	return json(resp);
};


export const DELETE = async ({ locals, params }) => {
	const orgId = params.org;
	const inviteId = params.inviteId;

	const resp = await req
		.user(locals.user)
		.del(`/org/${orgId}/user/invite/${inviteId}`);
	return json(resp);
};