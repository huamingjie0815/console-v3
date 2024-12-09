import req from '$lib/utils/request';
import { json } from '@sveltejs/kit';

export const PUT = async ({ params, locals }) => {
	const orgId = params.org;
	const clientId = params.clientId;
	const user = locals.user;

	const resp = await req.user(user).put(`/org/${orgId}/mqttClient/${clientId}/reset`, {});
	return json(resp);
};
