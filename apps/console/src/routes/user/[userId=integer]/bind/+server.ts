import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals, params, request }) => {
	const { phone, code } = await request.json();

	const resp = await req
		.user(locals.user)
		.post(`/user/${params.userId}/bind/phone`, {
      code,
      phone
    });
	return json(resp);
}