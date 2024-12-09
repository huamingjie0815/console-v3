import req from '$lib/utils/request.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { phone } = await request.json();
	const resp = await req.post(`/common/applyCode`, {
		phone
	});
	return json(resp);
};
