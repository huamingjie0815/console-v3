
import type { IRoleDetail } from '$lib/types/base.js';
import req from '$lib/utils/request.js';

export const load = async ({ locals, params }) => {
	const orgId = params.org;
	const key = params.key;

	return {
		roleDetailResp: req.user(locals.user).get<IRoleDetail>(`/org/${orgId}/role/${key}/detail`),
	};
};
