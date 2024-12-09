<script lang="ts">
	import msg from '$lib/utils/message';
	import { Button } from '@repo/ui/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getURLParams } from '$lib/utils/common';
	import type { IUser, IUserList } from '$lib/types/base.js';
	import type { TableColumns } from '$lib/components/ui-extend/table/Table.svelte';
	import Table from '$lib/components/ui-extend/table/Table.svelte';
	import OperationCell from './(components)/OperationCell.svelte';
	import pageReq from '$lib/utils/page-request';

	export let data;
	let dataSource: IUserList['list'] = [];
	let pagination: IUserList['pages'];
	$: {
		dataSource = data?.data?.list || [];
		pagination = data?.data?.pages || {
			page: 1,
			total: 0,
			pageCount: 0,
			pageSize: 10
		};
		if (data?.code !== 0) {
			msg.error(data?.message);
		}
	}

	const onPageChange = async (currentPage: number) => {
		goto(
			getURLParams({
				page: currentPage,
				pageSize: pagination.pageSize
			})
		);
	};

	const onInvite = () => {
		goto(`${$page.url.pathname}/invite`);
	};

	const onDeleteUser = async (user: IUser) => {
		try {
			const resp = await pageReq.del(`/org/${$page.params.org}/users/${user.id}`)
			msg.success("删除用户成功")
			location.reload()
		} catch (error: any) {
			msg.error('删除用户失败:' + error.message)
		}
	}

	const columns: TableColumns<IUser> = [
		{
			title: 'ID',
			class: 'w-[100px]',
			value: (v) => v.id
		},
		{
			title: '名称',
			class: 'w-[200px]',
			value: (v) => v.name
		},
		{
			title: '手机号码',
			class: 'w-[200px]',
			value: (v) => v.phone
		},
		// {
		// 	title: '邮箱',
		// 	class: 'w-[200px]',
		// 	value: (v) => v.email
		// },
		{
			title: '操作',
			class: 'w-[200px] text-center',
			renderComponent: {
				component: OperationCell,
				props: {
					onDeleteUser
				}
			}
		}
	];


</script>

<div class="mb-2 flex flex-row gap-2 justify-end">
	<Button size="sm" on:click={onInvite}>邀请用户</Button>
</div>
<Table
	{dataSource}
	{columns}
	pagination={{
		...pagination,
		onPageChange
	}}
/>
