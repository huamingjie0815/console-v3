<script lang="ts">
	import { page } from '$app/stores';
	import Empty from '$lib/components/ui-extend/empty/Empty.svelte';
	import Transfer, { type ITransferData } from '$lib/components/ui-extend/transfer/Transfer.svelte';
	import Badge from '@repo/ui/components/ui/badge/badge.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as Tooltip from '@repo/ui/components/ui/tooltip';
	import type { IRoleDetail, IUser, IUserList } from '$lib/types/base';
	import { loadDone } from '$lib/utils/common';
	import msg from '$lib/utils/message';
	import pageReq from '$lib/utils/page-request';

	type $$TransferData = ITransferData<IUser>;
	export let users: IUser[] | null | undefined;
	let isEdit: boolean = false;
	let currentPage: number = 1;
	let pageSize: number = 20;
	let disableSave: boolean = false;

	let allUsers: $$TransferData[] = [];
	let checkedUsers: $$TransferData[] = [];
	let showLoadMore: boolean = true;
	let loading: boolean = false;

	$: {
		checkedUsers =
			users?.map<$$TransferData>((item) => {
				return getTransferData(item);
			}) || [];

	}

	const getTransferData = (item: IUser): $$TransferData => {
		return {
			key: item.id,
			name: item.name,
			description: '',
			checked: true,
			origin: item
		};
	};

	const save = async () => {
		isEdit = false;
		if (checkedUsers) {
			try {
				const resp = await pageReq.put<{
					detail: IRoleDetail;
				}>(`/org/${$page.params.org}/roles/${$page.params.key}/users`, {
					users: checkedUsers.map((item) => item.key)
				});
				msg.success('保存角色关联用户配置成功');
				checkedUsers =
					resp.data?.detail?.users?.map<$$TransferData>((item) => {
						return getTransferData(item);
					}) || [];
			} catch (error: any) {
				msg.error('保存角色关联用户配置异常:' + error.message);
			}
		}
	};

	const getUsers = async () => {
		try {
			const resp = await pageReq.get<IUserList>(`/org/${$page.params.org}/roles/${$page.params.key}/users`, {
				page: currentPage,
				pageSize: pageSize
			});
			if (resp.code !== 0 || !resp.data) {
				throw new Error(resp.message);
			}
			showLoadMore = !loadDone(resp.data.pages);
			return resp.data.list.map((item) => getTransferData(item))
		} catch (error: any) {
			// 无法修改
			msg.error('获取用户列表异常:' + error.message);
			disableSave = true;
			return []
		}
	};

	const onCheckedChange = (e: CustomEvent) => {
		checkedUsers = e.detail.checked;
	};

	const onEdit = async () => {
		isEdit = true
		if (allUsers.length === 0) {
			currentPage = 1;
			allUsers = await getUsers();
		}
	}

	const onLoadMore = async () => {
		currentPage++;
		const users = await getUsers();
		allUsers = [...allUsers, ...users];
	};
</script>

<div class="card mt-2">
	<div class="card-title">
		<span class=" flex-1">关联用户</span>
		{#if users}
			{#if isEdit}
				<section>
					<Button size="sm" on:click={save} disabled={disableSave}>保存</Button>
					<Button size="sm" variant="outline" on:click={() => (isEdit = false)}>取消</Button>
				</section>
			{:else}
				<Button size="sm" on:click={onEdit}>修改</Button>
			{/if}
		{/if}
	</div>
	<div class="card-body">
		{#if isEdit}
			<div>
				<Transfer
					allData={{
						title: '所有用户',
						data: allUsers
					}}
					checkedData={{
						title: '已关联用户',
						data: checkedUsers
					}}
					{showLoadMore}
					{loading}
					on:change={onCheckedChange}
					on:loadMore={onLoadMore}
				/>
			</div>
		{:else if checkedUsers}
			<div class="flex flex-wrap gap-2">
				{#each checkedUsers as user, i}
					<Tooltip.Root>
						<Tooltip.Trigger><Badge>{user.name}</Badge></Tooltip.Trigger>
						<Tooltip.Content>
							<p>{`${user.name}(${user.key})`}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</div>
		{:else}
			<Empty />
		{/if}
	</div>
</div>
