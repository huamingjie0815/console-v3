import type { IInviteUser, IOrg, IUser } from '$lib/types/base.js'
import req from '$lib/utils/request.js'

interface IUserInfo extends IUser {
  orgs: IOrg[];
  invites: IInviteUser[]
}
export const load = async ({ locals }) => {
  return {
    userDetailResp: await req.user(locals.user).get<IUserInfo>(`/user/${locals.user.id}`)
  }
}