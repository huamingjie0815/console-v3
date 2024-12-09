import type { IOrg } from '$lib/types/base';
import req from '$lib/utils/request';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

export const load = async ({ locals }: LayoutServerLoadEvent) => {
	const user = locals.user;
	if (!user) {
		throw redirect(307, '/login');
	}
	let orgs: IOrg[] = [];
	const { id } = user;
	try {
		const resp = await req.user(user).get<IOrg[]>(`/user/${id}/orgs`);
		orgs = resp.data?.map((o) => ({
			...o,
			id: `${o.id}`
		})) || [];
	} catch (error) {
		console.error('查询组织列表异常', error);
	}

	if (orgs.length === 0) {
		// 无可选组织，需要确认是否被邀请

	}
	return {
		orgs,
		user
	};
};
