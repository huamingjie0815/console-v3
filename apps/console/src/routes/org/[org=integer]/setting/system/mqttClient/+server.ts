import type { IMqTTClient } from '$lib/types/base.js';
import req from '$lib/utils/request';
import { json } from '@sveltejs/kit';


export const GET = async ({ params, locals }) => {
	const orgId = params.org;
	const resp = await req.user(locals.user).get<IMqTTClient[]>(`/org/${orgId}/mqttClient`)
	return json(resp);
};

export const POST = async ({ params, locals }) => {
	const orgId = params.org;
	const user = locals.user;
	const resp = await req.user(user).post<IMqTTClient>(`/org/${orgId}/mqttClient`, {});
	return json(resp);
};

