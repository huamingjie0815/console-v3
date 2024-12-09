import req from '$lib/utils/request';
import { json } from '@sveltejs/kit';



export const PUT = async ({ params, locals, request }) => {
	const orgId = params.org;
	const clientId = params.clientId;
	const user = locals.user;
	const { description } = await request.json();
	const resp = await req.user(user).put(`/org/${orgId}/mqttClient/${clientId}/description`, {
		description
	});
	return json(resp);
};
