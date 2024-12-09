import req from '$lib/utils/request.js';
import { error, redirect } from '@sveltejs/kit';
import { getURLParams } from '$lib/utils/common.js';
import type { IUserList } from '$lib/types/base.js';



export const load = async ({ url, params, locals }) => {
	const pageSize = Number(url.searchParams.get('pageSize'));
	const page = Number(url.searchParams.get('page'));
	if (!pageSize || !page) {
		throw redirect(
			307,
			getURLParams({
				page: 1,
				pageSize: 10
			})
		);
	}
	const orgId = params.org;

	const resp = await req.user(locals.user).get<IUserList>(`/org/${orgId}/user`, {
		PageSize: pageSize,
		Page: page
	}).catch(err => {
		throw error(400, err)
	});

	return resp;
};
