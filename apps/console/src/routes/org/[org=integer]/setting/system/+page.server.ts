import type { IMqTTClient, IOrg } from '$lib/types/base'
import req from '$lib/utils/request.js'
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const orgId = params.org;
	if (!orgId) {
		throw redirect(307, '/org');
	}

    return {
        orgInfo: await req.user(locals.user).get<IOrg>(`/org/${orgId}`),
        mqttClients: await req.user(locals.user).get<IMqTTClient[]>(`/org/${orgId}/mqttClient`)
    }
}