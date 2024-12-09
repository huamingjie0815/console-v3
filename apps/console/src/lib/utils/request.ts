import { env } from '$env/dynamic/private';
import { ErrorCode, type IUser } from '$lib/types/base';

interface IRequestInit extends RequestInit {
	[key: string]: any;
}
export interface IResp<T> {
	code: number;
	message: string;
	data?: T;
}

type IFetch = (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;

/**
 * server request
 */
export class Request {
	userId?: string;
	base: string = 'innerapi';
	f: IFetch = fetch;
	constructor() {}

	private async getDomain() {
		const ip = env.SERVER_HTTP_HOST;
		const port = env.SERVER_HTTP_PORT;
		return `http://${ip}:${port}/${this.base}`;
	}

	public user(user: IUser) {
		this.userId = user?.id;
		return this;
	}

	public useFetch(f: IFetch) {
		this.f = f;
		return this;
	}

	async request<T = unknown>(url: string, options: IRequestInit = {}) {
		const domain = await this.getDomain();
		try {
			const resp = await this.f(`${domain}${url}`, {
				...options,
				headers: {
					...options.headers,
					...(this.userId
						? {
								'X-User-Id': this.userId
							}
						: {})
				}
			});
			if (!resp.ok) {
				throw resp.statusText;
			}
			const ret = await (resp.json() as Promise<IResp<T>>);
			console.info(url, resp.status, ret.code);
			return ret;
		} catch (err) {
			console.error(url, err);
			return {
				code: ErrorCode.InternalError,
				message: '系统内部错误'
			};
		}
	}

	async get<T = unknown>(url: string, params?: Record<string, any>, options: IRequestInit = {}) {
		const p =
			params &&
			Object.fromEntries(
				Object.entries(params).filter((par) => {
					return !!par[1];
				})
			);
		const searchStr = new URLSearchParams(p).toString();
		if (searchStr === '' || searchStr === undefined)
			return this.request<T>(url, { ...options, method: 'GET' });
		return this.request<T>(`${url}?${searchStr}`, { ...options, method: 'GET' });
	}

	async post<T = unknown>(url: string, data: Record<string, any>, options: IRequestInit = {}) {
		return this.request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) });
	}

	async put<T = unknown>(url: string, data: Record<string, any>, options: IRequestInit = {}) {
		return this.request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(data) });
	}

	async del<T = unknown>(url: string, options: IRequestInit = {}) {
		return this.request<T>(url, { ...options, method: 'DELETE' });
	}

	async patch<T = unknown>(url: string, data: Record<string, any>, options: IRequestInit = {}) {
		return this.request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) });
	}

	async upload<T = unknown>(url: string, data: FormData, options: IRequestInit = {}) {
		return this.request<T>(url, { ...options, method: 'POST', body: data });
	}
}

const req = new Request();
export default req;
