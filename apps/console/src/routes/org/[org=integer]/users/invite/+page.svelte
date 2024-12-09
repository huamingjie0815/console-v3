<script lang="ts">
	import msg from '$lib/utils/message';
	import { Button } from '@repo/ui/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { checkPhone, formatTime, getURLParams } from '$lib/utils/common';
	import type {
		IInviteUser,
		IInviteUserList,
		IRoleList,
		IUser,
		IUserList
	} from '$lib/types/base.js';
	import type { TableColumns } from '$lib/components/ui-extend/table/Table.svelte';
	import Table from '$lib/components/ui-extend/table/Table.svelte';
	import pageReq from '$lib/utils/page-request';
	import Input from '@repo/ui/components/ui/input/input.svelte';
	import OperationCell from './(components)/OperationCell.svelte';
	import * as Dialog from '@repo/ui/components/ui/dialog/index.js';
	import * as Select from '@repo/ui/components/ui/select';
	import { onMount } from 'svelte';
	import type { Selected } from 'bits-ui';

	export let data;
	let dataSource: IInviteUserList['list'] = [];
	let pagination: IInviteUserList['pages'];
	let phone: string | null = $page.url.searchParams.get('phone');
	let showDialog = false;
	let roles: IRoleList['list'] = [];
	let selectedRoles: Selected<string>[] = []
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

	const onInvokeInvite = () => {
		if (!phone || !checkPhone(phone)) {
			msg.error('手机号码不正确，请输入正确的手机号码');
			return;
		}
		showDialog = true;
	};
	const onCancelInvite = () => {
		showDialog = false;
	};
	const onInvite = async () => {
		try {
			console.log(selectedRoles)
			const roles = (selectedRoles || []).map(r => r.value).join(',')
			const resp = await pageReq.post(`/org/${$page.params.org}/users/invite`, {
				phone,
				roles
			});
			location.reload();
		} catch (error: any) {
			msg.error('邀请失败:' + error.message);
		}
	};

	const onSearch = () => {
		goto(
			getURLParams({
				phone
			})
		);
	};

	const onDeleteInvite = async (row: IInviteUser) => {
		try {
			const resp = await pageReq.del(`/org/${$page.params.org}/users/invite/${row.id}`);
			msg.success('删除邀请成功');
			location.reload();
		} catch (error: any) {
			msg.error('删除邀请失败:' + error.message);
		}
	};

	const getRoles = async () => {
		try {
			const resp = await pageReq.get<IRoleList>(
				`/org/${$page.params.org}/roles`,
				{
					page: 1,
					pageSize: 999
				}
			);
			if (resp.code !== 0 || !resp.data) {
				throw new Error(resp.message);
			}
			roles = resp.data.list;
		} catch (error: any) {
			// 无法修改
		}
	};

	const columns: TableColumns<IInviteUser> = [
		{
			title: 'ID',
			class: 'w-[100px]',
			value: (v) => v.id
		},
		{
			title: '用户ID',
			class: 'w-[200px]',
			value: (v) => v.userId || ''
		},
		{
			title: '手机号码',
			class: 'w-[200px]',
			value: (v) => v.phone
		},
		{
			title: '邀请时间',
			class: 'w-[200px]',
			value: (v) => formatTime(v.createdAt)
		},
		{
			title: '是否失效',
			class: 'w-[100px]',
			value: (v) => (v.expire ? '是' : '否')
		},
		{
			title: '是否接受',
			class: 'w-[100px]',
			value: (v) => (v.result === 1 ? '是' : '否')
		},
		{
			title: '操作',
			class: 'w-[100px] text-center',
			renderComponent: {
				component: OperationCell,
				props: {
					onDeleteInvite
				}
			}
		}
	];

	onMount(() => {
		getRoles();
	});
</script>

<div class="flex h-[180px] flex-row items-center justify-center gap-2">
	<Input class="w-[300px]" placeholder="请输入手机号码，点击邀请按钮" bind:value={phone} />
	<Button on:click={onInvokeInvite} disabled={!phone}>邀请</Button>
	<Button on:click={onSearch} variant="outline">查找</Button>

	<Dialog.Root bind:open={showDialog}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>配置角色</Dialog.Title>
				<Dialog.Description>为被邀请用户配置默认角色</Dialog.Description>
			</Dialog.Header>
			<div>
				<Select.Root multiple bind:selected={selectedRoles}>
					<Select.Trigger class="w-full">
						<Select.Value placeholder="可配置角色" />
					</Select.Trigger>
					<Select.Content>
						{#each roles as role}
							<Select.Item value={role.key} label={role.name}>{role.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<Dialog.Footer>
				<Button on:click={onCancelInvite} variant="ghost">取消</Button>
				<Button on:click={onInvite}>继续邀请</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
<Table
	{dataSource}
	{columns}
	pagination={{
		...pagination,
		onPageChange
	}}
/>
