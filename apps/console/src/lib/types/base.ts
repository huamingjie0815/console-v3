export enum ErrorCode {
	NoAuthorized = 61,
	InternalError = 500
}

export enum HttpCode {
	BadRequest = 400,
	NoAuthorized = 401,
	Forbidden = 403,
	InternalError = 500
}

export const Admin = 'administrator'
export interface IAnyObject {
	[key: string]: any;
}

export interface IUser {
	id: string;
	name: string;
	phone: string;
	email?: string;
}

export interface IUserDetail extends IUser {
	roles: IRole[];
	allowPermissions: IPermissionDetail[];
	denyPermissions: IPermissionDetail[];
}

export interface IUserList {
	list: IUser[];
	pages: IPagination;
}

export interface IOrg {
	id: string;
	name: string;
	status: string;
	activate: boolean;
	expire: string;
	created_at: string;
	activated_at: string;
	expired_at: string;
	updated_at: string;
	navs?: INav[];
	settings? :IOrgSettings
}

export interface IOrgSettings {
	data_mode: string;
	data_push_duration: number;
	connect_mqtt_limit: number
}

export interface INav {
	key: string;
	name: string;
	ename: string;
	sub_navs: INav[];
}

export interface IRole {
	key: string;
	org_id: number;
	name: string;
	description: string;
	created_at: string;
	type: string;
}

export interface IRoleDetail extends IRole {
	permissions: IPermission[];
	users: IUser[] | null;
}
export interface IRoleList {
	list: IRole[];
	pages: IPagination;
}

export interface IPermission {
	key: string;
	actions: string[];
	name: string;
	description: string;
	app_info: IAppInfo;
}

// allow / deny ，扁平的权限
export interface IPermissionDetail {
	key: string;
	action: string;
	name: string;
	description: string;
	app_id: number;
}

export interface IAppInfo {
	id: number;
	key: string;
	name: string;
	description: string;
}

export interface IPagination {
	total: number;
	pageCount: number;
	page: number;
	pageSize: number;
}

export interface IInviteUser {
	id: number;
	orgId: number;
	phone: string;
	userId: number;
	createdAt: string;
	expire: boolean;
	result: number;
}

export interface IInviteUserDetail extends IInviteUser {
	userDetail?: IUser;
	orgDetail?: IOrg;
}

export interface IInviteUserList {
  list: IInviteUser[];
  pages: IPagination
}
export interface IMqTTClient {
	client_id: string;
	username: string;
	password: string;
	description: string;
	created_at: string;
	updated_at: string
}
