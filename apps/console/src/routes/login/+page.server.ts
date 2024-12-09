import { genToken } from '$lib/utils/jwt';
import { fail, redirect } from '@sveltejs/kit';
import req from '$lib/utils/request';
import type { IUser } from '$lib/types/base';
import type { Actions } from './$types';
import { checkCode, checkPhone, checkPwd } from '$lib/utils/common';

export const actions = {
	password: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const phone = formData.get('phone') as string;
		const password = formData.get('password') as string;


		if (!phone || !checkPhone(phone)) {
			return fail(400, { phone, verifyError: true });
		}
		if (!password || !checkPwd(password)) {
			return fail(400, { phone, verifyError: true });
		}

		let userInfo = {};
		try {
			const resp = await req.post<IUser>('/user/verify/password', {
				password,
				phone
			});
			if (resp.code !== 0) {
				return fail(400, {
					phone,
					verifyError: true
				});
			}
			userInfo = {
				...resp.data,
				id: `${resp.data?.id}`
			};
		} catch (error) {
			console.error(error);
			return fail(400, {
				phone,
				loginError: true
			});
		}

		const jwtToken = genToken(userInfo);
		cookies.set('Authorization', `Bearer ${jwtToken}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 3
		});
		throw redirect(307, url.searchParams.get('redirect') || '/org');
	},
	code: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const phone = formData.get('phone') as string;
		const code = formData.get('code') as string;

		if (!phone || !checkPhone(phone)) {
			return fail(400, { phone, verifyError: true });
		}
		if (!code || !checkCode(code)) {
			return fail(400, { code, verifyError: true });
		}

		let userInfo = {};
		try {
			const resp = await req.post<IUser>('/user/verify/code', {
				code,
				phone
			});
			if (resp.code !== 0) {
				return fail(400, {
					phone,
					verifyError: true
				});
			}
			userInfo = {
				...resp.data,
				id: `${resp.data?.id}`
			};
		} catch (error) {
			console.error(error);
			return fail(400, {
				phone,
				loginError: true
			});
		}

		const jwtToken = genToken(userInfo);
		cookies.set('Authorization', `Bearer ${jwtToken}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 3
		});
		throw redirect(307, url.searchParams.get('redirect') || '/org');
	}
} satisfies Actions;
