<script lang="ts">
	import { page } from '$app/stores';
	import Empty from '$lib/components/ui-extend/empty/Empty.svelte';
	import Transfer, { type ITransferData } from '$lib/components/ui-extend/transfer/Transfer.svelte';
	import Badge from '@repo/ui/components/ui/badge/badge.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as Tooltip from '@repo/ui/components/ui/tooltip';
	import type { IPermission, IPermissionDetail } from '$lib/types/base';
	import { translatePermission } from '$lib/utils/common';
	import msg from '$lib/utils/message';
	import pageReq from '$lib/utils/page-request';

	type $$TransferData = ITransferData<IPermissionDetail>;
	export let title: string;
	export let permissions: IPermissionDetail[] | undefined = [];
	export let type: 'deny' | 'allow';

	let allPermissions: $$TransferData[] = [];
	let checkedPermissions: $$TransferData[] = [];
	let isEdit: boolean = false;
	let disableSave: boolean = false;

	$: {
		checkedPermissions = permissions?.map((item) => getTransferData(item)) || [];
	}

	const getTransferData = (item: IPermissionDetail) => {
		return {
			key: `${item.key}_${item.action}`,
			name: `${item.name}-${translatePermission(item.action)}`,
			description: `${item.key} ${item.action} ${item.description}`,
			checked: true,
			origin: item
		};
	};

	const save = async () => {
		isEdit = false;
		if (checkedPermissions) {
			if (type === 'allow') {
				try {
					const resp = await pageReq.put<{
						Permissions: IPermissionDetail[];
					}>(`/org/${$page.params.org}/users/${$page.params.userId}/permissions`, {
						permissions: checkedPermissions.map((item) => item.origin)
					});
					msg.success('保存用户权限白名单成功');
					checkedPermissions = resp.data?.Permissions?.map((item) => getTransferData(item)) || [];
				} catch (error: any) {
					msg.error('保存用户权限白名单异常:' + error.message);
				}
			} else if (type === 'deny') {
				try {
					const resp = await pageReq.put<{
						Permissions: IPermissionDetail[];
					}>(`/org/${$page.params.org}/users/${$page.params.userId}/deny-permissions`, {
						permissions: checkedPermissions.map((item) => item.origin)
					});
					msg.success('保存用户权限黑名单成功');
					checkedPermissions = resp.data?.Permissions?.map((item) => getTransferData(item)) || [];
				} catch (error: any) {
					msg.error('保存用户权限黑名单异常:' + error.message);
				}
			}
		}
	};

	const getPermissions = async () => {
		try {
			const resp = await pageReq.get<IPermission[]>(`/org/${$page.params.org}/users/${$page.params.userId}/permissions`);
			if (resp.code !== 0 || !resp.data) {
				throw new Error(resp.message);
			}
			allPermissions = resp.data.flatMap((item) =>
				item.actions?.map((act) => ({
					key: `${item.key}_${act}`,
					name: `${item.name}-${translatePermission(act)}`,
					description: `${item.key} ${act} ${item.description}`,
					checked: false,
					origin: {
						key: item.key,
						action: act,
						name: item.name,
						description: item.description,
						app_id: item.app_info.id
					} as IPermissionDetail
				}))
			);
		} catch (error: any) {
			msg.error('获取权限列表异常:' + error.message);
			// 无法修改
			disableSave = true;
		}
	};

	const onCheckedChange = (e: CustomEvent) => {
		checkedPermissions = e.detail.checked || [];
	};

	const onEdit = () => {
		isEdit = true
		getPermissions()
	}

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
			<Button size="sm" on:click={onEdit}>修改</Button>
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
