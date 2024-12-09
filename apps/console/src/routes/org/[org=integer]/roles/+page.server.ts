import type { IRoleList } from '$lib/types/base.js';
import { getURLParams } from '$lib/utils/common.js';
import req from '$lib/utils/request.js';
import { error, redirect } from '@sveltejs/kit';



export const load = async ({ locals, url, params }) => {
	const pageSize = url.searchParams.get('pageSize');
	const page = url.searchParams.get('page');
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
	const resp = await req.user(locals.user).get<IRoleList>(`/org/${orgId}/role`, {
		PageSize: pageSize,
		Page: page,
		ignoreTypes: ['member']
	}).catch(err => {
		throw error(400, err)
	});

	return resp;
};
