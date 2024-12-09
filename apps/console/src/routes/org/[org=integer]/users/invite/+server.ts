import { checkPhone } from '$lib/utils/common.js';
import req from '$lib/utils/request.js';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request, params }) => {
	const { phone } = await request.json();
	if (!phone || !checkPhone(phone)) {
		return error(400, '手机号码不正确');
	}
  const orgId = params.org;
	const resp = await req.post<{
		phone: string;
	}>(`/org/${orgId}/user/invite`, {
		phone
	});

	return json(resp);
};
