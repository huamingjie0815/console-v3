import { HttpCode, type IInviteUserDetail } from '$lib/types/base.js';
import req from '$lib/utils/request.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const orgId = url.searchParams.get('orgId');
	const inviteId = url.searchParams.get('inviteId');

	const resp = await req
		.user(locals.user)
		.get<IInviteUserDetail>(`/org/${orgId}/user/invite/${inviteId}`);

	if (resp.code !== 0) {
		throw error(HttpCode.InternalError, resp.message);
	}
	console.log(resp, locals.user)
	if (resp.data?.phone === locals.user.phone) {
		return {
			inviteDetail: resp.data
		};
	} else {
		return {
			error: '当前已登录用户与被邀请用户信息不匹配'
		};
	}
};
