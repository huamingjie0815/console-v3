import type { IInviteUserList } from '$lib/types/base.js';
import { getURLParams } from '$lib/utils/common.js';
import req from '$lib/utils/request.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals, url, params }) => {
	const pageSize = Number(url.searchParams.get('pageSize'));
	const page = Number(url.searchParams.get('page'));
  const phone = url.searchParams.get('phone')

	if (!pageSize || !page) {
    if (!phone) {
      throw redirect(
        307,
        getURLParams({
          page: 1,
          pageSize: 10
        })
      );
    }
	}
	const orgId = params.org;

	const resp = await req
		.user(locals.user)
		.get<IInviteUserList>(`/org/${orgId}/user/invite`, {
			PageSize: pageSize,
			Page: page,
      Phone: phone
		})
		.catch((err) => {
			throw error(400, err);
		});

	return resp;
};
