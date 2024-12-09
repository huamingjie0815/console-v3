import type { IResp } from "$lib/utils/request.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {
	cookies.delete('Authorization', {
    path: '/'
  });
	return json({
		code: 0,
		message: 'ok',
	} as IResp<null>, {
		status: 200
	})
};