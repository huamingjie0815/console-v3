<script lang="ts">
	import { onMount } from 'svelte';
	import msg from '$lib/utils/message';
	import Table, { type TableColumns } from '$lib/components/ui-extend/table/Table.svelte';
	import { getURLParams } from '$lib/utils/common.js';
	import { goto } from '$app/navigation';
	import * as Dialog from '@repo/ui/components/ui/dialog/index.js';
	import type { IRole, IRoleList } from '$lib/types/base.js';
	import OperationCell from './(components)/OperationCell.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import Label from '@repo/ui/components/ui/label/label.svelte';
	import Input from '@repo/ui/components/ui/input/input.svelte';
	import pageReq from '$lib/utils/page-request';
	import { page } from '$app/stores';

	export let data;
	let dataSource: IRoleList['list'];
	let pagination: IRoleList['pages'];
	let showDialog: boolean = false;
	let newKey: string;
	let newName: string;
	let newDescription: string;
	$: {
		dataSource = data?.data?.list || [];
		pagination = data?.data?.pages || {
			total: 0,
			page: 1,
			pageCount: 0,
			pageSize: 10
		};
		if (data?.code !== 0) {
			msg.error(data?.message);
		}
	}

	const onDeleteRole = async (role: IRole) => {
		try {
			const resp = await pageReq.del(`/org/${$page.params.org}/roles/${role.key}`)
			msg.success("删除角色成功")
			location.reload()
		} catch (error: any) {
			msg.error('删除角色失败:' + error.message)
		}
	}

	const columns: TableColumns<IRole> = [
		{
			title: 'ID',
			class: 'w-[100px]',
			value: (v) => v.org_id
		},
		{
			title: '名称',
			class: 'w-[200px]',
			value: (v) => v.name
		},
		{
			title: '描述',
			class: 'w-[200px]',
			value: (v) => v.description
		},
		{
			title: '类型',
			class: 'w-[200px]',
			value: (v) => v.type
		},
		{
			title: 'Key',
			class: 'w-[200px]',
			value: (v) => v.key
		},
		{
			title: '操作',
			class: 'w-[200px] text-center',
			renderComponent: {
				component: OperationCell,
				props: {
					onDeleteRole
				}
			}
		}
	];

	const onPageChange = async (currentPage: number) => {
		goto(
			getURLParams({
				page: currentPage,
				pageSize: pagination.pageSize
			})
		);
	};

	const onCreate = async () => {
		try {
			const resp = await pageReq.post(`/org/${$page.params.org}/roles`, {
				key: newKey,
				name: newName,
				description: newDescription
			});
			showDialog = false
			location.reload()
		} catch (err: any) {
			msg.error('创建角色异常:' + err.message);
		}
	};

	onMount(() => {});
</script>

<div class="mb-2 flex flex-row gap-2 justify-end">
	<Button size="sm" on:click={() => (showDialog = true)}>创建角色</Button>
</div>
<Table
	{dataSource}
	{columns}
	pagination={{
		...pagination,
		onPageChange
	}}
/>
<Dialog.Root bind:open={showDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>创建角色</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-5 items-center gap-4">
				<Label for="key" class="text-right">Key</Label>
				<Input id="key" bind:value={newKey} class="col-span-4" />
			</div>
			<div class="grid grid-cols-5 items-center gap-4">
				<Label for="name" class="text-right">名称</Label>
				<Input id="name" bind:value={newName} class="col-span-4" />
			</div>
			<div class="grid grid-cols-5 items-center gap-4">
				<Label for="description" class="text-right">描述</Label>
				<Input id="description" bind:value={newDescription} class="col-span-4" />
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={onCreate}>确定</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
