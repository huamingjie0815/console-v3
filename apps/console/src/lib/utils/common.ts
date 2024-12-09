import type { IPagination } from '$lib/types/base';
import dayjs from 'dayjs'
export const getURL = (url: string, params?: Record<string, any>): string => {
	const p =
		params &&
		Object.fromEntries(
			Object.entries(params).filter((par) => {
				return !!par[1];
			})
		);
	const searchStr = new URLSearchParams(p).toString();
	return `${url}?${searchStr}`;
};

export const getURLParams = (params?: Record<string, any>): string => {
	const p =
		params &&
		Object.fromEntries(
			Object.entries(params).filter((par) => {
				return !!par[1];
			})
		);
	return `?${new URLSearchParams(p).toString()}`;
};

const ACTION: {
	[key: string]: string;
} = {
	read: '可读',
	manage: '管理'
};
export const translatePermission = (action: string) => {
	return ACTION[action] || ''
};

export const formatTime = (time: string | undefined, formatter = "YYYY/MM/DD HH:mm:ss") => {
	if (!time) {
		return ''
	}
	return dayjs(time).format(formatter)
}

export const checkPhone = (phone: string) => {
	return /^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(phone);
}

export const checkPwd = (pwd: string) => {
	return /^(?![a-zA-Z]+$)(?!\d+$)[A-Za-z\d\S]{6,16}$/.test(pwd);
}

export const checkCode = (code: string) => {
	return /^[0-9]{6}$/.test(code);
}

export const loadDone = (pages: IPagination):boolean => {
	return pages.pageCount <= pages.page
}