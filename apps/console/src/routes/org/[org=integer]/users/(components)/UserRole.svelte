<script lang="ts">
	import { page } from '$app/stores';
	import Empty from '$lib/components/ui-extend/empty/Empty.svelte';
	import Transfer, { type ITransferData } from '$lib/components/ui-extend/transfer/Transfer.svelte';
	import Badge from '@repo/ui/components/ui/badge/badge.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as Tooltip from '@repo/ui/components/ui/tooltip';
	import type { IRole, IRoleList } from '$lib/types/base';
	import { loadDone } from '$lib/utils/common';
	import msg from '$lib/utils/message';
	import pageReq from '$lib/utils/page-request';

	type $$TransferData = ITransferData<IRole>;
	export let roles: IRole[] | undefined;
	let isEdit: boolean = false;
	let currentPage: number = 1;
	let pageSize: number = 20;
	let disableSave: boolean = false;

	let allRoles: $$TransferData[] = [];
	let checkedRoles: $$TransferData[] = [];
	let showLoadMore: boolean = true;
	let loading: boolean = false;

	$: {
		checkedRoles =
			roles?.map<$$TransferData>((item) => {
				return getTransferData(item);
			}) || [];
	}

	const getTransferData = (item: IRole): $$TransferData => {
		return {
			key: item.key,
			name: item.name,
			description: `${item.key} ${item.description}`,
			checked: true,
			origin: item,
			disabled: item.key === 'member'
		};
	};

	const save = async () => {
		isEdit = false;
		if (checkedRoles) {
			try {
				const resp = await pageReq.put<{
					roles: IRole[];
					failed: string;
				}>(`/org/${$page.params.org}/users/${$page.params.userId}/roles`, {
					roleKeys: checkedRoles.map((item) => item.key)
				});
				msg.success('保存用户角色配置成功');
				checkedRoles = resp.data?.roles?.map((item) => getTransferData(item)) || [];
			} catch (error: any) {
				msg.error('保存用户角色配置异常:' + error.message);
			}
		}
	};

	const getRoles = async () => {
		try {
			loading = true;
			const resp = await pageReq.get<IRoleList>(
				`/org/${$page.params.org}/users/${$page.params.userId}/roles`,
				{
					page: currentPage,
					pageSize: pageSize
				}
			);
			if (resp.code !== 0 || !resp.data) {
				throw new Error(resp.message);
			}
			showLoadMore = !loadDone(resp.data.pages);

			return resp.data.list.map((item) => {
				return getTransferData(item);
			});
		} catch (error: any) {
			// 无法修改
			msg.error('获取角色列表异常:' + error.message);
			disableSave = true;
			return [];
		} finally {
			loading = false;
		}
	};

	const onCheckedChange = (e: CustomEvent) => {
		checkedRoles = e.detail.checked;
	};

	const onEdit = async () => {
		isEdit = true;
		if (allRoles.length === 0) {
			currentPage = 1;
			allRoles = await getRoles();
		}
	};

	const onLoadMore = async () => {
		currentPage++;
		const roles = await getRoles();
		allRoles = [...allRoles, ...roles];
	};


</script>

<div class="card mt-2">
	<div class="card-title">
		<span class=" flex-1">角色信息</span>
		{#if checkedRoles}
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
						title: '所有角色',
						data: allRoles
					}}
					checkedData={{
						title: '已选角色',
						data: checkedRoles
					}}
					{showLoadMore}
					{loading}
					on:change={onCheckedChange}
					on:loadMore={onLoadMore}
				/>
			</div>
		{:else if checkedRoles}
			<div class="flex flex-wrap gap-2">
				{#each checkedRoles as role (role.key)}
					<Tooltip.Root>
						<Tooltip.Trigger><Badge>{role.name}</Badge></Tooltip.Trigger>
						<Tooltip.Content>
							<p>{`${role.description}(${role.key})`}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</div>
		{:else}
			<Empty />
		{/if}
	</div>
</div>
