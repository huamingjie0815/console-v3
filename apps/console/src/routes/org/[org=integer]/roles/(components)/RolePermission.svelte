<script lang="ts">
	import { page } from '$app/stores';
	import Empty from '$lib/components/ui-extend/empty/Empty.svelte';
	import Transfer, { type ITransferData } from '$lib/components/ui-extend/transfer/Transfer.svelte';
	import Badge from '@repo/ui/components/ui/badge/badge.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as Tooltip from '@repo/ui/components/ui/tooltip';
	import type { IPermission, IPermissionDetail, IRoleDetail } from '$lib/types/base';
	import { translatePermission } from '$lib/utils/common';
	import msg from '$lib/utils/message';
	import pageReq from '$lib/utils/page-request';
	import { createEventDispatcher, onMount } from 'svelte';

	type $$TransferData = ITransferData<IPermissionDetail>;
	const dispatch = createEventDispatcher<{
		save: {
			checkedData: $$TransferData[];
		};
	}>();
	export let title: string;
	export let permissions: IPermission[] | undefined = [];
	let allPermissions: $$TransferData[] = [];
	let checkedPermissions: $$TransferData[] = [];
	let isEdit: boolean = false;
	let disableSave: boolean = false;

	$: {
		checkedPermissions = getTransferData(permissions);
	}

	const getTransferData = (permissions?: IPermission[]) => {
		return (
			permissions?.flatMap((item) =>
				item.actions?.map((act) => ({
					key: `${item.key}_${act}`,
					name: `${item.name}-${translatePermission(act)}`,
					description: `${item.key} ${act} ${item.description}`,
					checked: false,
					origin: {
						key: item.key,
						action: act,
						name: item.name,
						description: item.description
					} as IPermissionDetail
				}))
			) || []
		);
	};

	const save = async () => {
		isEdit = false;
		dispatch('save', {
			checkedData: checkedPermissions
		});
		if (checkedPermissions) {
			try {
				const resp = await pageReq.put<{
					detail: IRoleDetail;
				}>(`/org/${$page.params.org}/roles/${$page.params.key}/permissions`, {
					permissions: checkedPermissions.map((item) => item.origin)
				});
				msg.success('保存角色权限成功');
				checkedPermissions = getTransferData(resp.data?.detail?.permissions);
			} catch (error: any) {
				msg.error('保存角色权限异常:' + error.message);
			}
		}
	};

	const getPermissions = async () => {
		try {
			const resp = await pageReq.get<IPermission[]>(`/org/${$page.params.org}/roles/${$page.params.key}/permissions`);
			if (resp.code !== 0 || !resp.data) {
				throw new Error(resp.message);
			}
			allPermissions = getTransferData(resp.data);
		} catch (error: any) {
			msg.error('获取权限列表异常:' + error.message);
			// 无法修改
			disableSave = true;
		}
	};

	const onCheckedChange = (e: CustomEvent) => {
		checkedPermissions = e.detail.checked || [];
	};

	getPermissions();

	onMount(() => {
	});
</script>

<div class="card mt-2">
	<div class="card-title">
		<span class=" flex-1">{title}</span>
		{#if isEdit}
			<section>
				<Button size="sm" on:click={save} disabled={disableSave}>保存</Button>
				<Button size="sm" variant="outline" on:click={() => (isEdit = false)}>取消</Button>
			</section>
		{:else}
			<Button size="sm" on:click={() => (isEdit = true)}>修改</Button>
		{/if}
	</div>
	<div class="card-body">
		{#if isEdit}
			<div>
				<Transfer
					allData={{
						title: '所有权限',
						data: allPermissions
					}}
					checkedData={{
						title: '已添加的权限',
						data: checkedPermissions
					}}
					on:change={onCheckedChange}
				/>
			</div>
		{:else if checkedPermissions}
			<div class="flex flex-wrap gap-2">
				{#each checkedPermissions as permission (permission.key)}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Badge>{`${permission.name}`}</Badge>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>
								{`${permission.description || permission.name}`}
							</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</div>
		{:else}
			<Empty />
		{/if}
	</div>
</div>
