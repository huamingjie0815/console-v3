<script lang="ts">
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as AlertDialog from '@repo/ui/components/ui/alert-dialog/index.js';
	import { goto } from '$app/navigation';
	import type { IUser } from '$lib/types/base';
	import { page } from '$app/stores';

	export let row: IUser;
	export let onDeleteUser: (user: IUser) => void;

	const onDetail = () => {
		if (row && row.id) {
			goto(`${$page.url.pathname}/${row.id}`);
		}
	};

	const onDelete = () => {
		onDeleteUser && onDeleteUser(row);
	};
</script>

<Button variant="link" size="sm" class=" link font-normal" on:click={onDetail}>详情</Button>
<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="link" size="sm" class="font-normal text-destructive"
			>删除</Button
		>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>确认删除此用户？</AlertDialog.Title>
			<AlertDialog.Description>
				<div>用户名: {row.name}</div>
				<div>手机号: {row.phone}</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>取消</AlertDialog.Cancel>
			<AlertDialog.Action on:click={onDelete}>确认</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
