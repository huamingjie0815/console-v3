import type { IOrg } from '$lib/types/base';
import req from '$lib/utils/request';
import { json } from '@sveltejs/kit';

export const PUT = async ({ locals, params, request }) => {
	const orgId = params.org;
	const user = locals.user;
	const { name } = (await request.json()) as Partial<IOrg>;
	const resp = await req.user(user).put(`/org/${orgId}`, {
		name
	} as Partial<IOrg>);
	return json(resp);
};
