import type { IOrgSettings } from '$lib/types/base';
import req from '$lib/utils/request';
import { json } from '@sveltejs/kit';

export const PUT = async ({ locals, params, request }) => {
	const orgId = params.org;
	const user = locals.user;
	const { data_mode, data_push_duration, connect_mqtt_limit } =
		(await request.json()) as Partial<IOrgSettings>;
	const resp = await req.user(user).put(`/org/${orgId}/settings`, {
		data_mode,
		data_push_duration,
		connect_mqtt_limit
	} as Partial<IOrgSettings>);
	return json(resp);
};
