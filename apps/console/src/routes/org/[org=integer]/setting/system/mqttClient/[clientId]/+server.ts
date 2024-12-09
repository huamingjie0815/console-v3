import type { IMqTTClient } from '$lib/types/base';
import req from '$lib/utils/request';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ params, locals }) => {
	const orgId = params.org;
    const clientId = params.clientId;
	const user = locals.user;
	const resp = await req.user(user).del<IMqTTClient>(`/org/${orgId}/mqttClient/${clientId}`);
	return json(resp);
};