export const ssr = false;
import type { SideNavProps } from '$lib/components/ui-extend/side-nav/SideNav.svelte';
import { Admin, HttpCode, type IOrg, type IUserDetail } from '$lib/types/base.js';
import req from '$lib/utils/request.js';
import { redirect, error } from '@sveltejs/kit';

const LayoutIconMap: {
	[key: string]: string;
} = {
	users: 'lucide:users',
	devices: 'lucide:monitor',
	roles: 'lucide:book-user'
};

export const load = async ({ params, locals }) => {
	const { user } = locals;
	const orgId = params.org;
	if (!orgId) {
		throw redirect(307, '/org');
	}

	let menus: SideNavProps['menus'] = [];
	// 获取当前登录用户的集团详细信息, 包含nav
	const resp = await Promise.all([
		req.user(user).get<IOrg>(`/org/${orgId}/currentUser`),
		req.user(user).get<IUserDetail>(`/org/${orgId}/user/${user.id}`)
	]).catch((e: any) => {
		console.error(e);
		throw error(HttpCode.InternalError, '查询当前用户信息错误');
	});

	if (resp.some((item) => item.code !== 0)) {
		throw error(HttpCode.Forbidden, '无权限访问');
	}
	const { navs = [] } = resp[0].data || {};
	// 设置路由
	menus = navs.map(({ key, name }) => {
		return {
			url: `/org/${orgId}/${key}`,
			icon: LayoutIconMap[key],
			label: name
		};
	});

	const { roles = [] } = resp[1].data || {};
	if (roles.some((item) => item.key === Admin)) {
		menus.push({
			url: '',
			icon: 'lucide:settings',
			label: '系统设置',
			children: [{
				url: `/org/${orgId}/setting/system`,
				icon: 'lucide:settings',
				label: '配置管理',
			}]
		});
	}
	return {
		menus
	};
};
