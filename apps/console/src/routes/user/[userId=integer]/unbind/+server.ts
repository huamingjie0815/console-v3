import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals, params }) => {
	// const { phone } = await request.json();

	const resp = await req
		.user(locals.user)
		.post(`/user/${params.userId}/unbind/phone`, {});
	return json(resp);
}