import type { IUser } from '$lib/types/base';
import { verifyToken } from '$lib/utils/jwt';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const { pathname } = event.url;
	if (['/login', '/logout', '/code'].some((url) => pathname?.indexOf(url) > -1)) {
		return await resolve(event);
	}

	const authorization =
		event.cookies.get('Authorization') || event.request.headers.get('Authorization');
	if (!authorization || !authorization.startsWith('Bearer ')) {
		throw redirect(307, `/login?redirect=${encodeURIComponent(event.request.url)}`);
	}

	const token = authorization.split('Bearer ')[1];
	try {
		const userInfo = verifyToken(token) as IUser;
		if (!userInfo || !userInfo.id) {
			throw new Error('Invalid token');
		}

		event.locals.user = userInfo;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		throw redirect(307, `/login?redirect=${encodeURIComponent(event.request.url)}`);
	}

	const resp = await resolve(event);
	return resp;
}

export async function handleError({ error }) {
	console.error(error);
}
