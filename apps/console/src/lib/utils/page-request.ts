interface IRequestInit extends RequestInit {
	[key: string]: any;
}
interface IResp<T> {
	code: number;
	message: string;
	data: T;
}

/**
 * page request
 */
export class Request {
	base: string = '';
	constructor() {}
	async request<T = unknown>(url: string, options: IRequestInit = {}) {
		const resp = await fetch(`${url}`, {
			...options,
			headers: {
				...options.headers
			}
		});
		const ret = await (resp.json() as Promise<IResp<T>>);
		if (ret.code === 0) {
			return ret
		} else {
			throw new Error(ret.message)
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

const pageReq = new Request();
export default pageReq;
